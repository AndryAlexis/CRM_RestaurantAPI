const express = require('express');
const router = express.Router();
const { 
    getReviews, 
    getReviewById, 
    getReviewsByUserId, 
    create, 
    remove 
} = require('../../controllers/api/review.controllers');

const { 
    hasToken, 
    userExistsByTokenId,
    hasRequiredBodyKeys,
    idIsNumber,
    isAdmin
} = require('../../middlewares/auth');



// Get all reviews
router.get('/', 
    hasToken,
    userExistsByTokenId,
    getReviews
);

// Get reviews by user id
router.get('/user/:id', 
    hasToken,
    isAdmin,
    idIsNumber,
    userExistsByTokenId,
    getReviewsByUserId
);

// Get review by id
router.get('/:id', 
    hasToken,
    idIsNumber,
    userExistsByTokenId,
    getReviewById
);

// Create a review
router.post('/', 
    hasToken,
    userExistsByTokenId,
    hasRequiredBodyKeys(['rating', 'comment']),
    create
);

// Delete a review
router.delete('/:id', 
    hasToken,
    userExistsByTokenId,
    remove
);

module.exports = router;