const { getAll, getById, deleteReservation, createByLocation, setReservationStatus, setReservationStatusById } = require('../../controllers/api/reservations.controllers')
const router = require('express').Router()

router.get('/', getAll)
router.get('/:id', getById)

router.post('/', createByLocation)

router.put('/:id/status/:status', setReservationStatusById)

router.delete('/:id', deleteReservation)

module.exports = router