const mqtt = require('mqtt');
require('dotenv').config()

class MqttHandler {
    constructor() {
        this.mqttClient = null;
        this.host = 'mqtt://io.adafruit.com';
        this.username = process.env.ADAFRUIT_USR; // mqtt credentials if these are needed to connect
        this.password = process.env.ADAFRUIT_PASSWORD;
        this.topic = 'joelcarlss/feeds/autocurtain'
    }

    connect() {
        // Connect mqtt with credentials (in case of needed, otherwise we can omit 2nd param)
        this.mqttClient = mqtt.connect(this.host, { username: this.username, password: this.password });

        // Mqtt error calback
        this.mqttClient.on('error', (err) => {
            console.log(err);
            this.mqttClient.end();
        });

        // Connection callback
        this.mqttClient.on('connect', () => {
            console.log(`mqtt client connected`);
        });

        // mqtt subscriptions
        this.mqttClient.subscribe(this.topic, { qos: 0 }); // Should be done from controller or unit.js

        // When a message arrives, console.log it
        this.mqttClient.on('message', function (topic, message) { // Should be done from controller or unit.js
            console.log(message.toString());
        });

        this.mqttClient.on('close', () => {
            console.log(`mqtt client disconnected`);
        });
    }

    // Sends a mqtt message to topic: mytopic
    sendMessage(message) {
        this.mqttClient.publish(this.topic, message);
    }
}

module.exports = MqttHandler;