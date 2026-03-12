    // 1. Declare the chart variable in the global scope.
let performanceChart; 

const perfData = {
  datasets: [{
    data: [0, 100],
    backgroundColor: ['#00C853', '#E0E0E0'],
    borderWidth: 0,
    cutout: '75%',
  }]
};

const perfConfig = {
  type: 'doughnut',
  data: perfData,
  options: {
    responsive: true,
    maintainAspectRatio: false,
    rotation: -360,
    circumference: 360,
    plugins: {
      tooltip: { enabled: false },
      legend: { display: false }
    }
  }
};

window.addEventListener('DOMContentLoaded', () => {
  const ctx = document.getElementById('performanceChart').getContext('2d');
  
  // 2. Assign the chart instance to the global variable.
  performanceChart = new Chart(ctx, perfConfig);
});

function updatePerfLevel(level) {
  // Clamp level 0–100
  level = Math.min(Math.max(level, 0), 100);

  // Change color based on level
  let color;
  if (level > 60) color = '#00C853';       // green
  else if (level > 30) color = '#FFD600';  // yellow
  else color = '#D50000';                  // red

  // Check if the chart instance is defined before updating.
  if (performanceChart) {
    performanceChart.data.datasets[0].data = [level, 100 - level];
    performanceChart.data.datasets[0].backgroundColor = [color, '#E0E0E0'];
    performanceChart.update();
  }

  document.getElementById('perfLabel').textContent = `${level}%`;
}