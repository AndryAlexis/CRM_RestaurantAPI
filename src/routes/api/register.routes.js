const express = require('express');
const router = express.Router();
const { register } = require('../../controllers/api/register.controllers');

router.post('/', register);

module.exports = router;