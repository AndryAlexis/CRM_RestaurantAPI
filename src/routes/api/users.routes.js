const express = require('express');
const router = express.Router();
const { register, getUsers } = require('../../controllers/api/users.controllers');

router.post('/register', register);


module.exports = router;