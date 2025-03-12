const http = require('http');
const express = require('express');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const mqtt = require('mqtt');

require('dotenv').config();

const options = {
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
    connectTimeout: parseInt(process.env.MQTT_CONNECT_TIMEOUT, 10),
};
const host = process.env.MQTT_HOST;
const client = mqtt.connect(`mqtt://${host}`, options);
client.on('connect', function () {
    console.log('Successful connection to the MQTT broker');
});

// Management of messages received from the MQTT broker
client.on('message', function (topic, message) {
    try {
        const jsonData = JSON.parse(message.toString()); // Converts the message directly to JSON//+
        console.log("json ricevuto:", jsonData);
        io.emit('dati', jsonData);
    } catch (error) {
        console.error("Errore nel parsing del JSON:", error);
        console.error("Messaggio ricevuto:", message.toString());
    }
});


// Error management
client.on('error', function (error) {
    console.error('MQTT connection error');

    const errJson = {
        error: "Home Assistant MQTT Error Connection",
    };
    io.emit('dati', errJson);    
    
});

client.subscribe('dataForMonitorFV', function (err) {
    if (err) {
        console.error('Error when subscribing to dataForMonitorFV', err);
    } else {
        console.log('Successful subscription to dataForMonitorFV');
    }
});

client.on('close', () => console.log('MQTT connection closed'));
client.on('offline', () => console.log('MQTT client offline'));
client.on('reconnect', () => console.log('MQTT client reconnecting...'));


app.use(express.static(__dirname));

const PORT = 3100;
server.listen(PORT, () => {
    console.log(
        "  __  __             _ _             _  _   ________      __  \n" +
        " |  \\/  |           (_) |           | || | |  ____\\ \\    / /  \n" +
        " | \\  / | ___  _ __  _| |_ ___  _ __| || |_| |__   \\ \\  / /   \n" +
        " | |\\/| |/ _ \\| '_ \\| | __/ _ \\| '__|__   _|  __|   \\ \\/ /    \n" +
        " | |  | | (_) | | | | | || (_) | |     | | | |       \\  /     \n" +
        " |_|  |_|\\___/|_| |_|_|\\__\\___/|_|     |_| |_|        \\/      \n" +
        "                                                             \n" +
        "                                                             "
      );
      
    console.log('Server running on http://localhost:3100/monitor.html');
});




// Endpoint to check the status of the server
app.get('/server-status', (req, res) => {
    res.status(200).send('The server is up and running');
});

