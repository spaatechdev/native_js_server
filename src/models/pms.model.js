'use strict';
var dbConn = require('../../config/db.config');
//Pms object create

var Pms = function (pms) {
    this.employee_id = pms.employee_id;
    this.supervisor_id = pms.supervisor_id;
    this.reviewer_id = pms.reviewer_id;
    this.created_date = pms.created_date;
    this.employee_remarks = pms.employee_remarks;
    this.supervisor_remarks = pms.supervisor_remarks;
    this.reviewer_remarks = pms.reviewer_remarks;
    this.status = pms.status;
    this.update_status = pms.update_status;
};

Pms.create = function (newPms, result) {
    dbConn.query("INSERT INTO kra_header set ?", newPms, function (err, res) {
        if (err) {
            result(err, null);
            return
        } else {
            result(null, res.insertId);
            return
        }
    });
};

Pms.findById = function (id, result) {
    dbConn.query("Select kra_header.*, employee.name as employee_name, supervisor.name as supervisor_name, reviewer.name as reviewer_name from kra_header left join users employee on kra_header.employee_id = employee.id left join users supervisor on kra_header.supervisor_id = supervisor.id left join users reviewer on kra_header.reviewer_id = reviewer.id where kra_header.id = ? ", id, function (err, res) {
        if (err) {
            result(null, err);
            return
        } else {
            res.forEach(element => {
                dbConn.query("Select kra_details.* from kra_details where kra_header_id=" + element.id, function (kra_err, kra_details) {
                    if (kra_err) {
                        result(null, kra_err);
                        return
                    } else {
                        element.kra_details = kra_details;
                        element.kra_details.forEach(kra_element => {
                            dbConn.query("Select kpi_details.* from kpi_details where kra_details_id=" + kra_element.id, function (kpi_err, kpi_details) {
                                if (kpi_err) {
                                    result(null, kpi_err);
                                    return
                                } else {
                                    kra_element.kpi_details = kpi_details;
                                }
                            })
                        });
                    }
                })
            });
            setTimeout(async () => {
                result(null, res);
                return
            }, 1000)
        }
    });
};

Pms.findByAndCondition = function (conditions, result, getKraDetails) {
    let query = '';
    query += Object.keys(conditions[0])[0] + "='" + Object.values(conditions[0])[0] + "'";
    if (conditions.length > 1) {
        for (let i = 1; i < conditions.length; i++) {
            query += " AND kra_header." + Object.keys(conditions[i])[0] + "='" + Object.values(conditions[i])[0] + "'"
        }
    }
    dbConn.query("Select kra_header.*, employee.name as employee_name, supervisor.name as supervisor_name, reviewer.name as reviewer_name from kra_header left join users employee on kra_header.employee_id = employee.id left join users supervisor on kra_header.supervisor_id = supervisor.id left join users reviewer on kra_header.reviewer_id = reviewer.id where " + query, async function (err, res, add_kra_header) {
        if (err) {
            result(null, err);
            return
        } else {
            res.forEach(element => {
                dbConn.query("Select kra_details.* from kra_details where kra_header_id=" + element.id, function (kra_err, kra_details) {
                    if (kra_err) {
                        result(null, kra_err);
                        return
                    } else {
                        element.kra_details = kra_details;
                        element.kra_details.forEach(kra_element => {
                            dbConn.query("Select kpi_details.* from kpi_details where kra_details_id=" + kra_element.id, function (kpi_err, kpi_details) {
                                if (kpi_err) {
                                    result(null, kpi_err);
                                    return
                                } else {
                                    kra_element.kpi_details = kpi_details;
                                }
                            })
                        });
                    }
                })
            });
            setTimeout(async () => {
                result(null, res);
                return
            }, 1000)
        }
    });
};

Pms.findByOrCondition = function (conditions, result) {
    let query = '';
    query += Object.keys(conditions[0])[0] + "='" + Object.values(conditions[0])[0] + "'";
    if (conditions.length > 1) {
        for (let i = 1; i < conditions.length; i++) {
            query += " OR kra_header." + Object.keys(conditions[i])[0] + "='" + Object.values(conditions[i])[0] + "'"
        }
    }
    dbConn.query("Select kra_header.*, employee.name as employee_name, supervisor.name as supervisor_name, reviewer.name as reviewer_name from kra_header left join users employee on kra_header.employee_id = employee.id left join users supervisor on kra_header.supervisor_id = supervisor.id left join users reviewer on kra_header.reviewer_id = reviewer.id where " + query, async function (err, res) {
        if (err) {
            result(null, err);
            return
        } else {
            res.forEach(element => {
                dbConn.query("Select kra_details.* from kra_details where kra_header_id=" + element.id, function (kra_err, kra_details) {
                    if (kra_err) {
                        result(null, kra_err);
                        return
                    } else {
                        element.kra_details = kra_details;
                        element.kra_details.forEach(kra_details => {
                            dbConn.query("Select kpi_details.* from kpi_details where kra_details_id=" + kra_details.id, function (kpi_err, kpi_details) {
                                if (kpi_err) {
                                    result(null, kpi_err);
                                    return
                                } else {
                                    kra_details.kpi_details = kpi_details
                                }
                            })
                        });
                    }
                })
            });
            setTimeout(async () => {
                result(null, await res);
                return
            }, 10)
        }
    });
};

Pms.findAll = function (result) {
    dbConn.query("Select kra_header.* from kra_header", function (err, res) {
        if (err) {
            result(null, err);
            return
        } else {
            res.forEach(element => {
                dbConn.query("Select kra_details.* from kra_details where kra_header_id=" + element.id, function (kra_err, kra_details) {
                    if (kra_err) {
                        result(null, kra_err);
                        return
                    } else {
                        element.kra_details = kra_details;
                        element.kra_details.forEach(kra_details => {
                            dbConn.query("Select kpi_details.* from kpi_details where kra_details_id=" + kra_details.id, function (kpi_err, kpi_details) {
                                if (kpi_err) {
                                    result(null, kpi_err);
                                    return
                                } else {
                                    kra_details.kpi_details = kpi_details
                                }
                            })
                        });
                    }
                })
            });
            setTimeout(async () => {
                result(null, await res);
                return
            }, 10)
        }
    });
};

Pms.updateSelfKPI = function (pms, result) {
    dbConn.query("UPDATE kpi_details SET employee_note=?,employee_rating=?,employee_submit_date=? WHERE id = ?", [pms.note, pms.rating, new Date(), pms.details_id], function (err, res) {
        if (err) {
            result(null, err);
            return
        } else {
            result(null, res);
            return
        }
    });
};

Pms.updateSelfKRA = function (req, result) {
    dbConn.query("UPDATE kra_header SET employee_remarks=?,update_status=?,created_date=? WHERE id = ?", [req.remarks, 1, new Date(), req.kra_header_id], function (err, res) {
        if (err) {
            result(null, err);
            return
        } else {
            result(null, res);
            return
        }
    });
};

Pms.updateSupervisorKPI = function (pms, result) {
    dbConn.query("UPDATE kpi_details SET supervisor_note=?,supervisor_rating=?,supervisor_submit_date=? WHERE id = ?", [pms.note, pms.rating, new Date(), pms.details_id], function (err, res) {
        if (err) {
            result(null, err);
            return
        } else {
            result(null, res);
            return
        }
    });
};

Pms.updateSupervisorKRA = function (req, result) {
    dbConn.query("UPDATE kra_header SET supervisor_remarks=?,update_status=?,created_date=? WHERE id = ?", [req.remarks, 2, new Date(), req.kra_header_id], function (err, res) {
        if (err) {
            result(null, err);
            return
        } else {
            result(null, res);
            return
        }
    });
};

Pms.updateReviewerKPI = function (pms, result) {
    dbConn.query("UPDATE kpi_details SET reviewer_note=?,reviewer_submit_date=? WHERE id = ?", [pms.note, new Date(), pms.details_id], function (err, res) {
        if (err) {
            result(null, err);
            return
        } else {
            result(null, res);
            return
        }
    });
};

Pms.updateReviewerKRA = function (req, result) {
    dbConn.query("UPDATE kra_header SET reviewer_remarks=?,update_status=?,created_date=? WHERE id = ?", [req.remarks, 3, new Date(), req.kra_header_id], function (err, res) {
        if (err) {
            result(null, err);
            return
        } else {
            result(null, res);
            return
        }
    });
};

Pms.delete = function (id, result) {
    kra_details = dbConn.query("select kra_header_id FROM kra_details WHERE kra_header_id = ?", [id], function (err, res) {
        if (err) {
            result(null, err);
            return
        } else {
            let kra_details_ids = []
            kra_details.forEach(element => {
                kra_details_ids.push(element.id)
            });
            dbConn.query("DELETE FROM kra_header WHERE id = ?", [id], function (header_err, header_res) {
                if (header_err) {
                    result(null, header_err);
                    return
                } else {
                    dbConn.query("DELETE FROM kra_details WHERE kra_header_id = ?", [id], function (kra_err, kra_res) {
                        if (kra_err) {
                            result(null, kra_err);
                            return
                        } else {
                            dbConn.query("DELETE FROM kpi_details WHERE id in = (?)", [kra_details_ids.join(', ')], function (kpi_err, kpi_res) {
                                if (kpi_err) {
                                    result(null, kpi_err);
                                    return
                                } else {
                                    result(null, kpi_res)
                                    return
                                }
                            })
                        }
                    })
                }
            });
        }
    })
};
module.exports = Pms;