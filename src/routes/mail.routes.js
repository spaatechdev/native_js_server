const express = require('express');
const router = express.Router();
const mailController = require('../controllers/mail.controller');
const User = require('../models/user.model');

// Login Checking
router.post('/signup_code_sending', async (req, res) => {
    // mailController.send_mail({email: req.body.email, code: req.body.code})
    if (!req.body.name || !req.body.email || !req.body.phone || !req.body.password || !req.body.confirm_password) {
        return res.status(400).send({ error: true, message: 'Please provide all required fields' });
    } else {
        User.findByOrCondition([{ email: req.body.email }, { phone: req.body.phone }], async function (err, user) {
            if (await user.length > 0) {
                return res.status(422).send({ error: true, message: 'User Already Exists' });
            } else {
                try {
                    // let verificationCode = Math.floor(100000 + Math.random() * 900000)
                    let verificationCode = 999999
                    userData = {name: req.body.name, email: req.body.email, phone: req.body.phone, password: req.body.password, confirm_password: req.body.confirm_password, verificationCode: verificationCode}
                    mailController.send_mail({ email: req.body.email, code: verificationCode })
                    return res.status(200).send({error: false, message: 'Verification code sent to your email', userData: userData})
                } catch (err) {
                    return res.status(422).send({error: true, message: 'Something went wrong: ' + err})
                }
            }
        });
    }
});
module.exports = router