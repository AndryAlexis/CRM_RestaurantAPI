const express = require('express');
const router = express.Router();

router.use('/users', require('./api/users.routes'));
router.use('/', require('./api/menus.routes'));

module.exports = router;
