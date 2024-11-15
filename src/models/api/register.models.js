const db = require('../../config/db');

const registerUser = async (name, password, email, phone, surname) => {
    return await db
    .query(
        'INSERT INTO users (name, password, email, phone, surname) VALUES (?, ?, ?, ?, ?)', 
        [name, password, email, phone, surname]
    );
};

module.exports = { registerUser };