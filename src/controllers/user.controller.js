'use strict';
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

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
        return res.status(400).send({ error: true, message: 'Please provide all required field' });
    } else {
        User.findByCondition([{ email: req.body.email }], async function (err, user) {
            if (await user.length > 0) {
                res.status(422).send({ error: true, message: 'User Already Exists' });
            } else {
                const new_user = new User(req.body);
                User.create(new_user, function (err, user) {
                    if (err)
                        res.send(err);
                    const token = jwt.sign({ _id: user.id }, process.env.JWT_SECRET)
                    res.status(200).send({ error: false, message: "User added successfully!", data: user, token: token });
                });
            }
        });
    }
};

exports.findById = function (req, res) {
    User.findById(req.params.id, function (err, user) {
        if (err)
            res.send(err);
        res.status(200).send({ error: false, data: user });
    });
};

exports.update = function (req, res) {
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        res.status(400).send({ error: true, message: 'Please provide all required field' });
    } else {
        User.update(req.params.id, new User(req.body), function (err, user) {
            if (err)
                res.send(err);
            res.status(200).send({ error: false, message: 'User successfully updated' });
        });
    }
};

exports.delete = function (req, res) {
    User.delete(req.params.id, function (err, user) {
        if (err)
            res.send(err);
        res.json({ error: false, message: 'User successfully deleted' });
    });
};