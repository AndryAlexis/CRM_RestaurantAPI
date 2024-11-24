const { getAllAvailableByDate, getAllTables, setTableCapacityById, removeTableById, createTable } = require('../../controllers/api/tables.controllers')

const router = require('express').Router()

router.get('/', getAllTables)
router.get('/available/:date', getAllAvailableByDate)

router.post('/', createTable)

router.put('/:id/capacity/:capacity', setTableCapacityById)

router.delete('/:id', removeTableById)

module.exports = router