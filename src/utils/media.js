// src/utils/media.js
// Pipeline de media (imágenes + video) generada por Magnific MCP.
//
// El agente (Claude Code) es quien llama al MCP de Magnific y obtiene las URLs.
// Este script NO llama al MCP: solo gestiona el contrato y los archivos en /public.
//
// Uso:
//   node src/utils/media.js pending  contracts/x.json   → lista slots sin resolver (JSON)
//   node src/utils/media.js save     <url> <dest>        → descarga una URL a /public
//   node src/utils/media.js apply    contracts/x.json <slot> <path>  → fija la ruta final
//
// Flujo completo (lo orquesta el agente):
//   1. `pending`  → obtiene los slots que faltan + su prompt
//   2. genera cada uno vía Magnific MCP (images_generate / video_generate)
//   3. `save`     → descarga la URL del creation a public/images|videos
//   4. `apply`    → escribe la ruta /images|/videos/slot.* en el contrato

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { resolve, join, dirname, extname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT      = resolve(__dirname, '../../');
const PUBLIC    = join(ROOT, 'public');

function loadContract(p) {
  return JSON.parse(readFileSync(resolve(ROOT, p), 'utf-8'));
}

function saveContract(p, data) {
  writeFileSync(resolve(ROOT, p), JSON.stringify(data, null, 2) + '\n', 'utf-8');
}

// Devuelve los slots de media aún sin `path` resuelto.
function cmdPending(contractPath) {
  const c = loadContract(contractPath);
  const media = c.media ?? {};
  const out = { images: [], videos: [] };

  for (const img of media.images ?? []) {
    if (!img.path) out.images.push({ slot: img.slot, prompt: img.prompt, alt: img.alt });
  }
  for (const vid of media.videos ?? []) {
    if (!vid.path) out.videos.push({ slot: vid.slot, prompt: vid.prompt, duration: vid.duration });
  }
  console.log(JSON.stringify(out, null, 2));
}

// Descarga una URL (creation de Magnific) a /public.
async function cmdSave(url, dest) {
  const absDest = join(PUBLIC, dest.replace(/^\/+/, ''));
  mkdirSync(dirname(absDest), { recursive: true });

  const res = await fetch(url);
  if (!res.ok) {
    console.error(`❌ Descarga falló (${res.status}): ${url}`);
    process.exit(1);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  writeFileSync(absDest, buf);
  const kb = (buf.length / 1024).toFixed(0);
  console.log(`✅ ${dest} (${kb} KB)`);
}

// Escribe la ruta final del slot en el contrato.
function cmdApply(contractPath, slot, path) {
  const c = loadContract(contractPath);
  const media = c.media ?? {};
  let found = false;

  for (const group of ['images', 'videos']) {
    for (const item of media[group] ?? []) {
      if (item.slot === slot) { item.path = path; found = true; }
    }
  }
  if (!found) {
    console.error(`❌ Slot "${slot}" no existe en media del contrato.`);
    process.exit(1);
  }
  saveContract(contractPath, c);
  console.log(`✅ ${slot} → ${path}`);
}

const [cmd, ...args] = process.argv.slice(2);

switch (cmd) {
  case 'pending': cmdPending(args[0]); break;
  case 'save':    await cmdSave(args[0], args[1]); break;
  case 'apply':   cmdApply(args[0], args[1], args[2]); break;
  default:
    console.error('Uso: pending <contract> | save <url> <dest> | apply <contract> <slot> <path>');
    process.exit(1);
}
