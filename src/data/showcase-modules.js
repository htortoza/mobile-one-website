// src/data/showcase-modules.js
// Los módulos principales y la caja de pago: texto y dispositivo de cada uno. Lo usan la Home y /producto.
export const showcaseModules = [
      { key: 'pos-movil', name: 'POS móvil', tag: 'En sala', device: 'phone', shot: 'medium', screen: 'pos', headline: 'Vende y cobra donde está el cliente.', text: 'El vendedor ve el stock de toda tu red y cobra con el terminal de pago que ya usas.', points: ['Ingreso rápido con QR', 'Pasillo infinito: stock local y de toda la red', 'Cobro con tu terminal Transbank, Getnet o Mercado Pago'] },
      { key: 'medicion', name: 'Medición', tag: 'Panel de control', device: 'laptop', headline: 'Tu operación, en cinco vistas.', text: 'Ventas, tiendas y vendedores en un panel web sincronizado con tu ERP.', points: ['Ventas en vivo', 'Documentos y kardex', 'Turnos y cajas por tienda'] },
      { key: 'facturacion', name: 'Facturación electrónica', tag: 'Documentos', device: 'phone', shot: 'far', screen: 'factura', headline: 'Boleta o factura al instante.', text: 'El documento se emite al cobrar y la venta queda integrada a tu ERP.', points: ['Boleta y factura electrónica', 'Descuentos visibles antes de cobrar', 'Pagos mixtos'] },
      { key: 'recepcion', name: 'Recepción de mercadería', tag: 'Bodega', device: 'phone', shot: 'close', screen: 'recepcion', headline: 'Un escaneo por bulto.', text: 'Cuadra el contenido contra el documento de tu ERP, escaneando con la cámara o el infrarrojo del mismo terminal.', points: ['Cámara e infrarrojo del propio terminal', 'Cuadratura con el ERP', 'El equipo recupera horas de conteo'] },
      { key: 'promociones', name: 'Promociones y cupones', tag: 'Comercial', device: 'phoneL', shot: 'closeL', screen: 'promos', headline: 'Las promociones se aplican solas.', text: 'Reglas por cliente, categoría, marca o ticket, aplicadas al cobrar. El vendedor no calcula nada a mano.', points: ['Descuentos automáticos al cobrar', 'Cupones', 'Conectado a tu motor de promociones'] },
      { key: 'caja', name: 'Caja de pago', tag: 'Nuevo', device: 'caja', headline: 'Otro punto de venta, para el mostrador.', text: 'Equipo POS 15" todo en uno con la misma plataforma, pensado para el manejo de efectivo.', points: ['Cierres de caja para resguardar el efectivo', 'Impresoras: boleta, comandas y ticket de cambio', 'Balanza para venta a granel y lector de código de barras'] },
    ];

// Otros módulos del panel y del terminal (los más relevantes). La plataforma tiene más de 15 en total:
// el panel de control lista Métricas, Ventas, Ventas en vivo, Cajas, Documentos pendientes, Tiendas, Artículos,
// Recepción de mercadería, Kardex, Clientes, Usuarios, Releases, Funcionalidades, Métodos de pago, Listas de precio,
// Impuestos, Servicio de pagos y Promociones. Aquí van los que más pesan en la operación diaria.
export const moreModules = [
  { name: 'Ventas en vivo', text: 'Cada venta de la red, apenas ocurre.' },
  { name: 'Cajas', text: 'Apertura y cierre de caja, por tienda.' },
  { name: 'Documentos pendientes', text: 'Los documentos que aún no se integran a tu ERP, a la vista.' },
  { name: 'Kardex', text: 'El movimiento de stock de cada artículo.' },
  { name: 'Listas de precio', text: 'Precios por sucursal o por cliente.' },
  { name: 'Usuarios y perfiles', text: 'Perfiles, credenciales QR y vigencia.' },
  { name: 'Funcionalidades', text: 'Activa solo lo que cada cliente necesita.' },
  { name: 'Maestros sincronizados', text: 'Tiendas, artículos y clientes, al día con tu ERP.' },
];
