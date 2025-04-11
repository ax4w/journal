<script lang="ts">
	import { type Thumbnail } from '$lib/images';
	import { Button, Modal } from 'flowbite-svelte';

	let { active, close, data, authed } = $props();
	let files = $state<File[]>([]);
	let thumbnails = $state<Thumbnail[]>([]);
	let fullScreen = $state(false);
	let fullResURL = $state('');

	async function loadThumbnails() {
		thumbnails = [];
		const res = await fetch(`/thumbnails/${data.id}`);
		const body = await res.json();
		thumbnails = body.thumbnails;
	}

	$effect(() => {
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
		alert("finished uploading")

		files = [];
		await loadThumbnails();
	}
	$inspect(thumbnails);
</script>

<Modal bind:open={active} autoclose size="md">
	<div class="p-4">
		<div class="overflow-y-auto" style="max-height: 300px;">
			<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
				{#each thumbnails as thumb}
					<img
						onclick={() => openFullScreen(thumb.full)}
						src={thumb.url}
						alt="Thumbnail"
						class="h-auto w-full rounded object-cover"
					/>
				{/each}
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

<Modal bind:open={fullScreen} autoclose>
	<div class="flex justify-center items-center">
		<img src={fullResURL} alt="image" class="max-h-[80vh] max-w-full rounded" />
	</div>
	<svelte:fragment slot="footer">
		<Button color="green" class="me-2" onclick={() => (fullScreen = false)}>Close</Button>
	</svelte:fragment>
</Modal>
