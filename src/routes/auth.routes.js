const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth.controller');
const jwt = require('jsonwebtoken');

// Login Checking
router.post('/login', authController.login);
module.exports = router