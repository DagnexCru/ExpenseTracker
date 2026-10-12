/**
 * Calculates secure cookie options according to environment
 * @returns {object} Express cookie configuration options
 */
export const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const days = parseInt(process.env.COOKIE_EXPIRES_IN_DAYS || '7', 10);

  return {
    httpOnly: true, // Prevents XSS theft of token via document.cookie
    secure: isProduction, // Transmitted only via HTTPS in production
    sameSite: isProduction ? 'strict' : 'lax', // CSRF protection
    maxAge: days * 24 * 60 * 60 * 1000, // Milliseconds (7 days)
    path: '/',
  };
};

/**
 * Attaches the authentication JWT as a secure HTTP-only cookie
 * @param {object} res - Express response object
 * @param {string} token - Signed JWT
 */
export const sendAuthCookie = (res, token) => {
  const options = getCookieOptions();
  res.cookie('token', token, options);
};

/**
 * Clears the authentication JWT cookie on logout
 * @param {object} res - Express response object
 */
export const clearAuthCookie = (res) => {
  const isProduction = process.env.NODE_ENV === 'production';
  res.cookie('token', '', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax',
    expires: new Date(0), // Set to epoch to expire immediately
    path: '/',
  });
};

export default {
  getCookieOptions,
  sendAuthCookie,
  clearAuthCookie,
};
