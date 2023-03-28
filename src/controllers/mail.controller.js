'use strict';
const nodemailer = require("nodemailer");
const User = require('../models/user.model')
require('dotenv').config()

module.exports.send_mail = async (req, res) => {
    let testAccount = await nodemailer.createTestAccount();

    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: 'chiranjit.spaatech@gmail.com',
            pass: 'iqojxhshpnocmurw',
        },
    });

    let info = await transporter.sendMail({
        from: 'Chiranjit(SPAATech)',
        to: req.email,
        subject: "Signup Verification",
        text: "Verification Code",
        html: `Your Verification code for ${process.env.PROJECT_NAME} is <b> ${req.code} </b>`,
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
};