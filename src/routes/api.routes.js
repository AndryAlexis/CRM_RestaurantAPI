const express = require('express');
const router = express.Router();

router.use('/users', require('./api/users.routes'));

module.exports = router;
