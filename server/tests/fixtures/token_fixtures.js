/**
 * @file token_fixtures.js
 * @description Mock JWT tokens and signature fixtures for testing auth edge cases
 */

export const mockMalformedTokens = {
  empty: '',
  invalidFormat: 'not-a-valid-jwt-token',
  tamperedSignature: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MGEyM2Y4OTBhYmNkZWYwMTIzNDU2NyIsImlhdCI6MTY5NzA1OTIwMCwiZXhwIjoxNjk3NjYzOTk5fQ.INVALID_SIGNATURE_TAMPERED_HASH',
  expiredFormat: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MGEyM2Y4OTBhYmNkZWYwMTIzNDU2NyIsImlhdCI6MTYwMDAwMDAwMCwiZXhwIjoxNjAwMDAwMTAwfQ.EXPIRED_MOCK_SIGNATURE',
};
