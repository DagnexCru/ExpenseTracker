import express from 'express';
import { register, login, logout, getMe } from '../controllers/auth.controller.js';
import { validateRegisterInput, validateLoginInput } from '../validators/auth.validator.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user account
 * @access  Public
 */
router.post('/register', validateRegisterInput, register);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user credentials and set auth cookie
 * @access  Public
 */
router.post('/login', validateLoginInput, login);

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
