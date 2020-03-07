//var watchId;
//
//function successCallback(position) {
//    document.getElementById('locationInfo').innerHTML = 'Latitude: ' + position.coords.latitude + '<br/>Longitude: ' + position.coords.longitude;
//}
//
//function errorCallback(error) {
//    var errorInfo = document.getElementById('locationInfo');
//
//    switch (error.code) {
//        case error.PERMISSION_DENIED:
//            errorInfo.innerHTML = 'User denied the request for Geolocation.';
//            break;
//        case error.POSITION_UNAVAILABLE:
//            errorInfo.innerHTML = 'Location information is unavailable.';
//            break;
//        case error.TIMEOUT:
//            errorInfo.innerHTML = 'The request to get user location timed out.';
//            break;
//        case error.UNKNOWN_ERROR:
//            errorInfo.innerHTML = 'An unknown error occurred.';
//            break;
//    }
//}
//
//(function watchFunc() {
//    if (navigator.geolocation) {
//    	watchId = navigator.geolocation.watchPosition(successCallback, errorCallback, {enableHighAccuracy: true});
//    } else {
//        document.getElementById('locationInfo').innerHTML = 'Geolocation is not supported.';
//    }
//}());
//
//function stopWatchFunc() {
//    if (navigator.geolocation) {
//        navigator.geolocation.clearWatch(watchId);
//    } else {
//        document.getElementById('locationInfo').innerHTML = 'Geolocation is not supported.';
//    }
//}
