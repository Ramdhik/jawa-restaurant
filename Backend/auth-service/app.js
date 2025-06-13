const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const auth = require('../shared/middlewares/middlewares');
const config = require('../shared/config/config');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();
const port = config.AUTH_PORT;

// Middleware
// Pastikan ini ada dan DITERAPKAN SEBELUM rute Anda
const authCorsOptions = {
  origin: 'http://localhost:5500', // HARUS SAMA PERSIS dengan origin frontend Anda
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  credentials: true, // SANGAT PENTING
  optionsSuccessStatus: 204
};
app.use(cors(authCorsOptions)); // Terapkan middleware CORS

app.use(bodyParser.json());
app.use(cookieParser());

// Routes
const routerGoogle = require('./routes/googleRoutes');
const routerUser = require('./routes/userRoutes');

app.use(routerGoogle);
app.use(routerUser);

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
