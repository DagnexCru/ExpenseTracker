/**
 * @file user.routes.js
 * @description API route definitions for User profile and preference management
 */

import express from 'express';
import { getMe, updateMe } from '../controllers/user.controller.js';
import { validateUpdateProfile } from '../validators/user.validator.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * @route   GET /api/users/me
 * @desc    Fetch current authenticated user profile
 * @access  Private (Protected)
 */
router.get('/me', protect, getMe);

/**
 * @route   PATCH /api/users/me
 * @desc    Update current user display name and/or preferred currency
 * @access  Private (Protected)
 */
router.patch('/me', protect, validateUpdateProfile, updateMe);

export default router;
