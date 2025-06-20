const express = require('express');
const router = express.Router();
const mqtt = require('mqtt');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const mqttUrl = process.env.MQTT_URL;
const mqttPort = process.env.MQTT_PORT;
const topic = process.env.MQTT_TOPIC;

const mqttClient = mqtt.connect(`mqtt://${mqttUrl}:${mqttPort}`);

mqttClient.on('connect', () => {
    console.log('Connected to MQTT broker');
});

router.get('/pesanan-masuk', (req, res) => {
    mqttClient.publish(`${topic}`, 'Pesanan Masuk');
    res.send('Pesanan Masuk dikirim ke MQTT');
});

router.get('/pesanan-selesai', (req, res) => {
    mqttClient.publish(`${topic}`, 'Pesanan Selesai');
    res.send('Pesanan Selesai dikirim ke MQTT');
});

module.exports = router;
