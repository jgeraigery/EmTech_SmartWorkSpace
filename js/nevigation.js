var geoJSONFeature = {
		"type": "FeatureCollection",
		"name": "Rect5",
		"crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
		"features": [
		{ "type": "Feature", "properties": { "id": 5 }, "geometry": { "type": "MultiPolygon", "coordinates": [ [ [ [ -0.129823141375036, 51.577004472237995 ], [ -0.129291861411101, 51.577168235954474 ], [ -0.12886150559802, 51.576671232117242 ], [ -0.129457529356844, 51.576501755712975 ], [ -0.129823141375036, 51.577004472237995 ] ] ] ] } }
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

leafletPip.bassackwards = true;

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
//	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	minZoom: 18,
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
		enteredGeoFence(geoJSONFeature.name);
	} else {
		leftGeoFence(geoJSONFeature.name)
	}
	
}

function errorCallback(error) {
    var errorInfo = document.getElementById('nevigation_Map');

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
	document.getElementById('nevigation_Destination_Head').innerHTML = "Location";
	document.getElementById('nevigation_Destination_Name').innerHTML = "Personally Identifiable Information was removed";
};

function isMarkerInsidePolygon(coords, polyPoints) {       
    var x = coords[0], y = coords[1];

    var inside = false;
    for (var i = 0, j = polyPoints.length - 1; i < polyPoints.length; j = i++) {
        var xi = polyPoints[i][0], yi = polyPoints[i][1];
        var xj = polyPoints[j][0], yj = polyPoints[j][1];

        var intersect = ((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) {
        	inside = !inside;
        }
    }

    return inside;
};