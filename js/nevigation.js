var watchId;

/*//Initialize the platform object:
var platform = new H.service.Platform({
  'apikey': '{ZAkfvoUpKGXXbH-GH63egVNGBgCovNPDK9d3uYx0KGA}'
});

// Obtain the default map types from the platform object
var maptypes = platform.createDefaultLayers();

// Instantiate (and display) a map object:
var map = new H.Map(
  document.getElementById('mapContainer'),
  maptypes.vector.normal.map,
  {
    zoom: 10,
    center: { lng: 13.4, lat: 52.51 }
  });*/

function successCallback(position) {
    document.getElementById('locationInfo').innerHTML = 'Latitude: ' + position.coords.latitude + '<br/>Longitude: ' + position.coords.longitude;
}

function errorCallback(error) {
    var errorInfo = document.getElementById('locationInfo');

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
        document.getElementById('locationInfo').innerHTML = 'Geolocation is not supported.';
    }
}());

function stopWatchFunc() {
    if (navigator.geolocation) {
        navigator.geolocation.clearWatch(watchId);
    } else {
        document.getElementById('locationInfo').innerHTML = 'Geolocation is not supported.';
    }
}
