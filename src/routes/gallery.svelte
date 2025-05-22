<script lang="ts">
	import { type Thumbnail } from '$lib/images';
	import { Button, ImagePlaceholder, Modal } from 'flowbite-svelte';

	let { active, close, data, authed } = $props();
	let files = $state<File[]>([]);
	let thumbnails = $state<Promise<Thumbnail[]>>();
	let fullScreen = $state(false);
	let fullResURL = $state('');

	async function loadThumbnails() {
		thumbnails = fetch(`/thumbnails/${data.id}`)
			.then((res) => res.json())
			.then((body) => body.thumbnails);
	}

	$effect(() => {
		console.log(data);
		if (data && data.id > 0) loadThumbnails();
	});

	function openFullScreen(url: string) {
		fullResURL = url;
		fullScreen = true;
	}

	async function upload(id: number) {
		if (!files.length) {
			console.log('no files selected');
			return;
		}
		alert('started uploading');
		for (const file of files) {
			const formData = new FormData();
			formData.append('file', file);
			console.log('uploading', file.name);
			try {
				const res = await fetch(`/upload/${id}`, {
					method: 'POST',
					body: formData
				});
				const d = await res.json();
				console.log(d);
				console.log(`${file.name}: ${d.message}`);
			} catch (err) {
				console.error(`${file.name}: Upload failed`, err);
				console.log(`${file.name}: Upload failed`);
			}
		}
		alert('finished uploading');
		files = [];
		if (active) {
			await loadThumbnails();
		}
	}
</script>

<Modal bind:open={active} size="md" class="z-999 min-h-[500px]">
	<div class="p-4">
		<div class="overflow-y-auto" style="max-height: 300px;">
			<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
				{#await thumbnails}
					{#each { length: 10 }}
						<ImagePlaceholder imgOnly imgHeight="60" class="h-auto w-full rounded object-cover" />
					{/each}
				{:then thumbnails}
					{#if thumbnails != undefined}
						{#if thumbnails.length == 0}
							<div class="flex h-full flex-col items-center justify-center">
								<p>No images found</p>
							</div>
						{:else}
							{#each thumbnails as thumb}
								<img
									onclick={() => openFullScreen(thumb.full)}
									src={thumb.url}
									alt="Thumbnail"
									class="h-auto w-full rounded object-cover"
								/>
							{/each}
						{/if}
					{:else}
						<div class="flex h-full flex-col items-center justify-center">
							<p>No images found</p>
						</div>
					{/if}
				{/await}
			</div>
		</div>
	</div>
	<svelte:fragment slot="header">
		<p>{data.name}</p>
	</svelte:fragment>
	<svelte:fragment slot="footer">
		<div class="flex flex-wrap gap-2" hidden={!authed}>
			<input
				class="rounded-xl"
				type="file"
				multiple
				onchange={(e) => {
					const input = e.target as HTMLInputElement;
					files = input.files ? Array.from(input.files) : [];
				}}
			/>
			<Button color="blue" onclick={() => upload(data.id)}>Upload</Button>
		</div>
	</svelte:fragment>
</Modal>

<Modal bind:open={fullScreen} autoclose class="z-999">
	<div class="flex items-center justify-center">
		<img src={fullResURL} alt="image" class="max-h-[80vh] max-w-full rounded" />
	</div>
	<svelte:fragment slot="footer">
		<Button color="green" class="me-2" onclick={() => (fullScreen = false)}>Close</Button>
	</svelte:fragment>
</Modal>
