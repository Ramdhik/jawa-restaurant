// app.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Import routes
const userRoutes = require('./routes/userRoutes');
const menuMakananRoutes = require('./routes/menuMakananRoutes');
const pesananRoutes = require('./routes/pesananRoutes');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Routing
app.use(userRoutes);
app.use(menuMakananRoutes);
app.use(pesananRoutes);

// Connect to MongoDB
mongoose.connect('mongodb+srv://baramora97:bara123@cluster0.lopfxb2.mongodb.net/restaurantDB', {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});