/**
 * @file user.controller.js
 * @description Controller actions for user profile endpoints
 */

import { getUserProfile, updateUserProfile } from '../services/user.service.js';

/**
 * @desc    Get current authenticated user profile
 * @route   GET /api/users/me
 * @access  Private (Protected)
 */
export const getMe = async (req, res, next) => {
  try {
    const user = await getUserProfile(req.user._id);
    return res.status(200).json({
      success: true,
      data: {
        user,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update current authenticated user profile (name, currency)
 * @route   PATCH /api/users/me
 * @access  Private (Protected)
 */
export const updateMe = async (req, res, next) => {
  try {
    const updatedUser = await updateUserProfile(req.user._id, req.body);
    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: updatedUser,
      },
    });
  } catch (err) {
    next(err);
  }
};

export default {
  getMe,
  updateMe,
};
