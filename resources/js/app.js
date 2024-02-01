// const parkingDataDiv = document.getElementById("parkingData");
//const parkingUtilDiv = document.getElementById("parkingUtilData");
const parkingDataTableBody = document
  .getElementById("parkingDataTable")
  .querySelector("tbody");
const socket = new WebSocket(
  "ws://127.0.0.1:8000/parking/ws/parking_activity?type=activity"
); // Change URL to your WebSocket server

socket.onopen = function (e) {
  console.log("Connection established");
  // parkingDataDiv.textContent = "Connected. Waiting for data...";
};

socket.onmessage = function (event) {
  const parkingData = JSON.parse(event.data);
  // parkingDataDiv.textContent = JSON.stringify(parkingData, null, 2); // Display the data prettified
  updateParkingTable(parkingData);
};

function updateParkingTable(data) {
  parkingDataTableBody.innerHTML = ""; // Clear existing rows
  data.forEach((entry) => {
    const row = parkingDataTableBody.insertRow();
    // Object.values(entry).forEach((text) => {
    //   const cell = row.insertCell();
    //   cell.textContent = text;
    // Add each cell with custom formatting
    Object.entries(entry).forEach(([key, value]) => {
      const cell = row.insertCell();
      if (key === "status") {
        cell.innerHTML = getStatusFormatted(value);
      } else if (
        key === "entry_time" ||
        key === "exit_time" ||
        key === "status_start_time"
      ) {
        cell.textContent = value ? new Date(value).toLocaleString() : "";
      } else if (key === "size" && value === "small") {
        cell.innerHTML = '<i class="fas fa-car-side"></i>'; // Example icon for 'small'
      } else if (key === "size" && value === "medium") {
        cell.innerHTML = '<i class="fas fa-truck-pickup"></i>';
      } else if (key === "size" && value === "large") {
        cell.innerHTML = '<i class="fas fa-truck"></i>';
      } else {
        cell.textContent = value;
      }
    });
  });
}

function getStatusFormatted(status) {
  const statusColors = {
    parked: "green",
    searching: "blue",
    leaving: "red",
  };
  return `<span style="color: ${statusColors[status]};">${status}</span>`;
}

socket.onclose = function (event) {
  if (event.wasClean) {
    console.log("Connection closed cleanly");
  } else {
    console.log("Connection interrupted");
  }
};

socket.onerror = function (error) {
  console.log(`Error: ${error.message}`);
};

// Utilization Data

const utilSocket = new WebSocket(
  "ws://127.0.0.1:8000/parking/ws/parking_activity?type=util"
);

utilSocket.onopen = function (e) {
  console.log("Connection established");
  //parkingUtilDiv.textContent = "Connected. Waiting for data...";
};

utilSocket.onmessage = function (event) {
  const parkingUtilData = JSON.parse(event.data);
  // parkingUtilDiv.textContent = JSON.stringify(parkingUtilData, null, 2);
  // Display the data prettified
  document.getElementById(
    "spotsInUse"
  ).textContent = `Spots in Use: ${parkingUtilData.spots_in_use}`;
  document.getElementById(
    "spotsAvail"
  ).textContent = `Spots Available: ${parkingUtilData.spots_avail}`;
  document.getElementById(
    "usageRate"
  ).textContent = `${parkingUtilData.usage_rate}%`;
  updateGauge(parkingUtilData.usage_rate);
};

function updateGauge(value) {
  const gaugeElement = document.getElementById("gauge");
  const rotation = value; // assuming usage_rate is a percentage
  gaugeElement.style.setProperty("--rotation", rotation + "turn");
}

utilSocket.onclose = function (event) {
  if (event.wasClean) {
    console.log("Connection closed cleanly");
  } else {
    console.log("Connection interrupted");
  }
};

utilSocket.onerror = function (error) {
  console.log(`Error: ${error.message}`);
};
