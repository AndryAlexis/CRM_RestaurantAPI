const { 
    selectReviews, 
    selectReviewById, 
    selectReviewsByUserId, 
    insertReview, 
    deleteReview 
} = require('../../models/api/review.models');
const { BadRequestError, NotFoundError } = require('../../errors/client.errors');
const { BadRequestError : BadServerRequestError } = require('../../errors/server.errors');
const { verifyToken } = require('../../utils/helpers');
const { httpStatus, httpCodes } = require('../../utils/serverStatus');

const getReviews = async (req, res) => {
    const reviews = await selectReviews();
    res.json(reviews);
};  

const getReviewById = async (req, res) => {
    const review = await selectReviewById(req.params.id);
    res.json(review);
};

const getReviewsByUserId = async (req, res, next) => {
    try {
        const review = await selectReviewsByUserId(req.params.id);

        if (!review) {
            return next(new NotFoundError('There are no reviews for this user'));
        }

        res.status(httpCodes.OK).json({
            status: httpCodes.OK,
            title: httpStatus[httpCodes.OK],
            message: 'Reviews fetched successfully',
            data: review
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Creates a new review for the authenticated user
 * @param {Object} req - Express request object containing review data in body
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} JSON response with creation status
 */
const create = async (req, res, next) => {
    try {
        // Check if user exists based on middleware validation
        if (!req.userExistsById) {
            return next(new BadRequestError('User not found'));
        }
        
        // Extract user ID from authorization token
        const token = req.headers.authorization;
        const decodedToken = verifyToken(token);
        const userId = decodedToken.id;
    
        // Add user ID to review data
        req.body.user_id = userId;
        
        // Attempt to insert the review into database
        const review = await insertReview(req.body);
        if (!review) {
            return next(new BadServerRequestError('Failed to create review'));
        }
    
        // Return success response
        return res.status(httpCodes.CREATED).json({
            status: httpCodes.CREATED,
            title: httpStatus[httpCodes.CREATED],
            message: 'Review created successfully',
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Deletes a review by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} JSON response with deletion status
 */ 
const remove = async (req, res, next) => {
    try {
        const result = await deleteReview(req.params.id);
        if (!result) {
            return next(new BadRequestError('Failed to delete review'));
        }
        return res.status(httpCodes.OK).json({
            status: httpCodes.OK,
            title: httpStatus[httpCodes.OK],
            message: 'Review deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getReviews,
    getReviewById,
    getReviewsByUserId,
    create,
    remove
};

