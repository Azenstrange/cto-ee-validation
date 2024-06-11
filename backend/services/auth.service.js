const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const otplib = require('otplib');
const qrcode = require('qrcode');
const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'mydb',
  port: 3306
});

class AuthService {
  async register(username, password) {
    const hashedPassword = await bcrypt.hash(password, 8);
    const otpSecret = otplib.authenticator.generateSecret();
    const otpAuthUrl = otplib.authenticator.keyuri(username, 'YourAppName', otpSecret);
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO users (username, password, otp_secret) VALUES (?, ?, ?)', [username, hashedPassword, otpSecret], (err, results) => {
        if (err) reject(err);
        qrcode.toDataURL(otpAuthUrl, (err, imageUrl) => {
          if (err) reject(err);
          resolve({ otpAuthUrl, imageUrl });
        });
      });
    });
  }

  async login(username, password) {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
        if (err) reject(err);
        if (results.length && await bcrypt.compare(password, results[0].password)) {
          const token = jwt.sign({ id: results[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });
          resolve({ token });
        } else {
          reject(new Error('Invalid credentials'));
        }
      });
    });
  }

  async validateOTP(token, otpcode) {
    return new Promise((resolve, reject) => {
      const userId = jwt.verify(token, process.env.JWT_SECRET).id;
      connection.query('SELECT id, otp_secret, username FROM users WHERE id = ?', [userId], async (err, results) => {
        if (err) reject(err);
        const validOTP = otplib.authenticator.check(otpcode, results[0].otp_secret);
        if (validOTP) {
          const newToken = jwt.sign({ id: results[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });
          resolve({ token: newToken, username: results[0].username });
        } else {
          reject(new Error('Invalid OTP'));
        }
      });
    });
  }
}

module.exports = AuthService;
