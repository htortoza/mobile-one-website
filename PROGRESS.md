# Estado del proyecto — Mobile One 2.0

> Registro de avance de **este sitio** (mobile-one-website). No aplica a otros repos de
> Web Factory ni reemplaza `CLAUDE.md` (metodología) — es solo el "qué se hizo y qué falta".
> Actualizar cada vez que se cierre un bloque de trabajo relevante.

## Páginas construidas

- **`/` (Home)** — Hero split azul/claro con imagen real del POS, carrusel de logos de
  clientes dentro del panel azul (bajo los CTA), sección de compatibilidad de hardware
  (Transbank/Getnet/Mercado Pago), hook de retención, tour de solución (3 respuestas a
  las 3 preguntas del hook), arquitectura de integración (diagrama con cables SVG),
  cómo funciona (4 pasos), stat de prueba social, CTA de cierre.
- **`/producto`** — Hero propio (distinto al de Home), switcher sticky POS Mobile/BackOffice
  (control segmentado), bento de features (POS Mobile) y ledger sticky (BackOffice) con
  contenido real sacado de la auditoría técnica interna (`_intake/mobile-one/Features/
  Auditoria-Flujos`), escena de feature-flags para la banda de "escala".
- **`/contacto`** — 2 columnas (referencia adereso.ai): info + bullets de confianza +
  carrusel de logos reales a la izquierda, formulario a la derecha. Fondo azul con grid
  degradado, panel translúcido único.
- **`/404`**

## Narrativa / copy

Todo el sitio gira en torno a 3 pilares nombrados, repetidos y cruzados entre Home y
Producto:
1. **Venta asistida y potenciada** — el vendedor no reemplazado, potenciado.
2. **Pasillo infinito** — stock de toda la red visible/vendible desde un solo terminal.
3. **Operación sin fricción** — recepción, documentos, backoffice sin fricción manual.

## Logos de clientes (reales, autorizados)

`public/logos-clientes/{white,dark}/` — DBS, Superpet, 100% Fútbol, Superzoo, Wayú, SEI,
Flores. Variante blanca para fondos azules (Home hero, si aplica), variante navy
(`#132d46`) para fondos claros (Contacto). Fuente: carpeta `_intake/mobile-one/
Clientes Mobile One` (SVGs entregados por el cliente, recoloreados solo donde no traían
fill, nunca reconstruidos).

## Header / Footer

- **Header** (actualizado 2026-11-26, `src/components/Header.astro`): layout de 3 zonas
  con grid `1fr auto 1fr` — logo izquierda · menú **centrado exacto** (Producto ·
  Integraciones · Recursos) · acciones derecha ("Iniciar sesión" → `loginUrl`, "Agendar
  demo" → `orderUrl`). Se quitó el separador vertical entre menú y login.
  - Hamburguesa ahora desde **≤1000px** (antes 860): las 3 zonas necesitan ~985px; entre
    860–1000 desbordaba en horizontal.
  - Desplegables (mega-menú) de Integraciones y Recursos: cada link lleva **ícono de
    trazo** (18px, navy al 45%, pasa a `--accent` al hover) + **descripción corta** debajo
    (`--text-xs`, `--text-secondary`). Datos en el objeto `MENUS` del frontmatter: campos
    `icon` (paths SVG separados por `|`, viewBox 24) y `desc`.
  - Las descripciones las redactó el agente a partir de los `description` de cada página
    — **pendiente que el usuario las valide**.
  - Íconos genéricos de línea (no logos de marca): en el repo solo hay logos completos
    (wordmark) de SAP/Transbank/Getnet/Mercado Pago, no isotipos; reconstruirlos está
    prohibido. Si el cliente entrega isotipos oficiales, reemplazar solo en Integraciones.
  - **Fondo compartido del mega-menú** (`.dd-bg`, patrón Stripe): un solo fondo se
    desliza/redimensiona al panel activo y solo el contenido se cruza. Corrige el "salto" al
    pasar de un menú a otro (antes se veían dos paneles de distinto ancho a la vez).
  - Apertura por hover o foco de **teclado** (`:has(:focus-visible)`), ya no `:focus-within`:
    tras un clic el menú quedaba abierto y se encimaba con el siguiente. Si hay hover, solo
    se ve el menú bajo el mouse.
  - **Header único y persistente** (`transition:persist`): mismo DOM en todas las páginas,
    scripts enganchados una vez, `aria-current` se sincroniza en `astro:page-load`. El estado
    del mega-menú lo maneja JS (`.is-open`, `.is-hot`), no `:hover`, y se congela durante la
    View Transition hasta `viewTransition.finished` → sin parpadeo al navegar desde el menú
    (verificado cuadro a cuadro: 0 caídas de opacidad, un solo header en 3 navegaciones).
  - **Resaltado único dentro del desplegable** (`.dd__hl`): un solo fondo por panel que se
    desliza entre links. Antes cada link tenía su fondo con fade de 300ms y al pasar de uno a
    otro el anterior seguía resaltado (hover "fantasma"). Cruzar el hueco entre links no apaga
    el resaltado (120ms de margen).

### Hub de integraciones — continuidad entre páginas (2026-11-26)
`src/components/integraciones/IntegrationHub.astro`: al navegar entre páginas de integración
(SAP → Retail Pro → …) el diagrama ya no se rearma desde cero (antes: giro de entrada desde
otro ángulo + nodos creciendo = "salto"). En `astro:before-preparation` se guarda ángulo y
focos del hub si está a la vista; en `astro:after-swap` el hub nuevo nace en ese estado con
`view-transition-name: ihub`, y luego solo gira a su foco. Las animaciones CSS en bucle
(flotar, anillos, pulso) van en fase con `performance.now()` (vars `--ph*`) para no reiniciarse.
Si el hub estaba fuera de pantalla, entrada normal.

## Design System (CLAUDE.md §22) — 2026-11-26

Hecho:
- `src/styles/components.css` (capa global 2, importada en `BaseHead`): `.btn` + variantes
  (`primary`, `ghost`, `light`, `outline-light`, `sm`, `block`), `.btn-group`, y patrones de
  contenido (`.card-grid`, `.step-list`, `.check-list`, `.tag`, `.badge`, `.logo-chip`,
  `.text-lead`).
- `Button.astro` reescrito como único botón. Migrados: Header (escritorio + drawer), Home,
  HeroSplit, CtaClose, PageHero, IntegrationHero, ResourcesHero, CtaBand, industrias/[slug].
  9 implementaciones de botón → 1.
- Analítica: ubicación del CTA por `data-cta` (`<Button track="...">`) en vez de clases.
  Motion: `data-magnetic` / `data-pulse` en vez de clases.
- Integraciones: 8 páginas quedaron **sin `<style>`** (el bloque estaba copiado en 9
  páginas). Solo conservan CSS propio `/integraciones`, `/integraciones/erp` y `/facturacion`
  (secciones únicas).

Deuda pendiente (migrar con las normas de §22):
- [ ] `StickyCTA.astro`: botón flotante propio → variante de `<Button>` (p. ej. `floating`).
- [ ] `header-login` / `overlay-login`: enlace con ícono → evaluar variante `text` de Button.
- [ ] Páginas con `<style>` grande: `recursos/industrias/[slug].astro` (~110 líneas),
      `index.astro` (~90), `recursos/index.astro` (~65), `integraciones/index.astro` (~45):
      revisar qué es único y qué es patrón (títulos de sección, tarjetas) → capa 2.
- [ ] Títulos de sección (`h2` con `clamp(2rem, 4.2vw, 3.2rem)` repetido en varios archivos)
      → clase global `.section-title`.
- [ ] Componentes muertos que usan la API vieja de Button: `Hero.astro`, `CTA.astro`,
      `VideoHero.astro` (no los usa ninguna página; borrar tras confirmar).

### Mega-menú Producto (2026-11-26)
- Desplegable de **Producto** con 13 módulos (fuente: catálogo interno `localhost:4200/modulos`)
  en 3 columnas: Vender (5) · Operar (5) · Administrar (3). Cada uno enlaza a su capítulo de
  `/producto` (`#armar-venta`, `#cerrar-venta`, `#recepcion`, `#red-completa`, `#en-la-tienda`,
  `#control-sistema`); Facturación va a `/integraciones/facturacion`.
- Omitido "Plataforma DOT" (administración interna cross-tenant, no es del cliente).
- Descripciones reescritas en lenguaje de cliente (las del catálogo interno eran técnicas).
- Paneles ahora centrados bajo el menú (`.nav-item { position: static }`): el de Producto se
  salía por la izquierda a ~1000px.
- [ ] Varios módulos comparten capítulo (p. ej. Promociones/Giftcards → `#cerrar-venta`): si
      se quiere un destino propio por módulo, hacen falta secciones o páginas nuevas.

## SEO competitivo: comparativas y soluciones (2026-11-26)

Páginas nuevas (plantillas sin CSS propio, datos en `src/data/`):
- `/comparativas` (página que agrupa todas las comparaciones) + 6 páginas `/comparativas/alternativa-a-{bsale, relbase,
  defontana-tivendo, lightspeed, shopify-pos, toteat}` (`src/data/comparativas.js`).
- 3 páginas por necesidad `/soluciones/{pos-para-sap-business-one, pos-movil-para-retail,
  pos-para-tiendas-de-ropa}` (`src/data/soluciones.js`), solo con afirmaciones ya publicadas.
- Componente nuevo `CompareTable.astro` (tabla en escritorio, tarjetas en móvil) y módulo
  compartido `src/scripts/reveal.js` (entrada al hacer scroll con `[data-rv]`).
- Enlaces: grupo "Compara" en el menú Recursos y columna "Soluciones" en el footer.
- SEO: title/description propios, JSON-LD de preguntas frecuentes y migas (FAQPage + BreadcrumbList), og:image absoluto, sitemap.

Reglas de contenido (en la cabecera de `comparativas.js`): datos del competidor verificados en
su sitio oficial con fuente numerada y fecha (revisión: 26-11-2026), "no lo menciona en su
sitio" en vez de "no tiene", sin logos de terceros, y siempre "cuándo conviene más el otro".

Pendiente:
- [ ] **Toteat** va con `noindex` (y fuera del sitemap) porque Mobile One para gastronomía
      (TCPOS) aún no existe. Quitar `noindex` en `comparativas.js` y el filtro en
      `astro.config.mjs` al lanzar.
- Decisión comercial (26-11-2026): las comparativas **no recomiendan al competidor** (se quitó
  "X puede ser mejor si…"). Se sumó caja fija con pantalla táctil (sin POS móvil) y venta +
  facturación offline. Roadmap NO publicado como disponible: e-commerce, tótem de autoatención
  (hardware propio), gastronomía/TCPOS.
- [ ] **Precio de Mobile One**: hoy dice "según tu operación, se cotiza en una demo"
      (DATO PENDIENTE: confirmar con comercial).
- [ ] Revisión legal de las comparativas antes de publicar.
- [ ] Revisar precios de la competencia cada trimestre (cambian sin aviso).
- [ ] Migrar el reveal copiado en las páginas de integraciones e industrias a `src/scripts/reveal.js`.

### Pendiente header
- [ ] Validar/ajustar copy de las descripciones del mega-menú.
- [ ] Menú móvil (acordeón del drawer) aún **sin** íconos ni descripciones — igualarlo si
      se aprueba el desktop.
- [ ] Isotipos oficiales de ERP/medios de pago (si el cliente los tiene).
- [ ] Cambios del 2026-11-26 **sin commit** (solo local, `npm run dev` en :4321).

## Formulario de contacto — integración real

Mismo patrón que `smartorder` (motor PHP propio en cPanel, no un servicio de terceros):

- `public/contact.php` — recibe el POST, valida origen (`ALLOWED_ORIGINS`), registra el
  lead siempre en un log local (`mobile-one-leads.log`, gitignored), crea tarea en
  **ClickUp** (misma lista compartida con SmartOrder, `901112194199`) y envía notificación
  por **SMTP** a `contacto@dotsolutions.io`.
- `public/contact-config.sample.php` — plantilla de secretos (se commitea).
- `contact-config.php` (raíz del repo) — secretos reales, **gitignored**, no se sube a
  git. Vive fuera de `public_html` en el servidor real.
- Honeypot (`hp`) + estado de carga en el botón ("Enviando…") + mensaje de error inline
  si falla el POST.

### Pendiente para que el envío funcione en producción
- [ ] `SMTP_PASS` real de `contacto@dotsolutions.io` en `contact-config.php` (dejado como
      placeholder a propósito — no se pidió por chat).
- [ ] Option-id de ClickUp para el label "Producto = Mobile One" (hoy se omite esa
      etiqueta específica; el lead igual se crea y queda "Producto: Mobile One" en la
      descripción).
- [ ] Subir `contact.php` + `contact-config.php` al servidor cPanel real (fuera de
      `public_html` el segundo).

## Deploy de preview

**https://htortoza.github.io/mobile-one-website/** — GitHub Pages *project page* (mismo
patrón que los demás repos de preview del usuario, con subpath, no user-site raíz).

- Workflow: `.github/workflows/deploy-gh-pages.yml` (build + `actions/deploy-pages`).
- `astro.config.mjs` acepta `GH_PAGES_SITE`/`GH_PAGES_BASE` por env var — **solo** las
  define ese workflow; el build real del cliente (`mobileone.dotsolutions.io`) no las usa.
- `src/utils/base.js` (`withBase()`) — todo `href`/`src` interno del sitio pasa por acá
  para respetar el subpath en el preview sin romper el dominio real.
- El PHP del form (`contact.php`) no funciona en este preview (GitHub Pages es estático,
  no ejecuta PHP) — es esperable, ese formulario solo sirve en el hosting real.

## Auditoría responsive — EN CURSO

Pedida explícitamente: revisar overflow, breakpoints y tamaños mobile en todo el sitio.

Hallazgos corregidos hasta ahora:
- `ArchitectureTeaser.astro` — `.arch__hub` tenía `width: 260px` fijo (sin `max-width`),
  desbordaba en viewports ≤324px (iPhone SE y similares). Cambiado a
  `width: 100%; max-width: 260px`.
- `ArchitectureTeaser.astro` — `.arch__hub-label` tenía `white-space: nowrap` sobre texto
  dinámico (prop `hubNode.label`) sin garantía de longitud — quitado el nowrap para que
  pueda envolver si el texto es más largo.

Verificado y sin problemas (matchMedia/pin/sticky, regla dura §21.1/§15.6.1 del CLAUDE.md):
- Todas las escenas con `scrub`/`pin` (SolutionSlide, ProblemHook, BrandCompat,
  ProductoHero, HowItWorksFlow) están correctamente dentro de `gsap.matchMedia()`, con
  fallback estático en mobile.
- Ningún ancestro de un elemento `position: sticky` (Header, ProductoSwitcher,
  ProductoFeatureSticky) tiene `overflow` distinto de `visible`.
- `viewport` meta sin `user-scalable=no`/`maximum-scale` (zoom no bloqueado).
- Sin `font-weight` > 600 en ningún componente.

Gaps detectados, aún sin corregir:
- [ ] Falta `touch-action: manipulation` global (previene delay de doble-tap en mobile) —
      no está en ningún lado del CSS del sitio.
- [ ] Falta `overscroll-behavior: contain` en el overlay móvil del Header (evita que el
      scroll "se filtre" al body detrás del overlay).
- [ ] Verificación visual real en 375/768/1024/1440px de las 4 páginas — pendiente
      (quedó cortada a mitad de la sesión).

## Componentes muertos (no tocar, no romper nada al limpiarlos después)

`Hero.astro`, `CTA.astro`, `VideoHero.astro`, `Button.astro`, `Features.astro`, `FAQ.astro`,
`Testimonials.astro`, `TrustBar.astro` — vienen del pipeline genérico de contratos JSON
(`src/utils/generate.js`), **no los usa ninguna página real** de este sitio (Home/Producto/
Contacto son hand-built). Bajo riesgo, pero si se van a borrar algún día, confirmar primero
que `generate.js` tampoco se usa en este repo.
