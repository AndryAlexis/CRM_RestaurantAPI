const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * Generates a JWT token with the provided payload
 * @param {Object} payload - Data to be encoded in the token
 * @param {string|number} payload.id - User ID to encode in token
 * @param {string} payload.role - User role to encode in token
 * @returns {string} JWT token signed with the secret key from environment variables
 */
const generateToken = ({ id, role }) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET);
}

/**
 * Verifies and decodes a JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded payload if token is valid
 * @throws {JsonWebTokenError} If token is invalid or expired
 */
const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
}

/**
 * Checks if an object contains all the required keys
 * @param {Object} obj - Object to check for keys
 * @param {string[]} keys - Array of key names to check for
 * @returns {Object} Result object containing:
 *   - hasAllKeys {boolean}: true if all keys exist, false otherwise
 *   - missingKeys {string[]}: array of keys that were not found in the object
 */
const hasKeys = (obj, keys) => {
    const missingKeys = keys.filter(key => !obj.hasOwnProperty(key));
    return {
        hasAllKeys: missingKeys.length === 0,
        missingKeys
    };
}

module.exports = { generateToken, verifyToken, hasKeys };
