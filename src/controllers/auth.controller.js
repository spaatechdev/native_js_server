'use strict';
const User = require('../models/user.model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
require('dotenv').config()


exports.login = function (req, res) {
    const {email, password} = req.body
    if (!email || !password) {
        return res.status(422).send({error: true, message: "Please Fill All The Details"})
    }
    User.findByAndCondition([{ email: req.body.email }], async function (err, user) {
        user = await user;
        if (user.length < 1) {
            return res.status(422).send({ error: true, message: 'Invalid Credentials' });
        }
        user = user[0];
        try {
            bcrypt.compare(password, user.password, async (err, result) => {
                result = await result;
                if (result) {
                    const token = jwt.sign({ _id: user.id }, process.env.JWT_SECRET)
                    return res.status(200).send({ error: false, message: "Logged in successfully!", token: token });
                } else {
                    return res.status(422).send({ error: true, message: 'Invalid Credentials' });
                }
            })
        } catch (err) {
            console.log(err);
        }
    });
};