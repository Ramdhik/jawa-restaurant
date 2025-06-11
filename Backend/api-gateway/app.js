const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const rateLimit = require('express-rate-limit');
const throttle = require('express-slow-down');

const app = express();
const port = process.env.PORT || 3000;

const WAITER_SERVICE_URL = 'http://localhost:3001';
const CHEF_SERVICE_URL = 'http://localhost:3002';
const AUTH_SERVICE_URL = 'http://localhost:3003';

const apiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests, please try again later.',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const apiThrottle = throttle({
    windowMs: 1 * 60 * 1000, // 1 minutes
    delayAfter: 80, // start throttling after 80 requests
    delayMs: (used, req) => {
        return (used - req.slowDown.limit) * 500; // 500ms per request
    },
});

app.use('/waiter', apiLimiter, apiThrottle, createProxyMiddleware({
    target: WAITER_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
        '^/waiter': '',
    },
}));

app.use('/chef', apiLimiter, apiThrottle, createProxyMiddleware({
    target: CHEF_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
        '^/chef': '',
    },
}));

app.use('/auth', apiLimiter, apiThrottle, createProxyMiddleware({
    target: AUTH_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
        '^/auth': '',
    },
}));

app.listen(port, () => {
    console.log(`API Gateway listening on port ${port}`);
});