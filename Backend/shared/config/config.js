const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

module.exports = {
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET,

    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI,

    API_GATEWAY_PORT: process.env.API_GATEWAY_PORT,
    WAITER_PORT: process.env.WAITER_PORT,
    CHEF_PORT: process.env.CHEF_PORT,
    AUTH_PORT: process.env.AUTH_PORT
};