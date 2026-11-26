// src/data/comparativas.js — Páginas "Alternativa a <competidor>" (/comparativas/{slug}).
//
// REGLAS (legales y de marca, no negociables):
// 1. Datos del competidor: SOLO verificados en su sitio oficial (o tercero marcado), con fuente
//    numerada (`src` → índice 1..n de `sources`) y fecha de revisión (`verifiedAt`).
// 2. Si algo no se pudo verificar se escribe "No lo menciona en su sitio", nunca "no tiene".
// 3. Sin logos de terceros y sin descalificar. La página vende Mobile One: NO recomienda al
//    competidor (decisión comercial, 26-11-2026).
// 5. Roadmap (e-commerce, tótem de autoatención con hardware propio, gastronomía/TCPOS) NO se
//    publica como disponible hasta que exista.
// 4. Columna Mobile One: solo lo que el sitio ya publica (producto, integraciones, industrias).
// Revisión de datos: 26-11-2026. Volver a revisar precios cada trimestre.

const MO = {
  para: 'Retail con varias tiendas: moda, electrónica, multitienda y retail con ERP.',
  paises: 'Chile y Perú.',
  precio: 'Según tu operación. Se cotiza en una demo.', // DATO PENDIENTE: confirmar modelo de precio con comercial
  equipo: 'POS móvil para vender en la sala, y caja fija con pantalla táctil para el mostrador, que funciona sin el POS móvil.',
  offline: 'Sí. Sigue vendiendo y facturando sin internet, y sincroniza al volver la conexión.',
  cobro: 'Con el terminal que ya usas: Transbank, Getnet o Mercado Pago en Chile; Niubiz o Mercado Pago en Perú.',
  red: 'Pasillo infinito: stock de toda la red, con retiro en otra tienda o despacho a domicilio.',
  sap: 'Sí. Consulta el stock y registra cada venta en SAP Business One.',
  rpro: 'Sí, con Retail Pro y Retail Pro Prism.',
  dte: 'Boleta o factura en Chile y comprobante electrónico en Perú, al cobrar.',
};

const VERIFIED = 'noviembre de 2026';

export const comparativas = [
  // ───────────────────────────── Bsale ─────────────────────────────
  {
    slug: 'alternativa-a-bsale',
    name: 'Bsale',
    segment: 'Pymes y emprendedores',
    card: 'Si tu retail ya creció a varias tiendas y corre sobre un ERP.',
    seo: {
      title: 'Alternativa a Bsale para retail con varias tiendas | Mobile One',
      description: 'Mobile One vs Bsale: POS móvil integrado a SAP Business One y Retail Pro, pasillo infinito y cobro con tu terminal. Comparación con precios y fuentes, Chile y Perú.',
    },
    h1: 'Alternativa a Bsale para retail con varias tiendas y ERP',
    lead: 'Bsale es una referencia para pymes que parten con ventas, inventario y facturación. Si tu operación ya tiene varias tiendas y un ERP como SAP Business One o Retail Pro, Mobile One está pensado para eso.',
    summary: 'Los dos venden y emiten boleta en Chile y Perú. La diferencia está en para quién están hechos.',
    highlights: [
      { title: 'Conectado a tu ERP', text: 'Mobile One se integra con SAP Business One, Retail Pro y Retail Pro Prism. Bsale no menciona Retail Pro ni SAP Business One en su sitio.' },
      { title: 'Vende en el pasillo', text: 'POS móvil que cobra con tu terminal de pago, para atender donde está el cliente.' },
      { title: 'Toda la red a la vista', text: 'El vendedor ve el stock de todas las tiendas y cierra la venta con retiro o despacho.' },
      { title: 'Vende sin internet', text: 'Si se cae la conexión, Mobile One sigue vendiendo y facturando, y sincroniza al volver.' },
    ],
    verifiedAt: VERIFIED,
    rows: [
      { k: 'Pensado para', mo: MO.para, c: 'Emprendedores y pymes: ventas, inventario, facturación electrónica y ecommerce.', src: 5 },
      { k: 'Países', mo: MO.paises, c: 'Chile y Perú.', src: 1 },
      { k: 'Precio publicado', mo: MO.precio, c: 'Chile: desde 1,9 UF + IVA al mes con punto de venta (1 sucursal); cada sucursal adicional, 1 UF + IVA. Perú: desde S/233 al mes.', src: 1 },
      { k: 'Dónde se vende', mo: MO.equipo, c: 'Navegador en PC, tablet o celular, y app móvil.', src: 5 },
      { k: 'Cobro con tarjeta', mo: MO.cobro, c: 'Integra Getnet, Transbank, Mercado Pago Point y Bci Pagos en Chile, y Niubiz en Perú.', src: 2 },
      { k: 'Stock de varias tiendas', mo: MO.red, c: 'Inventario en todas tus sucursales.', src: 5 },
      { k: 'SAP Business One', mo: MO.sap, c: 'Lista una integración con "SAP" en contabilidad; no especifica SAP Business One.', src: 2 },
      { k: 'Retail Pro', mo: MO.rpro, c: 'No lo menciona en su sitio.', src: 2 },
      { k: 'Facturación electrónica', mo: MO.dte, c: 'Nativa, autorizada por el SII y por SUNAT.', src: 1 },
    ],
    fitMO: [
      'Necesitas seguir vendiendo y facturando aunque se caiga internet.',
      'Tu retail corre sobre SAP Business One, Retail Pro o Retail Pro Prism.',
      'Quieres vender y cobrar en la sala, no solo en la caja.',
      'Tienes varias tiendas y quieres vender el stock de toda la red.',
      'Recibes mercadería y quieres cuadrarla escaneando contra el documento del ERP.',
    ],
    faqs: [
      { q: '¿Cuál es una buena alternativa a Bsale para retail con ERP?', a: 'Mobile One es un POS móvil y caja de pago pensado para retail con varias tiendas, integrado a SAP Business One, Retail Pro y Retail Pro Prism, en Chile y Perú.' },
      { q: '¿Cuánto cuesta Bsale?', a: 'Según su sitio (revisado en noviembre de 2026), en Chile el plan con punto de venta parte en 1,9 UF + IVA al mes con una sucursal, y cada sucursal adicional cuesta 1 UF + IVA. En Perú parte en S/233 al mes.' },
      { q: '¿Cuánto cuesta Mobile One?', a: 'Depende de tu operación: número de tiendas, terminales e integraciones. Lo cotizamos en una demo de 30 minutos.' },
      { q: '¿Mobile One se integra con SAP Business One?', a: 'Sí. Consulta el stock en SAP Business One y registra cada venta en el ERP, sin doble digitación.' },
    ],
    sources: [
      { label: 'Bsale Chile: precios', url: 'https://www.bsale.cl/sheet/precios' },
      { label: 'Bsale Chile: integraciones', url: 'https://www.bsale.cl/sheet/integraciones' },
      { label: 'Bsale Perú: precios', url: 'https://www.bsale.com.pe/sheet/precios' },
      { label: 'Bsale Perú: integraciones', url: 'https://www.bsale.com.pe/sheet/integraciones' },
      { label: 'Bsale Chile: sitio oficial', url: 'https://www.bsale.cl/' },
    ],
  },

  // ───────────────────────────── relBase ─────────────────────────────
  {
    slug: 'alternativa-a-relbase',
    name: 'relBase',
    segment: 'Pymes y emprendedores',
    card: 'Cuando necesitas POS móvil, stock de la red e integración con tu ERP.',
    seo: {
      title: 'Alternativa a relBase para retail con varias tiendas | Mobile One',
      description: 'Mobile One vs relBase: POS móvil, cobro con tu terminal, stock de toda la red e integración con SAP Business One y Retail Pro. Comparación con precios y fuentes.',
    },
    h1: 'Alternativa a relBase para retail con varias tiendas',
    lead: 'relBase reúne ventas, inventario y facturación para pymes. Si tu retail necesita vender en la sala, ver el stock de todas sus tiendas y conectarse a un ERP, Mobile One está hecho para eso.',
    summary: 'Ambos emiten documentos electrónicos. Cambia el tipo de operación para la que están pensados.',
    highlights: [
      { title: 'Integrado a tu ERP', text: 'SAP Business One, Retail Pro y Retail Pro Prism. relBase no menciona integraciones con ERP en su sitio.' },
      { title: 'Cobro con tu terminal', text: 'Transbank, Getnet, Mercado Pago o Niubiz, desde el mismo POS móvil.' },
      { title: 'Pasillo infinito', text: 'Si falta en la tienda, se vende desde otra sucursal con retiro o despacho.' },
      { title: 'Vende sin internet', text: 'Si se cae la conexión, Mobile One sigue vendiendo y facturando, y sincroniza al volver.' },
    ],
    verifiedAt: VERIFIED,
    rows: [
      { k: 'Pensado para', mo: MO.para, c: 'Pymes y emprendedores: ventas, inventario y facturación electrónica.', src: 1 },
      { k: 'Países', mo: MO.paises, c: 'Chile, con sitio para Perú.', src: 1 },
      { k: 'Precio publicado', mo: MO.precio, c: 'Desde 1 UF + IVA al mes con punto de venta (1 sucursal); cada sucursal adicional, 0,5 UF.', src: 2 },
      { k: 'Dónde se vende', mo: MO.equipo, c: 'Web y app para Android e iOS.', src: 1 },
      { k: 'Cobro con tarjeta', mo: MO.cobro, c: 'No menciona integraciones con terminales de pago en su sitio.', src: 1 },
      { k: 'Stock de varias tiendas', mo: MO.red, c: 'Sucursales adicionales pagadas y bodegas ilimitadas desde el plan Pyme.', src: 2 },
      { k: 'SAP Business One', mo: MO.sap, c: 'No lo menciona en su sitio.', src: 1 },
      { k: 'Retail Pro', mo: MO.rpro, c: 'No lo menciona en su sitio.', src: 1 },
      { k: 'Facturación electrónica', mo: MO.dte, c: 'Nativa, certificada por el SII.', src: 1 },
    ],
    fitMO: [
      'Necesitas seguir vendiendo y facturando aunque se caiga internet.',
      'Tu operación corre sobre SAP Business One o Retail Pro.',
      'Quieres cobrar con tu terminal de pago desde el pasillo.',
      'Tienes varias tiendas y quieres vender el stock de toda la red.',
      'Operas en Chile y Perú con el mismo sistema.',
    ],
    faqs: [
      { q: '¿Cuál es una alternativa a relBase para retail con varias tiendas?', a: 'Mobile One: POS móvil y caja de pago con stock de toda la red, integrado a SAP Business One, Retail Pro y Retail Pro Prism, en Chile y Perú.' },
      { q: '¿Cuánto cuesta relBase?', a: 'Según su sitio (revisado en noviembre de 2026), desde 1 UF + IVA al mes con una sucursal, y 0,5 UF por cada sucursal adicional.' },
      { q: '¿Cuánto cuesta Mobile One?', a: 'Depende de tu operación: número de tiendas, terminales e integraciones. Lo cotizamos en una demo de 30 minutos.' },
      { q: '¿Mobile One cobra con Transbank y Getnet?', a: 'Sí. Cobra con el terminal que ya usas: Transbank, Getnet o Mercado Pago en Chile, y Niubiz o Mercado Pago en Perú.' },
    ],
    sources: [
      { label: 'relBase: sitio oficial', url: 'https://www.relbase.cl/' },
      { label: 'relBase: precios', url: 'https://www.relbase.cl/precios/' },
    ],
  },

  // ───────────────────────────── Defontana / Tivendo ─────────────────────────────
  {
    slug: 'alternativa-a-defontana-tivendo',
    name: 'Defontana (Tivendo)',
    segment: 'ERP con punto de venta',
    card: 'Si tu ERP es SAP Business One o Retail Pro, y no Defontana.',
    seo: {
      title: 'Alternativa a Tivendo de Defontana para retail | Mobile One',
      description: 'Mobile One vs Tivendo (Defontana): POS móvil para retail integrado a SAP Business One y Retail Pro, con cobro desde tu terminal. Comparación con precios y fuentes.',
    },
    h1: 'Alternativa a Tivendo (Defontana) para retail con SAP o Retail Pro',
    lead: 'Tivendo es el punto de venta de Defontana y brilla conectado a su propio ERP. Si tu empresa ya trabaja con SAP Business One, Retail Pro o Retail Pro Prism, Mobile One se conecta a ese ERP sin cambiarlo.',
    summary: 'Los dos apuntan a operaciones con varias tiendas. La pregunta clave es qué ERP usas.',
    highlights: [
      { title: 'Tu ERP, no otro', text: 'Mobile One se integra a SAP Business One, Retail Pro y Retail Pro Prism. Tivendo se integra al ERP Defontana.' },
      { title: 'Cobro en el mismo equipo', text: 'Mobile One cobra con el terminal que ya usas. Tivendo documenta la conexión con Transbank y Getnet a través de un PC con Windows.' },
      { title: 'Pasillo infinito', text: 'Stock de toda la red, con retiro en otra tienda o despacho a domicilio.' },
      { title: 'Vende sin internet', text: 'Si se cae la conexión, Mobile One sigue vendiendo y facturando, y sincroniza al volver.' },
    ],
    verifiedAt: VERIFIED,
    rows: [
      { k: 'Pensado para', mo: MO.para, c: 'Punto de venta conectado al ERP Defontana, para pymes, medianas y grandes empresas.', src: 1 },
      { k: 'Países', mo: MO.paises, c: 'Sitio con versiones para Chile, Perú, México y Colombia.', src: 1 },
      { k: 'Precio publicado', mo: MO.precio, c: 'Chile: desde 2 UF + IVA al mes; la conexión con el ERP Defontana suma 1 UF.', src: 1 },
      { k: 'Dónde se vende', mo: MO.equipo, c: 'App móvil para iOS y Android.', src: 1 },
      { k: 'Venta sin internet', mo: MO.offline, c: 'Modo de venta sin internet ("SOS").', src: 1 },
      { k: 'Cobro con tarjeta', mo: MO.cobro, c: 'Transbank y Getnet, conectados a través de un PC con Windows.', src: 2 },
      { k: 'Stock de varias tiendas', mo: MO.red, c: 'Controla todas tus sucursales o tiendas en tiempo real.', src: 1 },
      { k: 'SAP Business One', mo: MO.sap, c: 'No lo menciona en su sitio; se integra con su propio ERP.', src: 1 },
      { k: 'Retail Pro', mo: MO.rpro, c: 'No lo menciona en su sitio.', src: 1 },
      { k: 'Facturación electrónica', mo: MO.dte, c: 'Nativa ante el SII.', src: 1 },
    ],
    fitMO: [
      'Necesitas seguir vendiendo y facturando aunque se caiga internet.',
      'Tu ERP es SAP Business One, Retail Pro o Retail Pro Prism y no quieres cambiarlo.',
      'Quieres facturar también sin conexión, no solo vender.',
      'Quieres cobrar desde el terminal de pago, sin un PC en el medio.',
      'Vendes en la sala con el stock de toda la red.',
    ],
    faqs: [
      { q: '¿Cuál es una alternativa a Tivendo si uso SAP Business One?', a: 'Mobile One es un POS móvil y caja de pago integrado a SAP Business One, Retail Pro y Retail Pro Prism, para retail en Chile y Perú.' },
      { q: '¿Cuánto cuesta Tivendo?', a: 'Según el sitio de Defontana (revisado en noviembre de 2026), en Chile desde 2 UF + IVA al mes, y la conexión con el ERP Defontana suma 1 UF.' },
      { q: '¿Cuánto cuesta Mobile One?', a: 'Depende de tu operación: número de tiendas, terminales e integraciones. Lo cotizamos en una demo de 30 minutos.' },
      { q: '¿Mobile One reemplaza mi ERP?', a: 'No. Mobile One se conecta a tu ERP y no lo reemplaza: consulta el stock y registra las ventas.' },
    ],
    sources: [
      { label: 'Defontana: POS Tivendo', url: 'https://www.defontana.com/cl/pos-tivendo' },
      { label: 'Defontana: integración con Getnet', url: 'https://intercom.help/defontanaerp/es/articles/13789703-integracion-con-getnet' },
      { label: 'Defontana: integración con Transbank', url: 'https://intercom.help/defontanaerp/es/articles/9212057-integracion-con-transbank' },
    ],
  },

  // ───────────────────────────── Lightspeed ─────────────────────────────
  {
    slug: 'alternativa-a-lightspeed',
    name: 'Lightspeed Retail',
    segment: 'POS internacional',
    card: 'Un POS hecho para Chile y Perú: SII, SUNAT y terminales locales.',
    seo: {
      title: 'Alternativa a Lightspeed Retail en Chile y Perú | Mobile One',
      description: 'Mobile One vs Lightspeed Retail: POS local para Chile y Perú, con boleta y comprobante electrónico, terminales Transbank, Getnet y Niubiz, e integración con SAP Business One.',
    },
    h1: 'Alternativa a Lightspeed Retail, hecha para Chile y Perú',
    lead: 'Lightspeed es un POS internacional para retail. En Chile y Perú opera a través de socios. Mobile One se construyó para estos dos mercados: documentos electrónicos locales, terminales locales y tu ERP.',
    summary: 'La diferencia principal es local: normativa, medios de pago y soporte.',
    highlights: [
      { title: 'Normativa local', text: 'Boleta y factura en Chile y comprobante electrónico en Perú, al cobrar.' },
      { title: 'Terminales locales', text: 'Transbank, Getnet, Mercado Pago y Niubiz.' },
      { title: 'Tu ERP', text: 'SAP Business One, Retail Pro y Retail Pro Prism.' },
      { title: 'Vende sin internet', text: 'Si se cae la conexión, Mobile One sigue vendiendo y facturando, y sincroniza al volver.' },
    ],
    verifiedAt: VERIFIED,
    rows: [
      { k: 'Pensado para', mo: MO.para, c: 'POS en la nube para retail, con presencia internacional.', src: 1 },
      { k: 'Países', mo: MO.paises, c: 'En Chile y Perú opera a través de socios.', src: 1 },
      { k: 'Precio publicado', mo: MO.precio, c: 'X-Series desde US$89 al mes (plan Basic).', src: 2 },
      { k: 'Cobro con tarjeta', mo: MO.cobro, c: 'No menciona Transbank, Getnet ni Niubiz en su sitio.', src: 1 },
      { k: 'SAP Business One', mo: MO.sap, c: 'No lo menciona en su sitio.', src: 2 },
      { k: 'Retail Pro', mo: MO.rpro, c: 'No lo menciona en su sitio.', src: 2 },
      { k: 'Facturación electrónica', mo: MO.dte, c: 'No menciona boleta SII ni comprobante SUNAT en su sitio.', src: 1 },
    ],
    fitMO: [
      'Necesitas seguir vendiendo y facturando aunque se caiga internet.',
      'Operas en Chile o Perú y necesitas boleta o comprobante electrónico local.',
      'Cobras con Transbank, Getnet, Mercado Pago o Niubiz.',
      'Tu ERP es SAP Business One, Retail Pro o Retail Pro Prism.',
    ],
    faqs: [
      { q: '¿Lightspeed funciona en Chile y Perú?', a: 'Según su sitio (revisado en noviembre de 2026), en Chile y Perú ofrece sus servicios a través de socios.' },
      { q: '¿Cuál es una alternativa local a Lightspeed?', a: 'Mobile One: POS móvil y caja de pago para retail en Chile y Perú, con documentos electrónicos locales, terminales locales e integración con SAP Business One y Retail Pro.' },
      { q: '¿Cuánto cuesta Mobile One?', a: 'Depende de tu operación: número de tiendas, terminales e integraciones. Lo cotizamos en una demo de 30 minutos.' },
    ],
    sources: [
      { label: 'Lightspeed México: presencia por socios', url: 'https://www.lightspeedhq.com/mx/' },
      { label: 'Lightspeed Retail: precios', url: 'https://www.lightspeedhq.com/pos/retail/pricing/' },
    ],
  },

  // ───────────────────────────── Shopify POS ─────────────────────────────
  {
    slug: 'alternativa-a-shopify-pos',
    name: 'Shopify POS',
    segment: 'Ecommerce con POS',
    card: 'Para retail físico que necesita boleta local y cobro con terminales locales.',
    seo: {
      title: 'Alternativa a Shopify POS para tiendas físicas en Chile | Mobile One',
      description: 'Mobile One vs Shopify POS: boleta electrónica nativa, cobro con Transbank, Getnet y Niubiz, stock de toda la red e integración con SAP Business One. Comparación con fuentes.',
    },
    h1: 'Alternativa a Shopify POS para tus tiendas físicas',
    lead: 'Shopify POS une la tienda física con Shopify. En Chile y Perú, la boleta electrónica y el cobro con tarjeta dependen de apps y proveedores externos. Mobile One trae ambos resueltos para retail físico.',
    summary: 'Shopify parte desde el ecommerce. Mobile One parte desde la tienda física y tu ERP.',
    highlights: [
      { title: 'Boleta incluida', text: 'Documento electrónico al cobrar, en Chile y Perú, sin apps adicionales.' },
      { title: 'Terminales locales', text: 'Transbank, Getnet, Mercado Pago y Niubiz. Shopify Payments no está disponible en Chile ni Perú.' },
      { title: 'Conectado a tu ERP', text: 'SAP Business One, Retail Pro y Retail Pro Prism.' },
      { title: 'Vende sin internet', text: 'Si se cae la conexión, Mobile One sigue vendiendo y facturando, y sincroniza al volver.' },
    ],
    verifiedAt: VERIFIED,
    rows: [
      { k: 'Pensado para', mo: MO.para, c: 'Marcas que venden en línea con Shopify y también en tienda física.', src: 1 },
      { k: 'Precio publicado', mo: MO.precio, c: 'POS Pro US$89 por local al mes (anual), más el plan de Shopify desde US$25.', src: 1 },
      { k: 'Cobro con tarjeta', mo: MO.cobro, c: 'Shopify Payments no está disponible en Chile ni Perú; requiere un proveedor de pagos externo.', src: 2 },
      { k: 'Facturación electrónica', mo: MO.dte, c: 'En Chile, la boleta SII requiere una app de terceros (p. ej., desde US$39,99 al mes).', src: 3 },
      { k: 'SAP Business One', mo: MO.sap, c: 'No lo menciona en su sitio.', src: 1 },
      { k: 'Retail Pro', mo: MO.rpro, c: 'No lo menciona en su sitio.', src: 1 },
    ],
    fitMO: [
      'Necesitas seguir vendiendo y facturando aunque se caiga internet.',
      'Tu negocio es principalmente de tiendas físicas.',
      'Quieres boleta electrónica y cobro con terminales locales sin apps extra.',
      'Tu ERP es SAP Business One, Retail Pro o Retail Pro Prism.',
    ],
    faqs: [
      { q: '¿Shopify POS emite boleta electrónica en Chile?', a: 'No de forma nativa: se hace con apps de terceros de su App Store (revisado en noviembre de 2026).' },
      { q: '¿Shopify Payments funciona en Chile o Perú?', a: 'Según el centro de ayuda de Shopify (revisado en noviembre de 2026), no está disponible en esos países y se necesita un proveedor de pagos externo.' },
      { q: '¿Cuánto cuesta Mobile One?', a: 'Depende de tu operación: número de tiendas, terminales e integraciones. Lo cotizamos en una demo de 30 minutos.' },
    ],
    sources: [
      { label: 'Shopify Chile: precios de POS', url: 'https://www.shopify.com/cl/pos/precios' },
      { label: 'Shopify: países con Shopify Payments', url: 'https://help.shopify.com/en/manual/payments/shopify-payments/supported-countries' },
      { label: 'Shopify App Store: e-Boletas DTE Chile SII (tercero)', url: 'https://apps.shopify.com/e-boleta' },
    ],
  },

  // ───────────────────────────── Toteat ─────────────────────────────
  // Mobile One para gastronomía (integración TCPOS) está EN DESARROLLO. La página es honesta al
  // respecto y va con noindex hasta el lanzamiento: quitar `noindex` cuando exista la versión.
  {
    slug: 'alternativa-a-toteat',
    name: 'Toteat',
    noindex: true,
    segment: 'Restaurantes',
    card: 'Para cadenas con tiendas y locales de comida: Mobile One para gastronomía, en desarrollo.',
    seo: {
      title: 'Alternativa a Toteat para cadenas de retail y gastronomía | Mobile One',
      description: 'Mobile One vs Toteat: qué ofrece cada uno hoy. Toteat es software para restaurantes; Mobile One es POS para retail y prepara su versión para gastronomía.',
    },
    h1: 'Alternativa a Toteat: retail hoy, gastronomía muy pronto',
    lead: 'Toteat es un software para restaurantes. Mobile One es un punto de venta para retail y estamos desarrollando su versión para gastronomía. Si tu grupo opera tiendas y locales de comida, conversemos.',
    summary: 'Hoy resuelven cosas distintas. Esto es lo que hace cada uno.',
    highlights: [
      { title: 'Retail, hoy', text: 'POS móvil, caja de pago, pasillo infinito e integración con SAP Business One y Retail Pro.' },
      { title: 'Gastronomía, en desarrollo', text: 'Estamos construyendo la versión de Mobile One para restaurantes.' },
      { title: 'Un solo proveedor', text: 'Pensado para grupos que operan tiendas y locales de comida.' },
      { title: 'Vende sin internet', text: 'Si se cae la conexión, Mobile One sigue vendiendo y facturando, y sincroniza al volver.' },
    ],
    verifiedAt: VERIFIED,
    rows: [
      { k: 'Pensado para', mo: 'Retail con varias tiendas. Versión para gastronomía en desarrollo.', c: 'Restaurantes, dark kitchens, bares y cafeterías, incluidas cadenas y franquicias.', src: 1 },
      { k: 'Países', mo: MO.paises, c: 'Chile, Argentina, Colombia, Perú y México.', src: 1 },
      { k: 'Precio publicado', mo: MO.precio, c: 'Desde $39.900 al mes más 0,7% + IVA de la venta neta (plan Básico).', src: 2 },
      { k: 'Equipos', mo: MO.equipo, c: 'Tablets, pantalla de cocina, kiosco de autoatención y cobro en la mesa.', src: 1 },
      { k: 'SAP Business One', mo: MO.sap, c: 'No lo menciona en su sitio; menciona sistemas contables.', src: 1 },
      { k: 'Facturación electrónica', mo: MO.dte, c: 'Emite boleta y factura electrónica.', src: 1 },
    ],
    fitMO: [
      'Necesitas seguir vendiendo y facturando aunque se caiga internet.',
      'Tu operación principal es retail con varias tiendas.',
      'Tu grupo tiene tiendas y locales de comida y quiere un solo proveedor a futuro.',
      'Trabajas con SAP Business One o Retail Pro.',
    ],
    faqs: [
      { q: '¿Mobile One sirve hoy para restaurantes?', a: 'Todavía no. Mobile One es un punto de venta para retail y estamos desarrollando su versión para gastronomía. Si te interesa, agenda una conversación.' },
      { q: '¿Cuánto cuesta Toteat?', a: 'Según su sitio (revisado en noviembre de 2026), el plan Básico cuesta $39.900 al mes más 0,7% + IVA de la venta neta.' },
      { q: '¿Para quién es Mobile One?', a: 'Para retail con varias tiendas en Chile y Perú: moda, electrónica, multitienda y retail con ERP.' },
    ],
    sources: [
      { label: 'Toteat: sitio oficial', url: 'https://www.toteat.com/' },
      { label: 'Toteat: precios', url: 'https://www.toteat.com/precios' },
    ],
  },
];
