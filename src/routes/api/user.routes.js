const express = require('express');
const router = express.Router();
const { register, menu, login, update, deleteUser } = require('../../controllers/api/users.controllers');
const { 
    isAdmin, 
    userExistsByEmail, 
    hasRequiredBodyKeys, 
    hasOptionalBodyKeys, 
    removeSpacesOfBody, 
    userExistsByTokenId,
    hasToken
} = require('../../middlewares/auth');

const REGISTER_KEYS = ['name', 'password', 'email', 'phone', 'surname'];
const LOGIN_KEYS = ['email', 'password'];
const UPDATE_KEYS = ['email', 'name', 'surname', 'phone', 'password'];

// Register a new user
router.post(
    '/register',
    removeSpacesOfBody(REGISTER_KEYS),
    userExistsByEmail, 
    hasRequiredBodyKeys(REGISTER_KEYS),
    register
);
// Login a user
router.post(
    '/login', 
    removeSpacesOfBody(LOGIN_KEYS), 
    userExistsByEmail,
    hasRequiredBodyKeys(LOGIN_KEYS), 
    login
);
// Update a user
router.put(
    '/',
    hasToken,
    removeSpacesOfBody(UPDATE_KEYS),
    userExistsByTokenId,
    userExistsByEmail,
    hasOptionalBodyKeys(UPDATE_KEYS),
    update
);

// Delete a user
router.delete(
    '/', 
    hasToken, 
    userExistsByTokenId, 
    deleteUser
);

// router.post('/menu', isAdmin, menu);

module.exports = router;