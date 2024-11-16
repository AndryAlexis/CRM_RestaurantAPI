const express = require('express');
const router = express.Router();
const { register, menu, login } = require('../../controllers/api/users.controllers');
const { isAdmin, userExists } = require('../../middlewares/auth');

router.post('/register', userExists, register);
router.post('/login', login);
router.post('/menu', isAdmin, menu);


module.exports = router;