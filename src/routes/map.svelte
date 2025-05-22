<script lang="ts">
	import type { Location } from '$lib/location';
	import maplibregl from 'maplibre-gl';
	import 'maplibre-gl/dist/maplibre-gl.css';
	import { onMount } from 'svelte';

	let { locations, Gallery, searchResult, SearchPopUp, refresh, authed } = $props();

	let mapElement = $state<HTMLDivElement | null>(null);
	let map: any;
	let markers: any[];

	let showModal = $state(false);
	let showGallery = $state(false);
	let modalData = $state<Location>({ id: 0, name: '', lat: 0, lon: 0 });

	$effect(() => {
		if (locations) {
			clearAllMarkers();
			addMarkers(locations, false);
			addMarkers(searchResult, true);
		}
	});

	onMount(() => {
		map = new maplibregl.Map({
			container: 'map',
			style: `https://api.maptiler.com/maps/hybrid/style.json?key=vCj2ptPvHwdumeLayQPp`,
			center: [0, 0],
			zoom: 1
		});

		map.on('style.load', () => {
			map.setProjection({
				type: 'globe'
			});
		});
	});

	function clearAllMarkers() {
		if (map) {
			markers.forEach((marker) => {
				marker.remove();
			});
		}
		markers = [];
	}

	function closeModal() {
		showModal = false;
	}

	function closeAddModal() {
		refresh();
	}

	function addMarkers(locations: Location[], isSearchResult: boolean) {
		locations.forEach((e) => {
			if (isSearchResult) addSearchMarker(e);
			else addLocationMarker(e);
		});
	}

	function addSearchMarker(loc: Location) {
		let marker = new maplibregl.Marker().setLngLat([loc.lon, loc.lat]).addTo(map);
		marker.getElement().style.filter = 'hue-rotate(120deg)';
		marker.getElement().addEventListener('click', () => {
			modalData = {
				id: loc.id,
				name: loc.name,
				lat: loc.lat,
				lon: loc.lon
			};
			if (showModal) {
				showModal = false;
				marker.getElement().click();
			} else {
				showModal = true;
			}
		});
		markers.push(marker);
	}

	function addLocationMarker(loc: Location) {
		let marker = new maplibregl.Marker().setLngLat([loc.lon, loc.lat]).addTo(map);
		marker.getElement().addEventListener('click', () => {
			modalData = {
				id: loc.id,
				name: loc.name,
				lat: loc.lat,
				lon: loc.lon
			};
			if (showGallery) {
				showGallery = false;
				marker.getElement().click();
			} else {
				showGallery = true;
			}
		});
		markers.push(marker);
	}
</script>

<div id="map" bind:this={mapElement} class="z-0 h-full w-full"></div>
<Gallery active={showGallery} close={closeModal} data={modalData} {authed} />
<SearchPopUp active={showModal} close={closeAddModal} data={modalData} />

<style>
	#map {
		background: #000;
	}
</style>
