// src/pages/robots.txt.js
// robots.txt generado en el build a partir de `site` (astro.config.mjs):
// permite rastrear todo el sitio y apunta al sitemap del dominio real.
export function GET({ site }) {
  const sitemap = new URL('sitemap-index.xml', site).href;
  const body = ['User-agent: *', 'Allow: /', '', `Sitemap: ${sitemap}`, ''].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
