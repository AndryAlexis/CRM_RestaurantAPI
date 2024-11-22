const db = require('../../config/db');

const selectAll = async () => {
    const [tables] = await db.query('SELECT * FROM `table`')
    return tables
}

const selectTableById = async (id) => {
    const [[table]] = await db.query('SELECT * FROM `table` WHERE id = ?',
        [id])
    return table
}


const selectByNumber = async (number) => {
    const [[table]] = await db.query('SELECT * FROM `table` WHERE number = ?', [number])
    return table
}

const selectByLocation = async (location) => {
    const [table] = await db.query('SELECT * FROM `table` WHERE location = ?', [location])
    return table
}

const selectTableNumberById = async (id) => {
    const [[number]] = await db.query('SELECT number FROM `table` WHERE id = ?', [id])

    return number
}

module.exports = {
    selectAll,
    selectByNumber,
    selectByLocation,
    selectTableById,
    selectTableNumberById,
}

