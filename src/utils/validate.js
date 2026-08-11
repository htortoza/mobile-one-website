// src/utils/validate.js
// Ejecutar con: node src/utils/validate.js contracts/[archivo].json
// El agente SIEMPRE valida antes de generar código.
// Detecta el tipo automáticamente:
//   contract_type:"site"                → validador de sitio
//   page_type: landing|product|blog|service → validador de página por tipo

import { readFileSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const VALID_PAGE_TYPES    = ['landing', 'product', 'blog', 'service'];
const MAX_TITLE_LENGTH    = 60;
const MAX_DESC_LENGTH     = 155;

// ─── SEO (común a todos los page contracts) ──────────────────────────────────

function validateSEO(seo, errors) {
  for (const field of ['title', 'description']) {
    if (!seo[field]) errors.push(`seo.${field}: campo obligatorio`);
  }
  if (seo.title?.length > MAX_TITLE_LENGTH) {
    errors.push(`seo.title: excede ${MAX_TITLE_LENGTH} caracteres (tiene ${seo.title.length})`);
  }
  if (seo.description?.length > MAX_DESC_LENGTH) {
    errors.push(`seo.description: excede ${MAX_DESC_LENGTH} caracteres (tiene ${seo.description.length})`);
  }
}

// ─── Validadores por page_type ────────────────────────────────────────────────

function validateProductBlock(product, errors) {
  if (!product) { errors.push('"product": bloque obligatorio'); return; }
  for (const field of ['name', 'description', 'price', 'currency']) {
    if (!product[field] && product[field] !== 0) {
      errors.push(`product.${field}: campo obligatorio`);
    }
  }
  if (product.price !== undefined && typeof product.price !== 'number') {
    errors.push('product.price: debe ser un número (sin símbolo de moneda)');
  }
  if (product.specs && !Array.isArray(product.specs)) {
    errors.push('product.specs: debe ser un array');
  }
}

function validatePostBlock(post, errors) {
  if (!post) { errors.push('"post": bloque obligatorio'); return; }
  for (const field of ['title', 'date', 'author', 'excerpt', 'body']) {
    if (!post[field]) errors.push(`post.${field}: campo obligatorio`);
  }
  if (post.date && !/^\d{4}-\d{2}-\d{2}/.test(post.date)) {
    errors.push('post.date: debe estar en formato ISO 8601 (ej: 2025-06-12)');
  }
  if (post.excerpt?.length > 300) {
    errors.push(`post.excerpt: excede 300 caracteres (tiene ${post.excerpt.length})`);
  }
}

function validateServiceBlock(service, errors) {
  if (!service) { errors.push('"service": bloque obligatorio'); return; }
  for (const field of ['name', 'description', 'areaServed']) {
    if (!service[field]) errors.push(`service.${field}: campo obligatorio`);
  }
  if (service.features && !Array.isArray(service.features)) {
    errors.push('service.features: debe ser un array de strings');
  }
}

// ─── Validador de PÁGINA ──────────────────────────────────────────────────────

function validatePageContract(contract) {
  const errors = [];

  if (!contract.seo) {
    errors.push('"seo": bloque obligatorio');
  } else {
    validateSEO(contract.seo, errors);
  }

  if (!contract.page_type) {
    errors.push(`"page_type": campo obligatorio (${VALID_PAGE_TYPES.join(' | ')})`);
  } else if (!VALID_PAGE_TYPES.includes(contract.page_type)) {
    errors.push(`"page_type": valor inválido "${contract.page_type}" — debe ser: ${VALID_PAGE_TYPES.join(' | ')}`);
  } else {
    switch (contract.page_type) {
      case 'product': validateProductBlock(contract.product, errors); break;
      case 'blog':    validatePostBlock(contract.post,       errors); break;
      case 'service': validateServiceBlock(contract.service, errors); break;
      // 'landing': hero y sections son responsabilidad del Agente al leer landing.schema.json
    }
  }

  return errors;
}

// ─── Auto-generadores de JSON-LD ─────────────────────────────────────────────

function generateProductSchema(contract) {
  const { seo, product } = contract;
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    'name': product.name,
    'description': product.description,
    ...(product.images?.length && { 'image': product.images }),
    'offers': {
      '@type': 'Offer',
      'price': product.price,
      'priceCurrency': product.currency,
      'availability': 'https://schema.org/InStock',
    },
  };
}

function generateArticleSchema(contract) {
  const { seo, post } = contract;
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': post.title,
    'description': post.excerpt,
    'datePublished': post.date,
    'author': { '@type': 'Person', 'name': post.author },
    ...(post.coverImage && { 'image': post.coverImage }),
  };
}

function generateServiceSchema(contract) {
  const { seo, service } = contract;
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    'name': service.name,
    'description': service.description,
    'areaServed': service.areaServed,
    ...(service.features?.length && {
      'hasOfferCatalog': {
        '@type': 'OfferCatalog',
        'itemListElement': service.features.map((f) => ({
          '@type': 'Offer',
          'itemOffered': { '@type': 'Service', 'name': f },
        })),
      },
    }),
  };
}

function generateOrganizationSchema(contract) {
  const { site, company } = contract;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': company.legalName,
    'url': site.domain,
    'email': company.email,
  };
  if (company.phone)        schema['telephone'] = company.phone;
  if (company.address)      schema['address'] = { '@type': 'PostalAddress', 'streetAddress': company.address };
  if (site.defaultOgImage)  schema['image'] = `${site.domain}${site.defaultOgImage}`;
  return schema;
}

// ─── Validador de SITIO ───────────────────────────────────────────────────────

function validateNavArray(arr, fieldName, errors) {
  if (!Array.isArray(arr) || arr.length === 0) {
    errors.push(`"${fieldName}": debe ser un array con al menos un elemento`);
    return;
  }
  arr.forEach((item, i) => {
    if (!item.label) errors.push(`"${fieldName}[${i}].label": campo obligatorio`);
    if (!item.href)  errors.push(`"${fieldName}[${i}].href": campo obligatorio`);
  });
}

function validateSiteContract(contract) {
  const errors = [];

  if (!contract.site) {
    errors.push('"site": bloque obligatorio');
  } else {
    if (!contract.site.domain)   errors.push('"site.domain": campo obligatorio (ej: https://cliente.com)');
    if (!contract.site.siteName) errors.push('"site.siteName": campo obligatorio');
  }

  if (!contract.company) {
    errors.push('"company": bloque obligatorio');
  } else {
    if (!contract.company.legalName) errors.push('"company.legalName": campo obligatorio');
    if (!contract.company.email)     errors.push('"company.email": campo obligatorio');
  }

  validateNavArray(contract.navigation,  'navigation',  errors);
  validateNavArray(contract.footerLinks, 'footerLinks', errors);

  return errors;
}

// ─── Detección de tipo ────────────────────────────────────────────────────────

function isSiteContract(contract) {
  return (
    contract.contract_type === 'site' ||
    ('site' in contract && !('page_type' in contract))
  );
}

// ─── Exports (para uso programático desde generate.js) ───────────────────────

export {
  validatePageContract,
  validateSiteContract,
  isSiteContract,
  generateProductSchema,
  generateArticleSchema,
  generateServiceSchema,
  generateOrganizationSchema,
};

// ─── CLI ─────────────────────────────────────────────────────────────────────

if (process.argv[1] === fileURLToPath(import.meta.url)) {

const filePath = process.argv[2];
if (!filePath) {
  console.error('Uso: node src/utils/validate.js <path/al/contrato.json>');
  process.exit(1);
}

try {
  const raw      = readFileSync(resolve(filePath), 'utf-8');
  const contract = JSON.parse(raw);
  const isSite   = isSiteContract(contract);
  const label    = isSite ? 'sitio' : `página (${contract.page_type ?? 'tipo desconocido'})`;
  const errors   = isSite ? validateSiteContract(contract) : validatePageContract(contract);

  if (errors.length > 0) {
    console.error(`❌ Contrato de ${label} inválido. Corrige antes de generar:`);
    errors.forEach((e) => console.error(`  - ${e}`));
    process.exit(1);
  }

  console.log(`✅ Contrato de ${label} válido. El agente puede proceder.`);

  // Mostrar JSON-LD auto-generado si no está en el contrato
  if (!contract.seo?.schemaData && !contract.organizationSchema) {
    let generatedSchema;
    let hint;
    if (isSite) {
      generatedSchema = generateOrganizationSchema(contract);
      hint = '"organizationSchema"';
    } else if (contract.page_type === 'product') {
      generatedSchema = generateProductSchema(contract);
      hint = '"seo.schemaData"';
    } else if (contract.page_type === 'blog') {
      generatedSchema = generateArticleSchema(contract);
      hint = '"seo.schemaData"';
    } else if (contract.page_type === 'service') {
      generatedSchema = generateServiceSchema(contract);
      hint = '"seo.schemaData"';
    }

    if (generatedSchema) {
      console.log(`\nℹ️  JSON-LD auto-generado (añade como ${hint} si necesitas personalizar):`);
      console.log(JSON.stringify(generatedSchema, null, 2));
    }
  }

  process.exit(0);

} catch (err) {
  console.error('Error leyendo el contrato:', err.message);
  process.exit(1);
}

} // end CLI guard
