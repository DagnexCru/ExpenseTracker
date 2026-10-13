/**
 * Dashboard Request Validators
 * Validates query parameters for dashboard aggregation endpoints
 */

export const validateDashboardSummaryQuery = (req, res, next) => {
  const { startDate, endDate } = req.query;

  if (startDate) {
    const start = new Date(startDate);
    if (isNaN(start.getTime())) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'Invalid startDate format. Must be an ISO date string (YYYY-MM-DD)',
        error: { code: 'INVALID_START_DATE' },
      });
    }
  }

  if (endDate) {
    const end = new Date(endDate);
    if (isNaN(end.getTime())) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'Invalid endDate format. Must be an ISO date string (YYYY-MM-DD)',
        error: { code: 'INVALID_END_DATE' },
      });
    }
  }

  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start > end) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'startDate cannot be after endDate',
        error: { code: 'INVALID_DATE_RANGE' },
      });
    }
  }

  next();
};

export const validateMonthlyTrendQuery = (req, res, next) => {
  const { year, months } = req.query;

  if (year !== undefined) {
    const parsedYear = parseInt(year, 10);
    if (isNaN(parsedYear) || parsedYear < 2000 || parsedYear > 2100) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'Year must be a valid 4-digit number between 2000 and 2100',
        error: { code: 'INVALID_YEAR' },
      });
    }
    req.query.year = parsedYear;
  }

  if (months !== undefined) {
    const parsedMonths = parseInt(months, 10);
    if (isNaN(parsedMonths) || parsedMonths < 1 || parsedMonths > 24) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'Months parameter must be an integer between 1 and 24',
        error: { code: 'INVALID_MONTHS_RANGE' },
      });
    }
    req.query.months = parsedMonths;
  }

  next();
};

export const validateCategoryBreakdownQuery = (req, res, next) => {
  const { type, startDate, endDate } = req.query;

  if (type && !['income', 'expense'].includes(type)) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: "Type filter must be either 'income' or 'expense'",
      error: { code: 'INVALID_TRANSACTION_TYPE' },
    });
  }

  // Re-use date validation logic
  return validateDashboardSummaryQuery(req, res, next);
};
