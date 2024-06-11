const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authController = require('./controllers/auth.controller');

const app = express();
const port = 8888;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
}));
app.use(bodyParser.json());

app.use('/', authController);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
