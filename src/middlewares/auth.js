const { ForbiddenError, ConflictError, BadRequestError } = require('../errors/client.errors');
const { getUserByEmail } = require('../models/api/users.models');
const bcrypt = require('bcryptjs');

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
const userExists = async (req, _, next) => {
    // Extract email from request body
    const { email } = req.body;

    // Try to find user with provided email
    const user = await getUserByEmail(email);

    // If no user found, throw error
    if (user)
        next(new ConflictError('User already exists'));

    // User exists, continue to next middleware
    next();
}

module.exports = { isAdmin, userExists };
