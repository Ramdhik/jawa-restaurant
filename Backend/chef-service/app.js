require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

require('../shared/models/pesanan');
require('../shared/models/user');
require('../shared/models/menuMakanan');

const auth = require('../shared/middlewares/middlewares'); // Tambahkan ini

const app = express();
const port = process.env.PORT || 3002;

// Middleware
app.use(bodyParser.json());

// Routes
const routerPesananChef = require('./routes/pesananChefRoutes');
app.use(auth, routerPesananChef); // Proteksi route dengan auth

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Start the server
app.listen(port, () => {
  console.log(`Chef Service listening on port ${port}`);
});
