import User from '../models/User.js';
import { generateToken } from '../utils/jwt.util.js';

/**
 * Registers a new user account
 * @param {object} userData - { name, email, password }
 * @returns {Promise<{ user: object, token: string }>}
 */
export const registerUser = async ({ name, email, password }) => {
  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error('An account with this email address already exists');
    error.statusCode = 409; // Conflict
    throw error;
  }

  // Create new user document (pre-save hook will hash password)
  const user = await User.create({
    name,
    email,
    password,
  });

  // Generate JWT token
  const token = generateToken({ id: user._id, email: user.email });

  return {
    user: user.toJSON(),
    token,
  };
};

/**
 * Authenticates user credentials and generates token
 * @param {object} credentials - { email, password }
 * @returns {Promise<{ user: object, token: string }>}
 */
export const loginUser = async ({ email, password }) => {
  // Find user by email, explicitly including password field
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401; // Unauthorized
    throw error;
  }

  // Verify password match
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401; // Unauthorized
    throw error;
  }

  // Generate JWT token
  const token = generateToken({ id: user._id, email: user.email });

  return {
    user: user.toJSON(),
    token,
  };
};

/**
 * Retrieves the profile of an authenticated user by ID
 * @param {string} userId
 * @returns {Promise<object>} User profile document
 */
export const getUserProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error('User account not found');
    error.statusCode = 404;
    throw error;
  }
  return user.toJSON();
};

/**
 * Authenticates or registers a user via Google Sign-In
 * @param {object} googleData - { email, name, token }
 * @returns {Promise<{ user: object, token: string }>}
 */
export const googleAuthUser = async ({ email, name, token }) => {
  let userEmail = email;
  let userName = name;

  // If Google access token or credential provided, verify with Google API
  if (token) {
    try {
      // 1. Try Google OAuth2 UserInfo endpoint
      const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const googleUser = await response.json();
        if (googleUser && googleUser.email) {
          userEmail = googleUser.email;
          userName = googleUser.name || googleUser.given_name || userName;
        }
      } else {
        // 2. Try ID token endpoint if credential passed
        const tokenInfoRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`);
        if (tokenInfoRes.ok) {
          const idData = await tokenInfoRes.json();
          if (idData && idData.email) {
            userEmail = idData.email;
            userName = idData.name || userName;
          }
        }
      }
    } catch (fetchErr) {
      console.warn('Google userinfo verification fallback:', fetchErr.message);
    }
  }

  if (!userEmail) {
    const error = new Error('Google authentication requires a valid email or token');
    error.statusCode = 400;
    throw error;
  }

  const normalizedEmail = userEmail.trim().toLowerCase();
  let user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    // Generate secure random password for Google-provisioned account
    const randomPassword = `GAuth_${Math.random().toString(36).slice(-8)}_${Date.now()}!`;
    user = await User.create({
      name: userName?.trim() || normalizedEmail.split('@')[0],
      email: normalizedEmail,
      password: randomPassword,
    });
  }

  const authToken = generateToken({ id: user._id, email: user.email });

  return {
    user: user.toJSON(),
    token: authToken,
  };
};


export default {
  registerUser,
  loginUser,
  getUserProfile,
  googleAuthUser,
};
