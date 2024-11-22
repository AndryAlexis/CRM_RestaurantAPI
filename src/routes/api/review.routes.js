const express = require('express');
const router = express.Router();
const { 
    getReviews, 
    create, 
    remove 
} = require('../../controllers/api/review.controllers');

const { 
    hasToken, 
    userExistsByTokenId,
    hasRequiredBodyKeys,
    removeSpacesOfBody,
    idIsNumber
} = require('../../middlewares/auth');

// Get all user reviews
router.get('/', 
    hasToken,
    userExistsByTokenId,
    getReviews
);

// Create a review
router.post('/', 
    hasToken,
    userExistsByTokenId,
    removeSpacesOfBody(['comment']),
    hasRequiredBodyKeys(['rating', 'comment']),
    create
);

// Delete a review
router.delete('/:id', 
    hasToken,
    idIsNumber,
    userExistsByTokenId,
    remove
);

module.exports = router;