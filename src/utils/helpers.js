const jwt = require('jsonwebtoken');
require('dotenv').config();
const nodemailer = require("nodemailer");


/**
 * Generates a JWT token with the provided payload
 * @param {Object} payload - Data to be encoded in the token
 * @param {string|number} payload.id - User ID to encode in token
 * @param {string} payload.role - User role to encode in token
 * @returns {string} JWT token signed with the secret key from environment variables
 */
const generateToken = ({ id, role }) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { noTimestamp: true });
}

/**
 * Verifies and decodes a JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded payload if token is valid
 * @throws {JsonWebTokenError} If token is invalid or expired
 */
const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return null;
    }
}

/**
 * Checks if an object contains all the required keys
 * @param {Object} obj - Object to check for keys
 * @param {string[]} keys - Array of key names to check for
 * @returns {Object} Result object containing:
 *   - hasAllKeys {boolean}: true if all keys exist, false otherwise
 *   - missingKeys {string[]}: array of keys that were not found in the object
 */
const hasKeys = (obj, keys) => {
    const missingKeys = keys.filter(key => !obj.hasOwnProperty(key));
    return {
        hasAllKeys: missingKeys.length === 0,
        missingKeys
    };
}

/**
 * Checks if an object contains at least one of the specified keys
 * @param {Object} obj - Object to check for keys
 * @param {string[]} keys - Array of key names to check for
 * @returns {Object} Result object containing:
 *   - hasAtLeastOneKey {boolean}: true if at least one key exists, false if none exist
 *   - missingKeys {string[]}: array of keys that were not found in the object
 */
const hasAtLeastOneKey = (obj, keys) => {
    const missingKeys = keys.filter(key => !obj.hasOwnProperty(key));
    return {
        hasSomeKeys: missingKeys.length < keys.length,
        missingKeys
    };
}

/**
 * Controls the length of a string by truncating or padding
 * @param {string} str - The string to control length of
 * @param {number} maxLength - Maximum allowed length
 * @returns {boolean} True if string length is within the limit, false otherwise
 */
const isStringLengthValid = (str, maxLength) => {
    return String(str.length) <= maxLength;
}

// Remove spaces from end and start from a string
const removeSpaces = (str) => {
    const string = String(str);
    return string.trim();
}

// Check if a value is a number
const isNumber = (value) => {
    return !isNaN(value);
}


const sendEmail = (email) => {

    const transporter = nodemailer.createTransport({
        host: 'smtp-mail.outlook.com', // Servidor SMTP de Hotmail/Outlook
        port: 587,                     // Puerto SMTP
        secure: false,                 // false para usar TLS
        auth: {
            user: 'skunk86_666@hotmail.com', // Reemplaza con tu correo
            pass: '608827637cjLB',         // Contraseña o contraseña de aplicación
        },
        tls: {
            rejectUnauthorized: false,    // Para evitar problemas con certificados TLS
        },

    });
    async function main() {
        // send mail with defined transport object
        const info = await transporter.sendMail({
            from: '"Carlos" <skunk86_666@hotmail.com>', // sender address
            to: email, // list of receivers
            subject: "Reservation confirmation", // Subject line
            html: `<b>Hello, your reservation is confirmed!`
            // html: `<b>Hello, your reservation is confirmed!</b><br>Date: ${reservationDetails.date}<br>Time: ${reservationDetails.time}<br>Guests: ${reservationDetails.guests}`
        });
    }
    main().catch(console.error);
}

module.exports = {
    generateToken,
    verifyToken,
    hasKeys,
    hasAtLeastOneKey,
    isStringLengthValid,
    removeSpaces,
    isNumber,
    sendEmail
};