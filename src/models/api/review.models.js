const db = require('../../config/db');

// SQL queries as constants to improve maintainability
const SQL_QUERIES = {
    SELECT_ALL: 'SELECT id, rating, comment FROM review WHERE user_id = ?',
    SELECT_BY_ID: 'SELECT * FROM review WHERE id = ?',
    SELECT_BY_ID_AND_USER_ID: 'SELECT * FROM review WHERE id = ? AND user_id = ?',
    INSERT: 'INSERT INTO review (user_id, rating, comment) VALUES (?, ?, ?)',
    DELETE: 'DELETE FROM review WHERE id = ?',
};

/**
 * Get all reviews from the database
 * @returns {Promise<Array|null>} Array of reviews or null if none found
 */
const selectReviews = async (user_id) => {
    const [result] = await db.query(SQL_QUERIES.SELECT_ALL, [user_id]);
    return result.length ? result : null;
};

/**
 * Get a single review by ID
 * @param {number} id Review ID
 * @returns {Promise<Object|null>} Review object or null if not found
 */
const selectReviewById = async (id) => {
    const [result] = await db.query(SQL_QUERIES.SELECT_BY_ID, [id]);
    return result.length ? result[0] : null;
};

const selectReviewByIdAndUserId = async (id, user_id) => {
    const [result] = await db.query(SQL_QUERIES.SELECT_BY_ID_AND_USER_ID, [id, user_id]);
    return result.length ? result[0] : null;
};

/**
 * Insert a new review
 * @param {Object} review Review object containing user_id, rating, and comment
 * @returns {Promise<number|null>} Inserted review ID or null if insert failed
 */
const insertReview = async (review) => {
    const { user_id, rating, comment } = review;
    const [result] = await db.query(SQL_QUERIES.INSERT, [user_id, rating, comment]);

    return result.affectedRows ? result.insertId : null;
};

/**
 * Delete a review by ID
 * @param {number} id Review ID to delete
 * @returns {Promise<number|null>} Number of affected rows or null if delete failed
 */
const deleteReview = async (id) => {
    const [result] = await db.query(SQL_QUERIES.DELETE, [id]);
    return result.affectedRows ? result.affectedRows : null;
};

module.exports = {
    selectReviews,
    selectReviewById,
    insertReview,
    deleteReview,
    selectReviewByIdAndUserId,
};
