import express from 'express';
import { dashboardController } from '../controllers/dashboard.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import {
  validateDashboardSummaryQuery,
  validateMonthlyTrendQuery,
  validateCategoryBreakdownQuery,
} from '../validators/dashboard.validator.js';

const router = express.Router();

// All dashboard endpoints require authentication
router.use(authenticateToken);

/**
 * @route   GET /api/dashboard/summary
 * @desc    Get key KPI metrics (income, expenses, net balance, recent transactions)
 * @access  Private
 */
router.get('/summary', validateDashboardSummaryQuery, dashboardController.getSummary);

/**
 * @route   GET /api/dashboard/monthly
 * @desc    Get monthly aggregated income vs expenses for bar/area charts
 * @access  Private
 */
router.get('/monthly', validateMonthlyTrendQuery, dashboardController.getMonthlyTrend);

/**
 * @route   GET /api/dashboard/categories
 * @desc    Get spending or income grouped by category for donut/pie charts
 * @access  Private
 */
router.get('/categories', validateCategoryBreakdownQuery, dashboardController.getCategoryBreakdown);

export default router;
