var geoJSONFeature = {
		"type": "FeatureCollection",
		"name": "Office",
		"crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
		"features": [
		{ "type": "Feature", "name": "Lab", "properties": { "id": 10 }, "geometry": { "type": "MultiPolygon", "coordinates": [ [ [ [ -0.129841826966892, 51.577008597994656 ], [ -0.129578233575669, 51.577090793783306 ], [ -0.129469583969967, 51.576930181322709 ], [ -0.129611300846969, 51.576892390155507 ], [ -0.129503596020448, 51.576733667253265 ], [ -0.129614135184509, 51.576701544761143 ], [ -0.129841826966892, 51.577008597994656 ] ] ] ] } },
		{ "type": "Feature", "name": "Meeting room", "properties": { "id": 11 }, "geometry": { "type": "MultiPolygon", "coordinates": [ [ [ [ -0.129413841998346, 51.577138977521486 ], [ -0.129578233575669, 51.577088904224944 ], [ -0.129469583969967, 51.576930181322709 ], [ -0.129307081951005, 51.576981199398425 ], [ -0.129413841998346, 51.577138977521486 ] ] ] ] } },
		{ "type": "Feature", "name": "Dining room", "properties": { "id": 12 }, "geometry": { "type": "MultiPolygon", "coordinates": [ [ [ [ -0.129307840125146, 51.576980397436941 ], [ -0.129191385368048, 51.576829838072406 ], [ -0.129443426735195, 51.576746656103047 ], [ -0.129539917819647, 51.576910524582672 ], [ -0.129307840125146, 51.576980397436941 ] ] ] ] } },
		{ "type": "Feature", "name": "Gym", "properties": { "id": 13 }, "geometry": { "type": "MultiPolygon", "coordinates": [ [ [ [ -0.129442594915501, 51.576747487922738 ], [ -0.12953825418026, 51.576909692762982 ], [ -0.129612286132986, 51.576893056369109 ], [ -0.129502485933437, 51.576733346987943 ], [ -0.129401003930824, 51.57668260598664 ], [ -0.129160608039387, 51.576786583448332 ], [ -0.129188058089274, 51.576828174433011 ], [ -0.129442594915501, 51.576747487922738 ] ] ] ] } }
		]
		}
	
var platform = new H.service.Platform({'apikey': '5cA7YxjJSM3kLtn4MlXrNbIkcRiV5LzJ0J1XWHBMyr0'});

// Get default map types from the platform object:
var defaultLayers = platform.createDefaultLayers();

//Get an instance of the geocoding service:
var geocoder = platform.getGeocodingService();

var watchId;
var marker = null;
var mymap = L.map('nevigation_Map', {zoomControl: false, attributionControl: false});
var myLayer = L.geoJSON(geoJSONFeature).addTo(mymap);
var area;

leafletPip.bassackwards = true;

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
//	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 19,
	minZoom: 19,
	id: 'mapbox/streets-v11',
	tileSize: 512,
	zoomOffset: -1,
	accessToken: 'pk.eyJ1IjoiZGV2MDMxNyIsImEiOiJjazduNnBicXYwZ2hzM25wamJsajlkY2t2In0.vYd6vbk1P4ZiUP4Dz0oZ7w'
}).addTo(mymap);

mymap.dragging.disable();
mymap.touchZoom.disable();
mymap.boxZoom.disable();
mymap.doubleClickZoom.disable();
mymap.keyboard.disable();
mymap.scrollWheelZoom.disable();
mymap.tap.disable();

function centerLeafletMapOnMarker(map, marker) {
	  var latLngs = [marker.getLatLng()];
	  var markerBounds = L.latLngBounds(latLngs);
	  map.fitBounds(markerBounds);
}

function successCallback(position) {
	// Create the parameters for the reverse geocoding request:
	
	var coords = [position.coords.latitude, position.coords.longitude];
	
	if (marker !== null) {
		var line = L.polyline([marker.getLatLng(), coords]);
		mymap.removeLayer(marker);
		
		marker = L.animatedMarker(line.getLatLngs());
        mymap.addLayer(marker);
    } else {
    	marker = L.marker(coords).addTo(mymap);
    }
	
	centerLeafletMapOnMarker(mymap, marker);
	
	var results = leafletPip.pointInLayer(coords, myLayer, true);
	
	if (results.length > 0) {
		area = results[0].toGeoJSON().name
		enteredGeoFence(area);
	} else if (timeTrackingEnabled) {
		leftGeoFence(area);
	}
	
	if (!timeTrackingEnabled) {
		var reverseGeocodingParameters = {
				prox: position.coords.latitude + ',' + position.coords.longitude + ',150',
			    mode: 'retrieveAddresses',
			    maxresults: 1
		};
		
		// Call the geocode method with the geocoding parameters,
		// the callback and an error callback function (called if a
		// communication error occurs):
		geocoder.reverseGeocode(
				reverseGeocodingParameters,
			    onSuccess,
			    function(e) { document.getElementById('nevigation_Destination_Name').innerHTML = "Unavailable" });
	}
	
}

function errorCallback(error) {
    var errorInfo = document.getElementById('nevigation_Destination_Name');

    switch (error.code) {
        case error.PERMISSION_DENIED:
            errorInfo.innerHTML = 'User denied the request for Geolocation.';
            break;
        case error.POSITION_UNAVAILABLE:
            errorInfo.innerHTML = 'Location information is unavailable.';
            break;
        case error.TIMEOUT:
            errorInfo.innerHTML = 'The request to get user location timed out.';
            break;
        case error.UNKNOWN_ERROR:
            errorInfo.innerHTML = 'An unknown error occurred.';
            break;
    }
}

(function watchFunc() {
    if (navigator.geolocation) {
    	watchId = navigator.geolocation.watchPosition(successCallback, errorCallback, {enableHighAccuracy: true});
    } else {
        document.getElementById('nevigation_Map').innerHTML = 'Geolocation is not supported.';
    }
}());

function stopWatchFunc() {
    if (navigator.geolocation) {
        navigator.geolocation.clearWatch(watchId);
    } else {
        document.getElementById('nevigation_Map').innerHTML = 'Geolocation is not supported.';
    }
}

// Define a callback function to process the response:
function onSuccess(result) {
	var location = result.Response.View[0].Result[0];
	document.getElementById('nevigation_Destination_Name').innerHTML = location.Location.Address.Label;
};