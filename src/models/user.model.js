'use strict';
var dbConn = require('../../config/db.config');
//User object create

var User = function (user) {
    this.name = user.name;
    this.email = user.email;
    this.phone = user.phone;
    this.password = user.password;
    this.raw_password = user.password;
    this.created_at = new Date();
    this.status = user.status ? user.status : 1;
    this.deleted = 0;
};

User.create = function (newUser, result) {
    dbConn.query("INSERT INTO users set ?", newUser, function (err, res) {
        if (err) {
            result(err, null);
        }
        else {
            result(null, res.insertId);
        }
    });
};

User.findById = function (id, result) {
    dbConn.query("Select * from users where id = ? ", id, function (err, res) {
        if (err) {
            result(err, null);
        }
        else {
            result(null, res);
        }
    });
};

User.findByCondition = function (conditions, result) {
    let query = '';
    query += Object.keys(conditions[0])[0] + "='" + Object.values(conditions[0])[0] + "'";
    if (conditions.length > 1) {
        for (let i=1; i<conditions.length; i++) {
            query += " AND " + Object.keys(conditions[i])[0] + "='" + Object.values(conditions[i])[0] + "'"
        }
    }
    dbConn.query("Select * from users where " + query, function (err, res) {
        if (err) {
            result(null, err);
        }
        else {
            result(null, res);
        }
    });
};

User.findAll = function (result) {
    dbConn.query("Select * from users", function (err, res) {
        if (err) {
            result(null, err);
        }
        else {
            result(null, res);
        }
    });
};

User.update = function (id, user, result) {
    dbConn.query("UPDATE users SET name=?,email=?,phone=?,password=?,raw_password=?,status=? WHERE id = ?", [user.name, user.email, user.phone, user.password, user.raw_password, user.status, id], function (err, res) {
        if (err) {
            result(null, err);
        } else {
            result(null, res);
        }
    });
};

User.delete = function (id, result) {
    dbConn.query("DELETE FROM users WHERE id = ?", [id], function (err, res) {
        if (err) {
            result(null, err);
        }
        else {
            result(null, res);
        }
    });
};
module.exports = User;