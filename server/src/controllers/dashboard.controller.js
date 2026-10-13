import { dashboardService } from '../services/dashboard.service.js';

/**
 * Dashboard Controller
 * Handles request parameters and sends standardized JSON responses
 */
export const dashboardController = {
  /**
   * GET /api/dashboard/summary
   */
  async getSummary(req, res, next) {
    try {
      const userId = req.user.id;
      const { startDate, endDate } = req.query;

      const result = await dashboardService.getSummary(userId, { startDate, endDate });

      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'Dashboard summary retrieved successfully',
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /api/dashboard/monthly
   */
  async getMonthlyTrend(req, res, next) {
    try {
      const userId = req.user.id;
      const { year, months } = req.query;

      const result = await dashboardService.getMonthlyTrend(userId, { year, months });

      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'Monthly trend data retrieved successfully',
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /api/dashboard/categories
   */
  async getCategoryBreakdown(req, res, next) {
    try {
      const userId = req.user.id;
      const { type = 'expense', startDate, endDate } = req.query;

      const result = await dashboardService.getCategoryBreakdown(userId, {
        type,
        startDate,
        endDate,
      });

      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'Category breakdown retrieved successfully',
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },
};
