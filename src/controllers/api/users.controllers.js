// Import required dependencies and utilities
const { 
    ConflictError, 
    BadRequestError, 
    LengthError, 
    NotFoundError,
    UnauthorizedError
} = require('../../errors/client.errors');
const { 
    registerUser, 
    getUserByEmail, 
    updateUserById, 
    deleteUserById, 
    getUserById,
    getAllUsers
} = require('../../models/api/users.models');
const { httpCodes, httpStatus } = require('../../utils/serverStatus');
const { generateToken, verifyToken, isStringLengthValid, isNumber } = require('../../utils/helpers');
const bcrypt = require('bcryptjs');

/**
 * Register a new user
 * @param {Object} req - Express request object containing user registration data in body
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Promise<void>}
 */
const register = async (req, res, next) => {    
    try {
        if (req.userExistsByEmail) {
            return next(new ConflictError('User already exists'));
        }

        const MAX_PASSWORD_LENGTH = 64;
        // Validate the length of password
        if (!isStringLengthValid(req.body.password, MAX_PASSWORD_LENGTH)) {
            return next(
                new LengthError(`The password must be at most ${MAX_PASSWORD_LENGTH} characters long`)
            );
        }

        // Extract user data from request body
        const { name, password, email, phone, surname } = req.body;

        // Hash the password before storing
        const passwordHash = await bcrypt.hash(password, 10);
        const newUserData = { name, password: passwordHash, email, phone, surname };

        // Insert new user into database
        const insertedUser = await registerUser(newUserData);
        if (!insertedUser) {
            return next(new BadRequestError('Failed to register user'));
        }

        // Generate JWT token for the new user
        const token = generateToken({ 
            id: insertedUser.id, 
            role: 'client' // Always set role to client for new users
        });

        // Send success response with token
        return res.status(httpCodes.CREATED).json({
            status: httpCodes.CREATED,
            title: httpStatus[httpCodes.CREATED],
            message: 'User registered successfully',
            token
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Login an existing user
 * @param {Object} req - Express request object containing login credentials in body
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Promise<void>}
 */
const login = async (req, res, next) => {
    try {
        if (!req.userExistsByEmail) {
            return next(new NotFoundError('Invalid email or password'));
        }

        const { email, password } = req.body;

        const user = await getUserByEmail(email);

        // Verify password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return next(new NotFoundError('Invalid email or password'));
        }

        // Generate JWT token for authenticated user
        const token = generateToken({ 
            id: user.id, 
            role: user.role 
        });

        // Send success response with token
        return res.status(httpCodes.OK).json({
            status: httpCodes.OK,
            title: httpStatus[httpCodes.OK],
            message: 'User logged in successfully',
            token
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update an existing user's information
 * @param {Object} req - Express request object containing user update data in body
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Promise<void>}
 */
const update = async (req, res, next) => {
    try {
        // Check if user exists based on token ID
        if (!req.userExistsById) {
            return next(new NotFoundError('User does not exist'));
        }

        // Check if new email (if provided) is already in use
        if (req.userExistsByEmail) {
            return next(new ConflictError('Email already in use'));
        }
        
        // Extract user ID from authorization token
        const token = req.headers.authorization;

        // Verify JWT token
        const decodedToken = verifyToken(token);

        // If token is invalid, return unauthorized error
        if (!decodedToken) {
            return next(new UnauthorizedError('Invalid token'));
        }

        // Get user ID from verified token
        const { id } = decodedToken;

        if (req.body.password) {
            // Hash new password if provided
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }

        // Attempt to update user in database
        const updatedUser = await updateUserById(id, req.body);
        if (!updatedUser) {
            return next(new BadRequestError('Failed to update user'));
        }

        // Send success response
        return res.status(httpCodes.OK).json({
            status: httpCodes.OK,
            title: httpStatus[httpCodes.OK],
            message: 'User updated successfully'
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Delete a user's account from the system
 * @param {Object} req - Express request object
 * @param {Object} req.userExistsById - Boolean indicating if user exists, set by middleware
 * @param {string} req.headers.authorization - JWT token from request header
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Promise<void>} 
 * @throws {NotFoundError} If user does not exist
 * @throws {UnauthorizedError} If token is invalid
 * @throws {BadRequestError} If deletion fails
 */
const deleteUser = async (req, res, next) => {
    try {
        // Check if user exists based on token ID from middleware
        if (!req.userExistsById) {
            return next(new NotFoundError('User does not exist'));
        }

        // Extract and verify JWT token from request headers
        const token = req.headers.authorization;
        const decodedToken = verifyToken(token);
        if (!decodedToken) {
            return next(new UnauthorizedError('Invalid token'));
        }

        // Get user ID from verified token
        const { id } = decodedToken;

        // Attempt to delete user from database
        const deletedUser = await deleteUserById(id);
        if (!deletedUser) {
            return next(new BadRequestError('Failed to delete user'));
        }

        // Send success response
        return res.status(httpCodes.OK).json({
            status: httpCodes.OK,
            title: httpStatus[httpCodes.OK],
            message: 'User deleted successfully'
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Retrieves user profile information
 * @param {Object} req - Express request object
 * @param {Object} req.user - User object from auth middleware
 * @param {number} req.user.id - ID of authenticated user
 * @param {Object} res - Express response object  
 * @param {Function} next - Express next middleware function
 * @returns {Object} User profile data with success message
 * @throws {NotFoundError} If user does not exist in database
 */
const getUser = async (req, res, next) => {
    try {
        // Check if user exists by token ID
        if (!req.userExistsById) {
            return next(new NotFoundError('User does not exist'));
        }

        // Extract and verify JWT token from request headers
        const token = req.headers.authorization;
        const decodedToken = verifyToken(token);

        // If token is invalid, return unauthorized error
        if (!decodedToken) {
            return next(new UnauthorizedError('Invalid token'));
        }

        // Check if user ID from token matches the requested user ID
        if (parseInt(req.params.id) !== parseInt(decodedToken.id)) {
            return next(
                new UnauthorizedError('The id in the token does not match the requested user ID')
            );
        }

        // Get user ID from verified token
        const { id } = decodedToken;

        // Attempt to fetch user from database using ID from auth token
        const user = await getUserById(id);

        // Send success response with user data
        return res.status(httpCodes.OK).json({
            status: httpCodes.OK,
            title: httpStatus[httpCodes.OK],
            message: 'User fetched successfully',
            user
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Get paginated list of all users
 * @param {Object} req - Express request object
 * @param {Object} req.query - Query parameters
 * @param {number} [req.query.page=1] - Page number to fetch
 * @param {number} [req.query.limit=10] - Number of users per page
 * @param {string} [req.query.order=asc] - Sort order ('asc' or 'desc')
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} Paginated users list with metadata
 * @throws {BadRequestError} If page or limit parameters are invalid
 */
const getUsers = async (req, res, next) => {
    try {
        // Extract and validate query parameters
        let { page = 1, limit = 10, order = 'asc' } = req.query;

        // Validate numeric parameters
        if (!isNumber(page) || !isNumber(limit)) {
            return next(new BadRequestError('Page and limit must be valid numbers'));
        }

        // Convert to integers and validate ranges
        page = parseInt(page);
        limit = parseInt(limit);

        if (page < 1 || limit < 1) {
            return next(new BadRequestError('Page and limit must be positive numbers'));
        }

        // Validate sort order
        if (!['asc', 'desc'].includes(order)) {
            return next(new BadRequestError('Invalid sort order. Use \'asc\' or \'desc\''));
        }

        // Fetch users with pagination
        const users = await getAllUsers(page, limit, order);

        // Return paginated response
        return res.status(httpCodes.OK).json({
            status: httpCodes.OK,
            title: httpStatus[httpCodes.OK],
            message: 'Users fetched successfully',
            data: {
                users,
            }
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    register,
    login,
    update,
    deleteUser,
    getUser,
    getUsers
};
