const ctx = document.getElementById('batteryChart').getContext('2d');
const batteryData = {
      datasets: [{
        data: [0, 100],  // [filled, remaining]
        backgroundColor: ['#00C853', '#E0E0E0'],
        borderWidth: 0,
        cutout: '75%',    // thickness of the ring
      }]
    };

    const batteryConfig = {
      type: 'doughnut',
      data: batteryData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        rotation: -360,     // start at top
        circumference: 360, // full circle
        plugins: {
          tooltip: { enabled: false },
          legend: { display: false }
        }
      }
    };

const batteryChart = new Chart(ctx, batteryConfig);

function updateBatteryLevel(level) {
      // Clamp level 0–100
      level = Math.min(Math.max(level, 0), 100);

      // Change color based on level
      let color;
      if (level > 60) color = '#00C853';       // green
      else if (level > 30) color = '#FFD600';  // yellow
      else color = '#D50000';                  // red

      batteryChart.data.datasets[0].data = [level, 100 - level];
      batteryChart.data.datasets[0].backgroundColor = [color, '#E0E0E0'];
      batteryChart.update();

      document.getElementById('batteryLabel').textContent = `${level}%`;
    }