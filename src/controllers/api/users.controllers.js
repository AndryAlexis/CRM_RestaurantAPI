const { NotFoundError, BadRequestError } = require('../../errors/client.errors');
const { registerUser, getUserByEmail } = require('../../models/api/users.models');
const { httpCodes, httpStatus } = require('../../utils/serverStatus');
const { generateToken, hasKeys, verifyToken } = require('../../utils/helpers');
const bcrypt = require('bcryptjs');

const register = async (req, res, next) => {
    try {
        const { name, password, email, phone, surname } = req.body;
        const passwordHash = await bcrypt.hash(password, 10);

        const newUserData = { name, password: passwordHash, email, phone, surname };

        const insertedUser = await registerUser(newUserData);

        const token = generateToken({
            id: insertedUser.id,
        });

        res.status(httpCodes.CREATED).json({
            status: httpCodes.CREATED,
            title: httpStatus[httpCodes.CREATED],
            message: 'User registered successfully',
            token: token
        });

    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { hasAllKeys, missingKeys } = hasKeys(req.body, ['email', 'password']);
        if (!hasAllKeys)
            return next(new BadRequestError(`Missing keys: ${missingKeys.join(', ')}`));

        const { email, password } = req.body;

        const user = await getUserByEmail(email, password);
        if (!user)
            return next(new NotFoundError('Credentials are incorrect'));
    
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch)
            return next(new BadRequestError('Credentials are incorrect'));

        const token = generateToken({
            id: user.id,
        });
        console.log(verifyToken(token));

        res.status(httpCodes.OK).json({
            status: httpCodes.OK,
            title: httpStatus[httpCodes.OK],
            message: 'User logged in successfully',
            token: token
        });
    } catch (error) {
        next(error);
    }
}

const menu = async (req, res, next) => {
    try {
        res.status(httpCodes.OK).json({ message: 'Menu fetched successfully' });
    } catch (error) {
        next(error);
    }
};

module.exports = { register, menu, login };