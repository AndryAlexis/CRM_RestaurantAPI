const db = require('../../config/db');

const registerUser = async ({name, password, email, phone, surname}) => {
    const [response] = await db
        .query(
            'INSERT INTO user (name, password, email, phone, surname) VALUES (?, ?, ?, ?, ?)',
            [name, password, email, phone, surname]
        );

    if (response.insertId !== 0)
        return response;
    
    return null
};

const getAllUsers = async () => {
    const [users] = await db.query('SELECT * FROM user');

    if (users.length === 0)
        return null;

    return users;
}

const getUserByEmail = async (email) => {
    const [response] = await db.query('SELECT * FROM user WHERE email = ?', [email]);

    if (response.length === 0)
        return null;

    const [user] = response;
    return user;
}

module.exports = { registerUser, getAllUsers, getUserByEmail, getUserByEmail };