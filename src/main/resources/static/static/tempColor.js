// temperatureColor.js

function updateTemperatureColor(tempValue) {
    const tempEl = document.getElementById("temp");

    // update the text
    tempEl.innerText = tempValue.toFixed(2) + " °C";

    // change color based on range
    if (tempValue < 20) {
        tempEl.style.color = "rgb(68, 76, 235)";   // too cold
    } else if (tempValue >= 20 && tempValue <= 25) {
        tempEl.style.color = "rgb(39, 168, 69)";  // just right
    } else {
        tempEl.style.color = "rgb(237, 45, 45)";    // too hot
    }
}

// reset if no data
function resetTemperatureDisplay() {
    const tempEl = document.getElementById("temp");
    tempEl.innerText = "--";
    tempEl.style.color = "color: rgb(134, 135, 161);";
}

// expose globally so Dashboard.js can call it
window.updateTemperatureColor = updateTemperatureColor;
window.resetTemperatureDisplay = resetTemperatureDisplay;