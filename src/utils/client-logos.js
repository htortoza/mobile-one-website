// src/utils/client-logos.js
// Logos reales de clientes (autorizados, ver /public/logos-clientes). Única
// fuente para el hero de Home y la franja del CTA de cierre (Home y /producto).
export const CLIENT_LOGOS = [
  { slug: 'dbs', alt: 'DBS' },
  { slug: '100-futbol', alt: '100% Fútbol' },
  { slug: 'wayu', alt: 'Wayú' },
  { slug: 'superzoo', alt: 'Superzoo' },
  { slug: 'superpet', alt: 'Superpet' },
  { slug: 'flores', alt: 'Flores' },
  { slug: 'sei', alt: 'SEI' },
];

// Variante blanca — para fondos azules de marca.
export const whiteClientLogos = () =>
  CLIENT_LOGOS.map((c) => ({ src: `/logos-clientes/white/${c.slug}.svg`, alt: c.alt }));
