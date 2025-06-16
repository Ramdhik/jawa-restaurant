const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

require('./models/pesanan');
require('./models/user');
require('./models/menuMakanan');

const auth = require('./middlewares'); // Tambahkan ini

const app = express();
const port = process.env.CHEF_PORT;

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
