const express = require('express');
const router = express.Router();

router.use('/user', require('./admin/admin.user.routes'));
// router.use('/reviews', require('./admin/reviews.routes'));
// router.use('/menu', require('./admin/menu.routes'));

module.exports = router;