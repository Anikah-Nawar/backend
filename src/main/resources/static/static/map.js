var activeSensorId = null;
var map = L.map('map').setView([49.24, -122.98], 13); //set to Burnaby starting position

L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}@2x.png?key=W0tuWSZ7EjFnP5TB5IUv', {
    maxZoom: 19,
    tileSize: 512,
    zoomOffset: -1,
    minZoom: 1,
    crossOrigin: true,
    attribution: '&copy; <a href="https://www.maptiler.com/copyright/">MapTiler</a>'
}).addTo(map); 

// 🗺️ Store markers by their sensor ID
var sensorMarkers = {};

var mIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

var activeIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// makes sure the sensor stays highlighted when selected
function setActiveSensor(sensorId) {

    // Reset previous
    if (activeSensorId && sensorMarkers[activeSensorId]) {
        sensorMarkers[activeSensorId].marker.setIcon(mIcon);
        sensorMarkers[activeSensorId].circle.setStyle({
            color: "purple",
            radius: 50
        });
    }

    // Highlight new one
    if (sensorMarkers[sensorId]) {
        sensorMarkers[sensorId].marker.setIcon(activeIcon);
        sensorMarkers[sensorId].circle.setStyle({
            color: "green",
            radius: 100
        });
    }

    activeSensorId = sensorId;

    // Sync dropdown
    const dropdown = document.getElementById("sensor-select");
    dropdown.value = sensorId;
    dropdown.dispatchEvent(new Event("change"));
}

// Function to add or update a marker for a sensor
function updateSensorMarker(sensorId, lat, lng) {
  // If marker already exists, move it it
  if (sensorMarkers[sensorId]) {

    sensorMarkers[sensorId].marker.setLatLng([lat, lng]);
    sensorMarkers[sensorId].circle.setLatLng([lat, lng]);

    return; // STOP here so we don’t recreate it
  }

  // Create a new marker for the updated position
  var marker = L.marker([lat, lng], {icon: mIcon}).addTo(map);
  var circle = L.circle([lat, lng], {
        color: 'purple',
        fillColor: 'rgba(233, 122, 183, 1)',
        fillOpacity: 0.5,
        radius: 50
    }).addTo(map);
  marker.bindPopup(`Sensor ${sensorId}`);

  //updates the cards depending on the sensor selected
  marker.on("click", function () {
    // highlights the clicked marker on the map in green and resets prev markers back to purple
    // Reset previously active marker
    if (activeSensorId && sensorMarkers[activeSensorId]) {
        sensorMarkers[activeSensorId].marker.setIcon(mIcon);
        sensorMarkers[activeSensorId].circle.setStyle({
            radius: 50,
            color: "purple"
        });
    }

    // Highlight current marker
    marker.setIcon(activeIcon);
    circle.setStyle({
        radius: 50,
        color: "green"
    });

    activeSensorId = sensorId;
    
    //sync with dropdown
    const dropdown = document.getElementById("sensor-select");

    // Set the dropdown to the clicked sensor
    dropdown.value = sensorId;

    // Trigger the same logic as manual selection
    dropdown.dispatchEvent(new Event("change"));

  });
  
  // Save it back to the dictionary
  sensorMarkers[sensorId] = {marker, circle};
}

//updateSensorMarker("A101", 49.24, -122.98);   
//updateSensorMarker("A201", 49.23, -122.98);  
//updateSensorMarker("A101", 49.24, -122.90);   // replace a101
//updateSensorMarker("A501", 49.21, -122.91);
//updateSensorMarker("A401", 49.24, -122.96);
//updateSensorMarker("A801", 49.20, -122.93);
