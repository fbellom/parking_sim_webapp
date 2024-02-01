const api_url = "http://127.0.0.1:8000/parking/gate";
var marker;
// Creare Fecth Function
function initializeMap() {
  fetch(api_url)
    .then((response) => response.json())
    .then((data) => {
      // Use the latitude and longitude from the API response
      var lat = data.latitude;
      var lon = data.longitude;

      // Set map view
      map.setView([lat, lon], 19);

      // Add marker
      marker = L.circleMarker([lat, lon], {
        color: "red",
        radius: 10,
      }).addTo(map);
      marker.bindPopup("<b>" + data.gate_desc + "</b><br>Status").openPopup();
    })
    .catch((error) => console.error("Error fetching gate data:", error));
}

// Initialize the map
var map = L.map("map");

// Add OpenStreetMap tiles
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "© OpenStreetMap contributors",
}).addTo(map);

// Call the function to initialize the map
initializeMap();

// Function to update the marker based on utilization
function updateMarker(utilization, radius_val) {
  let color;
  if (utilization < 30) {
    color = "green";
  } else if (utilization < 70) {
    color = "yellow";
  } else {
    color = "red";
  }

  if (marker) {
    marker.setStyle({ color: color, radius: radius_val });
  }
}

const mapSocket = new WebSocket(
  "ws://127.0.0.1:8000/parking/ws/parking_activity?type=util"
);

mapSocket.onopen = function (e) {
  console.log("Connection established");
  //parkingUtilDiv.textContent = "Connected. Waiting for data...";
};

mapSocket.onmessage = function (event) {
  const data = JSON.parse(event.data);
  const utilization = data.usage_rate;
  const radius_size = data.spots_in_use; // Assuming the utilization value is in the message
  updateMarker(utilization, radius_size);
};

// // Add a marker
// var marker = L.marker([18.40392191193637, -66.04436176129046]).addTo(map);
// marker.bindPopup("<b>Parking Lot</b><br>Status").openPopup();
