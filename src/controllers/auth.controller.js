'use strict';
const User = require('../models/user.model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
require('dotenv').config()

exports.home = async (req, res) => {
    return res.status(200).send({error: false, message: "Connected to v1 api urls"})
}

exports.login = async function (req, res) {
    const {email, password} = req.body
    if (!email || !password) {
        return res.status(422).send({error: true, message: "Please Fill All The Details"})
    }
    User.findByAndCondition([{ email: req.body.email }], async function (err, user) {
        if (await user.length < 1) {
            return res.status(422).send({ error: true, message: 'Invalid Credentials' });
        }
        user = user[0];
        try {
            console.log(user.password);
            console.log(user.password.replace('$2y', '$2b'));
            bcrypt.compare(password, user.password.replace('$2y', '$2b'), async (err, result) => {
                if (result) {
                    const token = jwt.sign({ _id: user.id }, process.env.JWT_SECRET)
                    return res.status(200).send({ error: false, message: "Logged in successfully!", token: token });
                } else {
                    return res.status(422).send({ error: true, message: 'Invalid Credentials' });
                }
            })
        } catch (err) {
            return res.status(422).send({ error: true, message: 'Something went wrong: ' + err });
        }
    });
};

exports.signup = async function (req, res) {
    //handles null error
    // if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    //     res.status(400).send({ error: true, message: 'Please provide all required field' });
    if (!req.body.name || !req.body.email || !req.body.phone || !req.body.password || !req.body.confirm_password) {
        return res.status(400).send({ error: true, message: 'Please provide all required fields' });
    } else {
        User.findByOrCondition([{ email: req.body.email }, {phone: req.body.phone}], async function (err, user) {
            if (await user.length > 0) {
                return res.status(422).send({ error: true, message: 'User Already Exists' });
            } else {
                if (req.body.password !== req.body.confirm_password) {
                    return res.status(501).send({ error: true, message: 'Passwords do not match' });
                }
                req.body.raw_password = req.body.password;
                req.body.password = await bcrypt.hash(req.body.password, 8);
                const new_user = new User(req.body);
                User.create(new_user, function (err, user) {
                    if (err)
                        res.send(err);
                    return res.status(200).send({ error: false, message: "Account Created successfully!" });
                });
            }
        });
    }
};

exports.getUserDetails = async (req, res, next) => {
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
            User.findById(_id, async function (err, userData) {
                req.user = await userData;
                return res.status(200).send({ error: false, userData: userData[0] });
            });
        }
    })
};