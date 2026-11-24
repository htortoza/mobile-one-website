// src/data/industrias.js
// Contenido de las páginas /recursos/industrias/{slug}. Cada rubro cuenta SU historia
// con las capacidades reales del producto (ver /producto y la propuesta comercial).
// Los datos dentro de la tarjeta "ticket" del hero son ficticios (solo ilustran la pantalla).
// Sin cifras inventadas: las únicas métricas son las ya publicadas (100+ tiendas, menos de una semana, Chile y Perú).

export const industrias = [
  {
    slug: 'moda-y-calzado',
    ctaTitle: 'Mobile One en tus tiendas de moda y calzado',
    name: 'Moda y calzado',
    short: 'La talla y el color justos, aunque estén en otra tienda.',
    seo: {
      title: 'POS móvil para tiendas de moda y calzado | Mobile One',
      description: 'Vende la talla y el color que el cliente quiere, aunque estén en otra tienda. POS móvil con stock de toda la red, promociones y cambios. Chile y Perú.',
    },
    eyebrow: 'Moda y calzado',
    h1: 'Vende la talla que quiere tu cliente, esté donde esté',
    lead: 'En moda y calzado el cliente se decide en el probador. Con Mobile One tu vendedor ve el stock de toda la red desde el terminal, cobra ahí mismo y cierra la venta aunque la talla esté en otra tienda.',
    image: '/images/solucion-fila.webp',
    imageAlt: 'Vendedora cobrando con el terminal Mobile One en una tienda de ropa',
    ticket: {
      store: 'Tienda Providencia',
      items: [
        { name: 'Zapatilla Urban Run', meta: 'Talla 38 · Negro', tag: 'Otra tienda · retiro jueves', tone: 'net' },
        { name: 'Polera básica', meta: 'Talla M · Blanco', tag: 'En esta tienda', tone: 'here' },
        { name: 'Calcetines pack x3', meta: 'Única · Gris', tag: 'Promoción aplicada', tone: 'promo' },
      ],
      total: '$119.970',
      float: 'Talla 38 disponible en 3 tiendas',
    },
    pains: [
      { now: 'La talla no está en la tienda y el cliente se va.', then: 'El pasillo infinito muestra el stock de otras sucursales y bodegas. La venta se hace igual: retiro en otra tienda o despacho a domicilio.' },
      { now: 'En hora punta la fila de la caja decide por el cliente.', then: 'Cobras en el pasillo o en el probador, con el terminal de pago que ya usas, sin pasar por la caja.' },
      { now: 'Un cambio o una devolución toma más de la cuenta.', then: 'Buscas la venta por folio, RUT o fecha, reimprimes el documento y generas el ticket de cambio desde el mismo terminal.' },
    ],
    dayTitle: 'Un sábado en tu tienda de moda',
    day: [
      { time: '09:00', title: 'Abres turno', text: 'El vendedor escanea su credencial y el QR de la tienda. En segundos está operando.', mod: 'Ingreso por QR' },
      { time: '11:30', title: 'Llega una clienta', text: 'Busca la zapatilla, revisa tallas y colores y ve cuántas hay en cada tienda, sin ir a la bodega.', mod: 'Catálogo y stock en línea' },
      { time: '11:34', title: 'La talla está en otra tienda', text: 'No se pierde la venta: la deja con retiro programado en la tienda que le acomode, o despachada a su casa.', mod: 'Pasillo infinito' },
      { time: '12:10', title: 'Cobras con promoción', text: 'La promoción se aplica sola, el pago puede ser mixto y la boleta sale al instante.', mod: 'Promociones y cobro' },
      { time: '16:00', title: 'Llega mercadería', text: 'Se escanean los bultos, se cuadran las cantidades y el stock se actualiza para toda la red.', mod: 'Recepción' },
    ],
    modules: [
      { name: 'POS móvil', text: 'Consulta, vende, cobra y emite el documento sin salir del pasillo.' },
      { name: 'Pasillo infinito', text: 'Nunca te quedas sin stock: lo que falta aquí, está en otra sucursal.' },
      { name: 'Promociones', text: 'Descuentos y packs que se aplican automáticamente al armar la venta.' },
      { name: 'Postventa', text: 'Cambios y devoluciones con autorización, desde el terminal.' },
    ],
    faqs: [
      { q: '¿Puedo vender una talla que no está en mi tienda?', a: 'Sí. El vendedor ve el stock de las otras sucursales y bodegas, y deja la venta con retiro en otra tienda o con despacho a domicilio, todo en la misma transacción.' },
      { q: '¿Sirve para varias tiendas de una misma marca?', a: 'Sí. Todas las tiendas operan sobre una misma plataforma y comparten el stock. El panel de control muestra lo que pasó en cada una.' },
      { q: '¿Tengo que cambiar mi terminal de pago?', a: 'No. Mobile One opera sobre el terminal que ya usas, con Transbank, Getnet, Mercado Pago o Niubiz.' },
    ],
  },
  {
    slug: 'electronica-y-tecnologia',
    ctaTitle: 'Mobile One en tus tiendas de electrónica y tecnología',
    name: 'Electrónica y tecnología',
    short: 'Productos de alto valor, con stock exacto y cobro sin vueltas.',
    seo: {
      title: 'POS móvil para tiendas de electrónica y tecnología | Mobile One',
      description: 'Stock exacto, venta asistida y cobro con pagos divididos para tiendas de electrónica y tecnología. POS móvil y caja integrados a tu ERP. Chile y Perú.',
    },
    eyebrow: 'Electrónica y tecnología',
    h1: 'Cada venta de alto valor, con el stock exacto y el cobro listo',
    lead: 'En electrónica el cliente compara, pregunta y decide con calma. Tu vendedor lo acompaña con el stock real en la mano, divide el pago en varias tarjetas y emite el documento al instante.',
    image: '/images/solucion-stock.webp',
    imageAlt: 'Vendedor consultando el stock de toda la red desde el terminal Mobile One',
    ticket: {
      store: 'Tienda Mall Plaza',
      items: [
        { name: 'Notebook 14 pulgadas', meta: '16 GB · 512 GB', tag: 'Stock validado en línea', tone: 'here' },
        { name: 'Audífonos inalámbricos', meta: 'Negro', tag: 'Despacho a domicilio', tone: 'net' },
        { name: 'Cargador USB-C', meta: '65 W', tag: 'En esta tienda', tone: 'here' },
      ],
      total: '$1.189.970',
      float: 'Pago dividido en 2 tarjetas',
    },
    pains: [
      { now: 'El sistema dice que hay stock y en la góndola no está.', then: 'El stock se valida en línea al agregar cada producto, así que el vendedor promete solo lo que hay.' },
      { now: 'Los tickets altos se pagan con más de una tarjeta y la caja se complica.', then: 'Pago mixto: varias tarjetas, o efectivo más tarjeta, con cálculo automático del vuelto y el monto directo al terminal.' },
      { now: 'El equipo grande no se lo lleva el cliente ese día.', then: 'Retiro programado en otra tienda o despacho a domicilio, con seguimiento por cada despacho.' },
    ],
    dayTitle: 'Un día de ventas en tu tienda de tecnología',
    day: [
      { time: '10:00', title: 'Abres turno', text: 'Credencial y QR de la tienda. El vendedor queda listo para atender.', mod: 'Ingreso por QR' },
      { time: '12:15', title: 'El cliente compara', text: 'El vendedor muestra modelos, variantes y disponibilidad real, sin pedir ayuda a bodega.', mod: 'Catálogo y stock en línea' },
      { time: '12:40', title: 'Venta asistida', text: 'Si el modelo no está en la tienda, lo ve en otra sucursal y lo deja con retiro o despacho.', mod: 'Pasillo infinito' },
      { time: '12:55', title: 'Pago dividido', text: 'El cliente paga con dos tarjetas. El cobro llega directo al terminal y la boleta o factura se emite al aprobar.', mod: 'Cobro sin re-digitar' },
      { time: '17:30', title: 'Cierre con datos', text: 'El encargado revisa en el panel todo lo vendido en el turno, sin pedir reportes.', mod: 'Panel de control' },
    ],
    modules: [
      { name: 'Stock real en línea', text: 'Validado al agregar cada producto, para no prometer lo que no hay.' },
      { name: 'Cobro sin re-digitar', text: 'Monto directo al terminal, pago mixto y varias tarjetas.' },
      { name: 'Retiro y despacho', text: 'Retiro en otra tienda o envío a domicilio, con seguimiento.' },
      { name: 'Documentos electrónicos', text: 'Boleta o factura al instante, integrada a tu facturador.' },
    ],
    faqs: [
      { q: '¿Se puede pagar una compra con varias tarjetas?', a: 'Sí. Mobile One soporta pagos mixtos: efectivo más tarjeta, o dos tarjetas distintas, con cálculo automático del vuelto.' },
      { q: '¿Cómo evito vender un producto que no está?', a: 'El stock se valida en línea cada vez que se agrega un producto a la venta, y se sincroniza con tu ERP.' },
      { q: '¿Emite factura además de boleta?', a: 'Sí. El documento electrónico sale al cobrar, desde el POS móvil o la caja: boleta o factura en Chile y comprobante electrónico en Perú.' },
    ],
  },
  {
    slug: 'multitienda-y-holdings',
    ctaTitle: 'Mobile One para toda tu red de tiendas',
    name: 'Multitienda y holdings',
    short: 'Muchas tiendas, una sola plataforma y el control en tus manos.',
    seo: {
      title: 'POS para multitienda y holdings de retail | Mobile One',
      description: 'Gestiona todas tus tiendas y empresas sobre una misma plataforma: stock en red, usuarios con perfiles y funciones por cliente. Chile y Perú. Pide tu demo.',
    },
    eyebrow: 'Multitienda y holdings',
    h1: 'Una red de tiendas, una sola plataforma',
    lead: 'Cuando creces, cada tienda empieza a funcionar como una isla. Mobile One conecta el stock, los usuarios y las ventas de toda la red, y le da a tu equipo central el control sin frenar a las tiendas.',
    image: '/images/solucion-backoffice.webp',
    imageAlt: 'Encargada revisando las ventas de la red de tiendas en un panel web',
    ticket: {
      store: 'Red de 12 tiendas',
      items: [
        { name: 'Tienda Providencia', meta: 'Ventas de hoy', tag: 'Sincronizada', tone: 'here' },
        { name: 'Tienda Mall Plaza', meta: 'Ventas de hoy', tag: 'Sincronizada', tone: 'here' },
        { name: 'Tienda Lima Centro', meta: 'Ventas de hoy', tag: 'Sincronizada', tone: 'here' },
      ],
      total: 'Una sola fuente de verdad',
      float: 'Stock de toda la red, en línea',
    },
    pains: [
      { now: 'Cada tienda ve solo su stock y las ventas se pierden entre sucursales.', then: 'El pasillo infinito pone el stock de todas las sucursales, bodegas y centros de distribución a un toque del vendedor.' },
      { now: 'No hay forma simple de saber quién hizo qué.', then: 'Usuarios con perfiles, credenciales QR con vigencia y trazabilidad de cada transacción. Nada se borra: todo queda para auditoría.' },
      { now: 'Cada tienda necesita algo distinto y el desarrollo a medida es lento.', then: 'Activas o desactivas funcionalidades por cliente y por tienda, sin tocar código ni afectar a los demás.' },
    ],
    dayTitle: 'Un lunes en tu operación central',
    day: [
      { time: '08:30', title: 'Revisas la red', text: 'Abres el panel y ves lo que pasó en cada tienda, con el detalle de cada venta y su documento.', mod: 'Panel de control' },
      { time: '10:00', title: 'Alta de un vendedor', text: 'Creas el usuario, defines su perfil y su credencial QR con vigencia. Queda listo para operar.', mod: 'Usuarios y perfiles' },
      { time: '11:30', title: 'Activas una función', text: 'Una tienda piloto prueba una funcionalidad nueva. El resto de la red no se entera.', mod: 'Funciones por cliente' },
      { time: '15:00', title: 'Precios por sucursal', text: 'Las listas de precio se manejan por sucursal o por cliente, sincronizadas con tu ERP.', mod: 'Cliente y precios' },
      { time: '18:00', title: 'Auditas sin buscar', text: 'Una incidencia queda marcada pero conservada. Tienes la trazabilidad completa.', mod: 'Trazabilidad' },
    ],
    modules: [
      { name: 'Pasillo infinito', text: 'Stock de sucursales, bodegas y centros de distribución.' },
      { name: 'Usuarios y perfiles', text: 'Roles, credenciales QR con vigencia y trazabilidad.' },
      { name: 'Funciones por cliente', text: 'Activa lo que cada operación necesita, sin desarrollos a medida.' },
      { name: 'Panel de control', text: 'Todo lo que pasó en la red, en un solo lugar.' },
    ],
    faqs: [
      { q: '¿Puedo manejar varias empresas bajo un mismo holding?', a: 'Sí. Mobile One organiza empresas y tiendas bajo un holding, con perfiles y permisos para cada tipo de usuario.' },
      { q: '¿Cómo controlo lo que hace cada usuario?', a: 'Cada usuario tiene un perfil y una credencial QR con vigencia. Las transacciones quedan trazadas y nada se borra: las incidencias se conservan para auditoría.' },
      { q: '¿Puedo activar funciones solo en algunas tiendas?', a: 'Sí. Las funcionalidades se activan por cliente, sin tocar código y sin afectar a los demás. Todos reciben cada mejora al mismo tiempo.' },
    ],
  },
  {
    slug: 'retail-con-erp',
    ctaTitle: 'Mobile One conectado a tu ERP',
    name: 'Retail con ERP',
    short: 'Tu ERP sabe todo. Ahora la tienda también.',
    seo: {
      title: 'POS integrado a tu ERP: SAP y Retail Pro | Mobile One',
      description: 'Conecta la tienda con tu ERP en tiempo real: SAP Business One, Retail Pro o Retail Pro Prism. Sin doble digitación y con el stock al día. Chile y Perú.',
    },
    eyebrow: 'Retail con ERP',
    h1: 'Tu ERP sabe todo. Ahora la tienda también',
    lead: 'Tu negocio ya corre sobre SAP Business One o Retail Pro. Pero el mostrador, el pasillo y la bodega siguen lejos de esos sistemas. Mobile One los conecta en tiempo real, sin reemplazar nada.',
    image: '/images/recepcion-documento.webp',
    imageAlt: 'Trabajadora comparando el documento de recepción de su ERP con el bulto que escanea con el terminal Mobile One',
    ticket: {
      store: 'Sincronización con tu ERP',
      items: [
        { name: 'Stock por tienda y almacén', meta: 'Consulta en línea', tag: 'Desde tu ERP', tone: 'net' },
        { name: 'Venta de hoy', meta: 'Boleta emitida', tag: 'Registrada en tu ERP', tone: 'here' },
        { name: 'Recepción de mercadería', meta: 'Traspaso en tránsito', tag: 'Cuadrada con la orden', tone: 'promo' },
      ],
      total: '0 doble digitación',
      float: '100% de las ventas registradas',
    },
    pains: [
      { now: 'Las ventas de la tienda se digitan otra vez en el ERP.', then: 'La venta se registra en tu sistema al cobrar. Cero doble digitación y el 100% de las ventas quedan en tu ERP.' },
      { now: 'El stock del ERP no coincide con el de la tienda.', then: 'Mobile One consulta el stock directo a tu ERP y lo sincroniza, de modo que el vendedor ve lo mismo que tu back office.' },
      { now: 'Recibir mercadería es contar a mano y cuadrar después.', then: 'La recepción se vincula al documento de transferencia del ERP, que trae lo que debería venir. Escaneas cada bulto con la cámara o el infrarrojo del terminal, cuadras cantidades y emites el comprobante.' },
    ],
    dayTitle: 'Un día con tu ERP conectado a la tienda',
    day: [
      { time: '09:00', title: 'La tienda abre sincronizada', text: 'Tiendas, artículos, clientes y catálogo ya vienen de tu ERP. No hay que cargar nada a mano.', mod: 'Maestros centralizados' },
      { time: '12:00', title: 'Se vende y se registra', text: 'El vendedor cobra en el pasillo y la venta queda registrada en tu sistema, con su documento.', mod: 'Venta registrada' },
      { time: '14:30', title: 'El stock se mueve', text: 'Cada venta descuenta stock y todas las tiendas ven el dato actualizado.', mod: 'Stock en línea' },
      { time: '16:00', title: 'Llega un traspaso', text: 'Se recibe contra el documento de tránsito del ERP, escaneando cada bulto con la cámara o el infrarrojo del terminal.', mod: 'Recepción' },
      { time: '19:00', title: 'Cierras sin conciliar', text: 'Lo que ves en el panel es lo que tiene tu ERP. No hay planillas paralelas.', mod: 'Panel de control' },
    ],
    modules: [
      { name: 'SAP Business One', text: 'Consulta de stock y registro de ventas sobre tu SAP.', href: '/integraciones/erp/sap-business-one' },
      { name: 'Retail Pro', text: 'Mobile One opera sobre tu Retail Pro.', href: '/integraciones/erp/retail-pro' },
      { name: 'Retail Pro Prism', text: 'Compatible también con Retail Pro Prism.', href: '/integraciones/erp/retail-pro-prism' },
      { name: 'Facturación electrónica', text: 'El documento de cada país sale al cobrar.', href: '/integraciones/facturacion' },
    ],
    faqs: [
      { q: '¿Con qué ERP se integra Mobile One?', a: 'Con SAP Business One, Retail Pro y Retail Pro Prism. Cada uno tiene su propia página con el detalle.' },
      { q: '¿Tengo que reemplazar mi ERP o mi POS?', a: 'No. Mobile One no reemplaza tus sistemas: los conecta con el mostrador, el pasillo y la bodega.' },
      { q: '¿Cuánto toma implementarlo?', a: 'Menos de una semana, sobre lo que ya tienes.' },
    ],
  },
];

export const bySlug = (slug) => industrias.find((i) => i.slug === slug);
