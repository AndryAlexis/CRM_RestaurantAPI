const express = require('express');
const rateLimiter = require('../middlewares/rateLimiter');
const router = express.Router();
const { httpCodes, httpStatus } = require('../utils/serverStatus');

router.use(rateLimiter);

router.use('/', require('./api/menus.routes'));
router.use('/user', require('./api/user.routes'));

// Catch any undefined routes
router.use('*', (req, res) => {
    res.status(httpCodes.NOT_FOUND).json({
        status: httpCodes.NOT_FOUND,
        title: httpStatus[httpCodes.NOT_FOUND],
        message: `Cannot ${req.method} ${req.originalUrl}`
    });
});


module.exports = router;