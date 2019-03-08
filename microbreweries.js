var map = L.map('mymap'); //.setView([50.082903, 14.424060], 12);


var mapLayer = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
	attribution: 'Map data &copy; <a target="_blank" href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a target="_blank" href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a target="_blank" href="https://www.mapbox.com/">Mapbox</a>, Icons © <a target="_blank" href="https://icons8.com/icons">Icons8</a> | <a target="_blank" href="https://github.com/millapet/PragueMicrobreweries">Github</a>',
	maxZoom: 18,
	id: 'mapbox.light',
	accessToken: 'pk.eyJ1IjoibWlsbGFwZXQiLCJhIjoiY2pycGRqNHYzMTl4MDN6cGpyZGpsYjRybyJ9.IWzPKinWNt-NvEGxkiJ97g'
}).addTo(map);

// MARKERS
//----------
var beerMarker =	L.icon({
	iconUrl: 'https://img.icons8.com/plasticine/42/000000/beer.png',
	iconAnchor: [21,21],
	popupAnchor: [0,-21]
});

var nearestBeerMarker = L.icon({
	iconUrl: 'nearestbeer.png',
	iconAnchor: [21,21],
	popupAnchor: [0,-21]
});
		
var youAreHereMarker = L.icon({
	//iconUrl: 'https://img.icons8.com/doodle/42/000000/chevron-down.png',
	iconUrl: 'youarehere.png',
	iconAnchor: [21,42],
	popupAnchor: [0,-42]
});

//GEOJSON LAYER
//----------
function onEachFeature(feature, layer){
	if (feature.properties && feature.properties.name) {
		layer.bindPopup('<font size="3"><p><b>'+feature.properties.name+'</b></font><br /><font size="3">'+feature.properties.address+'<br /> <a target="_blank" href="'+feature.properties.web+'">'+feature.properties.web+'</a></p></font>')
	}
}
				
var geojsonLayer = L.geoJSON(pivovary, {
	pointToLayer: function (feature, latlng) {
		return L.marker(latlng, {icon: beerMarker})},
	onEachFeature: onEachFeature
}).addTo(map);

//LOCATION CONTROL BUTTON
//----------
var ourCustomControl = L.Control.extend({
	options: {
    position: 'topleft' 
    //control position - allowed: 'topleft', 'topright', 'bottomleft', 'bottomright'
  },
 
  onAdd: function(map) {
    var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
	
	//container.marker = L.marker(e.latlng, {icon: getLocationMarker});
	
    //container.style.background = 'URL(\'https://img.icons8.com/plasticine/30/000000/place-marker.png\')';
	container.style.backgroundImage = 'URL(\'https://img.icons8.com/metro/15/000000/center-direction.png\')';
	container.style.backgroundColor = 'white';
	container.style.backgroundRepeat = 'no-repeat'
	container.style.backgroundPosition = 'center';
    container.style.width = '30px';
    container.style.height = '30px';
	container.style.cursor = 'pointer';
	
    container.onclick = function(){
		map.locate({setView: true, maxZoom: 16});
      console.log('buttonClicked');
    }
	container.onmouseover = function(){
		container.style.backgroundColor = '#eee';
    }
	container.onmouseout = function(){
		container.style.backgroundColor = 'white';
    }
    return container;
  },
});

map.addControl(new ourCustomControl());

//USER LOCATION
//----------
map.setView([50.082903, 14.424060], 12)
var markerLoc = null;
var markerBeer = null;
function onLocationFound(e){
	if(markerLoc != null && markerBeer != null){
		map.removeLayer(markerLoc);
		map.removeLayer(markerBeer)
	}
	markerLoc = L.marker(e.latlng, {icon: youAreHereMarker}).addTo(map),
	//.bindPopup('<font size="3"> You are here </font>'+L.GeometryUtil.closestLayer(map, geojsonLayer.getLayers(), e.latlng).latlng).openPopup(),
	closestPt = L.GeometryUtil.closestLayer(map, geojsonLayer.getLayers(), e.latlng),
	ID = L.stamp(closestPt),
	markerBeer = L.marker(closestPt.latlng,{icon: nearestBeerMarker}).addTo(map)
	.bindPopup('<font size="3"><p><b>'+closestPt.layer.feature.properties.name+'</b></font><br /><font size="3">'+closestPt.layer.feature.properties.address+'<br /> <a href="'+closestPt.layer.feature.properties.web+'">'+closestPt.layer.feature.properties.web+'</a></p></font>')
}
function onLocationError(e) {
	map.setView([50.082903, 14.424060], 12);
}

map.on('locationerror', onLocationError)
map.on('locationfound', onLocationFound)




