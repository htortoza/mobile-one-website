// astro.config.mjs
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // Dominio de producción: mobile-one.io (Cloudflare Pages, rama production).
  // GH_PAGES_SITE/GH_PAGES_BASE: solo los define el workflow del repo de
  // preview en GitHub Pages (project page con subpath) — el build real del
  // cliente nunca los setea. Todo href/src interno pasa por withBase()
  // (src/utils/base.js) para respetar este subpath.
  site: process.env.GH_PAGES_SITE ?? 'https://mobile-one.io',
  base: process.env.GH_PAGES_BASE ?? '/',

  integrations: [
    sitemap({
      filter: (page) =>
        !page.includes('/draft/') && !page.includes('/admin/') &&
        !page.includes('/clientes') && !page.includes('/propuesta') &&
        !page.includes('/privacidad') && !page.includes('/terminos') &&
        // noindex hasta que exista Mobile One para gastronomía (ver src/data/comparativas.js)
        !page.includes('/comparativas/alternativa-a-toteat'),
    }),
  ],

  compressHTML: true,

  vite: {
    build: {
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('gsap'))  return 'gsap';
            if (id.includes('lenis')) return 'lenis';
          },
        },
      },
    },
    optimizeDeps: {
      include: ['gsap', 'lenis'],
    },
  },
});
