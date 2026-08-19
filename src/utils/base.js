// src/utils/base.js
// Antepone import.meta.env.BASE_URL a rutas root-relative ("/foo") para que
// el sitio funcione tanto en el dominio real (base "/") como en un GitHub
// Pages project page (base "/repo/", ver GH_PAGES_BASE en astro.config.mjs).
// No toca URLs externas, mailto:, anchors (#) ni rutas ya absolutas http(s).
export function withBase(path) {
  if (!path) return path;
  if (/^(https?:)?\/\//.test(path) || path.startsWith('mailto:') || path.startsWith('#')) {
    return path;
  }
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return base + (path.startsWith('/') ? path : `/${path}`);
}
