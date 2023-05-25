import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import dsv from '@rollup/plugin-dsv'

export default defineConfig({
	base: "/469test/", // change to your repo name
	plugins: [
		sveltekit(),
		dsv(),
	]
});
