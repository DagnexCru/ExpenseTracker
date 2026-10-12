import User from '../models/User.js';
import { verifyToken } from '../utils/jwt.util.js';

/**
 * Authentication route guard middleware
 * Extracts JWT from HTTP-only cookie or Authorization header,
 * verifies signature, and attaches authenticated user document to req.user.
 */
export const protect = async (req, res, next) => {
  let token = null;

  // 1. Try reading token from HTTP-only cookie
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  // 2. Alternatively fallback to Authorization: Bearer <token> header
  else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // If no token present, reject request
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this resource. Please log in.',
    });
  }

  try {
    // Verify token
    const decoded = verifyToken(token);

    // Find user by ID in token
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'The user belonging to this token no longer exists.',
      });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication session. Please log in again.',
    });
  }
};

export default {
  protect,
};
