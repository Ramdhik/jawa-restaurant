const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3003;

// Middleware
app.use(bodyParser.json());

// Routes
const routerUser = require('./routes/userRoutes');
app.use(routerUser);

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
    console.log(`Auth Service listening on port ${port}`);
});