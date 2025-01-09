import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import {ghPages} from "vite-plugin-gh-pages";

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte(), ghPages()],
  base: '/MTG-pack-opener/',
});
