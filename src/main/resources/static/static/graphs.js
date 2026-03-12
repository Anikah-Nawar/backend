// Helper function to create a chart config
  function makeChartConfig(label, color) {
    return {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label,
          data: [],
          borderColor: color,
          backgroundColor: color + '33', // translucent fill
          borderWidth: 2,
          tension: 0.3,
          fill: true
        }]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            title: { display: true, text: 'Time', color:'#ffffff' },
            ticks: { maxTicksLimit: 8, color:'#ffffff' },
            grid:{color: '#ffffff'}
          },
          y: {
            title: { display: true, text: label, color: '#ffffff' },
            grid:{color: '#ffffff'},
            ticks: {color: '#ffffff'}
          }
        },
        plugins: {
          legend: { display: false }
        }
      }
    };
  }


  const charts = {
    temperature: new Chart(document.getElementById('tempChart'), makeChartConfig('Temperature (°C)', '#ff6384')),
    humidity: new Chart(document.getElementById('humChart'), makeChartConfig('Humidity (%)', '#36a2eb')),
    pressure: new Chart(document.getElementById('pressChart'), makeChartConfig('Pressure (hPa)', '#ffcd56')),
    iaq: new Chart(document.getElementById('iaqChart'), makeChartConfig('IAQ', '#4bc0c0'))
  };

  // Connect to backend WebSocket for averaged data
  const ws = new WebSocket("ws://localhost:8080/ws/avgdata");

  ws.onopen = () => console.log("Connected to /ws/avgdata");

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    // Expecting data like:
    // {
    //   "temperature": [{time: "...", value: 22.4}, ...],
    //   "humidity": [...],
    //   "pressure": [...],
    //   "iaq": [...]
    // }

    for (const key of Object.keys(charts)) {
      if (!data[key]) continue;
      const chart = charts[key];

      // Extract time and value arrays
      const times = data[key].map(p => new Date(p.time).toLocaleTimeString());
      const values = data[key].map(p => p.value);

      chart.data.labels = times;
      chart.data.datasets[0].data = values;
      chart.update();
    }
  };

  ws.onclose = () => console.log("Disconnected from /ws/avgdata");