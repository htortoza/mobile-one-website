// src/data/soluciones.js — Páginas por necesidad (/soluciones/{slug}). Búsquedas genéricas de alta
// intención ("pos para sap business one", "pos móvil retail", "pos tienda de ropa").
// REGLA: solo afirmaciones que el sitio ya publica (producto, integraciones, industrias). Nada de
// cifras nuevas. Si hace falta un dato que no existe, se marca DATO PENDIENTE y no se publica.

export const soluciones = [
  {
    slug: 'pos-para-sap-business-one',
    name: 'POS para SAP Business One',
    card: 'Punto de venta móvil y caja conectados a SAP Business One, sin doble digitación.',
    seo: {
      title: 'POS para SAP Business One en Chile y Perú | Mobile One',
      description: 'Punto de venta móvil y caja de pago integrados a SAP Business One: stock en línea, ventas registradas en el ERP y recepción de mercadería. Implementación en menos de una semana.',
    },
    h1: 'El punto de venta para tu retail con SAP Business One',
    lead: 'Mobile One conecta la sala de venta, la caja y la bodega con SAP Business One. Consulta el stock, registra cada venta en el ERP y cuadra la mercadería, sin reemplazar nada.',
    painsTitle: 'Si tu retail corre sobre SAP Business One, esto te suena',
    pains: [
      'Las ventas de la tienda se vuelven a digitar en el ERP.',
      'El stock que ve el vendedor no coincide con el de SAP Business One.',
      'Recibir mercadería es contar a mano y cuadrar después contra la orden.',
      'Cada tienda carga sus maestros por separado.',
    ],
    featuresTitle: 'Qué hace Mobile One con tu SAP Business One',
    features: [
      { title: 'Stock desde el ERP', text: 'El vendedor consulta en el terminal la disponibilidad real que tiene SAP Business One, de su tienda y de toda la red.' },
      { title: 'Venta registrada al cobrar', text: 'La venta se integra a SAP Business One al momento, sin que nadie la digite de nuevo.' },
      { title: 'Recepción contra la orden', text: 'Escaneas cada bulto con la cámara o el infrarrojo del terminal y lo cuadras contra el documento del ERP.' },
      { title: 'Maestros sincronizados', text: 'Tiendas, artículos, clientes y usuarios vienen de tu ERP y se gestionan en un panel sincronizado.' },
      { title: 'Documento electrónico', text: 'Boleta o factura en Chile y comprobante electrónico en Perú, emitidos al cobrar.' },
      { title: 'Tu terminal de pago', text: 'Cobra con Transbank, Getnet, Mercado Pago o Niubiz, según tu país.' },
      { title: 'Vende sin internet', text: 'Si se cae la conexión, sigues vendiendo y facturando; todo se sincroniza al volver.' },
    ],
    steps: [
      { title: 'Conectamos tu ERP', text: 'Mobile One se integra a SAP Business One sin cambiar tus reglas de negocio: el ERP sigue siendo la fuente de verdad.' },
      { title: 'Cargamos tus tiendas', text: 'Tiendas, artículos, clientes y usuarios se sincronizan desde el ERP.' },
      { title: 'Vendes', text: 'Tu equipo vende y cobra desde el POS móvil o la caja. Todo en menos de una semana.' },
    ],
    faqs: [
      { q: '¿Mobile One reemplaza a SAP Business One?', a: 'No. Mobile One se conecta a tu ERP y no lo reemplaza: consulta el stock y registra las ventas.' },
      { q: '¿Qué información se sincroniza con SAP Business One?', a: 'El stock, las ventas y los maestros de tiendas, artículos, clientes y usuarios.' },
      { q: '¿Funciona en Chile y en Perú?', a: 'Sí. El ERP se integra igual; cambia el documento electrónico según la normativa de cada país.' },
      { q: '¿Cuánto demora la implementación?', a: 'La implementación completa toma menos de una semana.' },
      { q: '¿También funciona con otros ERP?', a: 'Sí. Mobile One también se integra con Retail Pro y Retail Pro Prism.' },
    ],
    related: [
      { title: 'Integración con SAP Business One', text: 'El detalle técnico de cómo se conectan.', href: '/integraciones/erp/sap-business-one' },
      { title: 'Retail con ERP', text: 'Un día en una tienda con el ERP conectado.', href: '/recursos/industrias/retail-con-erp' },
    ],
    ctaTitle: '¿Lo vemos con tu SAP Business One?',
  },
  {
    slug: 'pos-movil-para-retail',
    name: 'POS móvil para retail',
    card: 'Vende y cobra en la sala, con el stock de toda tu red en la mano.',
    seo: {
      title: 'POS móvil para retail: vende y cobra en la sala | Mobile One',
      description: 'POS móvil para tiendas: el vendedor ve el stock de toda la red, cobra con tu terminal de pago y emite la boleta al instante. Pasillo infinito y promociones automáticas. Chile y Perú.',
    },
    h1: 'Un POS móvil para vender donde está el cliente',
    lead: 'Con Mobile One tu vendedor consulta, vende y cobra en el pasillo, con el terminal de pago que ya usas. Sin filas y sin decirle que no al cliente cuando falta stock.',
    painsTitle: 'Lo que pierdes cuando todo pasa por la caja',
    pains: [
      'Clientes que se van por la fila para pagar.',
      'Ventas que se pierden porque el vendedor no sabe si hay stock en otra tienda.',
      'Promociones que se calculan a mano en la caja.',
      'Horas contando cajas cuando llega mercadería.',
    ],
    featuresTitle: 'Qué hace el POS móvil de Mobile One',
    features: [
      { title: 'Acceso rápido por QR', text: 'El vendedor escanea su credencial y el QR de la tienda, y empieza a operar en segundos.' },
      { title: 'Catálogo y stock en línea', text: 'Busca por nombre o código, con variantes, precio y el stock de su tienda y de toda la red.' },
      { title: 'Pasillo infinito', text: 'Si falta en la tienda, el cliente lo retira en otra o lo recibe en su casa.' },
      { title: 'Promociones automáticas', text: 'Descuentos por cliente, categoría, marca o ticket, aplicados al cobrar.' },
      { title: 'Cobro sin fricción', text: 'Pagos mixtos, vuelto automático y cobro con Transbank, Getnet, Mercado Pago o Niubiz.' },
      { title: 'Documento al instante', text: 'Boleta o factura apenas se aprueba el pago, integrada a tu facturador.' },
      { title: 'Vende sin internet', text: 'Si se cae la conexión, sigues vendiendo y facturando; todo se sincroniza al volver.' },
    ],
    steps: [
      { title: 'Conectamos tu operación', text: 'Tu catálogo, tus tiendas y tu ERP, si tienes uno (SAP Business One, Retail Pro o Retail Pro Prism).' },
      { title: 'Activamos los terminales', text: 'Mobile One cobra con el terminal de pago que ya usas.' },
      { title: 'Tu equipo vende', text: 'Implementación completa en menos de una semana, con acompañamiento desde el primer día.' },
    ],
    faqs: [
      { q: '¿Necesito comprar terminales nuevos?', a: 'Mobile One cobra con el terminal de pago que ya usas: Transbank, Getnet o Mercado Pago en Chile, y Niubiz o Mercado Pago en Perú.' },
      { q: '¿Qué pasa si el producto no está en la tienda?', a: 'El vendedor ve el stock de toda la red y cierra la venta igual, con retiro en otra tienda o despacho a domicilio.' },
      { q: '¿También tienen caja fija?', a: 'Sí. La caja fija con pantalla táctil funciona en el mostrador sin necesidad del POS móvil, sobre la misma plataforma y pensada para el manejo de efectivo.' },
      { q: '¿Funciona sin internet?', a: 'Sí. Mobile One sigue vendiendo y facturando sin conexión, y sincroniza todo cuando vuelve.' },
      { q: '¿En qué países funciona?', a: 'En Chile y Perú.' },
    ],
    related: [
      { title: 'Producto', text: 'Todos los módulos, del terminal al panel.', href: '/producto' },
      { title: 'Medios de pago', text: 'Transbank, Getnet, Mercado Pago y Niubiz.', href: '/integraciones/medios-de-pago' },
    ],
    ctaTitle: '¿Lo pruebas en tu sala de venta?',
  },
  {
    slug: 'pos-para-tiendas-de-ropa',
    name: 'POS para tiendas de ropa',
    card: 'Tallas y colores de toda la red, promociones solas y cambios desde el terminal.',
    seo: {
      title: 'POS para tiendas de ropa y calzado | Mobile One',
      description: 'Punto de venta para moda y calzado: el vendedor ve tallas y colores de toda la red, vende aunque la talla esté en otra tienda, aplica promociones solas y gestiona cambios. Chile y Perú.',
    },
    h1: 'El punto de venta para tiendas de ropa y calzado',
    lead: 'En moda el cliente se decide en el probador. Con Mobile One tu vendedor ve el stock de toda la red desde el terminal, cobra ahí mismo y cierra la venta aunque la talla esté en otra tienda.',
    painsTitle: 'Lo que pasa hoy en una tienda de moda',
    pains: [
      'La talla no está y el cliente se va sin comprar.',
      'El vendedor va a la bodega a buscar colores que no sabe si existen.',
      'Las promociones de temporada se calculan a mano.',
      'Los cambios y devoluciones arman fila en la caja.',
    ],
    featuresTitle: 'Qué hace Mobile One en tu tienda de moda',
    features: [
      { title: 'Tallas y colores de toda la red', text: 'El vendedor ve cuántas unidades hay en cada tienda, sin ir a la bodega.' },
      { title: 'Pasillo infinito', text: 'Si la talla está en otra tienda, la venta queda con retiro programado o despacho a domicilio.' },
      { title: 'Promociones', text: 'Descuentos y packs que se aplican automáticamente al armar la venta.' },
      { title: 'Postventa', text: 'Cambios y devoluciones con autorización, desde el terminal.' },
      { title: 'Recepción por bulto', text: 'Se escanean los bultos, se cuadran las cantidades y el stock se actualiza para toda la red.' },
      { title: 'Cobro y boleta', text: 'Pago mixto y boleta al instante, con el terminal de pago que ya usas.' },
      { title: 'Vende sin internet', text: 'Si se cae la conexión, sigues vendiendo y facturando; todo se sincroniza al volver.' },
    ],
    steps: [
      { title: 'Conectamos tu catálogo', text: 'Artículos con sus variantes de talla y color, y el stock de cada tienda.' },
      { title: 'Activamos tus tiendas', text: 'El vendedor ingresa con QR y opera desde el primer turno.' },
      { title: 'Vendes en el probador', text: 'Implementación completa en menos de una semana.' },
    ],
    faqs: [
      { q: '¿Puedo vender una talla que no está en mi tienda?', a: 'Sí. El vendedor la ve en otra tienda y deja la venta con retiro programado o despacho a domicilio.' },
      { q: '¿Las promociones se aplican solas?', a: 'Sí. Descuentos y packs se aplican automáticamente al armar la venta; el vendedor no calcula nada a mano.' },
      { q: '¿Se pueden hacer cambios y devoluciones?', a: 'Sí, con autorización y desde el mismo terminal.' },
      { q: '¿Se integra a mi ERP?', a: 'Sí, con SAP Business One, Retail Pro y Retail Pro Prism.' },
    ],
    related: [
      { title: 'Moda y calzado', text: 'Un día en una tienda de moda con Mobile One.', href: '/recursos/industrias/moda-y-calzado' },
      { title: 'Producto', text: 'Todos los módulos, del terminal al panel.', href: '/producto' },
    ],
    ctaTitle: '¿Lo vemos con tu catálogo de temporada?',
  },
];
