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
	let modalData = $state<Location>({ id: 0, name: '', lat: 0, lon: 0, url: '' });

	$effect(() => {
		if (!authed) {
			clearAllMarkers();
			addMarkers(locations, false);
		}
	});

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
			style: `https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json`,
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
		const el = document.createElement('div');
		el.className = 'marker';
		el.style.backgroundImage = "url('/grey_question.png')";
		el.style.width = `30px`;
		el.style.height = `30px`;
		let marker = new maplibregl.Marker({ element: el }).setLngLat([loc.lon, loc.lat]).addTo(map);
		el.addEventListener('click', () => {
			modalData = {
				id: loc.id,
				name: loc.name,
				lat: loc.lat,
				lon: loc.lon,
				url: ''
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

	function addMarkerWithImage(loc: Location) {
		const el = document.createElement('div');
		el.className = 'marker';
		el.style.backgroundImage = `url(${loc.url})`;
		el.style.width = `40px`;
		el.style.borderRadius = `10px`;
		el.style.height = `40px`;
		el.style.backgroundSize = 'cover'; // Ensures the image covers the 30x30 area
		el.style.backgroundPosition = 'center'; // Centers the image within the div
		let marker = new maplibregl.Marker({ element: el }).setLngLat([loc.lon, loc.lat]).addTo(map);
		el.addEventListener('click', () => {
			modalData = {
				id: loc.id,
				name: loc.name,
				lat: loc.lat,
				lon: loc.lon,
				url: loc.url
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

	async function addLocationMarker(loc: Location) {
		if (loc.url.length > 0) addMarkerWithImage(loc);
		else {
			const el = document.createElement('div');
			el.className = 'marker';
			el.style.backgroundImage = "url('/round_pushpin.png')";
			el.style.width = `30px`;
			el.style.height = `30px`;
			let marker = new maplibregl.Marker({ element: el }).setLngLat([loc.lon, loc.lat]).addTo(map);
			el.addEventListener('click', () => {
				modalData = {
					id: loc.id,
					name: loc.name,
					lat: loc.lat,
					lon: loc.lon,
					url: loc.url
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
