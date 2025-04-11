<script lang="ts">
	import 'leaflet/dist/leaflet.css';
	import { onDestroy, onMount } from 'svelte';
	import markerIconUrl from 'leaflet/dist/images/marker-icon.png';
	import markerIconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
	import markerShadowUrl from 'leaflet/dist/images/marker-shadow.png';
	import type { Location } from '$lib/location';

	let { locations, Gallery, searchResult, SearchPopUp, refresh, authed } = $props();

	let mapElement = $state<HTMLDivElement | null>(null);
	let map: any;
	let leaflet: any;
	let markers: any[];

	let showModal = $state(false);
	let showGallery = $state(false);
	let modalData = $state<Location>({ id: 0, name: '', lat: 0, lon: 0 });

	$effect(() => {
		if (locations) {
			clearAllMarkers();
			addMakers(locations, false);
			addMakers(searchResult, true);
		}
	});

	onMount(async () => {
		leaflet = await import('leaflet');
		if (mapElement == null) {
			console.log('map element is null');
			return;
		}
		map = leaflet.map(mapElement, { zoomControl: false }).setView([0, 0], 2);
		leaflet
			.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
				noWrap: true,
				attribution:
					'© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
			})
			.addTo(map);
	});

	onDestroy(() => {
		clearAllMarkers();
		if (map) {
			console.log('Unloading Leaflet map.');
			map.remove();
			map = null;
		}
		leaflet = null;
	});

	function clearAllMarkers() {
		if (map) {
			markers.forEach((marker) => {
				map.removeLayer(marker);
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

	function addMakers(locations: Location[], searchResult: boolean) {
		if (!map || !leaflet) return;

		let defaultIcon = leaflet.icon({
			iconUrl: markerIconUrl,
			iconRetinaUrl: markerIconRetinaUrl,
			shadowUrl: markerShadowUrl,
			iconSize: [25, 41],
			iconAnchor: [12, 41],
			popupAnchor: [1, -34],
			shadowSize: [41, 41]
		});

		if (searchResult) {
		}

		locations.forEach((loc) => {
			const marker = leaflet.marker([loc.lat, loc.lon], { icon: defaultIcon }).addTo(map);

			markers.push(marker);

			marker.on('click', () => {
				modalData = {
					id: loc.id,
					name: loc.name,
					lat: loc.lat,
					lon: loc.lon
				};
				if (searchResult) {
					if (showModal) {
						showModal = false;
						marker.fire('click');
					} else {
						showModal = true;
					}
				} else {
					if (showGallery) {
						showGallery = false;
						marker.fire('click');
					} else {
						showGallery = true;
					}
				}
			});
		});
	}
</script>

<div bind:this={mapElement} class="z-0 h-full w-full"></div>
<Gallery active={showGallery} close={closeModal} data={modalData} {authed}/>
<SearchPopUp active={showModal} close={closeAddModal} data={modalData} />
