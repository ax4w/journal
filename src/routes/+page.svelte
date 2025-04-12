<script lang="ts">
	import Gallery from './gallery.svelte';
	import SearchPopUp from './searchPopUp.svelte';
	import Map from './map.svelte';
	import { Button, Input, Modal } from 'flowbite-svelte';
	import { ArrowLeftToBracketOutline } from 'flowbite-svelte-icons';
	import type { Location } from '$lib/location';
	import { onMount } from 'svelte';
	import Login from './login.svelte';

	let loggedIn = $state(false);
	let loginModal = $state(false);
	let searchInput = $state('');
	let searchResult = $state<Location[]>([]);
	let locations = $state<Location[]>([])

	async function search() {
        searchResult = []
		let encodedSearch = encodeURIComponent(searchInput);
		let data = await (await fetch(`/search/${encodedSearch}`)).json();
		if(!data.locations) {
			return
		}
        (data.locations as Location[]).forEach(e => {
            searchResult.push({
				id: e.id,
                name: e.name,
                lat: e.lat,
                lon: e.lon
            })
        })
		searchInput = ""
	}

	async function load() {
		let resp = await fetch("/list")
		let body = await resp.json()
		locations = body.locations
		searchResult = []
	}

	async function auth() {
		let resp = await fetch("/auth")
		let body = await resp.json()
		loggedIn = body.success
	}

	async function logout() {
		await fetch("/logout", {
			method: "POST"
		})
		await auth()
	}

	onMount(async () => {
		await load()
		await auth()
	})
</script>

<main class="h-screen">
	<Map {locations} {Gallery} {searchResult} {SearchPopUp} refresh={load} authed={loggedIn}/>
	<div class="absolute top-4 right-0 left-0 z-50 hidden sm:grid grid-cols-[auto_1fr_auto] items-center">
		<div class="ml-4 w-fit rounded-xl bg-neutral-950/50 shadow-xl backdrop-blur-sm">
			<Button onclick={() => loggedIn ? logout() : (loginModal = true)}><ArrowLeftToBracketOutline /></Button>
		</div>
		<div hidden={!loggedIn} class="mx-auto flex w-full max-w-lg rounded-xl shadow-xl backdrop-blur-sm">
			<Input bind:value={searchInput} placeholder="Add..." />
			<Button
				disabled={searchInput.length == 0}
				color="blue"
				class="mr-1 ml-2"
				onclick={() => search()}>Search</Button
			>
		</div>
	</div>
</main>

<Login refresh={auth} active={loginModal}/>
