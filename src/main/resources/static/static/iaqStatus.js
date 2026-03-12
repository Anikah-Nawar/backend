function updateIAQ(iaq) {
    const statusEl = document.getElementById("iaq-status-text");

    let status = "";
    let color = "";

    if (iaq <= 50) {
        status = "Excellent";
        color = "rgb(61, 151, 196)";
    } else if (iaq <= 100) {
        status = "Good";
        color = "rgb(56, 173, 52)";
    } else if (iaq <= 150) {
        status = "Lightly Polluted";
        color = "rgba(212, 214, 93, 1)";
    } else if (iaq <= 200) {
             status = "Moderately Polluted";
             color = "rgba(252, 209, 91, 1)";
    } else if (iaq <= 250) {
              status = "Heavily Polluted";
              color = "rgba(248, 141, 54, 1)";
    } else if (iaq <= 350) {
              status = "Severely Polluted";
              color = "rgba(243, 41, 15, 1)";
    } else if (iaq > 351) {
              status = "Extremely Polluted";
              color = "rgba(136, 27, 13, 1)";
    }

    statusEl.innerText = status;
    statusEl.style.color = color;
}
// expose globally so Dashboard.js can call it
window.updateIAQ = updateIAQ;