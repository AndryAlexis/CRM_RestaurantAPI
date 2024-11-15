const { registerUser } = require('../../models/api/register.models');

const register = async (req, res, next) => {
    try {
        const { name, password, email, phone, surname} = req.body;
        await registerUser(name, password, email, phone, surname);
        res.status(200).json({ message: 'User registered successfully' });
    } catch (error) {
        next(error);
    }

};

module.exports = { register };