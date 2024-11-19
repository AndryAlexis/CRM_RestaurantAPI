const { insertReservationTable } = require("../../models/api/reservation-has-table.models")
const { selectAll, selectByParams, selectById, insertReservation, deleteById } = require("../../models/api/reservations.models")
const { selectByNumber: selectTableByNumber } = require("../../models/api/tables.models")

const getAll = async (req, res, next) => {

    paramsArray = Object.entries(req.query)

    // Optional parameters
    if (paramsArray.length) {

        validParams = new Set(['date', 'time', 'guests', 'status', 'user_id'])
        filteredParams = paramsArray
            .filter(param => validParams.has(param[0]))
        paramsObect = Object.fromEntries(filteredParams)

        try {
            reservations = await selectByParams(paramsObect)
            return res.json(reservations)

        } catch (err) {
            next(err)
        }
    }

    // All if no params
    try {
        reservations = await selectAll();
        res.json(reservations);

    } catch (err) {
        next(err)
    }
}


const getById = async (req, res, next) => {
    const { id } = req.params

    try {
        const reservation = await selectById(id)

        if (!reservation)
            return res.status(404).json({ message: "The reservation with the requested id does not exists" })

        res.json(reservation)
    } catch (err) {
        next(err)
    }
}

const createWithTables = async (req, res, next) => {
    const { date, time, guests, status, user_id, tables: tablesNum } = req.body
    let reservationId;

    try {
        // Obtener un array de tablas segun sus numeros 
        const tables = await Promise.all(tablesNum.map(tableNum => {
            const table = selectTableByNumber(tableNum)
            if (!table)
                return res.status(404).json({ message: "Selected tables do not exists" })
            return table
        }))

        // Comprobar que la capacidad de las mesas sea suficiente
        const capacity = tables.reduce((acum, next) =>
            acum.capacity + next.capacity)
        if (capacity < guests)
            return res.status(409).json({ message: "Guests exceed tables capacity" })


        // Hacer la reserva
        reservationId = await insertReservation(date, time, guests, status, user_id)
        await Promise.all(tables.map(table =>
            insertReservationTable(reservationId, date, time, table.id)))

        res.status(200).json({
            message: "Reservation succesful",
            reservationId: reservationId
        })

    } catch (err) {

        // Deshacer la reserva
        await deleteById(reservationId)

        // DB errros
        if (['ER_TRUNCATED_WRONG_VALUE', 'WARN_DATA_TRUNCATED', 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD']
            .includes(err.code))
            return res.status(400).json({ message: "Invalid body data" })

        if (err.code === 'ER_DUP_ENTRY')
            return res.status(409).json({ message: "Seleted tables are reserved" })

        next(err)
    }
}


const deleteReservation = async (req, res, next) => {
    const { id } = req.params

    try {
        const reservation = await selectById(id)
        if (!reservation)
            return res.status(404).json({ message: "The reservation with the requested id does not exists" })

        await deleteById(id)

        return res.status(200).json(reservation)


    } catch (err) {
        next(err)
    }
}


module.exports = {
    getAll,
    getById,
    createWithTables,
    deleteReservation
}