const express = require('express');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const router = express.Router();

router.get('/', (req, res) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASS
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    const main = async () => {    
        const info = await transporter.sendMail({
            from: process.env.GMAIL_USER,
            to: 'andry.html@gmail.com',
            subject: 'Hello :)',
            text: 'xd'
        });
        console.log(info)
    }

    main().catch(console.error);
});

module.exports = router;