const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const auth = require('./middlewares');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const app = express();
const port = process.env.WAITER_PORT;

// Middleware
app.use(bodyParser.json());

// Routes
const routerMenuMakanan = require('./routes/menuMakananRoutes');
const routerPesanan = require('./routes/pesananRoutes');
app.use(auth, routerPesanan);
app.use(auth, routerMenuMakanan);

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
  console.log(`Waiter Service listening on port ${port}`);
});
