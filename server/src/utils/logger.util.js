/**
 * @file logger.util.js
 * @description Structured security and auth event audit logger
 */

export const logAuthEvent = (eventType, { email, ip, status, details = {} }) => {
  const timestamp = new Date().toISOString();
  const event = {
    timestamp,
    eventType,
    email: email ? email.toLowerCase() : 'anonymous',
    ip: ip || 'unknown-ip',
    status,
    details,
  };

  if (process.env.NODE_ENV !== 'test') {
    console.log(`[AUTH_AUDIT] ${JSON.stringify(event)}`);
  }

  return event;
};
