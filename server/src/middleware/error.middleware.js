/**
 * Handles 404 Not Found errors for unmatched routes
 */
export const notFoundHandler = (req, res, next) => {
  const error = new Error(`Resource not found - ${req.method} ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Centralized global error-handling middleware
 * Sanitizes stack traces in production to prevent data leakage
 */
export const errorHandler = (err, req, res, next) => {
  // If status is 200, default to 500 server error
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
};
