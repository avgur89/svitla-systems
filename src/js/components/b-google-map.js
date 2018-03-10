import 'js-marker-clusterer';
import GoogleMapsLoader from 'google-maps';
import { css } from '../modules/dev/helpers';

let mapStyle = [
		{
			"featureType": "all",
			"elementType": "all",
			"stylers": [
				{
					"hue": "#ff0000"
				}
			]
		},
		{
			"featureType": "administrative",
			"elementType": "geometry.fill",
			"stylers": [
				{
					"visibility": "off"
				}
			]
		},
		{
			"featureType": "administrative",
			"elementType": "geometry.stroke",
			"stylers": [
				{
					"visibility": "off"
				}
			]
		},
		{
			"featureType": "administrative",
			"elementType": "labels",
			"stylers": [
				{
					"visibility": "off"
				}
			]
		},
		{
			"featureType": "administrative.country",
			"elementType": "geometry",
			"stylers": [
				{
					"weight": "1.00"
				}
			]
		},
		{
			"featureType": "administrative.country",
			"elementType": "geometry.fill",
			"stylers": [
				{
					"visibility": "off"
				},
				{
					"color": "#ffffff"
				}
			]
		},
		{
			"featureType": "administrative.country",
			"elementType": "geometry.stroke",
			"stylers": [
				{
					"visibility": "on"
				},
				{
					"color": "#2e3a4d"
				},
				{
					"gamma": "1"
				},
				{
					"weight": "1"
				},
				{
					"saturation": "0"
				},
				{
					"lightness": "0"
				}
			]
		},
		{
			"featureType": "administrative.country",
			"elementType": "labels.text",
			"stylers": [
				{
					"visibility": "on"
				},
				{
					"weight": "0.01"
				},
				{
					"lightness": "91"
				}
			]
		},
		{
			"featureType": "administrative.country",
			"elementType": "labels.text.fill",
			"stylers": [
				{
					"visibility": "off"
				},
				{
					"weight": "1.00"
				}
			]
		},
		{
			"featureType": "administrative.country",
			"elementType": "labels.text.stroke",
			"stylers": [
				{
					"saturation": "62"
				},
				{
					"lightness": "-20"
				},
				{
					"gamma": "0.00"
				},
				{
					"color": "#2e3a4d"
				},
				{
					"weight": "0.20"
				}
			]
		},
		{
			"featureType": "administrative.province",
			"elementType": "geometry.stroke",
			"stylers": [
				{
					"visibility": "on"
				},
				{
					"color": "#2e3a4d"
				},
				{
					"weight": "0.75"
				}
			]
		},
		{
			"featureType": "administrative.locality",
			"elementType": "geometry.fill",
			"stylers": [
				{
					"visibility": "simplified"
				}
			]
		},
		{
			"featureType": "administrative.locality",
			"elementType": "geometry.stroke",
			"stylers": [
				{
					"visibility": "off"
				}
			]
		},
		{
			"featureType": "administrative.land_parcel",
			"elementType": "all",
			"stylers": [
				{
					"visibility": "simplified"
				}
			]
		},
		{
			"featureType": "landscape",
			"elementType": "geometry",
			"stylers": [
				{
					"visibility": "on"
				},
				{
					"color": "#e3e3e3"
				}
			]
		},
		{
			"featureType": "landscape",
			"elementType": "geometry.fill",
			"stylers": [
				{
					"color": "#236373"
				}
			]
		},
		{
			"featureType": "landscape.natural",
			"elementType": "labels",
			"stylers": [
				{
					"visibility": "off"
				}
			]
		},
		{
			"featureType": "poi",
			"elementType": "all",
			"stylers": [
				{
					"visibility": "off"
				}
			]
		},
		{
			"featureType": "road",
			"elementType": "all",
			"stylers": [
				{
					"color": "#cccccc"
				}
			]
		},
		{
			"featureType": "road",
			"elementType": "geometry.fill",
			"stylers": [
				{
					"color": "#454f5f"
				},
				{
					"weight": "0.40"
				}
			]
		},
		{
			"featureType": "road",
			"elementType": "geometry.stroke",
			"stylers": [
				{
					"color": "#2e3a4d"
				},
				{
					"visibility": "off"
				}
			]
		},
		{
			"featureType": "road",
			"elementType": "labels",
			"stylers": [
				{
					"visibility": "off"
				}
			]
		},
		{
			"featureType": "road",
			"elementType": "labels.text",
			"stylers": [
				{
					"visibility": "on"
				},
				{
					"weight": "0.05"
				},
				{
					"color": "#2d353f"
				},
				{
					"gamma": "1"
				}
			]
		},
		{
			"featureType": "road.highway",
			"elementType": "geometry.fill",
			"stylers": [
				{
					"visibility": "on"
				},
				{
					"weight": "0"
				}
			]
		},
		{
			"featureType": "road.highway",
			"elementType": "geometry.stroke",
			"stylers": [
				{
					"visibility": "off"
				},
				{
					"weight": "0.00"
				}
			]
		},
		{
			"featureType": "transit",
			"elementType": "geometry.fill",
			"stylers": [
				{
					"hue": "#ff0000"
				}
			]
		},
		{
			"featureType": "transit",
			"elementType": "labels.icon",
			"stylers": [
				{
					"visibility": "off"
				}
			]
		},
		{
			"featureType": "transit.line",
			"elementType": "geometry",
			"stylers": [
				{
					"visibility": "off"
				}
			]
		},
		{
			"featureType": "transit.line",
			"elementType": "labels.text",
			"stylers": [
				{
					"visibility": "off"
				}
			]
		},
		{
			"featureType": "transit.station.airport",
			"elementType": "geometry",
			"stylers": [
				{
					"visibility": "off"
				}
			]
		},
		{
			"featureType": "transit.station.airport",
			"elementType": "labels",
			"stylers": [
				{
					"visibility": "off"
				}
			]
		},
		{
			"featureType": "water",
			"elementType": "geometry",
			"stylers": [
				{
					"color": "#FFFFFF"
				}
			]
		},
		{
			"featureType": "water",
			"elementType": "geometry.fill",
			"stylers": [
				{
					"color": "#2e3a4d"
				}
			]
		},
		{
			"featureType": "water",
			"elementType": "labels",
			"stylers": [
				{
					"visibility": "off"
				}
			]
		}
	],
	mapSettings = [];

class GoogleMap {
	constructor () {
		this.$map = $('.google-map');
		
		this.init();
	}
	
	init() {
		if (this.$map.length) {
			this.initMap();
		}
	}
	
	initMap() {
		const $countryTab = $('.country__item');
		
		if (this.$map.length) {
			const dataJSON = this.$map.data('map');
			
			// If programmers want to specify the initial zoom and map coordinates:
			if (dataJSON.center) {
				mapSettings.center = dataJSON.center;
			}
			if (dataJSON.zoom) {
				mapSettings.zoom = dataJSON.zoom;
			}
			
			mapSettings.minZoom = 2;
			mapSettings.maxZoom = 18;
			mapSettings.styles = mapStyle;
			mapSettings.scrollwheel = false;
			
			// Clusters settings:
			mapSettings.clusters = {
				gridSize: 20,
				styles: [{
					url: dataJSON.clusterIcon,
					height: dataJSON.clusterIconHeight,
					width: dataJSON.clusterIconWidth,
					anchor: [0, 0],
					textColor: '#344152',
					textSize: 10
				}]
			}
			
			GoogleMapsLoader.KEY = dataJSON.key + '&language=' + dataJSON.lang;
			
			GoogleMapsLoader.load(function (google) {
				let map = new google.maps.Map(document.getElementsByClassName('google-map')[0], mapSettings),
					markersArray = [],
					infoWindowArray = [],
					bounds = new google.maps.LatLngBounds();
				
				for (let i = 0, max = dataJSON.markers.length; i < max; i++) {
					let url = dataJSON.markers[i].icon.url,
							width = dataJSON.markers[i].icon.width,
							height = dataJSON.markers[i].icon.height;
					
					// Create markers:
					markersArray.push(new google.maps.Marker({
						map: map,
						position: dataJSON.markers[i].position,
						title: dataJSON.markers[i].title,
						icon: {
							url: url,
							size: new google.maps.Size(width, height),
							anchor: new google.maps.Point(width/2, height)
						},
						tooltip: dataJSON.markers[i].tooltip
					}));
					
					if (markersArray[i].tooltip) {
						infoWindowArray[i] = new google.maps.InfoWindow({
							content: markersArray[i].tooltip
						});
					}
					
					// Create tooltips if marker has tooltip:
					google.maps.event.addListener(markersArray[i], 'click', function () {
						let $this = this;
						
						closeInfoWindow();
						infoWindowArray[i].open(map, $this);
						
						// Create custom close btn:
						$('.gm-style-iw').append('<div class="google-map__tooltip-close"></div>').parent().css("height", "auto")
						$('.google-map__tooltip-close').on("click tap", function () {
							closeInfoWindow();
						})
					});
					
					// Get markers parameters for settings autozoom and autocenter map:
					if (dataJSON.autozoom) {
						let loc = new google.maps.LatLng(dataJSON.markers[i].position.lat, dataJSON.markers[i].position.lng);
						bounds.extend(loc);
					}
				}
				
				// Autozoom and autocenter map:
				if (dataJSON.autozoom && markersArray.length > 1) {
					map.fitBounds(bounds);
					map.panToBounds(bounds);
				}
				
				// CreateClusters
				let markerCluster = new MarkerClusterer(map, markersArray, {
						styles: mapSettings.clusters.styles,
						gridSize: mapSettings.clusters.gridSize
					}
				);
				
				// Bounds for map area:
				let strictBounds = new google.maps.LatLngBounds(
					new google.maps.LatLng(-20, -125),
					new google.maps.LatLng(80, 125)
				);

				// Listen for the dragend event and return map:
				google.maps.event.addListener(map, 'drag', function() {
					
					if (strictBounds.contains(map.getCenter())) return;

					let c = map.getCenter(),
						x = c.lng(),
						y = c.lat(),
						maxX = strictBounds.getNorthEast().lng(),
						maxY = strictBounds.getNorthEast().lat(),
						minX = strictBounds.getSouthWest().lng(),
						minY = strictBounds.getSouthWest().lat();

					if (x < minX) x = minX;
					if (x > maxX) x = maxX;
					if (y < minY) y = minY;
					if (y > maxY) y = maxY;

					map.setCenter(new google.maps.LatLng(y, x));
				});
				
				// Close all tooltip after click at map field:
				google.maps.event.addListener(map, "click", function(event) {
					closeInfoWindow();
				});
				
				function closeInfoWindow() {
					for (let i = 0; i < infoWindowArray.length; i++ ) {
						infoWindowArray[i].close();
					}
				}
				
				$countryTab.on('click tap', function() {
					let $this = $(this);
					
					if ($this.hasClass(css.active)) {
						return false
					}
					
					closeInfoWindow();
					
					// Set active tab:
					$countryTab.removeClass(css.active);
					$this.addClass(css.active);
					
					// Set zoom and coordinates:
					map.setZoom($this.data('zoom'));
					map.setCenter(new google.maps.LatLng({
						"lat": $this.data('coordinate-lat'),
						"lng": $this.data('coordinate-lng')
					}));
				});
			});
		}
		return this;
	};
}

export default new GoogleMap();