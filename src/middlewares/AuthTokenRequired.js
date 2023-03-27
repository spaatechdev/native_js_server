'use strict';
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
    const {authorization} = req.headers;

    if (!authorization) {
        return res.status(401).send({error: true, message: "Authorization must be given."})
    }
    const token = authorization.replace("Bearer ", "")
    jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
        if (err) {
            return res.status(401).send({error: true, message: "Token Invalid."})
        } else {
            const {_id} = payload;
            User.findById(_id, function (err, userData) {
                req.user = userData;
                next();
            });
        }
    })
}