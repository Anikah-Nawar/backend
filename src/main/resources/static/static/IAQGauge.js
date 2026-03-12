 // setup 
    const data = {
      labels: ['Excellent', 'Good', 'Lightly Polluted', 'Moderately Polluted', 'Heavily Polluted', 'Severely Polluted', 'Extremely Polluted'],
      datasets: [{
        label: 'IAQ Levels',
        data: [10, 10, 10, 10, 10, 20, 30],
        backgroundColor: [
          'rgba(61, 151, 196, 1)', // excellent
          'rgba(56, 173, 52, 1)',
          'rgba(212, 214, 93, 1)',
          'rgba(252, 209, 91, 1)',
          'rgba(248, 141, 54, 1)',
          'rgba(243, 41, 15, 1)',
          'rgba(136, 27, 13, 1)' // extremely polluted
        ],
        borderColor: [
          'rgba(61, 151, 196, 1)',
          'rgba(56, 173, 52, 1)',
          'rgba(212, 214, 93, 1)',
          'rgba(252, 209, 91, 1)',
          'rgba(248, 141, 54, 1)',
          'rgba(243, 41, 15, 1)',
          'rgba(136, 27, 13, 1)'
        ],
        borderWidth: 0,
        circumference: 180,
        rotation: 270,
        cutout: '80%',
        needleValue: 0
      }]
    };

    const gaugeNeedle = {
        id: 'gaugeNeedle',
        afterDatasetsDraw(chart){ // draw after the data set since you want it to be on top of the donut chart
            const {ctx, data} = chart;

            ctx.save();
            const xCenter = chart.getDatasetMeta(0).data[0].x;
            const yCenter = chart.getDatasetMeta(0).data[0].y;
            const outerRadius = chart.getDatasetMeta(0).data[0].outerRadius;
            const innerRadius = chart.getDatasetMeta(0).data[0].innerRadius;
            const widthSlice = (outerRadius-innerRadius)/2;
            const radius = 10;
            //const angle = Math.PI/ 180; // 1 PI is half circle and 2 PI is full circle

            const needleValue = data.datasets[0].needleValue;
            const angle = Math.PI * ((1 + needleValue) / 100);
            //const dataTotal = data.datasets[0].data.reduce((a, b) => a+b, 0);
            const circumference = (((chart.getDatasetMeta(0).data[0].circumference/ Math.PI)/data.datasets[0].data[0]) * needleValue);
            

            ctx.translate(xCenter, yCenter); //define a new center point right in the middle
            ctx.rotate(Math.PI * (circumference  + 1.5));
            //ctx.rotate(angle);

            //needle
            ctx.beginPath(); //create a custom needle shape
            ctx.strokeStyle = 'black'; //border of needle color
            ctx.fillStyle = 'black';
            ctx.moveTo(0-radius, 0); //place line in center of doughnut
            ctx.lineTo(0, 0-innerRadius - widthSlice); // its laying on the very left
            ctx.lineTo(0+radius, 0);
            ctx.closePath();
            ctx.stroke(); //draw line
            ctx.fill(); //fill the needle
            

            //dot
            ctx.beginPath();
            ctx.arc(0, 0, radius, 0, angle * 360, false); //x, y, radius, angle start, angle end, counter clockwise
            ctx.fill();

            ctx.restore();
        }
    }

    // config 
    const config = {
      type: 'doughnut',
      data,
      options: {
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                enabled: false
            }
        }
      },
      plugins: [gaugeNeedle]
    };

    // render init block
    const myGauge = new Chart(
      document.getElementById('myGauge'),
      config
    );

    document.getElementById('chartVersion').innerText = Chart.version;

    // Instantly assign Chart.js version
    //const chartVersion = document.getElementById('chartVersion');
    //chartVersion.innerText = Chart.version;

    function updateGauge(iaq){
        //outliers
        if(iaq > 500){
            iaq = 500;
        }
        else if(iaq < 0){
            iaq = 0;
        }
        const normalized = Math.min(Math.max(iaq/5, 0), 100);
        myGauge.data.datasets[0].needleValue = normalized;
        myGauge.update();
    }