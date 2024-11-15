const express = require('express');
const router = express.Router();

router.use('/register', require('./api/register.routes'));

module.exports = router;
