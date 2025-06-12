const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const auth = require('../shared/middlewares/middlewares'); // Tambahkan ini
const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(bodyParser.json());

// Routes
const routerMenuMakanan = require('./routes/menuMakananRoutes');
const routerPesanan = require('./routes/pesananRoutes');
app.use(auth, routerPesanan);
app.use(auth, routerMenuMakanan);

// Connect to MongoDB
mongoose
  .connect('mongodb+srv://baramora97:bara123@cluster0.lopfxb2.mongodb.net/restaurantDB', {
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
