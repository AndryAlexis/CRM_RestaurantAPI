const db = require('../../config/db');

const registerUser = async (name, password, email, phone, surname) => {
    return await db
        .query(
            'INSERT INTO users (name, password, email, phone, surname) VALUES (?, ?, ?, ?, ?)',
            [name, password, email, phone, surname]
        );
};

const getAllUsers = async () => {
    const [users] = await db.query('SELECT * FROM users');
    return users;
}
module.exports = { registerUser, getAllUsers };