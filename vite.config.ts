import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	server: {
		fs: {
			// Allow serving files from the Life OS tmp directory
			allow: [
				'/Users/hanifcarroll/Library/Mobile Documents/iCloud~md~obsidian/Documents/hanif-md/tmp',
				'/Users/hanifcarroll/projects/x-thread-preview'
			]
		}
	}
});
