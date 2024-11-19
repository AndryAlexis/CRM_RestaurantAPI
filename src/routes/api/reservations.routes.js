const { getAll, getById, createWithTables, deleteReservation } = require('../../controllers/api/reservation.controllers')
const router = require('express').Router()

router.get('/', getAll)
router.get('/:id', getById)

router.post('/', createWithTables)

router.delete('/:id', deleteReservation)

module.exports = router