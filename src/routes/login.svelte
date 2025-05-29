<script lang="ts">
	import { Button, Input, Label, Modal } from 'flowbite-svelte';

	let { active, onSuccess, onFail } = $props();
    let password = $state("")

    async function login() {
        if(!password) return
        let resp = await fetch("/login", {
            method: "POST",
            body: JSON.stringify({
                password
            })
        })
        let body = await resp.json()
        if (body.success) {
            onSuccess()
        }else{
            onFail()
            alert("wrong password")
        }
        password = ""
    }
</script>

<Modal bind:open={active} autoclose size="xs">
	<div class="text-center">
        <div class="mb-6">
            <Label for="password" class="block mb-2">Login</Label>
            <Input bind:value={password} type="password" id="password" placeholder="password..." />
          </div>
		<Button disabled={password.length == 0} color="green" class="me-2" onclick={() => login()}>Login</Button>
	</div>
</Modal>