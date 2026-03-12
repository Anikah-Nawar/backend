function updateHumidity(hum) {
    const statusEl = document.getElementById("hum-status-text");

    let status = "";
    let color = "";

    if (hum <= 40) {
        status = "Dry";
        color = "rgb(168, 64, 50)";
    } else if (hum <= 60) {
        status = "Just Right";
        color = "rgb(56, 173, 52)";
    } else if (hum > 60) {
        status = "Too Humid";
        color = "rgb(61, 151, 196)";
    }

    statusEl.innerText = status;
    statusEl.style.color = color;
}
// expose globally so Dashboard.js can call it
window.updateHumidity = updateHumidity;