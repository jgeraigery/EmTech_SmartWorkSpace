function leftGeoFence(areaThatWasLeft) {
	timeTrackingEnabled = false;
}

function enteredGeoFence(areaThatWasEntered) {
	timeTrackingEnabled = true;
	document.getElementById('TimeTrack_Position_Text').innerHTML = areaThatWasEntered;
	document.getElementById('nevigation_Destination_Name').innerHTML = areaThatWasEntered;
}