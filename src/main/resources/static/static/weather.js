async function getWeatherData(location) {
    const apiKey = '61b0483c249d418eb1b203329251610'; // Replace with your actual API key
    
    const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(location)}`;//`http://api.weatherstack.com/current?access_key=${apiKey}&query=${encodeURIComponent(location)}&units=m`;

    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Weather data for', location, ':', data);

        // Access specific measurements
        if (data.current) {
            document.getElementById("wind").innerText = data.current.wind_kph + " km/h";
            document.getElementById("wind_dir").innerText = data.current.wind_dir;
            //document.getElementById("t").innerText = data.current.last_updated;
            // ... and other relevant measurements from data.current
        } else {
            console.log('No current weather data available for this location.');
        }

    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

// Call the function with a desired location
getWeatherData('Burnaby');

// Fetch again every hour (3600000 ms = 1 hour)
setInterval(() => {
    getWeatherData('Burnaby');
}, 3600000);