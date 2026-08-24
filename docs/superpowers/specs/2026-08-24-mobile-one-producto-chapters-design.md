# Mobile One — Rediseño /producto en capítulos narrativos

Fecha: 2026-08-24
Reemplaza el modelo de switcher (`ProductoSwitcher`, tabs POS Mobile/BackOffice con crossfade) descrito en `2026-08-13-mobile-one-producto-design.md` §5-6. Ese spec sigue vigente para Hero, paleta, tipografía y reglas de assets (§1-4) — este documento solo reemplaza la sección de features (§5.2-5.3) y el mecanismo de navegación.

## 1. Problema

`/producto` mete las 9 features de POS Mobile en un solo bento grid y las 7 de BackOffice en un solo ledger vertical, cada uno detrás de un tab que oculta al otro. Resultado: mucho contenido de una sentada, storytelling plano (una lista, no un relato), y el usuario nunca ve ambas superficies en el mismo scroll.

## 2. Principio rector

Se elimina el switcher. `/producto` pasa a ser un **scroll único y continuo** que cuenta una historia: abre turno → arma la venta → cierra la venta → el momento estelar de marca (pasillo infinito) → postventa → recepción → puente → backoffice en 3 capítulos → cierre. Las 16 features originales no desaparecen ni se resumen: se **agrupan en 9 capítulos** por momento del flujo de trabajo, cada uno con su propia idea visual (regla anti-repetición §16.2 CLAUDE.md: ningún formato se repite consecutivo).

## 3. Arquitectura de página

```
Hero (ProductoHero — sin cambios)
  ↓
[ChapterNav — rail sticky aparece a partir de aquí, desktop ≥900px]
01 Abrir turno                    — Solo
02 Armar la venta                 — Duo
03 Cerrar la venta                — Photo-callout
04 Pasillo infinito               — Flagship (momento estelar, Pilar 2 de marca)
05 Después de vender              — Ledger sticky (reusa ProductoFeatureSticky)
06 Recepción de mercadería        — Photo-callout
  ↓
Bridge (ProductoBridge — banda angosta, transición POS Mobile → BackOffice)
  ↓
07 En la tienda                   — Bento (reusa ProductoFeatureBento)
08 La red completa                — Diagrama de nodos
09 Control del sistema            — Stat-forward
  ↓
ProductoScaleBand (sin cambios — "1 código base")
CtaClose (sin cambios)
```

Se elimina el markup `data-psw-panels` / `data-psw-panel` (paneles ocultos con `hidden`) — ya no hay panel oculto, todo vive en el mismo flujo de documento.

## 4. Mapeo de features → capítulos (ninguna se pierde, ninguna se inventa)

### POS Mobile (9 features originales → 6 capítulos)

| Capítulo | Features (texto y assets ya existentes, sin reescribir copy) |
|---|---|
| 01 Abrir turno | Acceso rápido por QR (icon `qr`) |
| 02 Armar la venta | Catálogo con categorías y búsqueda (icon `search`) + Carrito de venta flexible (icon `cart`) |
| 03 Cerrar la venta | Cobro sin fricción (image `retail-payment-scene-mercadopago.webp`) + Documentos electrónicos al instante (icon `receipt`) |
| 04 Pasillo infinito | Venta omnicanal (image `solucion-stock.webp`) |
| 05 Después de vender | Búsqueda y postventa (icon `users`) + Resumen de ventas del día (icon `chart`) |
| 06 Recepción de mercadería | Recepción de mercadería (image `solucion-bulto.webp`) |

### BackOffice (7 features originales → 3 capítulos)

| Capítulo | Features |
|---|---|
| 07 En la tienda | Gestión de ventas + Carros con pago pendiente + Trazabilidad y auditoría |
| 08 La red completa | Entregas y despachos + Stock por tienda y almacén + Maestros centralizados |
| 09 Control del sistema | Administración del sistema (usuarios, feature flags) |

El copy exacto de cada feature (`title`/`text`/`icon`/`image`) se toma literal de `src/pages/producto.astro` actual — no se reescribe contenido en esta pasada, solo se reorganiza en capítulos.

## 5. Assets — cero generación nueva

Las 6 fotos ya aprobadas en el spec del 13-08 cubren los 6 capítulos que llevan imagen; no se genera ningún asset nuevo vía Magnific en esta pasada:

| Capítulo | Imagen |
|---|---|
| 02 Armar la venta | `solucion-fila.webp` |
| 03 Cerrar la venta | `retail-payment-scene-mercadopago.webp` |
| 04 Pasillo infinito | `solucion-stock.webp` |
| 06 Recepción de mercadería | `solucion-bulto.webp` |
| 07 En la tienda | `solucion-backoffice.webp` |

Capítulos 01, 05, 08, 09 no llevan foto (solo, ledger, diagrama y stat respectivamente no la necesitan — ver §6).

## 6. Componentes

**Nuevos:**
- `ProductoChapterNav.astro` — rail sticky con los 9 índices numerados + separador visual entre grupo POS Mobile/BackOffice. Resalta el capítulo activo vía `ScrollTrigger` (uno por sección, `toggleClass` al entrar/salir), click hace scroll suave (Lenis ya maneja `scrollTo`) al `id` del capítulo.
- `ProductoChapter.astro` — componente flexible para capítulos 01/02/03/06, con prop `variant`:
  - `solo` (cap. 01): texto + ícono grande centrado, sin foto, capítulo corto (beat rápido de apertura).
  - `duo` (cap. 02): foto + 2 sub-cards lado a lado (o apiladas en mobile).
  - `photo-callout` (cap. 03, 06): foto grande + lista corta de features en checklist al costado.
- `ProductoPasilloMoment.astro` — capítulo 04, standalone (no variante de `ProductoChapter`): tratamiento de marca más fuerte (tipografía protagonista, foto `solucion-stock.webp` a sangre o casi, eco visual del término "pasillo infinito" ya validado en Home). Es el único capítulo "flagship" de la página de producto — un solo momento, no se repite el tratamiento en ningún otro capítulo.
- `ProductoBridge.astro` — banda angosta de transición entre POS Mobile y BackOffice (planeada en el spec del 13-08 §7, nunca construida). Isotipo watermark de fondo + una frase corta puente: **"Del mostrador al panel de control."** Motion: line-draw sutil, mismo criterio que el spec viejo.
- `ProductoNetworkDiagram.astro` — capítulo 08. Diagrama de nodos (tiendas/almacenes/maestros conectados a un centro), técnica heredada de `ArchitectureTeaser.astro` (cables SVG en coordenadas %, `vector-effect: non-scaling-stroke`, paquetes viajando — ver gotchas §21.3 CLAUDE.md). Sin foto.
- `ProductoSystemStat.astro` — capítulo 09. Cifras protagonistas (ej. rango de feature flags, "multi-tenant", "cloud") en el mismo lenguaje visual que la sección "Cómo operamos" del deck de evento Perú (`MO2-Especificacion-Slides-Evento-Peru.md` slide 10) — reutiliza el mismo vocabulario de marca entre sitio y keynote. Sin foto.

**Reusados sin tocar su código, solo con menos features en el prop:**
- `ProductoFeatureBento.astro` — capítulo 07, ahora recibe 3 features en vez de 9.
- `ProductoFeatureSticky.astro` — capítulo 05, ahora recibe 2 features en vez de 7.
- `ProductoHero.astro`, `ProductoScaleBand.astro`, `CtaClose.astro` — sin cambios.

**Eliminado:**
- `ProductoSwitcher.astro` — sin más consumidores tras este cambio, se borra el archivo completo (no se deja código muerto).

## 7. Anti-repetición (verificación de formato, ninguno se repite consecutivo)

Hero (cards/texto) → 01 Solo → 02 Duo → 03 Photo-callout → 04 Flagship → 05 Ledger sticky → 06 Photo-callout → Bridge (banda watermark) → 07 Bento → 08 Diagrama → 09 Stat-forward → ScaleBand (bookend stat) → CtaClose.

Nota: 03 y 06 comparten formato `photo-callout`, pero no son consecutivos (04 Flagship y 05 Ledger los separan) — cumple la regla de no repetir el formato inmediatamente después.

## 8. Navegación e IDs

Cada capítulo lleva `id` propio para el rail y para links externos: `#abrir-turno`, `#armar-venta`, `#cerrar-venta`, `#pasillo-infinito`, `#despues-de-vender`, `#recepcion`, `#en-la-tienda`, `#red-completa`, `#control-sistema`. Se preservan `#pos-mobile` y `#backoffice` como alias (anchor extra en el primer capítulo de cada grupo — `#abrir-turno` también responde a `#pos-mobile`) para no romper links externos que ya apunten al viejo switcher.

## 9. Rail — comportamiento responsivo

Desktop (≥900px, mismo breakpoint que el rail de `ProductoFeatureSticky`): `position: sticky` a un costado del viewport, lista de 9 índices, el activo se resalta por `ScrollTrigger` (un trigger por capítulo, `start: 'top 50%'`, `end: 'bottom 50%'`), separador visual entre el bloque POS Mobile y BackOffice.

Mobile (<900px): el rail no se muestra como lista completa (repetiría el patrón de sticky-transformado prohibido en mobile por §15.6.1) — colapsa a un contador simple fijo en una esquina, tipo mono, `04 / 09`, sin lista de nombres, actualizado por el mismo `ScrollTrigger` por-capítulo que alimenta el rail desktop (un solo mecanismo de tracking, dos renders distintos vía `matchMedia`).

## 10. Motion por capítulo

- Capítulos que reusan componentes existentes (05 ledger, 07 bento) heredan su motion ya construido (reveal por fila/card con `ScrollTrigger`), sin cambios.
- Capítulos nuevos con reveal simple (01 solo, 02 duo, 03/06 photo-callout, Bridge): reveal estándar `fade-up` + stagger, sin pin ni scrub — son capítulos cortos, no necesitan coreografía compleja.
- 04 Pasillo infinito: el único capítulo con motion más elaborado — reveal dramático de tipografía (mask-reveal por palabra, ya usado en Hero) + parallax sutil de la foto. Sin pin (evitar el bug ya resuelto en `ProblemHook` de Home — no repetir un pin largo con holds muertos).
- 08 Diagrama de nodos: sin pin. Los paquetes viajando por los cables se activan una vez al entrar en viewport (`ScrollTrigger` de entrada simple, `start: 'top 75%'`), igual que el resto de capítulos cortos — el pin queda reservado exclusivamente al capítulo 04 si en implementación se decide agregarlo ahí (ver punto anterior), nunca a este.
- 09 Stat-forward: conteo ascendente en cifras puramente numéricas (si las hay) siguiendo el mismo criterio que el slide 10 del deck de Perú — rangos/etiquetas no numéricas (ej. "multi-tenant") no llevan count-up, solo `autoAlpha`.

Todas las escenas respetan `prefers-reduced-motion` y usan `gsap.matchMedia` donde haya diferencia desktop/mobile, `ScrollTrigger.config({ ignoreMobileResize: true })` heredado del resto del sitio, init en `astro:page-load`.

## 11. Reglas heredadas (no se repiten en detalle)

Peso tipográfico ≤600, solo variables de `theme.css`, `og:image` absoluto (sin cambios, ya lo cubre `Layout`), build verde + verificación 375px/1440px antes de reportar, ningún fondo `--brand-blue`/`--navy` con grid diagonal (CLAUDE.md §15, §18, §21). Assets: regla de la sección 2 del spec del 13-08 sigue vigente (prohibido el set fotográfico viejo de `public/images/producto/*`).

## 12. Fuera de alcance de esta pasada

- No se reescribe el copy de ninguna feature — se reorganiza texto existente.
- No se toca `ProductoHero.astro` (headline/selector de 2 tarjetas mencionado en el spec del 13-08 §5 sigue pendiente como ítem separado, no parte de este rediseño).
- No se genera media nueva vía Magnific (§5 de este documento).
