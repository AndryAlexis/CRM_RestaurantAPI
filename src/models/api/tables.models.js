const db = require('../../config/db');

const selectAll = async () => {
    const [tables] = await db.query('SELECT * FROM `table`')
    return tables
}


const selectByNumber = async (number) => {
    const [[table]] = await db.query('SELECT * FROM `table` WHERE number = ?', [number])
    return table
}

const selectByLocation = async (location) => {
    const [table] = await db.query('SELECT * FROM `table` WHERE location = ?', [location])
    return table
}

module.exports = {
    selectAll,
    selectByNumber,
    selectByLocation
}

