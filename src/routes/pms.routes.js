const express = require('express')
const router = express.Router()
const pmsController = require('../controllers/pms.controller');
// Retrieve all self pms
router.get('/self', pmsController.findSelf);
// Retrieve all supervising pms
router.get('/supervising', pmsController.findSupervising);
// Retrieve all self pms
router.get('/reviewing', pmsController.findReviewing);
// Submit new pms
router.post('/', pmsController.create);
// Submit Self Appraisal
router.put('/self/:id', pmsController.updateSelf);
// Submit Supervisor Remark
router.put('/supervising/:id', pmsController.updateSupervisor);
// Submit Reviewer Remark
router.put('/reviewing/:id', pmsController.updateReviewer);
// Retrieve a single pms with id
router.get('/:id', pmsController.findById);
// Delete a pms with id
router.delete('/:id', pmsController.delete);
module.exports = router