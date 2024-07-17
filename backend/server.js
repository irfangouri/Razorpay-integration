const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const paymentRoutes = require('./routes/payment.js');

const dotenv = require('dotenv');
dotenv.config();

const MONGO_URL = process.env.MONGO_URL;
const DB_NAME = process.env.DB_NAME;

const PORT = process.env.PORT || 5678;
const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect(MONGO_URL, {
  dbName: DB_NAME
}).then(() => console.log('Successfully connected with MongoDB'))
  .catch((err) => console.error('Error occurred while connected with MongoDB, Error: ', err));

app.get('/', (req, res, next) => {
  res.send(`Hello world`);
});

app.use('/api/payment', paymentRoutes);

app.listen(PORT , () => {
  console.log(`Server is listening on PORT ${PORT}`);
});
