// src/utils/apply-theme.js
// CLI: node src/utils/apply-theme.js [ruta-contrato-site]
// Default: contracts/site.json
// Aplica el bloque "theme" del contrato a src/styles/theme.css
// Solo modifica valores existentes — nunca añade variables ni toca estructura.

import { readFileSync, writeFileSync } from 'fs';
import { resolve, join } from 'path';
import { fileURLToPath } from 'url';
import { validateSiteContract, isSiteContract } from './validate.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT      = resolve(__dirname, '../../');
const THEME_CSS = join(ROOT, 'src/styles/theme.css');

// ─── Lógica de aplicación ─────────────────────────────────────────────────────

function applyTheme(css, theme) {
  const changed = [];
  const ignored = [];
  let result = css;

  for (const [varName, newValue] of Object.entries(theme)) {
    if (!varName.startsWith('--')) {
      ignored.push(`${varName}  (no es una variable CSS — omitida)`);
      continue;
    }

    // Escapa caracteres especiales de regex (el guion NO es especial fuera de [])
    const escaped = varName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Captura: whitespace+nombre+colon+spaces | valor actual | punto y coma
    const regex = new RegExp(`([ \\t]*${escaped}:[ \\t]*)([^;\\n]+)(;)`, 'g');

    let found = false;
    let oldValue = '';
    result = result.replace(regex, (_, prefix, old, semi) => {
      found    = true;
      oldValue = old.trim();
      return `${prefix}${newValue}${semi}`;
    });

    if (found) {
      changed.push({ varName, oldValue, newValue });
    } else {
      ignored.push(`${varName}  (no existe en theme.css)`);
    }
  }

  return { css: result, changed, ignored };
}

// ─── CLI ─────────────────────────────────────────────────────────────────────

const contractArg  = process.argv[2] ?? 'contracts/site.json';
const contractPath = resolve(ROOT, contractArg);

let contract;
try {
  contract = JSON.parse(readFileSync(contractPath, 'utf-8'));
} catch (err) {
  console.error(`❌ No se puede leer el contrato: ${err.message}`);
  process.exit(1);
}

if (!isSiteContract(contract)) {
  console.error('❌ El contrato no es de tipo site. Debe tener "contract_type": "site" o un bloque "site".');
  process.exit(1);
}

const siteErrors = validateSiteContract(contract);
if (siteErrors.length > 0) {
  console.error('❌ Contrato de sitio inválido. Corrige antes de aplicar:');
  siteErrors.forEach(e => console.error(`  - ${e}`));
  process.exit(1);
}

const theme = contract.theme;
if (!theme || typeof theme !== 'object' || Object.keys(theme).length === 0) {
  console.log('ℹ️  El contrato no contiene bloque "theme". No hay nada que aplicar.');
  process.exit(0);
}

let css;
try {
  css = readFileSync(THEME_CSS, 'utf-8');
} catch (err) {
  console.error(`❌ No se puede leer theme.css: ${err.message}`);
  process.exit(1);
}

console.log(`\n🎨 Aplicando tema desde: ${contractArg}\n`);

const { css: updatedCss, changed, ignored } = applyTheme(css, theme);

if (changed.length > 0) {
  writeFileSync(THEME_CSS, updatedCss, 'utf-8');
  console.log('✅ Variables aplicadas:');
  const pad = Math.max(...changed.map(c => c.varName.length));
  for (const { varName, oldValue, newValue } of changed) {
    console.log(`   ${varName.padEnd(pad)}  ${oldValue} → ${newValue}`);
  }
}

if (ignored.length > 0) {
  console.warn('\n⚠️  Variables ignoradas:');
  for (const msg of ignored) {
    console.warn(`   ${msg}`);
  }
}

if (changed.length === 0 && ignored.length === 0) {
  console.log('ℹ️  El bloque "theme" está vacío. No se modificó nada.');
}

console.log('\n✅ Listo. Ejecuta: npm run build\n');
