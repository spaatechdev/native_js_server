'use strict';
const User = require('../models/user.model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
require('dotenv').config()

exports.findAll = function (req, res) {
    User.findAll(function (err, user) {
        if (err)
            res.send(err);
        return res.status(200).send({ error: false, data: user });
    });
};

exports.create = function (req, res) {
    //handles null error
    // if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    //     res.status(400).send({ error: true, message: 'Please provide all required field' });
    if (!req.body.name || !req.body.email || !req.body.phone || !req.body.password || !req.body.confirm_password) {
        return res.status(400).send({ error: true, message: 'Please provide all required fields' });
    } else {
        User.findByOrCondition([{ email: req.body.email }, {phone: req.body.phone}], async function (err, user) {
            user = await user;
            if (user.length > 0) {
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
                    return res.status(200).send({ error: false, message: "User added successfully!" });
                });
            }
        });
    }
};

exports.findById = function (req, res) {
    User.findById(req.params.id, function (err, user) {
        if (err)
            res.send(err);
        return res.status(200).send({ error: false, data: user });
    });
};

exports.update = function (req, res) {
    // if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    //     res.status(400).send({ error: true, message: 'Please provide all required field' });
    if (!req.body.name || !req.body.email || !req.body.phone) {
        return res.status(400).send({ error: true, message: 'Please provide all required field' });
    } else {
        User.update(req.params.id, new User(req.body), function (err, user) {
            if (err)
                res.send(err);
            return res.status(200).send({ error: false, message: 'User successfully updated' });
        });
    }
};

exports.delete = function (req, res) {
    User.delete(req.params.id, function (err, user) {
        if (err)
            res.send(err);
        return res.json({ error: false, message: 'User successfully deleted' });
    });
};