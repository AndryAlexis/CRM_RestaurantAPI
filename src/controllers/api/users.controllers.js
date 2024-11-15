const { registerUser, getAllUsers } = require('../../models/api/users.models');

const register = async (req, res, next) => {
    try {
        const { name, password, email, phone, surname } = req.body;
        await registerUser(name, password, email, phone, surname);
        res.status(200).json({ message: 'User registered successfully' });
    } catch (error) {
        next(error);
    }

};

const getUsers = async (req, res, next) => {
    try {
        const users = await getAllUsers();
        console.log(users)
        // Si no hay usuarios, devolver un mensaje vacío
        if (users.length === 0) {
            return res.status(404).json({ message: 'No users found' });
        }
        // Si hay usuarios, devolverlos en formato JSON
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    register,
    getUsers
};