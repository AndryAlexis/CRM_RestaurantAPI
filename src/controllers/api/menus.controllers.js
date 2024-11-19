const { selectById, selectAll, createMenu, deleteMenuById } = require("../../models/api/menus.models");
const { ConflictError, BadRequestError, LengthError, NotFoundError } = require('../../errors/client.errors');
const { generateToken, verifyToken, isStringLengthValid } = require('../../utils/helpers');
const { httpCodes } = require("../../utils/serverStatus");

/**
 * Retrieves a menu by its ID.
 * @param {Object} req - Express request object with menuId in params
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Promise<void>} Returns a JSON response with the menu details or calls next with an error
 */
const getById = async (req, res, next) => {
    const { menuId } = req.params;
    try {
        const menu = await selectById(menuId);
        res.json(menu)
    } catch (error) {
        next(error);
    }
}

/**
 * Retrieves all menus from the database.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Promise<void>} Returns a JSON response with an array of menu objects or calls next with an error
 */
const getAll = async (req, res, next) => {
    try {
        const menus = await selectAll();
        res.json(menus)
    } catch (error) {
        next(error);
    }
}

/**
 * Generates a new menu with the provided date, name and dishes.
 * @param {Object} req - Express request object with date, name and dishes in body
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Promise<void>} Returns a JSON response with a success message or calls next with an error
 */
const generateMenu = async (req, res, next) => {
    // Step 1: Extract the necessary data (date, name, dishes) from the request body.
    const { date, name, dishes } = req.body;

    try {
        // Step 2: Attempt to create a new menu by calling the 'createMenu' function.
        const newMenu = await createMenu(date, name, dishes);
        // Step 3: Check if the menu creation was unsuccessful (i.e., 'newMenu' is falsy or 0).
        // This is a basic validation check; if no menu is created, respond with an error.
        if (!newMenu === 0) {
            return res.status(500).json({ message: 'Error creating menu' });
        }
        // Step 4: If the menu is created successfully, send a success response with a message.
        res.json({ message: `menu ${date} created successfully` });
    } catch (error) {
        // Step 5: If an error occurs during the process (e.g., database issues), pass the error to the next middleware.
        next(error);
    }
}

/**
 * Deletes a menu by its ID. Requires a valid JWT token in the 'Authorization' header
 * with the ID of the user that created the menu.
 * @param {Object} req - Express request object with menuId in params
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Promise<void>} Returns a JSON response with a success message or calls next with an error
 */
const deleteMenu = async (req, res, next) => {
    try {
        // Step 1: Check if the menu exists by verifying the 'menuExistsById' property on the request.
        // If the menu does not exist, return a 'NotFoundError' to indicate the menu cannot be found.
        if (!req.menuExistsById) {
            return next(new NotFoundError('Menu does not exist'));
        }
        // Step 2: Retrieve the authorization token from the request headers.
        const token = req.headers.authorization;
        // Step 3: Verify the token to decode the user's information and retrieve their ID.
        const decodedToken = verifyToken(token);
        const { id } = decodedToken;
        // Step 4: Attempt to delete the menu using the user's ID.
        // Call 'deleteUserById' function to delete the menu associated with the user.
        const deletedMenu = await deleteMenuById(id);
        // Step 5: If the deletion fails (i.e., 'deletedMenu' is falsy), return a 'BadRequestError'.
        if (!deletedMenu) {
            return next(new BadRequestError('Failed to delete menu'));
        }
        // Step 6: If the menu was successfully deleted, return a success message and a 200 OK status.
        return res.status(httpCodes.OK).json({
            status: httpCodes.OK,
            title: httpStatus[httpCodes.OK],
            message: 'Menu deleted successfully'
        });
    } catch (error) {
        // Step 7: If any error occurs during the process, pass it to the next middleware for error handling.
        next(error);
    }
}
module.exports = {
    getById,
    getAll,
    generateMenu,
    deleteMenu
}