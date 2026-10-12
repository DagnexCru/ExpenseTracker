/**
 * @file validate.middleware.js
 * @description Higher-order validation middleware runner for Express request handlers
 */

/**
 * Wraps validation functions into an Express middleware.
 *
 * @param {Function} validatorFn - Function receiving req.body and returning { isValid, errors }
 * @returns {import('express').RequestHandler}
 */
export const validate = (validatorFn) => {
  return (req, res, next) => {
    const { isValid, errors } = validatorFn(req.body);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid request data provided.',
          details: errors,
        },
      });
    }

    next();
  };
};
