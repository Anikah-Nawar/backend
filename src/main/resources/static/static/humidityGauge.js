let humidityChart;
let humidityNeedle = 0;

function initHumidityGauge(ctx) {
  const data = {
    datasets: [{
      data: [33, 34, 33], // dry, just right, humid
      backgroundColor: ["#3498db", "#2ecc71", "#e74c3c"],
      borderWidth: 0,
      circumference: 180,   // semi circle
      rotation: 270,        // draw top arc
      cutout: "70%",        // donut hole
    }]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false }
    }
  };

  const gaugeNeedle = {
    id: "gaugeNeedle",
    afterDatasetDraw(chart) {
      const { ctx, chartArea: { width, height, top } } = chart;
      const meta = chart.getDatasetMeta(0);
      const arc = meta.data[0]; // first arc element
      const centerX = arc.x;
      const centerY = arc.y;
      const outerRadius = arc.outerRadius;

      // Map humidity (0–100) to angle (0–π radians)
      // 0% = right, 50% = top, 100% = left
      const angle = Math.PI * (humidityNeedle / 100);

      const innerRadius = arc.innerRadius;
      const needleLength = (outerRadius + innerRadius) / 2;

      const dx = Math.cos(angle) * needleLength;
      const dy = Math.sin(angle) * needleLength;

      // Draw needle
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(centerX + dx, centerY + dy);
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#000";
      ctx.stroke();
      ctx.restore();

      // Draw center circle
      ctx.beginPath();
      ctx.arc(centerX, centerY, 6, 0, 2 * Math.PI);
      ctx.fillStyle = "#000";
      ctx.fill();
    }
  };

  humidityChart = new Chart(ctx, {
    type: "doughnut",
    data,
    options,
    plugins: [gaugeNeedle]
  });
}

function updateHumidityGauge(humidity) {
  humidityNeedle = Math.max(0, Math.min(100, humidity)); // clamp between 0–100
  document.getElementById("hum").innerText = humidity.toFixed(2) + " %";
  if (humidityChart) {
    humidityChart.update();
  }
}