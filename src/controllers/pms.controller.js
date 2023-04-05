'use strict';
const Pms = require('../models/pms.model')
require('dotenv').config()

exports.findSelf = function (req, res) {
    Pms.findByAndCondition([{ employee_id: req.user[0].id }], function (err, pms) {
        if (err) {
            res.send(err);
        } else {
            res.status(200).send({ error: false, data: pms });
        }
    });
};

exports.findSupervising = function (req, res) {
    Pms.findByAndCondition([{ supervisor_id: req.user[0].id }], async function (err, pms) {
        if (err) {
            res.send(err);
        } else {
            pms = await pms;
            res.status(200).send({ error: false, data: await pms });
        }
    });
};

exports.findReviewing = function (req, res) {
    Pms.findByAndCondition([{ reviewer_id: req.user[0].id }], async function (err, pms) {
        if (err) {
            res.send(err);
        } else {
            res.status(200).send({ error: false, data: await pms });
        }
    });
};

exports.create = function (req, res) {
    if (!req.body.name || !req.body.email || !req.body.phone || !req.body.password || !req.body.confirm_password) {
        return res.status(400).send({ error: true, message: 'Please provide all required fields' });
    } else {
        Pms.findByOrCondition([{ email: req.body.email }, { phone: req.body.phone }], async function (err, pms) {
            pms = await pms;
            if (pms.length > 0) {
                return res.status(422).send({ error: true, message: 'Pms Already Exists' });
            } else {
                if (req.body.password !== req.body.confirm_password) {
                    return res.status(501).send({ error: true, message: 'Passwords do not match' });
                }
                req.body.raw_password = req.body.password;
                const new_pms = new Pms(req.body);
                Pms.create(new_pms, function (err, pms) {
                    if (err)
                        res.send(err);
                    return res.status(200).send({ error: false, message: "Account Created successfully!" });
                });
            }
        });
    }
};

exports.findById = function (req, res) {
    Pms.findById(req.params.id, function (err, pms) {
        if (err)
            res.send(err);
        return res.status(200).send({ error: false, data: pms });
    });
};

exports.updateSelf = function (req, res) {
    if (!req.body.kra_header_id || !req.body.kpi_details) {
        return res.status(400).send({ error: true, message: 'Please provide all required fields' });
    } else {
        let kpi_details = req.body.kpi_details;
        let json_data = kpi_details.replace(/'/g, '"');
        // json_data = JSON.parse(JSON.stringify(JSON.parse(json_data)))
        json_data = JSON.parse(json_data)
        json_data.forEach(element => {
            Pms.updateSelfKPI(element, function (err, kpi) {
                if (err)
                    res.send(err);
            });
        });
        setTimeout(()=> {
            Pms.updateSelfKRA(req.body, function (err, kra) {
                if (err)
                    res.send(err);
                return res.status(200).send({ error: false, message: 'Pms successfully updated' });
            });
        }, 1000)
    }
};

exports.updateSupervisor = function (req, res) {
    if (!req.body.kra_header_id || !req.body.kpi_details) {
        return res.status(400).send({ error: true, message: 'Please provide all required fields' });
    } else {
        let kpi_details = req.body.kpi_details;
        let json_data = kpi_details.replace(/'/g, '"');
        // json_data = JSON.parse(JSON.stringify(JSON.parse(json_data)))
        json_data = JSON.parse(json_data)
        json_data.forEach(element => {
            Pms.updateSupervisorKPI(element, function (err, kpi) {
                if (err)
                    res.send(err);
            });
        });
        setTimeout(()=> {
            Pms.updateSupervisorKRA(req.body, function (err, kra) {
                if (err)
                    res.send(err);
                return res.status(200).send({ error: false, message: 'Pms successfully updated' });
            });
        }, 1000)
    }
};

exports.updateReviewer = function (req, res) {
    if (!req.body.kra_header_id || !req.body.kpi_details) {
        return res.status(400).send({ error: true, message: 'Please provide all required fields' });
    } else {
        let kpi_details = req.body.kpi_details;
        let json_data = kpi_details.replace(/'/g, '"');
        // json_data = JSON.parse(JSON.stringify(JSON.parse(json_data)))
        json_data = JSON.parse(json_data)
        json_data.forEach(element => {
            Pms.updateReviewerKPI(element, function (err, kpi) {
                if (err)
                    res.send(err);
            });
        });
        setTimeout(()=> {
            Pms.updateReviewerKRA(req.body, function (err, kra) {
                if (err)
                    res.send(err);
                return res.status(200).send({ error: false, message: 'Pms successfully updated' });
            });
        }, 1000)
    }
};

exports.delete = function (req, res) {
    Pms.delete(req.params.id, function (err, pms) {
        if (err)
            res.send(err);
        return res.json({ error: false, message: 'Pms successfully deleted' });
    });
};