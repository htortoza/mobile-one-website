// src/utils/seo.js — helpers de datos estructurados (JSON-LD) para las páginas interiores.
const SITE = 'https://mobile-one.io';
export const orgSchema = {
  '@type': 'Organization', name: 'Mobile One', url: SITE,
  parentOrganization: { '@type': 'Organization', name: 'DOT Solutions', url: 'https://dotsolutions.io' },
};
export function faqSchema(items) {
  return { '@type': 'FAQPage', mainEntity: items.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) };
}
export function breadcrumbSchema(trail) {
  return { '@type': 'BreadcrumbList', itemListElement: trail.map((t, i) => ({ '@type': 'ListItem', position: i + 1, name: t.label, item: SITE + t.href })) };
}
// Une varios nodos en un único @graph.
export function graph(...nodes) { return { '@context': 'https://schema.org', '@graph': nodes.filter(Boolean) }; }
