// src/utils/generate.js
// Ejecutar con: node src/utils/generate.js [carpeta]
// Default: contracts/pages/
// Valida todos los contratos de la carpeta y genera un .astro por cada uno en src/pages/

import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'fs';
import { resolve, join, basename } from 'path';
import { fileURLToPath } from 'url';

import {
  validatePageContract,
  isSiteContract,
  generateProductSchema,
  generateArticleSchema,
  generateServiceSchema,
} from './validate.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT      = resolve(__dirname, '../../');
const PAGES_OUT = join(ROOT, 'src/pages');

const SECTION_COMPONENT_MAP = {
  features:     'Features',
  testimonials: 'Testimonials',
  faq:          'FAQ',
  cta:          'CTA',
};

// ─── Generadores de .astro ────────────────────────────────────────────────────

function generateWebPageSchema(contract) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'name': contract.seo.title,
    'description': contract.seo.description,
  };
}

function slugFromContract(contract, filename) {
  if (contract.slug) return contract.slug;
  return basename(filename, '.json');
}

function generateLandingPage(contract) {
  const { seo, hero, sections = [] } = contract;

  // Collect which section components are actually used
  const usedComponents = new Set();
  sections.forEach(({ type }) => {
    if (SECTION_COMPONENT_MAP[type]) usedComponents.add(SECTION_COMPONENT_MAP[type]);
  });

  const componentImports = [...usedComponents]
    .map(name => `import ${name} from '../components/${name}.astro';`)
    .join('\n');

  const schemaData = seo.schemaData ?? generateWebPageSchema(contract);

  // Build section data constants + JSX lines
  const sectionConsts = sections.map((sec, i) => {
    return `const _section${i} = ${JSON.stringify(sec.content, null, 2)};`;
  }).join('\n');

  const sectionJsx = sections.map((sec, i) => {
    const comp = SECTION_COMPONENT_MAP[sec.type];
    if (!comp) return `{/* sección "${sec.type}" — componente no disponible */}`;
    return `<${comp} {..._section${i}} />`;
  }).join('\n  ');

  const secondaryCta = hero.ctaSecondaryText
    ? `\n  secondaryText="${esc(hero.ctaSecondaryText)}" secondaryHref="${esc(hero.ctaSecondaryHref ?? '#')}"`
    : '';

  return `---
// AUTO-GENERADO por generate.js — NO editar a mano, editar el contrato
import Layout from '../layouts/Layout.astro';
import Hero from '../components/Hero.astro';
${componentImports}

const _seo = ${JSON.stringify(seo, null, 2)};
const _hero = ${JSON.stringify(hero, null, 2)};
${sectionConsts}
const _schema = ${JSON.stringify(schemaData, null, 2)};
---

<Layout
  title={_seo.title}
  description={_seo.description}
  googleFontsUrl={_seo.googleFontsUrl}
  schemaData={_schema}
>
  <Hero
    headline={_hero.headline}
    subheadline={_hero.subheadline}
    ctaText={_hero.ctaText}
    ctaHref={_hero.ctaHref}${secondaryCta}
    backgroundImage={_hero.backgroundImage}
  />
  ${sectionJsx}
</Layout>
`;
}

function generateProductPage(contract) {
  const { seo, product, hero = {} } = contract;
  const schemaData = seo.schemaData ?? generateProductSchema(contract);

  return `---
// AUTO-GENERADO por generate.js — NO editar a mano, editar el contrato
import Layout from '../layouts/Layout.astro';
import Hero from '../components/Hero.astro';

const _seo = ${JSON.stringify(seo, null, 2)};
const _product = ${JSON.stringify(product, null, 2)};
const _hero = ${JSON.stringify(hero, null, 2)};
const _schema = ${JSON.stringify(schemaData, null, 2)};
---

<Layout
  title={_seo.title}
  description={_seo.description}
  googleFontsUrl={_seo.googleFontsUrl}
  schemaData={_schema}
>
  <Hero
    headline={_product.name}
    subheadline={_product.description}
    ctaText={_hero.ctaText ?? "Comprar ahora"}
    ctaHref={_hero.ctaHref ?? "#"}
    backgroundImage={_hero.backgroundImage}
  />
  {/* Contenido de producto generado desde contrato */}
  <section class="product-detail container">
    <p class="product-price">{_product.price} {_product.currency}</p>
    {_product.specs?.length > 0 && (
      <ul class="product-specs">
        {_product.specs.map(s => (
          <li><strong>{s.label}:</strong> {s.value}</li>
        ))}
      </ul>
    )}
  </section>
</Layout>

<style>
  .product-detail {
    padding: var(--space-xl) 0;
  }
  .product-price {
    font-size: var(--text-2xl);
    font-family: var(--font-heading);
    color: var(--accent);
    margin-bottom: var(--space-md);
  }
  .product-specs {
    list-style: none;
    padding: 0;
    display: grid;
    gap: var(--space-xs);
  }
  .product-specs li {
    color: var(--text-secondary);
  }
</style>
`;
}

function generateBlogPage(contract) {
  const { seo, post } = contract;
  const schemaData = seo.schemaData ?? generateArticleSchema(contract);

  return `---
// AUTO-GENERADO por generate.js — NO editar a mano, editar el contrato
import Layout from '../layouts/Layout.astro';
import Hero from '../components/Hero.astro';

const _seo = ${JSON.stringify(seo, null, 2)};
const _post = ${JSON.stringify(post, null, 2)};
const _schema = ${JSON.stringify(schemaData, null, 2)};
---

<Layout
  title={_seo.title}
  description={_seo.description}
  googleFontsUrl={_seo.googleFontsUrl}
  schemaData={_schema}
>
  <Hero
    headline={_post.title}
    subheadline={_post.excerpt}
    ctaText="Leer artículo"
    ctaHref="#article-body"
    backgroundImage={_post.coverImage}
  />
  <article id="article-body" class="post-body container">
    <p class="post-meta">{_post.date} · {_post.author}</p>
    <div class="post-content" set:html={_post.body.replace(/\\n/g, '<br>')} />
  </article>
</Layout>

<style>
  .post-body {
    padding: var(--space-xl) 0;
    max-width: 72ch;
  }
  .post-meta {
    color: var(--text-secondary);
    font-size: var(--text-sm);
    margin-bottom: var(--space-lg);
  }
  .post-content {
    line-height: 1.75;
    color: var(--text-primary);
  }
</style>
`;
}

function generateServicePage(contract) {
  const { seo, service, hero = {} } = contract;
  const schemaData = seo.schemaData ?? generateServiceSchema(contract);

  return `---
// AUTO-GENERADO por generate.js — NO editar a mano, editar el contrato
import Layout from '../layouts/Layout.astro';
import Hero from '../components/Hero.astro';

const _seo = ${JSON.stringify(seo, null, 2)};
const _service = ${JSON.stringify(service, null, 2)};
const _hero = ${JSON.stringify(hero, null, 2)};
const _schema = ${JSON.stringify(schemaData, null, 2)};
---

<Layout
  title={_seo.title}
  description={_seo.description}
  googleFontsUrl={_seo.googleFontsUrl}
  schemaData={_schema}
>
  <Hero
    headline={_service.name}
    subheadline={_service.description}
    ctaText={_hero.ctaText ?? "Consultar"}
    ctaHref={_hero.ctaHref ?? "#contacto"}
    backgroundImage={_hero.backgroundImage}
  />
  {_service.features?.length > 0 && (
    <section class="service-features container">
      <ul class="features-list">
        {_service.features.map(f => (
          <li class="feature-item">{f}</li>
        ))}
      </ul>
      <p class="area-served">Área de cobertura: {_service.areaServed}</p>
    </section>
  )}
</Layout>

<style>
  .service-features {
    padding: var(--space-xl) 0;
  }
  .features-list {
    list-style: none;
    padding: 0;
    display: grid;
    gap: var(--space-sm);
    margin-bottom: var(--space-lg);
  }
  .feature-item {
    padding: var(--space-sm) var(--space-md);
    border-left: 3px solid var(--accent);
    background: var(--bg-secondary);
    border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
    color: var(--text-primary);
  }
  .area-served {
    color: var(--text-secondary);
    font-size: var(--text-sm);
  }
</style>
`;
}

// ─── Helper ───────────────────────────────────────────────────────────────────

function esc(str) {
  return str.replace(/"/g, '&quot;');
}

// ─── CLI ─────────────────────────────────────────────────────────────────────

const folder     = process.argv[2] ?? 'contracts/pages';
const folderPath = resolve(ROOT, folder);

let files;
try {
  files = readdirSync(folderPath).filter(f => f.endsWith('.json'));
} catch {
  console.error(`❌ No se puede leer la carpeta: ${folderPath}`);
  process.exit(1);
}

if (files.length === 0) {
  console.error(`❌ No hay archivos .json en ${folderPath}`);
  process.exit(1);
}

console.log(`\n📂 Leyendo ${files.length} contrato(s) desde ${folder}\n`);

// ── Fase 1: validar todos ────────────────────────────────────────────────────

const results = [];

for (const file of files) {
  const filePath = join(folderPath, file);
  let contract;
  try {
    contract = JSON.parse(readFileSync(filePath, 'utf-8'));
  } catch (err) {
    results.push({ file, ok: false, errors: [`JSON inválido: ${err.message}`] });
    continue;
  }

  if (isSiteContract(contract)) {
    results.push({ file, ok: false, errors: ['Este es un contrato de sitio, no de página. Usa validate.js directamente.'] });
    continue;
  }

  const errors = validatePageContract(contract);
  results.push({ file, contract, ok: errors.length === 0, errors });
}

const failed = results.filter(r => !r.ok);

if (failed.length > 0) {
  console.error('❌ Validación fallida — se aborta la generación completa:\n');
  for (const { file, errors } of failed) {
    console.error(`  ${file}:`);
    errors.forEach(e => console.error(`    - ${e}`));
  }
  console.error('\nCorrige los errores anteriores y vuelve a ejecutar.\n');
  process.exit(1);
}

console.log('✅ Todos los contratos son válidos.\n');

// ── Fase 2: generar archivos .astro ──────────────────────────────────────────

mkdirSync(PAGES_OUT, { recursive: true });

for (const { file, contract } of results) {
  const slug = slugFromContract(contract, file);
  const outPath = join(PAGES_OUT, `${slug}.astro`);

  let content;
  switch (contract.page_type) {
    case 'landing':  content = generateLandingPage(contract);  break;
    case 'product':  content = generateProductPage(contract);  break;
    case 'blog':     content = generateBlogPage(contract);     break;
    case 'service':  content = generateServicePage(contract);  break;
    default:
      console.error(`  ⚠  ${file}: page_type "${contract.page_type}" no soportado — omitido`);
      continue;
  }

  writeFileSync(outPath, content, 'utf-8');
  console.log(`  ✅ ${contract.page_type.padEnd(9)}→ src/pages/${slug}.astro`);
}

console.log(`\n🎉 Generación completa. Ejecuta: npm run build\n`);
