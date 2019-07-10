var map;
var service;
var infowindow;

function initMap() {
var bangsue = new google.maps.LatLng(13.8237731,100.5102495);

infowindow = new google.maps.InfoWindow();

map = new google.maps.Map(
document.getElementById('map'), {center: bangsue, zoom: 15});


service = new google.maps.places.PlacesService(map);
	service.nearbySearch({
		location : bangsue,
		radius : 1500,
		type : [ 'restaurant' ]
	}, callback);
}
  
function callback(results, status) {
	if (status === google.maps.places.PlacesServiceStatus.OK) {
		for (var i = 0; i < results.length; i++) {
		createMarker(results[i]);
	}
		map.setCenter(results[0].geometry.location);
	}
}

function createMarker(place) {
	var marker = new google.maps.Marker({
		map: map,
		position: place.geometry.location
	});

	google.maps.event.addListener(marker, 'click', function() {
		infowindow.setContent(place.name);
		infowindow.open(map, this);
	});
}