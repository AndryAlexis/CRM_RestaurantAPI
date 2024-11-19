const db = require('../../config/db');

const insertReservationTable = async (reservationId, date, time, tableId) => {

    const [result] = await db.query(
        `INSERT INTO reservation_has_table (reservation_id, table_id, date, time)
            VALUES
            (?, ?, ?, ?)`,
        [reservationId, tableId, date, time]
    )


    if (result.affectedRows == 0)
        return false

    return true
}

const selectReservationTableByDate = async (date) => {

    const [reservationsWithTable] = await db.query(
        `SELECT * FROM reservation_has_table WHERE date = ?`,
        [date]
    )

    return reservationsWithTable
}

module.exports = {
    insertReservationTable,
    selectReservationTableByDate,
}