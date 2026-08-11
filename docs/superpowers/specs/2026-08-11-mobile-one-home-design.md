# Mobile One 2.0 — Diseño (Fase 1: Scaffold + Home)

Fecha: 2026-08-11
Repo: `DOTSolutions-io/mobile-one-website` (privado, ya creado en GitHub, vacío)
Origen de contenido: documento maestro "Mobile One 2.0 (MO2) — Sitio Web de Ventas" (pegado por el cliente en la conversación de brainstorming).

## 1. Decisiones técnicas

- **Stack:** Astro + GSAP/ScrollTrigger + Lenis, a partir de `web-factory-seed` (no Next.js/Tailwind como sugería el doc original — se descarta explícitamente esa parte para mantener consistencia con el resto de proyectos de Web Factory).
- **Repo:** `mobile-one-website`, ya existe vacío en GitHub bajo `DOTSolutions-io`. Se clona localmente y se puebla con el contenido de `web-factory-seed`.
- **Contrato de marca:** `contracts/site.json` (siguiendo `site.schema.json`) para company/nav/footer/theme. Las páginas NO se generan vía `landing.schema.json` (ese schema es para landings simples de 1 sección) — Mobile One es un sitio de producto B2B de 8 páginas con secciones bespoke. Se construye siguiendo el **Protocolo de Iteración Creativa (§14)** + **ADN de Diseño (§15-21)** del `CLAUDE.md` del seed, mismo enfoque usado en el proyecto SmartOrder.
- **Fases de construcción** (decisión de scope, confirmada con el cliente):
  1. **Fase 1 (esta spec):** scaffold del repo + `contracts/site.json` + componentes compartidos (Header, Footer, CTA banner, TrustBar) + página Home completa.
  2. **Fases siguientes (specs propias, una por página o agrupadas):** Producto, Soluciones, Por qué Mobile One, Integraciones, Casos de éxito, Nosotros, Contacto. El copy de estas páginas ya está resuelto en el documento maestro (ver más abajo) — cada fase futura es principalmente blueprint técnico + implementación, no brainstorming de contenido nuevo.

## 2. Contenido fuente

El documento maestro entregado por el cliente contiene, ya redactado y listo para usar:
- Sitemap completo (8 páginas)
- Voz de marca, mensajes clave, buyer personas
- Copy completo de Header/Footer/CTA banner/Trust bar (componentes compartidos)
- Copy completo de las 8 páginas, sección por sección, con SEO (title/description) por página
- Especificación técnica detallada de la sección inmersiva de scroll horizontal (Home §4.3)
- Lista de placeholders que NO deben publicarse con datos ficticios (testimonios, métricas, certificaciones, hitos de compañía, datos de contacto)

Este documento vive completo en el historial de la conversación de brainstorming; se referencia aquí en vez de duplicarlo. Al ejecutar cada fase, extraer el copy textual de esa sección del documento original — no reescribir ni inventar contenido nuevo salvo que el cliente lo pida.

**Precisión de producto que debe repetirse en todo el sitio:** Mobile One no corre en un celular personal del vendedor + lector de tarjetas Bluetooth. Corre directo en el terminal de cobro (Getnet/Transbank/Mercado Pago) que la tienda ya usa. Evitar cualquier visual o copy que sugiera "celular + lector aparte".

## 3. Identidad de marca

Assets recibidos en `_intake/mobile-one/` (fuera del repo, mover a `public/brand/` o equivalente al ejecutar la Fase 1):
- Logos oficiales: `Imagotipo-logo.svg`, `Isotipo-logo.svg`, `Logotipo-logo.svg`
- Manual de marca (`Manual de Marca MobileOne.pdf`) — **usar solo la información** (paleta, tipografía), **no replicar su layout/diseño de slides** (instrucción explícita del cliente).
- Capturas de producto real (login, dashboard, flujo de venta) — usar como referencia de estilo de UI para mockups del sitio.

**Paleta (del manual, verificada en el isotipo SVG):**
- Azul principal: `#0000FF`
- Gradiente de marca: `#0022AA` → `#4A90E2` (el isotipo usa además `#050099` → `#0002FE` → `#1B8CFA`)
- Navy secundario: `#132D46`
- Blanco: `#FFFFFF`
- Texto oscuro (del wordmark): `#1C1C1C`

**Tipografía:** Satoshi (sans-serif geométrica). El manual ofrece hasta Bold/Black, pero el `CLAUDE.md` del seed impone tope duro de peso 600 (§15.3) — usar como máximo Satoshi Medium. Nunca Bold/Black, ni en CSS ni en la URL de fuente.

## 4. Dirección de arte (Home y sitio en general)

Se descarta la dirección "sala de control" oscura (usada en SmartOrder) porque no calza con esta marca. En su lugar:

- **Fondo base claro** (blanco / `#F7F8FA`), nunca dark navy dominante.
- **Bloques full-bleed azules** (gradiente `#0022AA → #4A90E2`) reservados para 3 momentos del Home, a modo de "bookend" narrativo:
  1. Mitad izquierda del Hero (split-screen, inspirado directamente en la pantalla de login real del producto: panel azul con propuesta+bullets+CTA, panel claro con mockup flotando).
  2. La sección inmersiva de scroll horizontal (4.3) — el clímax visual de la página.
  3. El CTA de cierre (4.9).
- **Navy `#132D46`** reservado para texto sobre fondo claro y detalles de contraste puntuales.
- **Mockups de producto reales**: reconstruir en HTML/CSS las pantallas reales del producto (carrito, cobro, login, backoffice) vistas en las capturas de referencia — no ilustraciones inventadas de hardware de terceros (evita también problema de marcas registradas de Getnet/Transbank/Mercado Pago, señalado explícitamente por el documento original).
- **Elemento de personalidad/fuerza propio**: el isotipo "M" repetido en diagonal como textura de fondo sutil (recurso que la propia marca ya usa en sus banners) — reemplaza cualquier recurso neón/oscuro para dar "fuerza" sin salir del tono claro/azul.
- Producto siempre visible: este es un SaaS B2B de retail — el sitio debe **mostrar el producto y sus capacidades constantemente** (mockups reales grandes, multi-estado), no solo describirlo en texto. Es el criterio de éxito principal del cliente ("que nos escojan").

## 5. Blueprint sección por sección — Home (§16.4)

| # | Sección | Objetivo narrativo | Formato | Visual | Dato/título protagonista | Motion |
|---|---|---|---|---|---|---|
| 4.1 | Hero | Promesa clara en <10s + CTA | Split blue(izq)/claro(der) | Mockup real: pantalla de carrito Mobile One flotando en device frame + card de BackOffice detrás | H1 gigante, mask-reveal por palabra | Reveal por palabra; mockup entra con clip-path+scale; CTA magnético |
| 4.2 | Trust bar | Credibilidad inmediata | Marquee de texto (sin logos de terceros no autorizados) | — | Badges: "Implementación en horas", "Multi-tenant Cloud" | Marquee infinito, pausa on hover |
| 4.3 | Terminal narrativo (prueba viva) | El usuario "vive" la compatibilidad multi-terminal | Galería horizontal pinneada, 9 escenas (spec completa en doc original §4.3) | 3 device frames estilizados (sin fotos de marcas de terceros) + pantallas reales Mobile One recreadas por escena | Copy flotante grande por escena | GSAP ScrollTrigger pin+scrub horizontal en `matchMedia(min-width:768px)`; mobile = carrusel con scroll-snap nativo; `prefers-reduced-motion` = tarjetas apiladas; textura M diagonal de fondo |
| 4.4 | El problema | Tensión | Ledger editorial numerado (01/02/03), regla que se dibuja | Iconos lineales simples (no genéricos) | Números gigantes en navy | Reglas se dibujan al scroll; stagger fade-up |
| 4.5 | La solución | Gran idea — mostrar producto | Bento grid (celdas de tamaño mixto) | Mini-mockups reales por celda: carrito, stock multitienda, promos automáticas, BackOffice | La UI real es el protagonista visual | Stagger scale-in; hover lift |
| 4.6 | Cómo funciona | Flujo operativo | Diagrama de nodos conectados con paquete animado | Iconografía + mini-capturas en nodos | — | Paquete recorre cable SVG a medida que se scrollea |
| 4.7 | Arquitectura (teaser) | Confianza técnica, enlaza a `/integraciones` | Badges grandes tipo stat + mini-diagrama teaser (4 nodos) | Diagrama reducido: POS Mobile ⇄ Core ⇄ SAP/Promos/Pago/Facturador | 3 badges | Line-draw + count-in |
| 4.8 | Prueba social | Honestidad (sin datos ficticios) | Stat count-up gigante + 2 cards "próximamente" claramente marcadas | — | "Implementación típica: horas, no semanas" | Count-up al entrar al viewport |
| 4.9 | CTA de cierre | Conversión | Banner full-bleed azul (bookend con Hero y 4.3) | Textura M diagonal | CTA primario + secundario | CTA magnético + pulso sutil cada ~8s |

Regla anti-repetición (§16.2.3) verificada: ningún formato se repite en secciones consecutivas.

## 6. Reglas técnicas inquebrantables aplicables (heredadas de CLAUDE.md, no se repiten aquí en detalle)

- Tipografía: tope de peso 600, nunca bold/black (§15.3).
- Todo el motion complejo (pin/scrub/scroll horizontal) en `gsap.matchMedia('(min-width:768px)')` con fallback estático en mobile (§15.6.1).
- `ScrollTrigger.config({ ignoreMobileResize: true })`.
- Colores solo vía variables CSS de `theme.css` (nunca hex hardcodeado en componentes).
- `og:image` absoluto obligatorio.
- No inventar contenido no autorizado: testimonios, métricas, certificaciones y datos de contacto quedan como placeholder explícito hasta que el cliente los apruebe (ver doc original §12.4).
- No usar fotos de terminales de pago de terceros (Getnet/Transbank/Mercado Pago) sin verificar licencia de marca — usar device frames estilizados propios.

## 7. Fuera de alcance de esta fase

- Páginas: Producto, Soluciones, Por qué Mobile One, Integraciones, Casos de éxito, Nosotros, Contacto — cada una se aborda en una fase/spec posterior.
- i18n (el doc original lo deja como posible trabajo futuro, no requerido ahora).
- Testimonios/métricas/certificaciones reales — bloqueado hasta aprobación del cliente.
