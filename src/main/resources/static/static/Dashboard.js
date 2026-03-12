/*let ws = new WebSocket("ws://localhost:8080/ws/sensor");
        ws.onmessage = function(event) {
            const data = JSON.parse(event.data);
            document.getElementById("temp").innerText = data.temperature.toFixed(2) + " °C";
            document.getElementById("hum").innerText = data.humidity.toFixed(2) + " %";
            document.getElementById("pressure").innerText = data.pressure.toFixed(2) + " hPa";
            document.getElementById("gas").innerText = data.gas_resistance.toFixed(2) + " Ω";
            document.getElementById("iaq").innerText = data.iaq.toFixed(2);
        };*/
document.addEventListener("DOMContentLoaded", () => {
    console.log("Dashboard.js is running");
    let ws = new WebSocket("ws://localhost:8080/ws/sensor");
    // Store all sensor data in a global object.
    const allSensorData = {};


    // Handle incoming WebSocket messages.
    ws.onmessage = function(event) {
        const data = JSON.parse(event.data);

        // Assuming the server sends a single object with all sensor data, keyed by sensor ID.
        // e.g., { "sensor-a": {...}, "sensor-b": {...} }
        // Update the global data object.
        Object.assign(allSensorData, data);
        for (const sensorId in data) {

            const sensor = data[sensorId];

            // Make sure your backend sends latitude and longitude
            if (sensor.latitude && sensor.longitude) {

                updateSensorMarker(
                    sensorId,
                    sensor.latitude,
                    sensor.longitude
                );
            }
        }

        // Check if the dropdown menu needs to be populated.
        const select = document.getElementById("sensor-select");
        if (select.options.length <= 1) { // Populate on first message.
            populateDropdown(allSensorData);
        }

        // Update the dashboard with data for the currently selected sensor.
        updateDashboard();
    };


    // Populate the dropdown menu with sensor IDs.
    function populateDropdown(sensors) {
        const select = document.getElementById("sensor-select");

        // Clear existing options, keeping the placeholder.
        select.innerHTML = '<option value="">-- Please choose a sensor --</option>';

        for (const sensorId in sensors) {
            const option = document.createElement("option");
            option.value = sensorId;
            option.text = sensorId;
            select.appendChild(option);
        }
    }

    // Update the dashboard display for the currently selected sensor.
    function updateDashboard() {
        const selectedSensorId = document.getElementById("sensor-select").value;
        const selectedData = allSensorData[selectedSensorId];

        // Update the dashboard if a sensor is selected and data exists for it.
        if (selectedData) {
            //document.getElementById("temp").innerText = selectedData.temperature.toFixed(2) + " °C";
            updateTemperatureColor(selectedData.temperature);
            document.getElementById("hum").innerText = selectedData.humidity.toFixed(2) + " %";
            updateHumidity(selectedData.humidity);
            document.getElementById("pressure").innerText = selectedData.pressure.toFixed(2) + " hPa";
            updatePressure(selectedData.pressure);
            //document.getElementById("gas").innerText = selectedData.gas_resistance.toFixed(2) + " Ω";
            document.getElementById("iaq").innerText = selectedData.iaq.toFixed(2);
            updateIAQ(selectedData.iaq);
            updateGauge(selectedData.iaq);
            updateBatteryLevel(selectedData.battery);
            //updatePerfLevel(selectedData.performance);
            //document.getElementById("perfLabel").innerText = selectedData.performance + "%";

            updatePerfLevel(selectedData.performance);
        } else {
            // Clear the display if no sensor is selected or data is missing.
            resetTemperatureDisplay();
            document.getElementById("hum").innerText = "--";
            document.getElementById("pressure").innerText = "--";
            //document.getElementById("gas").innerText = "--";
            document.getElementById("iaq").innerText = "--";
            updateGauge(0);
            updateBatteryLevel(0);
            updatePerfLevel(0);
        }
    }

    // Add an event listener to the dropdown menu.
    document.getElementById("sensor-select").addEventListener("change", function () {

                                                                                            const selected = this.value;

                                                                                            if (selected) {
                                                                                                setActiveSensor(selected); // highlight on map
                                                                                            }

                                                                                            updateDashboard();
                                                                                    });

});

