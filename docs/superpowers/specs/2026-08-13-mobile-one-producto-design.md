# Mobile One 2.0 — Diseño /producto (Fase 2: rediseño, eleva Home)

Fecha: 2026-08-13
Reemplaza el primer intento de rebuild de `/producto` (que reusaba `HeroSplit` de Home tal cual — el cliente lo rechazó explícitamente: "mantén el estilo, no la hagas exactamente igual").

## 1. Principio rector

`/producto` comparte el ADN visual del Home (paleta, tipografía ≤600, bloques azules bookend, grid+degradado) pero **no es un clon**: cada sección tiene su propia idea espacial, el Hero es estructuralmente distinto al de Home, y la página suma un nivel de detalle encima de Home (acentos secundarios, jerarquía tipográfica más marcada, más animación coreografiada). Es la página que profundiza — debe sentirse un escalón "más" que Home, no un remix.

## 2. Regla de assets — solo estilo Home

**Prohibido** reusar las fotos del viejo tema oscuro (`public/images/producto/*.webp`: `hero-venta`, `red`, `bultos`, `promo`, `erp` — set fotográfico distinto, tono nocturno, ya descartado). El **único** set de imágenes válido para `/producto` es el que ya existe y se usó en Home:

- `/images/hero-mobile-pos-v2-final.webp` — mockup device POS (venta).
- `/images/solucion-fila.webp` — vendedora cobrando en sala (venta asistida).
- `/images/solucion-stock.webp` — despacho/stock en red.
- `/images/solucion-bulto.webp` — recepción de bultos.
- `/images/solucion-promo.webp` — promoción aplicada en terminal.
- `/images/solucion-backoffice.webp` — encargada revisando panel en laptop/tablet (BackOffice — calce directo).

Si una sección necesita una imagen que no existe en este set, generar una nueva vía Magnific **en el mismo estilo fotográfico** (misma iluminación/tono que las anteriores) antes de usar cualquier placeholder o foto de otro tono.

## 3. Vocabulario visual — grid+degradado, logo repetido, acentos

- **Grid con degradado** (recurso del Hero de Home, `hero-split__light::before`): rejilla sutil `color-mix(navy 8%)` enmascarada con `radial-gradient` — reutilizar esta técnica en secciones claras que necesiten textura de fondo sin competir con el contenido.
- **Isotipo como textura de fondo**: `/brand/Isotipo-logo.svg` repetido en mosaico/diagonal a opacidad muy baja (`opacity: 0.04–0.08`, o `color-mix` sobre `--navy`/`--accent`) como capa de marca en al menos una sección — recurso distinto a la rejilla, refuerza identidad sin ruido. Alternativa: un solo isotipo gigante recortado en una esquina (tipo watermark editorial), no necesariamente mosaico.
- **Bloques azules bookend**: igual criterio que Home — momentos puntuales, no todo el fondo. Aquí: Hero (parcial, no split completo) y banda "Diseñado para escalar".
- **Acentos secundarios (sin inventar color de marca)**: el manual solo define `--accent` (#0000FF) y `--navy` (#132D46). "Otro color" se logra por **tono/opacidad de los mismos dos**, no una tercera familia:
  - `--accent-hover` (#0022AA) como acento secundario "cálido-oscuro" para números/labels que antes eran `--accent` plano → más profundidad tonal sin salir de marca.
  - `color-mix(in srgb, var(--navy) 6-10%, transparent)` para superficies/chips secundarios (ya usado en grid de Home).
  - Un chip/badge puede usar `--navy` como fondo solido + `--on-accent` texto, como contraste frente a los chips `--accent` — dos familias tonales dentro de la misma paleta autorizada.

## 4. Jerarquía tipográfica (reforzar vs. Home, mismo tope de peso)

Home usa `--font-heading` peso 400/500 en casi todo. Para dar más "peso visual" sin romper el tope de 600 (§15.3 CLAUDE.md):
- Usar `font-weight: 600` (el máximo permitido) en los H2 de sección y en los números/labels protagonistas — Home se queda mayormente en 400/500, así que 600 aquí ya se percibe "más fuerte" sin salirse de la regla.
- Contraste de tamaño más agresivo entre heading y body que en Home (ratio ≥ 3:1 en vez de ~2.5:1 de Home) — clamps más grandes en H1/H2 de sección, texto de apoyo igual o más chico.

## 5. Hero — estructuralmente distinto a HeroSplit

**Rechazado:** reusar `HeroSplit` (split 60/40 azul/claro) — es el Hero de Home, no de Producto.

**Nuevo Hero de Producto:** foco en "un producto, dos superficies", no en la promesa de venta genérica del Home.
- Fondo **claro** (no split azul/blanco) con la rejilla+degradado de marca de fondo completo (sutil), no un bloque azul sólido a la izquierda.
- H1 grande centrado o alineado, con las dos palabras clave ("terminal de venta" / "panel de administración") tratadas con acento tonal (`--accent` vs `--navy`) para que se lean como las dos superficies antes de leer el resto.
- **Selector visual de dos superficies** como pieza central del Hero (no una tab de texto simple como en el primer intento): dos tarjetas grandes lado a lado (mobile: apiladas) — "POS Mobile" (imagen `hero-mobile-pos-v2-final.webp`) y "BackOffice" (imagen `solucion-backoffice.webp`), cada una con su propio mini-label y ancla (`#pos-mobile` / `#backoffice`). Esto ES el contenido del Hero, no un CTA secundario aparte.
- Motion: headline con mask-reveal por palabra (como Home), las dos tarjetas entran con stagger + hover-lift/tilt (touch: tap-scale), rejilla de fondo con parallax sutil al scroll.

## 6. Blueprint sección por sección

| # | Sección | Objetivo | Formato | Visual | Motion |
|---|---|---|---|---|---|
| Hero | Qué es (2 superficies) | Selector de 2 superficies grande, fondo claro+grid | `hero-mobile-pos-v2-final.webp` + `solucion-backoffice.webp` | mask-reveal H1, stagger cards, parallax grid |
| POS Mobile (§5.2) | Profundidad terminal de venta | Bento asimétrico (ya construido) — **sube el detalle**: 1a card con imagen real embebida (no solo texto), no todas iguales | `solucion-fila.webp` grande + `solucion-bulto.webp`/`solucion-promo.webp` en 2 cards del bento | reveal stagger + hover lift en cards, número con `--accent-hover` |
| Transición | Puente entre superficies | Banda angosta, isotipo watermark opacidad baja + 1 frase corta | isotipo bg | line-draw sutil |
| BackOffice (§5.3) | Profundidad panel web | Ledger sticky (ya construido) — imagen real `solucion-backoffice.webp`, rail con badge `--navy` sólido | `solucion-backoffice.webp` | rule-draw + fade por fila (ya construido) |
| Diseñado para escalar (§5.4) | Un código base | Banda azul bookend + isotipo repetido diagonal (ya tiene `bg-pattern-m`) — **añadir** dato protagonista grande ("1 código base") como elemento gráfico, no solo texto | isotipo textura | count-in del número |
| CTA cierre (§5.5) | Conversión | Reusa `CtaClose` de Home (componente 3.3 idéntico) | isotipo sutil de fondo opcional | igual a Home |

Regla anti-repetición: Hero (selector de tarjetas) ≠ POS Mobile (bento) ≠ Transición (banda watermark) ≠ BackOffice (ledger sticky) ≠ Escalar (banda bookend+dato). Ningún formato se repite consecutivo.

## 7. Componentes a crear/editar

- **Nuevo** `ProductoHero.astro` (reemplaza el intento de reusar `HeroSplit`): fondo claro+grid, H1 con acento bicolor, selector de 2 tarjetas.
- Revertir el prop `tabs` agregado a `HeroSplit.astro` si termina sin otro consumidor (Home no lo usa) — no dejar props muertos en un componente compartido.
- **Nuevo** `ProductoBridge.astro`: banda angosta de transición con isotipo watermark.
- Editar `ProductoFeatureBento.astro`: la card 0 y una más pasan a llevar imagen embebida (no todas texto-only); número usa `--accent-hover`.
- Editar `ProductoScaleBand.astro`: agregar dato grande tipo count-in ("1") antes/junto al título.
- `ProductoFeatureSticky.astro`: badge del rail en `--navy` sólido (acento secundario).
- `CtaClose.astro`: sin cambios (ya ajustado en Home).

## 8. Reglas técnicas heredadas (no se repiten en detalle)

Peso tipográfico ≤600, `gsap.matchMedia` para motion complejo, `ScrollTrigger.config({ignoreMobileResize:true})`, solo variables de `theme.css`, `og:image` absoluto, build verde + verificación 375/1440 antes de reportar (CLAUDE.md §15, §18, §21).
