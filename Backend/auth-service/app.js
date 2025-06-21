const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();
const port = process.env.AUTH_PORT;

// Middleware
const authCorsOptions = {
  origin: ['http://localhost:5500', 'http://127.0.0.1:5500', 'http://localhost:80', 'http://127.0.0.1:80', 'http://localhost', 'http://127.0.0.1'],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  credentials: true,
  optionsSuccessStatus: 204
};
app.use(cors(authCorsOptions));

app.use(bodyParser.json());
app.use(cookieParser());

// Routes
const routerGoogle = require('./routes/googleRoutes');
const routerUser = require('./routes/userRoutes');

app.use(routerGoogle);
app.use(routerUser);

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
  console.log(`Auth Service listening on port ${port}`);
});
