# Producto en Capítulos Narrativos — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reemplazar el switcher de tabs (POS Mobile/BackOffice) de `/producto` por un scroll único de 9 capítulos narrativos agrupados por momento del flujo de trabajo, con un rail de navegación sticky y "pasillo infinito" como momento estelar propio.

**Architecture:** 6 componentes Astro nuevos (`ProductoChapterNav`, `ProductoChapter` con 3 variantes, `ProductoPasilloMoment`, `ProductoBridge`, `ProductoNetworkDiagram`, `ProductoSystemStat`) + 2 componentes existentes reusados sin modificar (`ProductoFeatureBento`, `ProductoFeatureSticky`, ahora alimentados con menos features cada uno) + reescritura de `src/pages/producto.astro` + eliminación de `ProductoSwitcher.astro`.

**Tech Stack:** Astro 5, GSAP + ScrollTrigger, Lenis (smooth scroll global, sin cambios), CSS con variables de `theme.css` únicamente. Sin framework de tests en este repo — la verificación de cada tarea es `npm run build` (compila y tipa todo `.astro` referenciado) + revisión visual manual en `npm run dev` a 375px y 1440px, siguiendo el mismo método que el resto del proyecto (CLAUDE.md §15.8/§18).

## Global Constraints

- Peso tipográfico máximo 600 en todo CSS/HTML nuevo (nunca 700+), incluida cualquier fuente cargada.
- Solo variables de `src/styles/theme.css` para color/tipografía/espaciado — prohibido hex hardcodeado.
- Toda imagen nueva usa `withBase()` de `src/utils/base.js`, nunca una ruta `/...` directa en `src=`.
- Motion con `pin`/`scrub`/scroll-horizontal solo dentro de `gsap.matchMedia('(min-width:768px)')` o superior, con fallback estático en mobile. `ScrollTrigger.config({ ignoreMobileResize: true })` ya está seteado globalmente (no repetir por componente salvo que el componente registre el plugin standalone, como ya hacen los componentes existentes).
- Motion init siempre en `document.addEventListener('astro:page-load', ...)`.
- `prefers-reduced-motion: reduce` siempre respetado (early return o fallback estático).
- Cero assets nuevos vía Magnific — todas las imágenes usadas ya existen en `public/images/` (ver Task 7).
- No reescribir el copy de ninguna feature original — solo reorganizar el texto ya existente en `src/pages/producto.astro` en capítulos.
- Build verde (`npm run build` sin errores) es condición de cierre de cada tarea.

---

### Task 1: `ProductoChapterNav.astro` — rail de navegación por capítulos

**Files:**
- Create: `src/components/producto/ProductoChapterNav.astro`

**Interfaces:**
- Consumes: nada de tareas anteriores (componente hoja).
- Produces: componente `ProductoChapterNav` con prop `chapters: Array<{ id: string, num: string, label: string, group: 'pos' | 'backoffice' }>`. Se monta buscando en el DOM `document.getElementById(chapter.id)` — Task 7 debe garantizar que cada capítulo real tenga exactamente esos `id`. También busca `[data-gsap-section="phero2"]` (ya existe en `ProductoHero.astro`) para ocultarse mientras el Hero está en pantalla.

- [ ] **Step 1: Crear el componente**

```astro
---
// src/components/producto/ProductoChapterNav.astro
// /producto — rail sticky con los 9 capítulos narrativos (spec
// 2026-08-24). Reemplaza a ProductoSwitcher: en vez de alternar 2 paneles,
// da orientación mientras se scrollea un flujo único. Un solo mecanismo de
// tracking (ScrollTrigger por capítulo) alimenta dos renders — rail
// completo en desktop, contador simple en mobile (§15.6.1: sticky
// transformado es patrón desktop-only).
const { chapters } = Astro.props;
const list = chapters ?? [];
---

<nav class="pcn" data-pcn aria-label="Capítulos de producto">
  <ol class="pcn__list">
    {list.map((ch, i) => (
      <>
        {i > 0 && ch.group !== list[i - 1].group && <li class="pcn__sep" aria-hidden="true"></li>}
        <li>
          <a class="pcn__link" data-pcn-link href={`#${ch.id}`} data-target={ch.id}>
            <span class="pcn__num">{ch.num}</span>
            <span class="pcn__label">{ch.label}</span>
          </a>
        </li>
      </>
    ))}
  </ol>
  <p class="pcn__counter" data-pcn-counter aria-hidden="true">
    01 / {String(list.length).padStart(2, '0')}
  </p>
</nav>

<script>
  import { gsap } from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  gsap.registerPlugin(ScrollTrigger);

  function initChapterNav() {
    const nav = document.querySelector('[data-pcn]');
    if (!nav) return;
    const links = Array.from(nav.querySelectorAll('[data-pcn-link]'));
    const counter = nav.querySelector('[data-pcn-counter]');
    if (!links.length) return;

    const total = links.length;

    links.forEach((link, i) => {
      const target = document.getElementById(link.dataset.target);
      if (!target) return;

      const setActive = () => {
        links.forEach((l) => l.classList.remove('is-active'));
        link.classList.add('is-active');
        if (counter) counter.textContent = `${String(i + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
      };

      ScrollTrigger.create({
        trigger: target,
        start: 'top 50%',
        end: 'bottom 50%',
        onEnter: setActive,
        onEnterBack: setActive,
      });
    });

    const hero = document.querySelector('[data-gsap-section="phero2"]');
    if (hero) {
      ScrollTrigger.create({
        trigger: hero,
        start: 'bottom top',
        onEnter: () => nav.classList.add('is-visible'),
        onLeaveBack: () => nav.classList.remove('is-visible'),
      });
    } else {
      nav.classList.add('is-visible');
    }
  }

  document.addEventListener('astro:page-load', initChapterNav);
</script>

<style>
  .pcn {
    position: fixed;
    z-index: var(--z-above);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s var(--ease-out);
  }
  .pcn.is-visible { opacity: 1; pointer-events: auto; }

  .pcn__list { list-style: none; }

  .pcn__counter {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: var(--navy);
    background-color: color-mix(in srgb, var(--bg-primary) 85%, transparent);
    backdrop-filter: blur(6px);
    border: 1px solid var(--border);
    border-radius: var(--radius-full);
    padding: 4px 10px;
  }

  @media (max-width: 899px) {
    .pcn { right: var(--space-sm); bottom: var(--space-sm); left: auto; top: auto; }
    .pcn__list { display: none; }
  }

  @media (min-width: 900px) {
    .pcn { left: var(--space-md); top: 50%; transform: translateY(-50%); }
    .pcn__list { display: grid; gap: var(--space-xs); }
    .pcn__counter { display: none; }

    .pcn__sep { height: 1px; background-color: var(--border); margin-block: var(--space-xs); }

    .pcn__link {
      display: flex;
      align-items: baseline;
      gap: var(--space-xs);
      text-decoration: none;
      padding: 4px 0;
      opacity: 0.45;
      transition: opacity var(--transition-fast);
    }
    .pcn__link:hover { opacity: 0.8; }
    .pcn__link.is-active { opacity: 1; }

    .pcn__num { font-family: var(--font-mono); font-size: var(--text-xs); color: var(--accent-hover); }
    .pcn__label { font-size: var(--text-xs); color: var(--navy); white-space: nowrap; }
  }
</style>
```

- [ ] **Step 2: Verificar build**

Run: `npm run build`
Expected: `[build] Complete!` sin errores. (El componente aún no está importado por ninguna página — este build solo confirma que no rompió nada existente. La verificación visual real ocurre en Task 7, una vez montado en `/producto`.)

- [ ] **Step 3: Commit**

```bash
git add src/components/producto/ProductoChapterNav.astro
git commit -m "feat(producto): agrega ProductoChapterNav (rail de 9 capítulos)"
```

---

### Task 2: `ProductoChapter.astro` — componente flexible (variantes solo/duo/photo-callout)

**Files:**
- Create: `src/components/producto/ProductoChapter.astro`

**Interfaces:**
- Consumes: nada de tareas anteriores.
- Produces: componente `ProductoChapter` con props `id: string`, `variant: 'solo' | 'duo' | 'photo-callout'`, `eyebrow?: string`, `num: string`, `title: string`, `image?: string`, `imageAlt?: string`, `items: Array<{ icon?: 'qr'|'search'|'cart'|'receipt', title: string, text: string }>`. Usado por Task 7 para los capítulos 01, 02, 03 y 06.

- [ ] **Step 1: Crear el componente**

```astro
---
// src/components/producto/ProductoChapter.astro
// /producto capítulos 01, 02, 03, 06 — componente flexible para features
// agrupadas por momento del flujo de trabajo (spec 2026-08-24). `variant`
// cambia el layout: 'solo' (1 feature, beat corto, sin foto), 'duo' (foto +
// 2 sub-features lado a lado), 'photo-callout' (foto grande + checklist
// corto, foto va primero). Copy de cada feature es el original de
// producto.astro — no se reescribe, solo se reorganiza en capítulos.
import { withBase } from '../../utils/base.js';
const { id, variant, eyebrow, num, title, image, imageAlt, items } = Astro.props;
const list = items ?? [];

const ICONS = {
  qr: 'M4 4h4v1H5v3H4V4Z|M16 4h4v4h-1V5h-3V4Z|M4 16h4v4H4v-4Z|M9 9h6v6H9V9Z',
  search: 'M10.5 3a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15Z|M21 21l-4.3-4.3',
  cart: 'M3 4h2l2.4 12.4a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2-1.6L21 8H6|M9.5 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z|M17.5 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z',
  receipt: 'M6 2h12v20l-2-1-2 1-2-1-2 1-2-1-2 1V2Z|M9 7h6|M9 11h6|M9 15h4',
};
---

<section id={id} class="pch" data-gsap-section={`pch-${id}`} data-variant={variant}>
  <div class="container pch__grid">
    <div class="pch__copy">
      <span class="pch__num" aria-hidden="true">{num}</span>
      {eyebrow && <p class="pch__eyebrow" data-gsap-animate="fade-up">{eyebrow}</p>}
      <h2 class="pch__title" data-gsap-animate="fade-up">{title}</h2>

      <div class="pch__items">
        {list.map((it) => (
          <article class="pch__item" data-pch-item>
            {it.icon && ICONS[it.icon] && (
              <span class="pch__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                  {ICONS[it.icon].split('|').map((d) => <path d={d} />)}
                </svg>
              </span>
            )}
            <h3 class="pch__item-title">{it.title}</h3>
            <p class="pch__item-text">{it.text}</p>
          </article>
        ))}
      </div>
    </div>

    {image && (
      <div class="pch__frame" data-gsap-animate="fade-up">
        <img class="pch__img" src={withBase(image)} alt={imageAlt ?? ''} loading="lazy" />
      </div>
    )}
  </div>
</section>

<script>
  import { gsap } from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  gsap.registerPlugin(ScrollTrigger);

  document.addEventListener('astro:page-load', () => {
    document.querySelectorAll('[data-gsap-section^="pch-"]').forEach((section) => {
      if (section.dataset.pchInit) return;
      section.dataset.pchInit = '1';
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const frame = section.querySelector('[data-gsap-animate="fade-up"]');
      const items = section.querySelectorAll('[data-pch-item]');

      gsap.from(section.querySelectorAll('.pch__eyebrow, .pch__title'), {
        opacity: 0, y: 20, duration: 0.7, stagger: 0.06, ease: 'expo.out',
        scrollTrigger: { trigger: section, start: 'top 82%' },
      });
      if (items.length) {
        gsap.from(items, {
          opacity: 0, y: 16, duration: 0.6, stagger: 0.08, ease: 'expo.out',
          scrollTrigger: { trigger: section, start: 'top 78%' },
        });
      }
      if (frame) {
        gsap.from(frame, {
          opacity: 0, scale: 0.96, duration: 0.7, ease: 'expo.out',
          scrollTrigger: { trigger: section, start: 'top 78%' },
        });
      }
    });
  });
</script>

<style>
  .pch { padding-block: var(--space-xl); background-color: var(--bg-primary); }

  .pch__grid { display: grid; gap: var(--space-lg); }
  .pch__copy { display: grid; gap: var(--space-sm); position: relative; }
  .pch__num { font-family: var(--font-heading); font-weight: 600; font-size: var(--text-sm); color: var(--accent-hover); }
  .pch__eyebrow { font-size: var(--text-sm); letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-secondary); }
  .pch__title { font-family: var(--font-heading); font-weight: 600; font-size: clamp(1.8rem, 4vw, 2.6rem); letter-spacing: -0.02em; line-height: 1.1; color: var(--navy); }

  .pch__items { display: grid; gap: var(--space-md); margin-top: var(--space-sm); }
  .pch__item { display: grid; gap: var(--space-xs); min-width: 0; }
  .pch__icon {
    display: inline-flex; align-items: center; justify-content: center;
    width: 38px; height: 38px;
    border-radius: var(--radius-md);
    background-color: color-mix(in srgb, var(--accent) 10%, var(--bg-primary));
    color: var(--accent);
  }
  .pch__icon svg { width: 20px; height: 20px; }
  .pch__item-title { font-family: var(--font-heading); font-weight: 600; font-size: clamp(1.1rem, 1.4vw, 1.3rem); color: var(--navy); }
  .pch__item-text { font-size: var(--text-base); color: var(--text-secondary); line-height: 1.55; max-width: 52ch; }

  .pch__frame { border-radius: var(--radius-lg); overflow: hidden; box-shadow: var(--shadow-md); }
  .pch__img { width: 100%; height: 100%; object-fit: cover; display: block; aspect-ratio: 4 / 3; }

  /* solo — beat corto, sin foto, un solo item centrado */
  .pch[data-variant="solo"] .pch__grid { justify-items: center; text-align: center; max-width: 60ch; margin-inline: auto; }
  .pch[data-variant="solo"] .pch__items { justify-items: center; }
  .pch[data-variant="solo"] .pch__icon { width: 56px; height: 56px; }
  .pch[data-variant="solo"] .pch__icon svg { width: 28px; height: 28px; }

  /* photo-callout — checklist compacto con regla lateral */
  .pch[data-variant="photo-callout"] .pch__item { border-left: 2px solid var(--border); padding-left: var(--space-sm); }

  @media (min-width: 900px) {
    .pch[data-variant="duo"] .pch__grid,
    .pch[data-variant="photo-callout"] .pch__grid {
      grid-template-columns: 1fr 1fr;
      align-items: center;
      gap: var(--space-2xl);
    }
    .pch[data-variant="duo"] .pch__items { grid-template-columns: 1fr 1fr; }

    /* photo-callout: la foto va primero, más protagonismo visual */
    .pch[data-variant="photo-callout"] .pch__frame { order: -1; }
  }
</style>
```

- [ ] **Step 2: Verificar build**

Run: `npm run build`
Expected: `[build] Complete!` sin errores.

- [ ] **Step 3: Commit**

```bash
git add src/components/producto/ProductoChapter.astro
git commit -m "feat(producto): agrega ProductoChapter (variantes solo/duo/photo-callout)"
```

---

### Task 3: `ProductoPasilloMoment.astro` — capítulo 04, momento estelar

**Files:**
- Create: `src/components/producto/ProductoPasilloMoment.astro`

**Interfaces:**
- Consumes: nada de tareas anteriores.
- Produces: componente `ProductoPasilloMoment` con props `id: string`, `eyebrow?: string`, `title: string`, `text: string`, `image: string`, `imageAlt?: string`.

- [ ] **Step 1: Crear el componente**

```astro
---
// src/components/producto/ProductoPasilloMoment.astro
// /producto capítulo 04 — único momento "flagship" de la página (Pilar 2
// de marca, "pasillo infinito"). El titular reusa el copy ya validado de
// Home (SolutionSlide panel 02) para consistencia de marca; el cuerpo es
// el copy original de la feature "Venta omnicanal" de producto.astro. No
// se repite este tratamiento tipográfico en ningún otro capítulo.
import { withBase } from '../../utils/base.js';
const { id, eyebrow, title, text, image, imageAlt } = Astro.props;
---

<section id={id} class="ppm" data-gsap-section="ppm">
  <div class="ppm__frame" aria-hidden="true">
    <img class="ppm__img" src={withBase(image)} alt="" loading="lazy" />
    <div class="ppm__overlay"></div>
  </div>

  <div class="container ppm__copy">
    {eyebrow && <p class="ppm__eyebrow" data-gsap-animate="fade-up">{eyebrow}</p>}
    <h2 class="ppm__title" data-gsap-split="words">{title}</h2>
    <p class="ppm__text" data-gsap-animate="fade-up">{text}</p>
  </div>
</section>

<script>
  import { gsap } from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  gsap.registerPlugin(ScrollTrigger);

  function initPasillo() {
    const section = document.querySelector('[data-gsap-section="ppm"]');
    if (!section) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const titleEl = section.querySelector('[data-gsap-split="words"]');
    if (titleEl && !titleEl.dataset.split) {
      titleEl.dataset.split = '1';
      const words = titleEl.textContent.trim().split(/\s+/);
      titleEl.innerHTML = words
        .map((w) => `<span class="ppm__word-outer"><span class="ppm__word">${w}</span></span>`)
        .join(' ');
    }

    gsap.from(section.querySelectorAll('.ppm__word'), {
      y: '100%', opacity: 0, duration: 0.9, stagger: 0.05, ease: 'expo.out',
      scrollTrigger: { trigger: section, start: 'top 75%' },
    });

    const text = section.querySelector('[data-gsap-animate="fade-up"]');
    if (text) {
      gsap.from(text, {
        y: 20, opacity: 0, duration: 0.8, ease: 'expo.out',
        scrollTrigger: { trigger: section, start: 'top 70%' },
      });
    }

    const mm = gsap.matchMedia();
    mm.add('(min-width: 768px)', () => {
      gsap.to(section.querySelector('.ppm__img'), {
        yPercent: 10, ease: 'none',
        scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    });
  }

  document.addEventListener('astro:page-load', initPasillo);
</script>

<style>
  .ppm { position: relative; padding-block: var(--space-2xl); overflow: hidden; background-color: var(--navy); }

  .ppm__frame { position: absolute; inset: 0; z-index: 0; }
  .ppm__img { width: 100%; height: 100%; object-fit: cover; display: block; opacity: 0.55; }
  .ppm__overlay {
    position: absolute; inset: 0;
    background: linear-gradient(180deg, color-mix(in srgb, var(--navy) 55%, transparent), var(--navy) 92%);
  }

  .ppm__copy { position: relative; z-index: 1; display: grid; gap: var(--space-md); max-width: 60ch; }
  .ppm__eyebrow { font-size: var(--text-sm); letter-spacing: 0.1em; text-transform: uppercase; color: color-mix(in srgb, var(--on-accent) 70%, transparent); }
  .ppm__title {
    font-family: var(--font-heading);
    font-weight: 600;
    font-size: clamp(2.6rem, 6.5vw, 5rem);
    line-height: 1.05;
    letter-spacing: -0.03em;
    color: var(--on-accent);
  }
  .ppm__word-outer { display: inline-block; overflow: hidden; vertical-align: top; }
  .ppm__word { display: inline-block; }
  .ppm__text { font-size: clamp(1.1rem, 1.6vw, 1.35rem); color: color-mix(in srgb, var(--on-accent) 85%, transparent); line-height: 1.6; }
</style>
```

- [ ] **Step 2: Verificar build**

Run: `npm run build`
Expected: `[build] Complete!` sin errores.

- [ ] **Step 3: Commit**

```bash
git add src/components/producto/ProductoPasilloMoment.astro
git commit -m "feat(producto): agrega ProductoPasilloMoment (capítulo 04, momento estelar)"
```

---

### Task 4: `ProductoBridge.astro` — transición POS Mobile → BackOffice

**Files:**
- Create: `src/components/producto/ProductoBridge.astro`

**Interfaces:**
- Consumes: `/brand/Isotipo-logo.svg` (ya existe en `public/brand/`).
- Produces: componente `ProductoBridge` con prop `text: string`.

- [ ] **Step 1: Crear el componente**

```astro
---
// src/components/producto/ProductoBridge.astro
// /producto — banda angosta de transición entre el bloque POS Mobile y el
// bloque BackOffice (planeada en el spec del 13-08 §7, nunca construida
// porque el switcher la hacía innecesaria). Isotipo watermark + una frase
// puente corta.
import { withBase } from '../../utils/base.js';
const { text } = Astro.props;
---

<section class="pbr" data-gsap-section="pbr">
  <img class="pbr__mark" src={withBase('/brand/Isotipo-logo.svg')} alt="" aria-hidden="true" />
  <div class="container pbr__inner">
    <span class="pbr__rule" data-pbr-rule aria-hidden="true"></span>
    <p class="pbr__text" data-gsap-animate="fade-up">{text}</p>
  </div>
</section>

<script>
  import { gsap } from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  gsap.registerPlugin(ScrollTrigger);

  document.addEventListener('astro:page-load', () => {
    const section = document.querySelector('[data-gsap-section="pbr"]');
    if (!section) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const rule = section.querySelector('[data-pbr-rule]');
    const text = section.querySelector('[data-gsap-animate="fade-up"]');

    if (rule) {
      gsap.fromTo(rule, { scaleX: 0 }, {
        scaleX: 1, duration: 0.8, ease: 'expo.out', transformOrigin: 'left',
        scrollTrigger: { trigger: section, start: 'top 82%' },
      });
    }
    if (text) {
      gsap.from(text, {
        opacity: 0, y: 12, duration: 0.6, ease: 'expo.out',
        scrollTrigger: { trigger: section, start: 'top 78%' },
      });
    }
  });
</script>

<style>
  .pbr { position: relative; padding-block: var(--space-lg); background-color: var(--bg-secondary); overflow: hidden; }
  .pbr__mark {
    position: absolute;
    top: 50%;
    right: -5%;
    width: 320px;
    height: 320px;
    transform: translateY(-50%);
    opacity: 0.05;
    pointer-events: none;
  }
  .pbr__inner { display: grid; gap: var(--space-sm); max-width: 48ch; }
  .pbr__rule { display: block; width: 48px; height: 2px; background-color: var(--accent); }
  .pbr__text { font-family: var(--font-heading); font-size: clamp(1.3rem, 2.4vw, 1.8rem); color: var(--navy); letter-spacing: -0.01em; }
</style>
```

- [ ] **Step 2: Verificar build**

Run: `npm run build`
Expected: `[build] Complete!` sin errores.

- [ ] **Step 3: Commit**

```bash
git add src/components/producto/ProductoBridge.astro
git commit -m "feat(producto): agrega ProductoBridge (transición POS Mobile → BackOffice)"
```

---

### Task 5: `ProductoNetworkDiagram.astro` — capítulo 08, diagrama de nodos

**Files:**
- Create: `src/components/producto/ProductoNetworkDiagram.astro`

**Interfaces:**
- Consumes: técnica de cables SVG adaptada de `src/components/home/ArchitectureTeaser.astro` (medición por posición real de card/hub, no coordenadas fijas).
- Produces: componente `ProductoNetworkDiagram` con props `id: string`, `eyebrow?: string`, `title: string`, `inputs: Array<{ label: string, sub?: string }>`, `hub: { label: string, sub?: string }`, `outputs: Array<{ label: string, sub?: string }>`.

- [ ] **Step 1: Crear el componente**

```astro
---
// src/components/producto/ProductoNetworkDiagram.astro
// /producto capítulo 08 — "La red completa". Reusa la técnica de diagrama
// de ArchitectureTeaser.astro (Home §4.7): cables SVG medidos por posición
// real de cada card + paquetes que viajan (§16.3/§21.3 CLAUDE.md).
// Contenido propio: Stock + Maestros (entradas) → Red sincronizada (hub) →
// Entregas y despachos (salida). No repite contenido de Home, solo la
// técnica del diagrama.
const { id, eyebrow, title, inputs, hub, outputs } = Astro.props;
const inputList = inputs ?? [];
const outputList = outputs ?? [];
const hubNode = hub ?? { label: 'Red sincronizada' };
---

<section id={id} class="pnd" data-gsap-section="pnd">
  <div class="container pnd__head">
    {eyebrow && <p class="pnd__eyebrow" data-gsap-animate="fade-up">{eyebrow}</p>}
    <h2 class="pnd__title" data-gsap-animate="fade-up">{title}</h2>
  </div>

  <div class="container pnd__diagram" data-pnd-diagram>
    <svg class="pnd__cables" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      {inputList.map((_, i) => (
        <>
          <path class="pnd__cable" data-pnd-cable data-side="in" data-index={i} />
          <path class="pnd__beam" data-pnd-beam data-side="in" data-index={i} pathLength="100" />
        </>
      ))}
      {outputList.map((_, i) => (
        <>
          <path class="pnd__cable" data-pnd-cable data-side="out" data-index={i} />
          <path class="pnd__beam" data-pnd-beam data-side="out" data-index={i} pathLength="100" />
        </>
      ))}
    </svg>

    <div class="pnd__col pnd__col--in">
      {inputList.map((node, i) => (
        <div class="pnd__card" data-pnd-card="in" data-pnd-index={i}>
          <p class="pnd__card-label">{node.label}</p>
          {node.sub && <p class="pnd__card-sub">{node.sub}</p>}
        </div>
      ))}
    </div>

    <div class="pnd__hub" data-pnd-hub>
      <p class="pnd__hub-label">{hubNode.label}</p>
      {hubNode.sub && <p class="pnd__hub-sub">{hubNode.sub}</p>}
    </div>

    <div class="pnd__col pnd__col--out">
      {outputList.map((node, i) => (
        <div class="pnd__card" data-pnd-card="out" data-pnd-index={i}>
          <p class="pnd__card-label">{node.label}</p>
          {node.sub && <p class="pnd__card-sub">{node.sub}</p>}
        </div>
      ))}
    </div>
  </div>
</section>

<script>
  import { gsap } from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  gsap.registerPlugin(ScrollTrigger);

  function layoutCables(diagram) {
    const svg = diagram.querySelector('.pnd__cables');
    const hub = diagram.querySelector('[data-pnd-hub]');
    if (!svg || !hub || window.innerWidth < 1024) return;

    const box = diagram.getBoundingClientRect();
    const toPct = (x, y) => ({ x: ((x - box.left) / box.width) * 100, y: ((y - box.top) / box.height) * 100 });

    const hubBox = hub.getBoundingClientRect();
    const hubLeft = toPct(hubBox.left, hubBox.top + hubBox.height / 2);
    const hubRight = toPct(hubBox.right, hubBox.top + hubBox.height / 2);

    diagram.querySelectorAll('[data-pnd-card="in"]').forEach((card) => {
      const i = card.dataset.pndIndex;
      const cardBox = card.getBoundingClientRect();
      const start = toPct(cardBox.right, cardBox.top + cardBox.height / 2);
      const midX = (start.x + hubLeft.x) / 2;
      const d = `M ${start.x} ${start.y} C ${midX} ${start.y}, ${midX} ${hubLeft.y}, ${hubLeft.x} ${hubLeft.y}`;
      svg.querySelectorAll(`[data-side="in"][data-index="${i}"]`).forEach((p) => p.setAttribute('d', d));
    });

    diagram.querySelectorAll('[data-pnd-card="out"]').forEach((card) => {
      const i = card.dataset.pndIndex;
      const cardBox = card.getBoundingClientRect();
      const end = toPct(cardBox.left, cardBox.top + cardBox.height / 2);
      const midX = (hubRight.x + end.x) / 2;
      const d = `M ${hubRight.x} ${hubRight.y} C ${midX} ${hubRight.y}, ${midX} ${end.y}, ${end.x} ${end.y}`;
      svg.querySelectorAll(`[data-side="out"][data-index="${i}"]`).forEach((p) => p.setAttribute('d', d));
    });
  }

  function initNetworkDiagram() {
    const section = document.querySelector('[data-gsap-section="pnd"]');
    if (!section) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const diagram = section.querySelector('[data-pnd-diagram]');
    if (!diagram) return;

    layoutCables(diagram);
    const onResize = () => layoutCables(diagram);
    window.addEventListener('resize', onResize);
    window.addEventListener('load', onResize, { once: true });
    document.addEventListener('astro:before-swap', () => window.removeEventListener('resize', onResize), { once: true });

    if (reduced) return;

    gsap.from(section.querySelectorAll('[data-pnd-card]'), {
      opacity: 0, y: 16, duration: 0.5, stagger: 0.07, ease: 'expo.out',
      scrollTrigger: { trigger: diagram, start: 'top 75%' },
    });
    gsap.from(section.querySelector('[data-pnd-hub]'), {
      opacity: 0, scale: 0.85, duration: 0.6, ease: 'back.out(1.6)',
      scrollTrigger: { trigger: diagram, start: 'top 72%' },
    });

    ScrollTrigger.addEventListener('refresh', () => layoutCables(diagram));

    section.querySelectorAll('[data-pnd-cable]').forEach((cable) => {
      gsap.fromTo(cable, { opacity: 0 }, {
        opacity: 1, duration: 0.6,
        scrollTrigger: { trigger: diagram, start: 'top 70%' },
      });
    });

    section.querySelectorAll('[data-pnd-beam]').forEach((beam) => {
      gsap.set(beam, { attr: { 'stroke-dasharray': '16 100', 'stroke-dashoffset': 0 } });
      gsap.to(beam, {
        attr: { 'stroke-dashoffset': -116 },
        duration: 1.6,
        repeat: -1,
        delay: gsap.utils.random(0, 1.2),
        ease: 'power1.inOut',
        scrollTrigger: { trigger: diagram, start: 'top 85%', end: 'bottom top' },
      });
    });
  }

  document.addEventListener('astro:page-load', initNetworkDiagram);
</script>

<style>
  .pnd { padding-block: var(--space-2xl); background-color: var(--bg-secondary); }
  .pnd__head { display: grid; gap: var(--space-sm); margin-bottom: var(--space-xl); max-width: 70ch; }
  .pnd__eyebrow { font-size: var(--text-sm); letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-secondary); }
  .pnd__title { font-family: var(--font-heading); font-weight: 600; font-size: clamp(2.2rem, 5vw, 3.4rem); letter-spacing: -0.03em; line-height: 1.08; color: var(--navy); }

  .pnd__diagram { position: relative; display: grid; grid-template-columns: 1fr; gap: var(--space-xl); padding-block: var(--space-lg); }
  .pnd__cables { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 0; display: none; overflow: visible; }
  .pnd__cable { stroke: var(--border); stroke-width: 1.4; fill: none; opacity: 0; vector-effect: non-scaling-stroke; }
  .pnd__beam {
    stroke: var(--accent-hover);
    stroke-width: 2.2;
    stroke-linecap: round;
    fill: none;
    vector-effect: non-scaling-stroke;
    filter: drop-shadow(0 0 4px color-mix(in srgb, var(--accent) 75%, transparent));
  }

  .pnd__col { position: relative; z-index: 1; display: grid; gap: var(--space-md); }
  .pnd__card {
    background-color: var(--bg-primary);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: var(--space-md);
    display: grid;
    gap: var(--space-xs);
  }
  .pnd__card-label { font-family: var(--font-heading); font-size: var(--text-base); color: var(--text-primary); }
  .pnd__card-sub { font-size: var(--text-sm); color: var(--text-secondary); }

  .pnd__hub {
    position: relative;
    z-index: 1;
    justify-self: center;
    align-self: center;
    width: 100%;
    max-width: 240px;
    min-height: 160px;
    border-radius: 32px;
    background: var(--accent-gradient);
    color: var(--on-accent);
    display: grid;
    align-content: center;
    justify-items: center;
    gap: var(--space-xs);
    padding: var(--space-lg) var(--space-md);
    text-align: center;
    box-shadow: var(--shadow-lg);
  }
  .pnd__hub-label { font-family: var(--font-heading); font-size: var(--text-lg); line-height: 1.3; max-width: 16ch; }
  .pnd__hub-sub { font-size: var(--text-sm); color: color-mix(in srgb, var(--on-accent) 82%, transparent); }

  @media (min-width: 1024px) {
    .pnd__diagram { grid-template-columns: 1fr 240px 1fr; align-items: center; gap: var(--space-2xl); }
    .pnd__cables { display: block; }
    .pnd__col--out { justify-items: end; }
    .pnd__col--out .pnd__card { text-align: right; justify-items: end; }
  }
</style>
```

- [ ] **Step 2: Verificar build**

Run: `npm run build`
Expected: `[build] Complete!` sin errores.

- [ ] **Step 3: Commit**

```bash
git add src/components/producto/ProductoNetworkDiagram.astro
git commit -m "feat(producto): agrega ProductoNetworkDiagram (capítulo 08)"
```

---

### Task 6: `ProductoSystemStat.astro` — capítulo 09, cifras protagonistas

**Files:**
- Create: `src/components/producto/ProductoSystemStat.astro`

**Interfaces:**
- Consumes: nada de tareas anteriores.
- Produces: componente `ProductoSystemStat` con props `id: string`, `eyebrow?: string`, `title: string`, `text: string`, `stats: Array<{ value: string, label: string, isNumeric: boolean }>`. Si `isNumeric` es `true`, `value` debe ser parseable con `Number(value)` para el conteo ascendente.

- [ ] **Step 1: Crear el componente**

```astro
---
// src/components/producto/ProductoSystemStat.astro
// /producto capítulo 09 — "Control del sistema". Cifras protagonistas en
// el mismo lenguaje visual que el slide "Cómo operamos" del deck de evento
// Perú (MO2-Especificacion-Slides-Evento-Peru.md, slide 10) — reusa
// vocabulario de marca ya validado entre sitio y keynote.
const { id, eyebrow, title, text, stats } = Astro.props;
const list = stats ?? [];
---

<section id={id} class="pss" data-gsap-section="pss">
  <div class="container pss__grid">
    <div class="pss__copy">
      {eyebrow && <p class="pss__eyebrow" data-gsap-animate="fade-up">{eyebrow}</p>}
      <h2 class="pss__title" data-gsap-animate="fade-up">{title}</h2>
      <p class="pss__text" data-gsap-animate="fade-up">{text}</p>
    </div>

    <div class="pss__stats">
      {list.map((s, i) => (
        <div class="pss__stat" data-pss-stat data-numeric={s.isNumeric ? 'true' : 'false'} data-value={s.isNumeric ? s.value : undefined} data-index={i}>
          <p class="pss__stat-value">{s.value}</p>
          <p class="pss__stat-label">{s.label}</p>
        </div>
      ))}
    </div>
  </div>
</section>

<script>
  import { gsap } from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  gsap.registerPlugin(ScrollTrigger);

  document.addEventListener('astro:page-load', () => {
    const section = document.querySelector('[data-gsap-section="pss"]');
    if (!section) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const copy = section.querySelectorAll('[data-gsap-animate="fade-up"]');
    if (!reduced) {
      gsap.from(copy, {
        opacity: 0, y: 20, duration: 0.7, stagger: 0.08, ease: 'expo.out',
        scrollTrigger: { trigger: section, start: 'top 80%' },
      });
    }

    section.querySelectorAll('[data-pss-stat]').forEach((stat, i) => {
      if (reduced) return;
      const isNumeric = stat.dataset.numeric === 'true';
      const valueEl = stat.querySelector('.pss__stat-value');

      if (isNumeric && valueEl) {
        const target = Number(stat.dataset.value) || 0;
        const counter = { n: 0 };
        gsap.to(counter, {
          n: target,
          duration: 1,
          ease: 'power1.out',
          onUpdate: () => { valueEl.textContent = String(Math.round(counter.n)); },
          scrollTrigger: { trigger: section, start: 'top 78%' },
        });
      } else {
        gsap.from(stat, {
          opacity: 0, y: 14, duration: 0.5, delay: i * 0.1, ease: 'power2.out',
          scrollTrigger: { trigger: section, start: 'top 78%' },
        });
      }
    });
  });
</script>

<style>
  .pss { padding-block: var(--space-2xl); background-color: var(--bg-primary); }
  .pss__grid { display: grid; gap: var(--space-xl); }

  .pss__copy { display: grid; gap: var(--space-sm); max-width: 56ch; }
  .pss__eyebrow { font-size: var(--text-sm); letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-secondary); }
  .pss__title { font-family: var(--font-heading); font-weight: 600; font-size: clamp(2.2rem, 5vw, 3.4rem); letter-spacing: -0.03em; line-height: 1.08; color: var(--navy); }
  .pss__text { font-size: clamp(1.1rem, 1.5vw, 1.3rem); color: var(--text-secondary); line-height: 1.6; }

  .pss__stats { display: grid; gap: var(--space-md); }
  .pss__stat { border-top: 1px solid var(--border); padding-block: var(--space-sm); }
  .pss__stat-value { font-family: var(--font-mono); font-weight: 600; font-size: clamp(1.5rem, 3vw, 2.2rem); color: var(--accent-hover); letter-spacing: -0.01em; }
  .pss__stat-label { font-size: var(--text-sm); color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em; margin-top: var(--space-xs); }

  @media (min-width: 900px) {
    .pss__grid { grid-template-columns: 1fr 1fr; align-items: center; }
    .pss__stats { grid-template-columns: repeat(3, 1fr); }
    .pss__stat { border-top: none; border-left: 1px solid var(--border); padding-inline-start: var(--space-md); padding-block: 0; }
    .pss__stat:first-child { border-left: none; padding-inline-start: 0; }
  }
</style>
```

- [ ] **Step 2: Verificar build**

Run: `npm run build`
Expected: `[build] Complete!` sin errores.

- [ ] **Step 3: Commit**

```bash
git add src/components/producto/ProductoSystemStat.astro
git commit -m "feat(producto): agrega ProductoSystemStat (capítulo 09)"
```

---

### Task 7: Reescribir `producto.astro` — integración completa + eliminar el switcher

**Files:**
- Modify: `src/pages/producto.astro` (reemplazo completo del body, desde el import de `ProductoSwitcher` en adelante)
- Delete: `src/components/producto/ProductoSwitcher.astro`

**Interfaces:**
- Consumes: los 6 componentes de Tasks 1-6 + `ProductoFeatureBento`, `ProductoFeatureSticky`, `ProductoHero`, `ProductoScaleBand`, `CtaClose` (sin cambios de código, solo props distintas).
- Produces: `/producto` funcional de punta a punta — este es el punto de integración real, la primera vez que todo el conjunto se verifica visualmente.

- [ ] **Step 1: Reemplazar `src/pages/producto.astro` completo**

```astro
---
// src/pages/producto.astro
// Deep-dive de producto (§5 doc maestro + spec 2026-08-24). Scroll único de
// 9 capítulos narrativos agrupados por momento del flujo de trabajo (spec:
// docs/superpowers/specs/2026-08-24-mobile-one-producto-chapters-design.md).
// Reemplaza el modelo de switcher (ver git history de este archivo antes de
// este commit para el modelo anterior).
import Layout from '../layouts/Layout.astro';
import ProductoHero from '../components/producto/ProductoHero.astro';
import ProductoChapterNav from '../components/producto/ProductoChapterNav.astro';
import ProductoChapter from '../components/producto/ProductoChapter.astro';
import ProductoPasilloMoment from '../components/producto/ProductoPasilloMoment.astro';
import ProductoFeatureSticky from '../components/producto/ProductoFeatureSticky.astro';
import ProductoBridge from '../components/producto/ProductoBridge.astro';
import ProductoFeatureBento from '../components/producto/ProductoFeatureBento.astro';
import ProductoNetworkDiagram from '../components/producto/ProductoNetworkDiagram.astro';
import ProductoSystemStat from '../components/producto/ProductoSystemStat.astro';
import ProductoScaleBand from '../components/producto/ProductoScaleBand.astro';
import CtaClose from '../components/home/CtaClose.astro';

const schemaData = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Mobile One — Producto',
  url: 'https://mobileone.dotsolutions.io/producto',
};

const chapters = [
  { id: 'abrir-turno', num: '01', label: 'Abrir turno', group: 'pos' },
  { id: 'armar-venta', num: '02', label: 'Armar la venta', group: 'pos' },
  { id: 'cerrar-venta', num: '03', label: 'Cerrar la venta', group: 'pos' },
  { id: 'pasillo-infinito', num: '04', label: 'Pasillo infinito', group: 'pos' },
  { id: 'despues-de-vender', num: '05', label: 'Después de vender', group: 'pos' },
  { id: 'recepcion', num: '06', label: 'Recepción', group: 'pos' },
  { id: 'en-la-tienda', num: '07', label: 'En la tienda', group: 'backoffice' },
  { id: 'red-completa', num: '08', label: 'La red completa', group: 'backoffice' },
  { id: 'control-sistema', num: '09', label: 'Control del sistema', group: 'backoffice' },
];
---

<Layout
  title="Producto — POS Mobile y BackOffice | Mobile One"
  description="Conoce las funcionalidades de Mobile One: venta móvil, omnicanalidad, promociones, recepción de mercadería y administración centralizada."
  image="/images/og-default.png"
  schemaData={schemaData}
>
  <ProductoHero
    eyebrow="Producto"
    headline={[
      { text: 'Un' }, { text: 'producto,' }, { text: 'dos' }, { text: 'superficies:' },
      { text: 'el', accent: 'accent' }, { text: 'terminal', accent: 'accent' }, { text: 'de', accent: 'accent' }, { text: 'venta', accent: 'accent', break: true },
      { text: 'y' }, { text: 'el', accent: 'navy' }, { text: 'panel', accent: 'navy' }, { text: 'de', accent: 'navy' }, { text: 'administración', accent: 'navy' },
    ]}
    subheadline="Todo lo que necesitas para operar la venta directamente en tu terminal de cobro, y todo lo que necesitas para controlarla desde un panel web, en un solo sistema."
  />

  <ProductoChapterNav chapters={chapters} />

  <ProductoChapter
    id="abrir-turno"
    variant="solo"
    eyebrow="POS Mobile"
    num="01"
    title="Abrir turno"
    items={[
      { icon: 'qr', title: 'Acceso rápido por QR', text: 'El vendedor escanea su credencial y el QR de la tienda directamente en el terminal; el sistema valida vigencia y pertenencia antes de dejarlo operar.' },
    ]}
  />

  <ProductoChapter
    id="armar-venta"
    variant="duo"
    eyebrow="POS Mobile"
    num="02"
    title="Armar la venta"
    image="/images/solucion-fila.webp"
    imageAlt="Vendedora cobrando con terminal Mobile One en la sala de venta"
    items={[
      { icon: 'search', title: 'Catálogo con categorías y búsqueda', text: 'Navega el catálogo completo por categoría y subcategoría, o busca un producto directamente por nombre o código — con su detalle, variantes y el pasillo infinito de stock de toda la red al tiro.' },
      { icon: 'cart', title: 'Carrito de venta flexible', text: 'Crear, modificar y eliminar líneas de producto libremente. Cantidad mínima de línea es 1; para retirar un producto se ejecuta la acción explícita de eliminar, evitando errores de digitación.' },
    ]}
  />

  <ProductoChapter
    id="cerrar-venta"
    variant="photo-callout"
    eyebrow="POS Mobile"
    num="03"
    title="Cerrar la venta"
    image="/images/retail-payment-scene-mercadopago.webp"
    imageAlt="Vendedora de retail cobrando a un cliente en una tienda de ropa"
    items={[
      { title: 'Cobro sin fricción', text: 'El monto a pagar aparece automáticamente en la pantalla de cobro. Soporta pagos mixtos: efectivo + tarjeta, o dos tarjetas distintas, con cálculo automático de vuelto.' },
      { icon: 'receipt', title: 'Documentos electrónicos al instante', text: 'Boleta o factura se genera e imprime apenas se aprueba el pago, integrado a tu facturador electrónico.' },
    ]}
  />

  <ProductoPasilloMoment
    id="pasillo-infinito"
    eyebrow="POS Mobile — 04"
    title='El "sin stock" se vuelve un pasillo infinito'
    text="Tres modalidades en la misma transacción: venta directa, retiro programado en otra tienda (con fecha) y despacho a domicilio — el pasillo infinito hace posible despachar multidirección cuando un mismo pedido va a más de un destino."
    image="/images/solucion-stock.webp"
    imageAlt="Vendedor consultando stock de toda la red para despachar un pedido"
  />

  <ProductoFeatureSticky
    id="despues-de-vender"
    eyebrow="POS Mobile"
    title="Después de vender"
    features={[
      { title: 'Búsqueda y postventa', text: 'Buscador de ventas por folio, RUT/cliente o fecha, con reimpresión de documentos y generación de tickets de cambio. También busca clientes existentes para asignarlos directo a la venta.' },
      { title: 'Resumen de ventas del día', text: 'El vendedor consulta el total vendido y el detalle de cada boleta o factura emitida en su turno, sin salir del terminal ni pedirle el reporte a otra persona.' },
    ]}
  />

  <ProductoChapter
    id="recepcion"
    variant="photo-callout"
    eyebrow="POS Mobile"
    num="06"
    title="Recepción de mercadería"
    image="/images/solucion-bulto.webp"
    imageAlt="Trabajador escaneando un bulto sellado con el terminal"
    items={[
      { title: 'Recepción de mercadería', text: 'Ingreso vinculado a documentos de transferencia del ERP (almacenes en tránsito), escaneo de código de barras (reconoce EAN-13 y UPC-A automáticamente), cuadratura de cantidades y comprobante de recepción.' },
    ]}
  />

  <ProductoBridge text="Del mostrador al panel de control." />

  <ProductoFeatureBento
    id="en-la-tienda"
    eyebrow="BackOffice"
    title="Todo lo que pasó en la tienda, en un solo lugar"
    image="/images/solucion-backoffice.webp"
    imageAlt="Encargada de tienda revisando ventas y stock en un panel web desde laptop y tablet"
    features={[
      { title: 'Gestión de ventas', text: 'Consulta de todas las ventas por tienda, estado o folio, con detalle completo: transacción, cliente, ítems, pagos y resumen financiero. Descarga de DTE en PDF.' },
      { title: 'Carros con pago pendiente', text: 'Visibilidad de ventas que quedaron a mitad de camino en el POS, con verificación directa del estado del cobro en Mercado Pago para decidir si se completa o se retira.' },
      { title: 'Trazabilidad y auditoría', text: 'Nada se borra: las transacciones con incidencias se marcan como no visibles pero se conservan para auditoría completa.' },
    ]}
  />

  <ProductoNetworkDiagram
    id="red-completa"
    eyebrow="BackOffice"
    title="La red completa, siempre sincronizada"
    inputs={[
      { label: 'Stock por tienda y almacén', sub: 'Consulta y ajusta el stock de cada producto en cada tienda y almacén, sincronizado con tu ERP.' },
      { label: 'Maestros centralizados', sub: 'Tiendas, artículos, clientes y catálogo sincronizados con tu ERP.' },
    ]}
    hub={{ label: 'Red sincronizada', sub: 'Una sola fuente de verdad' }}
    outputs={[
      { label: 'Entregas y despachos', sub: 'Sigue cada despacho por separado — dirección, número de seguimiento y estado.' },
    ]}
  />

  <ProductoSystemStat
    id="control-sistema"
    eyebrow="BackOffice"
    title="Control del sistema"
    text="Gestión de usuarios (perfiles, credenciales QR, vigencia) y de releases (registro de versiones), con activación/desactivación de funcionalidades por cliente vía feature flags — sin tocar código ni afectar a otros clientes."
    stats={[
      { value: 'F-00 → F-18', label: 'feature flags', isNumeric: false },
      { value: 'multi-tenant', label: 'un solo código base', isNumeric: false },
      { value: 'cloud', label: 'sin on-premise', isNumeric: false },
    ]}
  />

  <ProductoScaleBand
    stat={1}
    statLabel="Código base para toda la red"
    title="Una funcionalidad, disponible para todos los clientes — activable donde se necesite"
    text="Mobile One corre sobre un único código base. Las diferencias entre clientes se gestionan con feature flags, no con desarrollos a medida. Esto significa releases más rápidos, menos bugs exclusivos de un cliente y una plataforma que mejora para todos al mismo tiempo."
  />

  <CtaClose
    title="Quiero ver el producto con mi catálogo"
    body="Agenda una demo de 30 minutos y te mostramos Mobile One funcionando con tu catálogo."
    ctaText="Agendar demo"
    ctaHref="/contacto"
    ctaSecondaryText="Hablar con un especialista"
    ctaSecondaryHref="/contacto"
  />
</Layout>
```

- [ ] **Step 2: Eliminar el switcher (sin más consumidores)**

```bash
git rm src/components/producto/ProductoSwitcher.astro
```

- [ ] **Step 3: Verificar build**

Run: `npm run build`
Expected: `[build] Complete!` sin errores. Si falla por un import roto o un prop mal tipado, revisar el mensaje — usualmente apunta al archivo y línea exactos.

- [ ] **Step 4: Verificación visual — desktop (1440px)**

Run: `npm run dev`, abrir `http://localhost:4321/producto` en el navegador a 1440px de ancho.

Checklist (marcar cada uno):
- [ ] El rail de capítulos aparece a la izquierda una vez que se pasa el Hero (no antes).
- [ ] Al scrollear, el capítulo activo se resalta en el rail (opacidad completa vs. 0.45 del resto) y hay un separador visual entre el bloque POS Mobile (01-06) y BackOffice (07-09).
- [ ] Click en un ítem del rail salta al capítulo correspondiente.
- [ ] Capítulo 01 (Abrir turno) se ve como un beat corto centrado, sin foto.
- [ ] Capítulo 02 (Armar la venta) muestra foto + 2 sub-features lado a lado.
- [ ] Capítulo 03 (Cerrar la venta) muestra foto grande primero + checklist de 2 features.
- [ ] Capítulo 04 (Pasillo infinito) se ve claramente distinto a los demás — tipografía grande sobre fondo navy con la foto de fondo.
- [ ] Capítulo 05 (Después de vender) es el ledger sticky con 2 filas (ya construido, ahora con menos features).
- [ ] Capítulo 06 (Recepción) es foto-callout con 1 sola feature.
- [ ] El Bridge muestra la frase "Del mostrador al panel de control." entre los dos bloques.
- [ ] Capítulo 07 (En la tienda) es el bento con 3 cards (ya construido, ahora con menos features).
- [ ] Capítulo 08 (La red completa) muestra el diagrama con 2 cards de entrada, 1 hub central y 1 card de salida, cables conectando cada uno.
- [ ] Capítulo 09 (Control del sistema) muestra las 3 cifras (F-00 → F-18 / multi-tenant / cloud) en fila.
- [ ] ScaleBand y CtaClose se ven sin cambios al final.

- [ ] **Step 5: Verificación visual — mobile (375px)**

Repetir en el navegador a 375px de ancho.

Checklist:
- [ ] El rail de capítulos NO se muestra como lista — en su lugar aparece un contador simple (`01 / 09`, etc.) fijo en una esquina.
- [ ] El contador se actualiza al scrollear entre capítulos.
- [ ] Ningún capítulo tiene overflow horizontal (revisar especialmente 02/03/06 con imagen + texto, y 08 con el diagrama).
- [ ] El diagrama del capítulo 08 se apila verticalmente (entradas → hub → salida) sin cables (los cables SVG solo se dibujan en `min-width: 1024px`).
- [ ] Capítulo 04 (Pasillo infinito) sigue siendo legible — el parallax de la imagen de fondo está gateado a `min-width: 768px`, así que en mobile la imagen queda estática.

- [ ] **Step 6: Grep de reglas heredadas**

```bash
grep -rn "font-weight: 7\|font-weight: 8" src/components/producto/
```
Expected: sin resultados.

```bash
grep -n "og:image" dist/producto/index.html
```
Expected: al menos una línea con una URL absoluta (`https://...`).

- [ ] **Step 7: Nota de artefacto conocido (no bloqueante)**

`ProductoFeatureBento.astro` reusado en el capítulo 07 conserva las reglas CSS `.pfb__card--4` y `.pfb__card--7` (pensadas para el layout de 9 cards original). Con solo 3 cards en este capítulo esas reglas no calzan con ningún elemento — es CSS muerto pero inofensivo (no genera error ni layout roto). No se modifica `ProductoFeatureBento.astro` en este plan porque el spec lo marca como "reusado sin tocar". Si se quiere limpiar, es una tarea aparte.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "$(cat <<'EOF'
feat(producto): rediseña /producto en 9 capítulos narrativos, elimina switcher

Reemplaza el modelo de tabs POS Mobile/BackOffice por un scroll único
agrupado por momento del flujo de trabajo, con "pasillo infinito" como
momento estelar propio y un rail de navegación sticky. Cero features
perdidas — las 16 originales se reorganizan en 9 capítulos, mismo copy.

Spec: docs/superpowers/specs/2026-08-24-mobile-one-producto-chapters-design.md
EOF
)"
```

---

## Self-Review (completado durante la escritura de este plan)

**Cobertura del spec:** los 9 capítulos, el rail, el Bridge, el mapeo de las 16 features originales, la regla de cero assets nuevos, y la eliminación del switcher están cubiertos por las Tasks 1-7. La sección "Fuera de alcance" del spec (no tocar `ProductoHero.astro`, no generar media nueva) se respeta — ningún task la contradice.

**Placeholders:** ninguno — todo el copy, todas las rutas de imagen y todo el código de cada componente está completo en cada step.

**Consistencia de tipos:** `id`/`variant`/`items`/`icon` de `ProductoChapter` se usan igual en Task 2 (definición) y Task 7 (uso). `stats[].isNumeric` de `ProductoSystemStat` se usa igual en Task 6 y Task 7. Los 9 `id` de `chapters` en Task 7 coinciden exactamente con los `id` que `ProductoChapterNav` busca vía `document.getElementById` (Task 1).
