const { ForbiddenError, BadRequestError, UnauthorizedError } = require('../errors/client.errors');
const { getUserByEmail, getUserById } = require('../models/api/users.models');
const { hasKeys, hasAtLeastOneKey, isNumber, verifyToken } = require('../utils/helpers');

/**
 * Middleware to check if the user has admin privileges
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object 
 * @param {Function} next - Express next middleware function
 * @throws {ForbiddenError} If user is not an admin
 */
const isAdmin = (req, _, next) => {
    // Extract user from request
    const { user } = req;

    // Check if user has admin privileges
    if (user.type !== 'admin') {
        next(new ForbiddenError());
    }

    // User is admin, continue to next middleware
    next();
};

/**
 * Middleware to check if a user exists in the database
 * @param {Object} req - Express request object containing user email in body
 * @param {Object} _ - Express response object (unused)
 * @param {Function} next - Express next middleware function
 * @throws {NotFoundError} If user with provided email is not found
 */
const userExistsByEmail = async (req, _, next) => {
    // Extract email from request body
    const { email } = req.body;

    // Try to find user with provided email
    const user = await getUserByEmail(email);

    req.userExistsByEmail = user ? true : false;

    // User exists, continue to next middleware
    next();
}

/**
 * Middleware to check if a user exists in the database by ID
 * @param {Object} req - Express request object containing user ID in params
 * @param {Object} _ - Express response object (unused)
 * @param {Function} next - Express next middleware function
 * @returns {Promise<void>} Sets userExistsById flag on request object and calls next
 */
const userExistsByTokenId = async (req, _, next) => {
    // Extract ID from request parameters
    const token = req.headers.authorization;
    const decodedToken = verifyToken(token);
    const { id } = decodedToken;

    // Try to find user with provided ID
    const user = await getUserById(id);

    // Set flag on request indicating if user exists
    req.userExistsById = user ? true : false;

    // Continue to next middleware
    next();
}

/**
 * Creates a middleware function that checks if request body contains all required keys
 * @param {string[]} keys - Array of required key names to check for
 * @returns {Function} Middleware function that validates request body keys
 * @throws {BadRequestError} If any required keys are missing from request body
 */
const hasRequiredBodyKeys = (keys) => {
    return (req, _, next) => {
        // Check if request body has all required keys
        const { hasAllKeys, missingKeys } = hasKeys(req.body, keys);
        
        // If any keys are missing, return error with list of missing keys
        if (!hasAllKeys) {
            return next(new BadRequestError(`Missing keys: ${missingKeys.join(', ')}`));
        }

        // All required keys present, continue to next middleware
        next();
    }
}

/**
 * Creates a middleware function that checks if request body contains at least one of the specified keys
 * @param {string[]} keys - Array of key names to check for, at least one must be present
 * @returns {Function} Middleware function that validates request body has at least one key
 * @throws {BadRequestError} If none of the specified keys are present in request body
 */
const hasOptionalBodyKeys = (keys) => {
    return (req, _, next) => {
        // Check if request body has at least one of the specified keys
        const { hasSomeKeys, missingKeys } = hasAtLeastOneKey(req.body, keys);
        
        // If no keys are present, return error listing the missing keys
        if (!hasSomeKeys) {
            return next(new BadRequestError(`Must to provide at least one of the following keys: ${missingKeys.join(', ')}`));
        }

        // At least one key is present, continue to next middleware
        next();
    }
}

/**
 * Creates a middleware function that removes leading and trailing spaces from specified request body fields
 * @param {string[]} keys - Array of field names to trim spaces from. If empty, no fields are processed
 * @returns {Function} Middleware function that trims spaces from specified fields
 */
const removeSpacesOfBody = (keys = []) => {
    return (req, _, next) => {
        // Iterate through provided keys and trim spaces from corresponding request body fields
        keys.forEach(key => {
            // Check if field exists in request body
            if (req.body[key]) {
                // Trim spaces from field value
                req.body[key] = req.body[key].trim();
            }
        });
        // Continue to next middleware
        next();
    }
}

/**
 * Middleware to check if a token is present in the request headers
 * @param {Object} req - Express request object
 * @param {Object} _ - Express response object (unused)
 * @param {Function} next - Express next middleware function
 * @throws {UnauthorizedError} If no token is present in request headers
 */
const hasToken = (req, _, next) => {
    const token = req.headers.authorization;
    if (!token) {
        next(new UnauthorizedError());
    }
    next();
}

module.exports = { 
    isAdmin, 
    userExistsByEmail, 
    hasRequiredBodyKeys, 
    hasOptionalBodyKeys, 
    removeSpacesOfBody,
    userExistsByTokenId,
    hasToken
};