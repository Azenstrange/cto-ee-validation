const express = require('express');
const router = express.Router();
const AuthService = require('../services/auth.service');

const authService = new AuthService();

// User registration
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const response = await authService.register(username, password);
    res.status(201).json(response);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// User login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const response = await authService.login(username, password);
    res.json(response);
  } catch (error) {
    res.status(401).send(error.message);
  }
});

// Validation of the OTP code
router.post('/validateotp', async (req, res) => {
  const { token, otpcode } = req.body;
  try {
    const response = await authService.validateOTP(token, otpcode);
    res.json(response);
  } catch (error) {
    res.status(401).send(error.message);
  }
});

module.exports = router;
