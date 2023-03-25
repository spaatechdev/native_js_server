'use strict';
const User = require('../models/user.model');
exports.login = function (req, res) {
    const {email, password, confirm_password} = req.body
    if (!email || !password || !confirm_password) {
        return res.status(422).send({error: true, message: "Please Fill All The Details"})
    }
};