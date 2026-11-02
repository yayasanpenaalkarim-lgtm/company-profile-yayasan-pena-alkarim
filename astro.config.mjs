import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

// Halaman publik di-render di server (data selalu segar dari Supabase).
// Halaman /admin dibuat statis (prerender) dan jalan di browser.
export default defineConfig({
  output: 'server',
  compressHTML: true,
  session: false,
  adapter: vercel(),
});
