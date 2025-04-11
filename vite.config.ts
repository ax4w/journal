import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { config } from 'dotenv';

config({ path: ".env" });

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()]
});
