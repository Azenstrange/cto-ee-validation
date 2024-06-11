const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const otplib = require('otplib');
const qrcode = require('qrcode');
const mysql = require('mysql2');
const { OAuth2Client } = require('google-auth-library');
const fs = require('fs');
const cors = require('cors');
const app = express();
const port = 8888;
require('dotenv').config();
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
}));
app.use(express.json())
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const clientSecret = JSON.parse(fs.readFileSync('./client_secret.json')); 
const client = new OAuth2Client(clientSecret.web.client_id);

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'mydb',
  port: 3306
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to the database!');
});

// User registration
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 8);
  const otpSecret = otplib.authenticator.generateSecret();
  const otpAuthUrl = otplib.authenticator.keyuri(username, 'YourAppName', otpSecret);
  connection.query('INSERT INTO users (username, password, otp_secret) VALUES (?, ?, ?)', [username, hashedPassword, otpSecret], (err) => {
    if (err) throw err;
    // Generate QR code for the OTP Auth URL
    qrcode.toDataURL(otpAuthUrl, (err, imageUrl) => {
      if (err) throw err;
      res.status(201).json({ otpAuthUrl, imageUrl });
    });
  });
});


// User login
app.post('/login', async (req, res) => {
  const { username, password} = req.body;

  connection.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
    if (err) throw err;

    if (results.length && await bcrypt.compare(password, results[0].password)) {
        const token = jwt.sign({ id: results[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } else {
      res.status(401).send('Invalid credentials');
    }
  });
});

app.post('/validateotp', async (req, res) => {
  const { token, otpcode } = req.body;
  const userId = jwt.verify(token, process.env.JWT_SECRET).id;
  connection.query('SELECT id, otp_secret, username FROM users WHERE id = ?', [userId], async (err, results) => {
    const validOTP = otplib.authenticator.check(otpcode, results[0].otp_secret);
    if (validOTP) {
      const newToken = jwt.sign({ id: results[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token: newToken, username: results[0].username });
    } else {
      res.status(401).send('Invalid OTP');
    }
  });
});
