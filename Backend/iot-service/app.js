const express = require('express');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const app = express();
const port = process.env.IOT_PORT;

const routerIOT = require('./routes/iotRoutes');
app.use(routerIOT);

app.listen(port, () => {
    console.log(`IoT Service listening on port ${port}`);
});