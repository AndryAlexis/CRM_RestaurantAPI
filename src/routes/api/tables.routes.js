const { getAvailableByDate } = require('../../controllers/api/tables.controllers')

const router = require('express').Router()

router.get('/available/:date', getAvailableByDate)

module.exports = router