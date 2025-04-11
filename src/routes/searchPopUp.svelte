<script lang="ts">
	import { Button, Modal } from 'flowbite-svelte';
	import { QuestionCircleOutline } from 'flowbite-svelte-icons';

	let { active, close, data } = $props();

    async function add() {
        let resp = await fetch("/add", {
            method: "POST",
            body: JSON.stringify({
                name: data.name,
                lat: data.lat,
                lon: data.lon
            })
        })
        if (resp.ok) {
            alert(`added ${data.name}`)
        }
        close()
    }
</script>

<Modal bind:open={active} autoclose size="xs">
	<div class="text-center">
		<QuestionCircleOutline class="mx-auto mb-4 h-12 w-12 text-gray-400 dark:text-gray-200" />
		<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
			Do you want to use these coordinates ({data.lat}, {data.lon}) for {data.name}
		</h3>
		<Button color="green" class="me-2" onclick={() => add()}>Yes, I'm sure</Button>
		<Button color="alternative">No, cancel</Button>
	</div>
</Modal>