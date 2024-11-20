const { getAllAvailableByDate } = require('../../controllers/api/tables.controllers')

const router = require('express').Router()

router.get('/available/:date', getAllAvailableByDate)

module.exports = router