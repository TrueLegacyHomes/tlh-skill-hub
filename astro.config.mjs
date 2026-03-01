// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';
import preact from '@astrojs/preact';

// https://astro.build/config
export default defineConfig({
  adapter: vercel(),
  integrations: [preact()],
  site: 'https://truelegacyhomes.github.io',
  base: '/tlh-skill-hub/',
  vite: {
    plugins: [tailwindcss()]
  }
});
