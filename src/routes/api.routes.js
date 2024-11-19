const express = require('express');
const router = express.Router();

router.use('/menus', require('./api/menus.routes'));
router.use('/user', require('./api/user.routes'));
router.use('/reservations', require('./api/reservations.routes'));
router.use('/tables', require('./api/tables.routes'))

module.exports = router;
