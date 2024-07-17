const socket = io();


document.getElementById('save-mode').addEventListener('click', function() {
    var selectedMode = document.querySelector('input[name="mode"]:checked');
    
    if (selectedMode) {
        if (selectedMode.value === "api") {
            console.log('API mode selected');
            socket.emit('changeMode', 'api');
                // Inserisci qui il codice per gestire la modalità API
        } else if (selectedMode.value === "mqtt") {
            console.log('MQTT mode selected');
            socket.emit('changeMode', 'mqtt');
            }
    } else {
        console.log('No mode selected');
    }

});

socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
});

socket.on('dati', (data) => {
    console.log('recived mode from: ', data["reciver_mode"]);

    const mqttMode = document.getElementById('mqtt-mode');
    const apiMode = document.getElementById('api-mode');

    if (data["reciver_mode"] === "api") {
        apiMode.checked = true;
    } else if (data["reciver_mode"] === "mqtt") {
        mqttMode.checked = true;
    }
});