var map = L.map('mymap'); //.setView([50.082903, 14.424060], 12);
		//map.control.locate().addTo(map);
		//var map = L.map('mymap');
		//map.locate({setView: true, maxZoom: 16});
		map.locate({setView: true, maxZoom: 16});
		function onLocationFound(e){
			L.marker(e.latlng, {icon: youAreHereMarker}).addTo(map)
				.bindPopup('<font size="3"> You are here </font>').openPopup();
		}
		
		function onLocationError(e) {
			map.setView([50.082903, 14.424060], 12);
		}

		map.on('locationerror', onLocationError);
		map.on('locationfound', onLocationFound);
		
		
		L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
			attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>, Icons © <a href="https://icons8.com/icons">Icons8</a>',
			maxZoom: 18,
			id: 'mapbox.light',
			accessToken: 'pk.eyJ1IjoibWlsbGFwZXQiLCJhIjoiY2pycGRqNHYzMTl4MDN6cGpyZGpsYjRybyJ9.IWzPKinWNt-NvEGxkiJ97g'
		}).addTo(map);
		
		var geojsonMarker =	L.icon({
			iconUrl: 'https://img.icons8.com/plasticine/42/000000/beer.png',
			iconAnchor: [21,21],
			popupAnchor: [0,-21]
		});
		
		var youAreHereMarker = L.icon({
			iconUrl: 'https://img.icons8.com/doodle/48/000000/chevron-down.png',
			iconAnchor: [24,48],
			popupAnchor: [0,-48]
		});
		
		function onEachFeature(feature, layer){
			if (feature.properties && feature.properties.nazev) {
				layer.bindPopup('<font size="3"><p><b>'+feature.properties.nazev+'</b></font><br /><font size="3">'+feature.properties.adresa+'</p></font>');
			}
		}
				
		L.geoJSON(pivovary, {
			pointToLayer: function (feature, latlng) {
				return L.marker(latlng, {icon: geojsonMarker});},
			onEachFeature: onEachFeature
		}).addTo(map);