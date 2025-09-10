import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
	preprocess: vitePreprocess(),
	kit: { 
		adapter: adapter({
			bodyLimitBytes: 52428800  // 50MB in bytes
		})
	}
};

export default config;
