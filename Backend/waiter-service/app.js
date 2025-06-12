const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('../shared/config/config');

const app = express();
const port = config.WAITER_PORT;

// Middleware
app.use(bodyParser.json());

// Routes
const routerMenuMakanan = require('./routes/menuMakananRoutes');
const routerPesanan = require('./routes/pesananRoutes');
app.use(routerPesanan);
app.use(routerMenuMakanan);

// Connect to MongoDB
mongoose.connect(config.MONGODB_URI, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

// Start the server
app.listen(port, () => {
    console.log(`Waiter Service listening on port ${port}`);
});