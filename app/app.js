const http = require('node:http');
const express = require('express');
const socketIo = require('socket.io');
const axios = require('axios');
const mqtt = require('mqtt');
const fs = require('node:fs'); 
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
require('dotenv').config();

const endpoint = process.env.ENDPOINT;
const token = process.env.TOKEN;

function getValueById(data, id) {
    const sensor = data.find(item => item.entity_id === id);
    return sensor ? sensor.state : 'N/A';
}

app.use(express.static(__dirname));
const PORT = process.env.port;



async function apiServer() {
    io.on('connection', (socket) => {
        console.log('One client connected');



        socket.on('changeMode', (newMode) => {
            if (newMode === 'api' || newMode === 'mqtt') {
                updateEnvFile(newMode);
            } else {
                console.error("Error: invalid parameter. Use 'api' or 'mqtt'.");
            }
        });




        
        const sendDataToDevices = async () => {
            try {
                const response = await axios.get(endpoint, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    timeout: 4000
                });
                const filteredData = {
                    reciver_mode: "api",
                    solaredge_potenza_totale_dc: getValueById(response.data, "sensor.solaredge_potenza_totale_dc"),
                    prism_sensore_rete: getValueById(response.data, "sensor.sensore_rete"),
                    consumo_casa: getValueById(response.data, "sensor.consumo_casa"),
                    lg_carica_scarica_istantanea_kw: getValueById(response.data, "sensor.lg_carica_scarica_istantanea_kw"),
                    lg_percentuale_di_carica: getValueById(response.data, "sensor.lg_percentuale_di_carica"),
                    shelly_consumo_boiler: getValueById(response.data, "sensor.shelly_consumo_boiler"),
                    car_corsa_energy_level: getValueById(response.data, "sensor.car_corsa_energy_level"),
                    prism_plug_state: getValueById(response.data, "sensor.prism_stato"),
                    prism_potenza_di_carica: getValueById(response.data, "sensor.prism_potenza_di_carica"),
                    car_corsa_last_update: getValueById(response.data, "sensor.car_corsa_last_update"),
                    // new
                    solar_panel_to_grid: getValueById(response.data, "sensor.solar_panel_to_grid_kw"),
                    solar_panel_to_house: getValueById(response.data, "sensor.solar_panel_to_house_kw"),
                    solar_panel_to_battery: getValueById(response.data, "sensor.solar_panel_to_battery_kw"),
                    solar_grid_to_house: getValueById(response.data, "sensor.solar_grid_to_house_kw")
                };

                const jsonData = JSON.stringify(filteredData);
                const json = JSON.parse(jsonData);
                io.emit('dati', json);

            } catch (error) {
                console.error('Error during API request:', error.message);
                const errJson = { error: "Home Assistant API Error Connection" };
                io.emit('dati', errJson);
            }
        };

        setInterval(sendDataToDevices, 2000);
    });

    listenServer();
}

function mqttServer() {
    const options = {
        username: process.env.MQTT_USERNAME,
        password: process.env.MQTT_PASSWORD,
        connectTimeout: Number.parseInt(process.env.MQTT_CONNECT_TIMEOUT, 10),
    };
    const host = process.env.MQTT_HOST;
    const client = mqtt.connect(`mqtt://${host}`, options);
    
    client.on('connect', function () {
        console.log('Successful connection to the MQTT broker');
        
        // Subscribe to a specific topic if necessary
        client.subscribe('dataForMonitorFV', function (err) {
            if (err) {
                console.error('Error when subscribing to dataForMonitorFV', err);
            } else {
                console.log('Successful subscription to dataForMonitorFV');
            }
        });
    });

    // Listen for changeMode event from the socket
    io.on('connection', (socket) => {
        socket.on('changeMode', (newMode) => {
            if (newMode === 'api' || newMode === 'mqtt') {
                updateEnvFile(newMode);
            } else {
                console.error("Error: invalid parameter. Use 'api' or 'mqtt'.");
            }
        });
    });

    // Management of messages received from the MQTT broker
    client.on('message', function (topic, message) {
        const jsonData = JSON.stringify(message.toString(), null, 2);
        const validJsonString = jsonData.replaceAll(/'/g, '"');
        let stringWithoutQuotes = validJsonString.replaceAll(/^["']|["']$/g, '');
        const json = JSON.parse(stringWithoutQuotes);
        json.reciver_mode = "mqtt";

        io.emit('dati', json);
    });
    
    // Error management
    client.on('error', function (error) {
        console.error('MQTT connection error');
        
        const errJson = {
            error: "Home Assistant MQTT Error Connection",
        };
        io.emit('dati', errJson);    
    });
    
    listenServer();
}


function listenServer() {
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
          
        console.log('Server running on http://localhost:' + PORT + '/monitor.html');
    });
}




function updateEnvFile(newMode) {
    fs.readFile('.env', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading .env file', err);
            return;
        }
        const updatedEnv = data.replace(/mode=.*/, `mode=${newMode}`);
        fs.writeFile('.env', updatedEnv, 'utf8', (err) => {
            if (err) {
                console.error('Error writing .env file', err);
            } else {
                console.log('.env file updated with new mode:', newMode);
                currentMode = newMode; // Update the current mode
                console.log("restarting server");
                process.exit();
            }
        });
    });
}







function main() {
    const args = process.argv.slice(2);
    let mode;

    if (args.length > 0) {
        mode = args[0];
    } else {
        mode = process.env.mode;
    }

    if (mode === 'api') {
        apiServer();
    } else if (mode === 'mqtt') {
        mqttServer();
    } else {
        console.error("Error: invalid parameter. Use 'api' or 'mqtt'.");
    }
}

main();

// Endpoint to check the status of the server
app.get('/server-status', (req, res) => {
    res.status(200).send('The server is up and running');
});
app.get('/favicon.ico', (req, res) => res.status(204));


