/**
 * @typedef {Object} UserDTO
 * @property {string} _id - Unique MongoDB user identifier
 * @property {string} name - User's full display name
 * @property {string} email - Normalized lowercase email address
 * @property {string} currency - Default monetary display currency (e.g. 'ETB')
 * @property {string} createdAt - Account creation ISO timestamp
 * @property {string} updatedAt - Last account update ISO timestamp
 */

/**
 * @typedef {Object} AuthResponse
 * @property {boolean} success - Operation status flag
 * @property {string} message - Human-readable response message
 * @property {Object} data - Enclosed payload
 * @property {UserDTO} data.user - Authenticated user details
 */

/**
 * @typedef {Object} RegisterPayload
 * @property {string} name - Full user name
 * @property {string} email - Valid unique email
 * @property {string} password - Minimum 6-character password
 */

/**
 * @typedef {Object} LoginPayload
 * @property {string} email - Registered email
 * @property {string} password - Plaintext password to verify
 */

export default {};
