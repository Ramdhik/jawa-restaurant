const express = require('express');
const router = express.Router();
const mqtt = require('mqtt');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const mqttUrl = process.env.MQTT_URL;
const mqttPort = process.env.MQTT_PORT;
const mqttTopic = process.env.MQTT_TOPIC;

if (!mqttUrl || !mqttPort || !mqttTopic) {
    console.error('MQTT_URL, MQTT_PORT, atau MQTT_TOPIC tidak ditemukan di .env');
    process.exit(1);
}

const mqttClient = mqtt.connect(`mqtt://${mqttUrl}:${mqttPort}`);

// Koneksi ke MQTT
mqttClient.on('connect', () => {
    console.log('Connected to MQTT broker');
});

mqttClient.on('reconnect', () => {
    console.log('MQTT connection reconnected');
});

mqttClient.on('close', () => {
    console.log('MQTT connection closed');
});

mqttClient.on('error', (error) => {
    console.error('MQTT connection error:', error.message);
});

mqttClient.on('offline', () => {
    console.log('MQTT connection offline');
});

// Route untuk mengirim pesanan masuk (Menghidupkan Alat)
router.post('/pesanan-masuk', (req, res) => {
    const topic = mqttTopic;
    const message = 'ON';

    if (!mqttClient.connected) {
        return res.status(503).json({ success: false, message: 'MQTT client not connected. Cannot send "ON" command.' });
    }

    mqttClient.publish(topic, message, (error) => {
        if (error) {
            return res.status(500).json({ success: false, message: 'Failed to send "ON" command to MQTT broker.', error: error.message });
        }

        res.status(200).json({ success: true, message: 'Sent "ON" command to MQTT broker.' });
        console.log('Sent "ON" command to MQTT broker.');
    });
});

// Route untuk mengirim pesanan selesai (Mematikan Alat)
router.post('/pesanan-selesai', (req, res) => {

    const topic = mqttTopic;
    const message = 'OFF';
    if (!mqttClient.connected) {
        return res.status(503).json({ success: false, message: 'MQTT client not connected. Cannot send "OFF" command.' });
    }

    mqttClient.publish(topic, message, (error) => {
        if (error) {
            return res.status(500).json({ success: false, message: 'Failed to send "OFF" command to MQTT broker.', error: error.message });
        }

        res.status(200).json({ success: true, message: 'Sent "OFF" command to MQTT broker.' });
        console.log('Sent "OFF" command to MQTT broker.'); 
    });
});

module.exports = router;
