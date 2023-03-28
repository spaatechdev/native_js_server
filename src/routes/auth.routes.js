const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth.controller');
const jwt = require('jsonwebtoken');

// Login Checking
router.post('/login', authController.login);
router.post('/signup', authController.signup);
router.get('/getUserDetails', authController.getUserDetails);
module.exports = router