import adapter from "@sveltejs/adapter-vercel";

import compression from "compression";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter(),
  },
  preprocess: vitePreprocess(),
  paths: {
    relative: false,
  },
};

export default config;
