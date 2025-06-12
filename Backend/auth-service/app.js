const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const auth = require('../shared/middlewares/middlewares');
const config = require('../shared/config/config');

const app = express();
const port = config.AUTH_PORT;

// Middleware
app.use(bodyParser.json());

// Routes
const routerUser = require('./routes/userRoutes');
app.use(auth, routerUser);

// Connect to MongoDB
mongoose
  .connect(config.MONGODB_URI, {
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
  console.log(`Auth Service listening on port ${port}`);
});
