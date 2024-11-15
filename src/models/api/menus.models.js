const pool = require('../../config/db');

const selectById = async (id) => {
    const [result] = await pool.query('SELECT * FROM menus WHERE id = ?', [id]);
    return result[0];
};

const selectAll = async () => {
    const [result] = await pool.query('SELECT * FROM menus');
    return result;
}

const createMenu = async (id, date) => {
    const [result] = await pool.query('INSERT INTO menus (id, date) VALUES (?, ?)', [id, date]);
    return result;

}
module.exports = {
    selectById,
    selectAll,
    createMenu
};