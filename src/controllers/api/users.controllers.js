// Import required dependencies and utilities
const { ConflictError, BadRequestError, LengthError, NotFoundError } = require('../../errors/client.errors');
const { registerUser, getUserByEmail, updateUserById, deleteUserById } = require('../../models/api/users.models');
const { httpCodes, httpStatus } = require('../../utils/serverStatus');
const { generateToken, verifyToken, isStringLengthValid } = require('../../utils/helpers');
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
            return next(new LengthError(`The password must be at most ${MAX_PASSWORD_LENGTH} characters long`));
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
        const token = generateToken({ id: insertedUser.id });

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
            return next(new NotFoundError('User does not exist'));
        }

        const { email, password } = req.body;

        const user = await getUserByEmail(email);
    
        // Verify password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return next(new BadRequestError('Invalid email or password'));
        }

        // Generate JWT token for authenticated user
        const token = generateToken({ id: user.id });

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
        const decodedToken = verifyToken(token);
        const { id } = decodedToken;

        // Hash new password if provided
        req.body.password = await bcrypt.hash(req.body.password, 10);

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

const deleteUser = async (req, res, next) => {
    try {
        if (!req.userExistsById) {
            return next(new NotFoundError('User does not exist'));
        }
        const token = req.headers.authorization;
        const decodedToken = verifyToken(token);
        const { id } = decodedToken;
        console.log('id', id);
        const deletedUser = await deleteUserById(id);
        if (!deletedUser) {
            return next(new BadRequestError('Failed to delete user'));
        }
        return res.status(httpCodes.OK).json({
            status: httpCodes.OK,
            title: httpStatus[httpCodes.OK],
            message: 'User deleted successfully'
        });
    } catch (error) {
        next(error);
    }
}
// /**
//  * Fetch menu data
//  * @param {Object} req - Express request object
//  * @param {Object} res - Express response object
//  * @param {Function} next - Express next middleware function
//  * @returns {Promise<void>}
//  */
// const menu = async (req, res, next) => {
//     try {
//         return res.status(httpCodes.OK).json({ 
//             status: httpCodes.OK,
//             title: httpStatus[httpCodes.OK],
//             message: 'Menu fetched successfully' 
//         });
//     } catch (error) {
//         next(error);
//     }
// };

module.exports = {
    register,
    login,
    update,
    deleteUser
};
