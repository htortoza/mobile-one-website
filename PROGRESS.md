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

- **Header**: se retiró el menú de navegación (páginas del sitemap aún no construidas:
  `/soluciones`, `/por-que-mobile-one`, `/integraciones`, `/casos-de-exito`, `/nosotros`).
  Quedan solo "Iniciar sesión" (→ `mobile-one-dev.dotsolutions.io/login`) y "Agendar demo"
  (→ `/contacto`), ambos con ícono.
- **Footer**: los links a esas mismas páginas no construidas quedaron **desactivados**
  (texto plano, sin `href`) en vez de eliminados — fácil de reactivar cuando existan.

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
