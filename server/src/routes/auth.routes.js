import express from 'express';
import { register, login, logout, getMe, googleLogin } from '../controllers/auth.controller.js';
import { validateRegisterInput, validateLoginInput } from '../validators/auth.validator.js';
import { protect } from '../middleware/auth.middleware.js';
import { authRateLimiter } from '../middleware/rate_limiter.middleware.js';

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user account with rate limit protection
 * @access  Public
 */
router.post('/register', authRateLimiter, validateRegisterInput, register);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user credentials with rate limit protection
 * @access  Public
 */
router.post('/login', authRateLimiter, validateLoginInput, login);

/**
 * @route   POST /api/auth/google
 * @desc    Authenticate or register user via Google Sign-In
 * @access  Public
 */
router.post('/google', authRateLimiter, googleLogin);

/**
 * @route   POST /api/auth/logout
 * @desc    Clear authentication cookie
 * @access  Public
 */
router.post('/logout', logout);

/**
 * @route   GET /api/auth/me
 * @desc    Get current authenticated user profile
 * @access  Private (Protected)
 */
router.get('/me', protect, getMe);

export default router;
