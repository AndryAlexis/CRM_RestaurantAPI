const { selectReservationTableByDate } = require("../../models/api/reservation-has-table.models")
const { selectAll } = require("../../models/api/tables.models")

const getAllAvailableByDate = async (req, res, next) => {
    const { date } = req.params

    try {
        const tables = await selectAll()
        // Tablas con reservas
        const tablesReserved = await selectReservationTableByDate(date)

        // Creamos un array con todas las tablas y disponibilidad a todas horas
        const availableTables = tables.map(table => ({
            id: table.id,
            number: table.number,
            available: {
                breakfast: true,
                lunch: true,
                dinner: true
            }
        }))

        // Iterando sobre las tablas reservadas cambiamos la disponibilidad de todas las tablas
        for (const ocupied of tablesReserved) {
            availableTables.forEach(table => {
                if (table.id === ocupied.table_id) {
                    table.available[ocupied.time] = false
                }
            });
        }

        res.status(200).json(availableTables)

    } catch (err) {
        next(err)
    }
}

module.exports = {
    getAllAvailableByDate,
}