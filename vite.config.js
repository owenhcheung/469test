import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import dsv from '@rollup/plugin-dsv'

export default defineConfig({
	base: "/digital-divide/", // change to your repo name
	plugins: [
		sveltekit(),
		dsv(),
	]
});
