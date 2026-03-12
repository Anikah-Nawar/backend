function updatePressure(pressure) {
    const statusEl = document.getElementById("pressure-status-text");

    let status = "";
    let color = "";

    if (pressure <= 1010) {
        status = "Low Pressure";
        color = "rgb(61, 151, 196)";
    } else if (pressure <= 1020) {
        status = "Just Right";
        color = "rgb(56, 173, 52)";
    } else if (pressure > 1020) {
        status = "High Pressure";
        color = "rgb(168, 64, 50)";
    }

    statusEl.innerText = status;
    statusEl.style.color = color;
}
// expose globally so Dashboard.js can call it
window.updatePressure = updatePressure;