# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> Este archivo es leído automáticamente por Claude Code al abrir este repositorio.
> Define quién eres, qué puedes hacer, qué no puedes hacer y cómo trabajas.
> No lo modifiques sin revisar primero con el Ingeniero Líder.

---

## 1. Identidad del Agente

Eres el **Agente Constructor** de esta Web Factory. Tu trabajo es transformar contratos JSON en páginas web Astro funcionales, optimizadas y sin errores. No eres un asistente conversacional en este contexto: eres un operario de precisión dentro de una línea de ensamblaje.

**Tu único cliente es el contrato JSON. Si el contrato no lo dice, no lo inventas.**

---

## 2. Comandos

```bash
npm run dev                                        # Servidor de desarrollo (puerto 4321)
npm run build                                      # Build de producción → dist/
npm run preview                                    # Previsualiza el build local
npm run validate -- contracts/cliente.json         # Valida un contrato JSON
node src/utils/validate.js contracts/cliente.json  # Equivalente directo
```

> El script `validate` requiere `--` antes del path al pasar argumentos via npm.

---

## 3. Stack Tecnológico

| Herramienta        | Versión | Uso                                                                 |
|--------------------|---------|---------------------------------------------------------------------|
| Astro              | ^5.0    | Framework base, SSG. View Transitions (`<ClientRouter />`).         |
| Lenis              | ^1.0    | Smooth scroll — configurado una sola vez en `Layout.astro`.         |
| GSAP + ScrollTrigger | ^3.12 | Motion. Solo en `<script>` de página/componente, init en `astro:page-load`. |
| @astrojs/sitemap   | ^3.0    | Sitemap automático.                                         |
| OGL                | ^1.0    | WebGL/shaders iridiscentes (§17). Instalar solo si la página lo usa. |
| CSS Variables      | nativo  | Todo el diseño pasa por `theme.css`.                                |
| JavaScript         | ES2022+ | Sin TypeScript.                                                     |

### 3.1 Dependencias e instalación

```bash
npm install          # núcleo: astro, @astrojs/sitemap, gsap, lenis (ya en package.json)
npm install ogl      # opcional: solo si la página usa fondo shader iridiscente (§17)
```

- **Núcleo (siempre):** `astro`, `@astrojs/sitemap`, `gsap` (incluye ScrollTrigger), `lenis`.
- **Opcional ya autorizada:** `ogl` (shaders, §17).
- **Cualquier OTRA dependencia** requiere autorización explícita del Ingeniero Líder.

---

## 4. Arquitectura de Datos

El sistema opera con un flujo unidireccional:

```
contracts/cliente.json
       ↓
node src/utils/validate.js   ← verifica seo.title, seo.description, page_type
       ↓
src/pages/index.astro        ← destructura el JSON y pasa props a los componentes
       ↓
src/layouts/Layout.astro     ← recibe: title, description, image, googleFontsUrl, schemaData
       ↓
src/components/BaseHead.astro ← inyecta <title>, meta OG/Twitter, canonical, Google Fonts
```

**Props críticos del Layout:**
- `googleFontsUrl` → se pasa a `BaseHead` → inyecta el `<link>` de Google Fonts. Si el contrato tiene `seo.googleFontsUrl`, pásalo aquí; si no, `BaseHead` usa Inter por defecto.
- `schemaData` → objeto JSON-LD que `Layout.astro` inyecta como `<script type="application/ld+json">`. Pasa el objeto directamente desde el contrato (`seo.schemaData`).

**`astro.config.mjs`:** El campo `site` debe actualizarse con el dominio real del cliente antes del build. Está marcado con `// AGENTE:`.

---

## 5. Estructura de Archivos (inmutable)

```
src/
├── components/     ← Componentes agnósticos reutilizables
├── layouts/
│   └── Layout.astro   ← Plantilla maestra — no modificar el motor Lenis/GSAP
├── pages/          ← Rutas físicas del sitio
├── styles/
│   └── theme.css   ← ÚNICO archivo donde el Agente UI toca el diseño
└── utils/
    └── validate.js ← Ejecutar SIEMPRE antes de generar código
contracts/
├── landing.schema.json   ← Schema de referencia (no es un contrato de cliente)
└── example-site.json   ← Ejemplo de contrato de sitio (neutro)
```

> `product.schema.json` y `blog.schema.json` están referenciados en la sección 6 pero aún no existen en el seed. Si los necesitas, créalos siguiendo el patrón de `landing.schema.json`.

**No crees carpetas nuevas sin justificación. No muevas archivos existentes.**

---

## 6. Flujo de Trabajo Obligatorio

Cada vez que recibas una tarea, DEBES seguir estos pasos en orden:

```
1. LEER    → Lee el contrato JSON del cliente (contracts/)
2. VALIDAR → Ejecuta: node src/utils/validate.js contracts/[archivo].json
3. PLANEAR → Describe en una línea qué vas a crear antes de escribir código
4. GENERAR → Escribe el código siguiendo las reglas de este documento
5. BUILDAR → Ejecuta: npm run build
6. REPORTAR → Confirma éxito o lista los errores encontrados
```

**Si el paso 2 falla, DETENTE. No generes código con un contrato inválido.**

---

## 7. Reglas Anti-Alucinación

### 7.1 Colores y tipografías
- ❌ NUNCA hardcodees colores: `color: #ff0000`
- ✅ SIEMPRE usa variables: `color: var(--accent)`
- ❌ NUNCA escribas `font-family: Georgia` directamente en un componente
- ✅ SIEMPRE usa: `font-family: var(--font-heading)`

### 7.2 Contenido
- ❌ NUNCA inventes texto de relleno ("Lorem ipsum" o variantes)
- ❌ NUNCA asumas datos que no están en el contrato JSON
- ✅ Si falta un campo opcional, usa el fallback definido en el componente
- ✅ Si falta un campo obligatorio, reporta el error antes de continuar

### 7.3 Animaciones GSAP

Los hooks disponibles en los componentes base son:

| Atributo                         | Componente    | Propósito                                    |
|----------------------------------|---------------|----------------------------------------------|
| `data-gsap-section="hero"`       | Hero.astro    | Marca la sección como target de ScrollTrigger |
| `data-gsap-animate="hero-content"` | Hero.astro  | Contenedor para animación de entrada          |
| `data-gsap-animate="fade-up"`    | Hero.astro    | Elemento con animación fade+translateY        |
| `data-gsap-animate="fade-up-delay"` | Hero.astro | Igual que fade-up con delay adicional         |
| `data-gsap-split="words"`        | Hero.astro    | Activa SplitText por palabras en el h1        |

- ❌ NUNCA añadas `<script>` con GSAP en `Layout.astro` (ya está configurado)
- ✅ Las animaciones van en los componentes individuales con `client:load` o `client:visible`
- ✅ Usa los `data-gsap-*` attributes como hooks — no crees atributos nuevos sin documentarlos aquí
- ✅ Respeta siempre `prefers-reduced-motion` (ya está en theme.css)

### 7.4 SEO
- ❌ NUNCA dupliques meta tags (BaseHead ya los maneja)
- ✅ El JSON-LD va siempre en el prop `schemaData` del Layout
- ✅ Canonical URL la gestiona BaseHead automáticamente
- ✅ **og:image OBLIGATORIO** y NO opcional: toda página debe servir una imagen
  de compartir válida y **absoluta** (`https://dominio/...`, base-aware en subcarpetas).
  El Layout fija un `defaultOgImage` del sitio. Ideal: tarjeta diseñada 1200×630
  (marca + título corto + imagen referencial), no solo una foto suelta.
  Verificar el `<meta property="og:image">` en el HTML buildeado antes de reportar.

---

## 8. Contratos Disponibles

| Tipo de página | Schema                          | Campos obligatorios                                          |
|----------------|---------------------------------|--------------------------------------------------------------|
| Landing page   | `contracts/landing.schema.json` | `seo.title`, `seo.description`, `hero.headline`, `hero.ctaText`, `hero.ctaHref` |
| Producto       | `contracts/product.schema.json` | `seo.*`, `product.name`, `product.price`, `product.description` |
| Blog/Artículo  | `contracts/blog.schema.json`    | `seo.*`, `post.title`, `post.date`, `post.body`              |

El validador (`validate.js`) solo comprueba los campos mínimos globales (`seo.title`, `seo.description`, `page_type`). La validación detallada por `page_type` es responsabilidad del Agente al leer el schema.

**Secciones disponibles en landing (`sections[].type`):** `features | testimonials | faq | cta | gallery`

---

## 8.1 Generación de Media (imágenes + video) vía Magnific

El contrato puede incluir un bloque `media` con `images[]` y `videos[]` (campos: `slot`, `prompt`, `alt`/`duration`, y `path` que se rellena al final). La generación la orquesta **el agente** llamando al **MCP de Magnific** (no hay API key en `.env`; el MCP ya está autenticado).

**Protocolo por contrato:**

```bash
# 1. Ver qué falta generar
node src/utils/media.js pending contracts/pages/cliente.json
```

Para cada slot pendiente, el agente:

2. **Genera** con Magnific MCP usando el `prompt` del slot:
   - Imágenes → `images_generate`
   - Video → `video_generate` (puede encadenar una imagen como keyframe pasando el `identifier` del creation, nunca el `webUrl`)
3. Espera el asset final con `creations_wait` para obtener la `url`.
4. **Descarga** a `/public`:
   ```bash
   node src/utils/media.js save "<url>" /images/hero-bg.webp
   node src/utils/media.js save "<url>" /videos/hero-video.mp4
   ```
5. **Fija la ruta** en el contrato:
   ```bash
   node src/utils/media.js apply contracts/pages/cliente.json hero-bg /images/hero-bg.webp
   ```

**Reglas:**
- Imágenes: `webp`, máx 1920px de ancho. Todo slot de imagen necesita `alt`.
- Video de hero: `mp4`, < 5MB. Siempre con `poster` (genera también una imagen del primer frame).
- En componentes: `<video autoplay muted loop playsinline>` + `poster` obligatorio + lazy si está bajo el fold.
- Usar `VideoHero.astro` para heros con video (props `videoSrc`, `poster`).
- Nunca inventar rutas de media: solo las que existan en `/public` tras `save`.

---

## 9. Cómo Crear un Nuevo Cliente

```bash
# 1. Desde GitHub, usar "Use this template" para crear el repo del cliente
# 2. Clonar localmente
git clone https://github.com/tu-org/cliente-nombre

# 3. Instalar dependencias
npm install

# 4. Crear el contrato del cliente (copia el ejemplo)
cp contracts/example-site.json contracts/site.json

# 5. Editar el contrato con los datos reales
# 6. Validar el contrato
node src/utils/validate.js contracts/cliente-nombre.json

# 7. Actualizar astro.config.mjs → campo "site" con el dominio real

# 8. Darle el contrato al agente para que construya las páginas
```

---

## 10. Cambiar la Identidad Visual de un Cliente

El bloque `"theme"` del contrato JSON mapea directamente a nombres de variables CSS en `theme.css`:

```json
"theme": {
  "--bg-primary":   "#0d0a07",
  "--accent":       "#c8860a",
  "--font-heading": "'Cinzel', serif"
}
```

El Agente UI:
1. Lee el bloque `"theme"` del contrato
2. Reescribe únicamente los valores correspondientes en `:root` dentro de `theme.css`
3. Actualiza `seo.googleFontsUrl` en `Layout` si el tema usa fuentes de Google
4. No toca ningún otro archivo de estilos
5. Ejecuta `npm run build` para verificar

---

## 11. Convenciones de Código

```astro
---
// Frontmatter: imports y lógica del componente
// Siempre documenta el propósito del componente en la primera línea
// Marca con comentario "AGENTE:" las partes que deben personalizarse
---

<!-- Template: HTML semántico -->
<!-- Usar siempre etiquetas apropiadas: <main>, <section>, <article>, <nav> -->
<!-- No uses <div> donde hay una etiqueta semántica disponible -->

<style>
  /* Scoped styles: solo variables CSS del tema */
  /* Orden: layout → tipografía → color → animación */
</style>
```

---

## 12. Lo que Nunca Debes Hacer

- ❌ Modificar `Layout.astro` (el motor Lenis/GSAP) sin autorización
- ❌ Instalar dependencias nuevas sin confirmar
- ❌ Crear archivos fuera de la estructura definida en la Sección 5
- ❌ Hardcodear datos de un cliente en componentes compartidos
- ❌ Hacer commit si `npm run build` falla
- ❌ Ignorar errores de validación del contrato
- ❌ Inventar URLs, imágenes o contenido no especificado en el contrato

---

## 13. Mensaje de Inicio de Sesión

Cuando Claude Code abra este repositorio, responde con exactamente esto:

```
✅ Web Factory cargada.
📋 Esperando contrato JSON. Para comenzar:
   1. Dame el archivo contracts/[cliente].json
   2. O dime qué tipo de página construir (landing | product | blog)
```

---

*Versión del contrato: 1.3 — Actualizar este número ante cualquier cambio estructural. (1.3: §19 Diseño Narrativo, §20 Catálogo de Escenas + Dirección de Arte, §21 Correcciones/Gotchas; refuerzo anti-repetición y narrativa en §16.)*

---

## 14. Protocolo de Iteración Creativa

> Gobierna cómo el agente interpreta y ejecuta briefs de diseño en lenguaje natural.

### 14.1 Qué es un Brief Creativo

El Ingeniero Líder describirá componentes o cambios en lenguaje natural, con libertad total de diseño. Ejemplo real:

> "Necesito un header que entre como una bola, que cae de la parte superior,
> se ubique a la altura óptima, tenga efecto glass, y que se expanda suavemente.
> Al expandirse debe mostrar el logo a la izquierda, el menú en el centro
> y a la derecha el botón de CTA."

Tu trabajo: traducir eso a código Astro + GSAP **sin pedir un contrato JSON**. Los briefs creativos NO usan schemas — usan este protocolo.

---

### 14.2 Cómo descomponer un brief (obligatorio antes de codear)

Antes de escribir código, extrae y lista estas 5 dimensiones:

| Dimensión | Del ejemplo anterior |
|-----------|---------------------|
| **1. Elemento** | Header (componente: Header.astro) |
| **2. Estados** | Estado A: bola compacta cayendo → Estado B: barra expandida |
| **3. Física/Timing** | Caída con gravedad (ease: bounce/expo), expansión suave (ease: expo.out) |
| **4. Estética** | Glass effect (backdrop-filter + transparencia) |
| **5. Layout final** | logo izquierda / menú centro / CTA derecha (flexbox 3 zonas) |

Muestra esta tabla al Ingeniero ANTES de codear. Si una dimensión es ambigua, pregunta. Si todo está claro, procede sin esperar confirmación.

---

### 14.3 Vocabulario de Diseño → Implementación

Traducciones estándar. Usa estas por defecto salvo indicación contraria:

#### Movimiento
| El Ingeniero dice | Implementas |
|---|---|
| "cae" / "entra desde arriba" | `gsap.from(el, { y: -100vh, ease: 'bounce.out' o 'expo.out' })` |
| "rebota" | `ease: 'bounce.out'` o `elastic.out(1, 0.5)` |
| "suave" / "fluido" | `ease: 'expo.out'`, duración 0.8–1.2s |
| "se expande" | animar `width/scale` con `expo.inOut` + revelar hijos con stagger |
| "aparece al hacer scroll" | ScrollTrigger con `start: 'top 80%'` |
| "flota" | yoyo infinito sutil: `y: ±8px, duration: 2s+` |
| "magnético" | seguimiento de cursor con `gsap.quickTo` |
| "parallax" | ScrollTrigger con `scrub: true` |

#### Estética
| El Ingeniero dice | Implementas |
|---|---|
| "glass" / "cristal" | `backdrop-filter: blur(12px); background: color-mix(in srgb, var(--bg-primary) 60%, transparent); border: 1px solid color-mix(...)` |
| "neón" / "glow" | `box-shadow` con var(--accent) + blur alto |
| "minimalista" | espaciado generoso (--space-lg+), sin bordes, tipografía protagonista |
| "actual" / "moderno" | bordes --radius-lg, micro-interacciones hover, espaciado amplio |

**Regla:** los valores de color SIEMPRE derivan de variables del tema (`color-mix` con `var(--accent)` está permitido; hex hardcodeado NO).

---

### 14.4 Protocolo de Edición de Componentes Existentes

Cuando el brief pide MODIFICAR un componente ya creado:

```
1. LEE el componente actual completo
2. IDENTIFICA qué pide el brief — y SOLO eso
3. EDITA únicamente las líneas necesarias
4. NO "mejores" nada que no se pidió (ni estilos, ni textos, ni estructura)
5. NO elimines hooks data-gsap-* existentes
6. npm run build
7. REPORTA: "Cambié X, Y, Z. No toqué nada más."
```

#### Prohibiciones absolutas en ediciones
- ❌ Refactorizar código que funciona "porque se puede hacer mejor"
- ❌ Cambiar nombres de props (rompe páginas que ya usan el componente)
- ❌ Tocar otros componentes "de paso"
- ❌ Modificar theme.css para resolver un problema de UN componente
  (los estilos específicos van scoped en el componente)

---

### 14.5 Reglas Técnicas Inquebrantables (aplican a TODO brief)

Por más creativo que sea el pedido, esto nunca se negocia:

1. **Variables del tema**: colores y fuentes solo via `var(--*)` o `color-mix()` sobre ellas
2. **prefers-reduced-motion**: toda animación debe tener fallback estático
3. **client:visible** por defecto; `client:load` solo si la animación es de entrada inmediata (como el header-bola)
4. **Performance**: animar solo `transform` y `opacity` (nunca `width/height/top/left` directamente — usar `scale/x/y`)
   - Excepción: expansiones de layout pueden usar `clip-path` o FLIP technique de GSAP
5. **Accesibilidad**: el contenido debe ser usable ANTES de que termine la animación (no bloquear interacción)
6. **Mobile-first**: toda animación compleja debe degradar elegante en pantallas pequeñas (simplificar, no eliminar funcionalidad)
7. **Build verde**: ningún cambio se reporta como terminado sin `npm run build` exitoso

---

### 14.6 Formato de Respuesta a un Brief

```
📋 BRIEF DESCOMPUESTO
Elemento: [componente]
Estados: [A → B → ...]
Física: [eases y duraciones elegidas]
Estética: [técnicas CSS]
Layout: [estructura]

[código]

✅ Build: OK
📝 Cambios: [lista exacta de archivos y qué se modificó]
🎬 Para probar: npm run dev → [qué deberías ver]
```

---

### 14.7 Ejemplo Completo Resuelto (referencia)

Brief: *"header que entra como bola, cae, glass, se expande mostrando logo/menú/CTA"*

Descomposición correcta:
- **Timeline GSAP**: (1) bola `scale(1) border-radius: 50%` cae desde `y: -120vh` con `bounce.out` → (2) pausa 0.2s → (3) expansión: `width: 56px → 100%`, `border-radius: 50% → var(--radius-full)` con `expo.inOut` → (4) hijos (logo, nav, CTA) entran con `stagger: 0.08, opacity + y`
- **Glass**: `backdrop-filter: blur(12px)` en el contenedor desde el inicio
- **Estado sin JS / reduced-motion**: header ya expandido y visible (la animación es mejora progresiva)
- **client:load** (es animación de entrada de página)

---

*Fin de la Sección 14. El agente que viola este protocolo debe descartar su cambio y reintentar.*

---

## 15. ADN de Diseño

> Referencia de nivel: showcase de lenis.dev, sitios Awwwards.
> Esta sección aplica a TODO lo que construyas, aunque el brief sea de una línea.

---

### 15.1 Principio rector

Un brief básico ("web para un café") NO autoriza un resultado básico.
El estándar showcase es el PISO. Si el resultado podría confundirse con
una plantilla de WordPress o un template genérico de Tailwind, está mal
y debes iterarlo antes de reportar.

---

### 15.2 Los Tres Pilares (innegociables)

#### Pilar 1 — Espectacular
Nivel visual de showcase internacional en cada página.

#### Pilar 2 — Responsivo Total
La experiencia móvil ES la experiencia. No una versión recortada.

#### Pilar 3 — Conversión
Si el sitio vende algo, todo el diseño empuja hacia la acción.
Espectacular y convertidor NO son opuestos: el motion guía al CTA.

---

### 15.3 Tipografía (Pilar 1)

- **PESO MÁXIMO 600 — PROHIBIDO bold (700/800/900)** en todo el sitio, incluidos
  headings, botones, badges y el wordmark. La jerarquía se construye con TAMAÑO,
  espaciado y color, no con grosor. Verificar también la URL de Google Fonts
  (no cargar pesos > 600) y todo `font-weight` en CSS antes de reportar.
- Headlines protagonistas: `clamp(2.5rem, 8vw, 8rem)` — el texto ES el diseño
- `letter-spacing: -0.02em` a `-0.05em` en headlines grandes
- `line-height: 0.95–1.1` en display text
- PROHIBIDO por defecto: Inter, Arial, Roboto, Open Sans como heading
  (solo si el contrato lo exige). Elige fuentes con carácter:
  serif editorial, grotesk con personalidad, o display fonts según el tema
- Jerarquía radical: contraste extremo entre display y body (no escalas tímidas)
- Texto enorme + espacio negativo > texto mediano + decoración

### 15.4 Coreografía de Motion (Pilar 1)

NADA aparece sin intención. Mínimos obligatorios por página:
- Headlines: reveal por palabra o línea (mask reveal, ya implementado en Hero)
- Imágenes: entrada con clip-path, scale sutil (1.1→1) o parallax
- Secciones: stagger coordinado, nunca todo a la vez
- Hover en TODO elemento interactivo: links con underline animado,
  cards con lift/tilt, botones con micro-feedback
- Al menos 1 elemento scroll-driven por página (parallax, scrub, pin, marquee)
- Velocidades: entrada 0.8–1.2s expo.out; hover 0.3s; nunca animaciones lentas
  que hagan esperar al usuario

### 15.5 Layout No Genérico (Pilar 1)

PROHIBIDO el patrón plantilla: hero centrado → 3 cards iguales → testimonios → footer.
Herramientas obligatorias (usa al menos 3 por página):
- Asimetría intencional (grids 5/7, 4/8, contenido off-center)
- Elementos que se superponen (overlapping de imágenes/texto/secciones)
- Espaciado extremo: secciones con --space-2xl+, aire generoso
- Números de sección grandes (01, 02, 03) como elemento gráfico
- Texto vertical u orientado, marquees infinitos para marcas/keywords
- Imágenes a sangre (full-bleed) alternadas con contenido contenido
- Detalles de textura: grain/noise sutil, gradientes mesh, blur decorativo

### 15.6 Responsivo Total (Pilar 2)

- Mobile-first SIEMPRE: diseña el móvil primero, expande a desktop
- Breakpoints mínimos a verificar: 375px, 768px, 1024px, 1440px
- En móvil:
  - Headlines siguen siendo protagonistas (clamp se encarga)
  - Animaciones se SIMPLIFICAN, no se eliminan (menos stagger, menos parallax)
  - Touch targets ≥ 44px
  - Menú: navegación móvil de calidad (overlay animado, no un dropdown pobre)
  - CTAs alcanzables con el pulgar (zona inferior preferente)
- PROHIBIDO: overflow horizontal, texto que se corta, elementos que se montan
- Test obligatorio antes de reportar: revisar el build en viewport 375px

#### 15.6.1 Motion en mobile (REGLA DURA — origen de bugs frecuentes)

Lo que funciona en desktop NO se traslada igual a mobile. Antes de reportar:

1. **`gsap.matchMedia()` SIEMPRE** para escenas complejas. Las animaciones
   con `pin`, `scrub`, scroll horizontal o `position: sticky` que se transforma
   van DENTRO de `mm.add('(min-width: 768px)', ...)`. En mobile (`max-width: 767px`)
   se sirve la MISMA sección en layout estático/vertical con fades simples.
2. **Distinguir el pin BUENO del MALO en mobile** (matiz validado por el usuario):
   - ✅ Galería de slides horizontales que AVANZAN con el scroll (el contenido progresa):
     funciona y se siente premium en mobile — **mantenerla**. El overflow lateral se
     evita con `overflow: hidden` en el contenedor del track, NO eliminando el efecto.
   - ❌ Pin donde un elemento (p. ej. imagen full-screen) solo se transforma "en su eje"
     (escala/rota/scrub) SIN que el contenido avance: atrapa al usuario que quiere seguir
     bajando y leyendo. Esas escenas (tipo "anatomía") van **estáticas y scrolleables** en
     mobile (layout vertical, fades simples), no pinneadas.
3. **`ScrollTrigger.config({ ignoreMobileResize: true })`** siempre. La barra de URL
   móvil cambia el alto del viewport al hacer scroll y dispara refreshes que rompen pins.
4. **Estado inicial sin JS:** si GSAP anima `scaleX(0)→1`, `opacity:0→1`, etc., y esa
   animación es desktop-only, el CSS base debe dejar el elemento VISIBLE en mobile
   (resetear `transform`/`opacity` en el `@media`), o el contenido queda invisible.
5. **`position: sticky` que se escala/encoge:** desktop-only. En mobile el hero/secciones
   van `position: relative`, alto natural.
6. **Verifica overflow horizontal real** a 375px: ningún elemento debe exceder el ancho.
   `html { overflow-x: hidden }` es backstop, NO solución — arregla el elemento culpable.
7. **Init robusto (probar SIEMPRE con F5 y navegación interna):** el motion debe
   inicializarse en `astro:page-load` (corre en carga inicial, recarga y View
   Transitions), NO solo en un evento one-shot. Si una intro depende de un evento
   (ej. `kaizen:revealed` del preloader), úsalo con un **flag global** de respaldo
   (`window.__kaizenRevealed`) porque el módulo que importa GSAP puede registrar el
   listener DESPUÉS de que el evento ya se disparó (en refresh el preloader dispara
   en ~1 frame) → la página queda estática. Revertir `matchMedia` antes de recrear.

### 15.7 Diseño para Conversión (Pilar 3)

Cuando el sitio vende (product, service, landing comercial):

#### Jerarquía de conversión
- UN CTA primario por viewport — siempre visible o a un scroll de distancia
- El CTA es el elemento con MÁS contraste de la página (var(--accent) reservado para él)
- Above the fold: propuesta de valor clara en < 3 segundos + CTA

#### Innovación que convierte (no plana, no aburrida)
- CTA magnético (sigue sutilmente el cursor en desktop)
- CTA sticky inteligente: aparece al pasar el hero, se oculta cerca del footer
- Micro-animación en el CTA cada ~8s (pulso sutil, shimmer) para atraer el ojo
- Social proof animado: contadores que suben al entrar al viewport
- Precio/oferta con reveal dramático (no escondido en una tabla)
- Formularios: mínimos campos, validación inline animada, estados de éxito
  celebratorios
- Urgencia honesta: si hay stock/tiempo limitado real, animarlo; NUNCA inventar
  urgencia falsa

#### El motion sirve al CTA
- Las animaciones GUÍAN el ojo hacia la acción (dirección, timing, contraste)
- Nada debe competir visualmente con el CTA en su viewport
- Scroll storytelling: cada sección responde una objeción y acerca a la compra

### 15.8 Checklist de Auto-Evaluación (antes de reportar CUALQUIER página)

Responde honestamente. Si alguna falla → itera ANTES de reportar:

- [ ] ¿Podría estar en el showcase de lenis.dev sin desentonar?
- [ ] ¿La tipografía tiene carácter y escala protagonista?
- [ ] ¿Hay al menos 1 momento memorable de motion?
- [ ] ¿Usé al menos 3 herramientas de layout no genérico (15.5)?
- [ ] ¿Lo revisé en 375px sin overflow ni elementos rotos?
- [ ] ¿Las escenas con pin/scrub/scroll-horizontal están en `gsap.matchMedia()` con fallback estático en mobile? (ver 15.6.1)
- [ ] ¿Ningún elemento queda invisible en mobile por un estado inicial de GSAP que solo corre en desktop?
- [ ] ¿Todo elemento interactivo tiene hover/touch feedback?
- [ ] Si vende algo: ¿el CTA es inconfundible y el camino a la conversión es obvio?
- [ ] ¿prefers-reduced-motion tiene fallback digno?
- [ ] ¿Solo variables de theme.css?
- [ ] ¿Ningún `font-weight` > 600 (ni en CSS ni en la URL de Google Fonts)?

### 15.9 Jerarquía de prioridades en conflicto

Si dos pilares chocan, este es el orden:
1. Usabilidad/accesibilidad (nunca sacrificar)
2. Conversión (si el sitio vende)
3. Espectacularidad
4. Performance sigue siendo ley: anima transform/opacity, lazy-load media,
   Lighthouse ≥ 90 siempre

---

*Fin de la Sección 15. Un resultado genérico es un resultado fallido.*

---

## 16. Planificación de Diseño (OBLIGATORIA antes de codear cualquier página)

> Origen: el agente construyó páginas "tipo plantilla" dos veces. Esta fase lo previene.
> Ninguna página se codea sin pasar por aquí. El blueprint se presenta al Ingeniero ANTES de escribir código.

### 16.1 Investigación de referentes (paso 1)

Antes de diseñar, estudiar 2–3 referentes del MISMO nicho del cliente, bien posicionados:
- Fuentes: `lenis.dev/showcase`, galería de Framer, Awwwards, y los líderes del vertical.
- Para SaaS/software B2B: `linear.app`, `stripe.com`, `vercel.com`, `raycast.com`, `clerk.com`.
- Para estudios/agencias: `nakula.framer.website`, showcase de lenis.
- Extraer de cada uno: estructura de secciones, uso de imágenes, presentación de títulos/datos,
  formatos creativos. Patrones concretos, no impresiones.

### 16.2 Reglas duras del blueprint

1. **Imágenes OBLIGATORIAS**: toda página lleva imágenes/visuales reales (Magnific, assets del
   cliente, mockups de producto, charts). Una página de solo texto y cards NO es diseño premium.
   Cada sección principal debe declarar su visual en el blueprint.
2. **Títulos y datos con protagonismo**: los números/claims importantes se muestran GRANDES
   (stats con count-up, numeración de secciones tipo "01 —", cifras como elemento gráfico),
   nunca enterrados en párrafos.
3. **Formatos creativos por sección — ANTI-REPETICIÓN DURA**: prohibido que dos secciones seguidas
   usen el mismo formato, el mismo recurso gráfico o la misma idea espacial. No basta cambiar el texto:
   si la sección anterior usó "número fantasma gigante + regla que se dibuja + columna sticky", la
   siguiente NO puede repetir ninguno de esos tres recursos. Antes de codear, lista los recursos de la
   sección anterior y elige otros. Elegir de la biblioteca 16.3 o inventar uno mejor.
4. **Software se muestra con producto**: si el cliente es software, el diseño DEBE mostrar el
   producto (mockups de UI por feature, screenshots estilizados, diagramas vivos) — patrón Linear:
   tour numerado de features (1.0, 2.0…) cada uno con su mockup propio. Los mockups van **grandes,
   con datos reales y multi-estado** (ej. varias órdenes en estados distintos con badges), nunca un
   recuadro casi vacío.
5. **Cada sección cuenta un trozo de la historia (§19)**: el blueprint declara qué parte del relato
   cuenta la sección y cómo conecta con la anterior y la siguiente. Una sección que no avanza la
   historia sobra. El scroll debe HACER AVANZAR el contenido (no solo aparecer/moverse) en al menos
   una sección protagonista por página.
6. **Dirección de arte con fuerza (§20)**: define una atmósfera fuerte y sosténla. El look
   "SaaS limpio" (cards oscuras sobre fondo claro, un acento, tipografía correcta) se lee como
   genérico/sin personalidad. Usa escenario dramático, profundidad, textura (grain/scanlines),
   data-viz con el acento, señales "en vivo". Si el Ingeniero pide "más fuerza/personalidad",
   NO adivines: ancla 1–2 referentes o propón un giro de arte concreto y confírmalo ANTES de codear.

### 16.3 Biblioteca de formatos probados (de referentes reales)

| Formato | Cuándo usarlo | Referente |
|---|---|---|
| Tour de producto numerado (1.0–5.0), texto + mockup propio por feature, alternando lados | Features de software | Linear |
| Bento grid (celdas de tamaños mixtos con visual cada una) | Capacidades diversas | Vercel/Apple |
| Stats gigantes con count-up ("220+", "33.000 equipos") | Prueba social / escala | Nakula, Linear |
| Labels de sección "(01 — ETIQUETA)" en caps como ritmo visual | Toda página editorial | Nakula |
| Ledger/lista editorial numerada con reglas que se dibujan | Problemas, principios | — |
| Sticky lateral (título fijo) + contenido que scrollea | Listas largas con contexto | — |
| Marquee de keywords/logos | Confianza, stack | ubicuo |
| Screenshot/panel de producto en perspectiva o superpuesto a imagen | Hero SaaS | Stripe/Linear |
| Diagrama de flujo vivo (nodos + paquete animado) | Integraciones/API | — |
| Chart que se dibuja al scroll (histórico + predicción punteada) | Roadmap/datos | — |
| Galería horizontal pinneada que avanza con el scroll | Portfolio/módulos | showcase lenis |
| Thread/conversación embebida como UI | Colaboración | Linear |
| Imagen full-bleed con texto en franja de color sólido | Momentos de marca | editorial |
| Fondo shader WebGL iridiscente (mesh/holográfico que fluye) | Hero / cierre premium | Awwwards (§17) |
| **Sala de control "OS"**: dispositivo único fijo cuya pantalla CAMBIA de módulo con el scroll; rail lateral con índice activo + barra de progreso; stage oscuro, glow, scanlines, "● en vivo" | Tour de features de software (alternativa al tour alternado) | SmartOrder §20 |
| **Embudo / diagrama vivo**: elementos flotantes (chips de producto) que CONVERGEN a una caja central al scroll, se ordenan dentro (estante), y de la caja salen nodos conectados por cables con paquetes que viajan | "Cómo funciona", flujo entrada→proceso→salida, contar una historia | SmartOrder §20 |
| **Caja-contenedor con inventario ordenado**: panel que se "llena" en secuencia con tiles (icono+dato) a medida que entra el contenido | Mostrar orden/consolidación de datos | SmartOrder §20 |
| **Nodos conectados a los lados** (no fila abajo): entradas a la izquierda, salidas a la derecha, cables SVG + paquetes direccionales que dan sentido de flujo | Relacionar pasos/causas/efectos | SmartOrder §20 |

### 16.4 Formato del blueprint (entregable antes de codear)

Por cada sección: `nombre · objetivo · formato (de 16.3 o nuevo) · visual/imagen (cuál y de dónde
sale — slot Magnific con prompt si aplica) · dato/título protagonista · motion`.
El blueprint se presenta al Ingeniero. Sin blueprint aprobado, no hay código.

---

## 17. WebGL / Shaders (cualidad iridiscente — capa premium opcional)

> Cuándo buscar esa cualidad "iridiscente / holográfica / mesh-gradient vivo" que distingue a un
> sitio Awwwards de uno plano: fondos de hero que fluyen, gradientes que respiran, reflejos
> aceitosos sobre el acento de marca, grain animado, distorsión sutil al hover. CSS no llega ahí
> — para eso usamos un shader en `<canvas>`.

### 17.1 Cuándo usarlo (y cuándo NO)
- ✅ Fondo de hero o de sección de cierre, halo detrás de un mockup, transición entre secciones,
  textura iridiscente sobre el acento. **Un (1) momento WebGL fuerte por página**, no más.
- ❌ NO para texto, datos, UI o cualquier cosa que deba leerse. NO si el sitio es ultra-minimal y
  el shader rompería la sobriedad. Si dudas, primero intenta `color-mix` + gradientes CSS.

### 17.2 Stack (autorizado para este uso)
- **OGL** (`ogl`, ~50 KB) es la librería por defecto: mínima, sin dependencias, ideal para un
  full-screen quad con fragment shader. (three.js solo si el brief pide 3D real.)
- Va en un componente Astro propio (ej. `ShaderField.astro`) con `client:visible`, **nunca** en el
  `Layout`. El canvas es `position:absolute; inset:0; z-index:-1` detrás del contenido.

### 17.3 Reglas inquebrantables
1. **Colores del shader = variables del tema.** Lee `--accent`, `--bg-primary`, etc. con
   `getComputedStyle` y pásalos como `uniform vec3`. Prohibido hardcodear color en el GLSL.
2. **Fallback obligatorio sin JS / reduced-motion / WebGL no disponible:** un gradiente CSS estático
   equivalente SIEMPRE presente debajo del canvas. Si `prefers-reduced-motion`, no se anima
   (render de 1 frame o se omite el canvas).
3. **Performance es ley (Lighthouse ≥ 90):** `IntersectionObserver` para pausar el `requestAnimationFrame`
   cuando el canvas sale del viewport; `dpr = min(devicePixelRatio, 2)`; pausar en `visibilitychange`;
   destruir en `astro:before-swap`. Shader barato (ruido simplex / fbm, sin loops pesados).
4. **Init robusto** (igual que el resto del motion, §15.6.1 #7): arranca en `astro:page-load`,
   limpia en `astro:before-swap`.
5. **Accesibilidad:** `aria-hidden`, `pointer-events:none`. El contenido encima debe tener contraste
   suficiente sobre el peor frame del shader (probar legibilidad).

### 17.4 En el blueprint (§16)
Si una sección usa WebGL, declararlo: `visual: shader (OGL) — concepto: <p.ej. mesh iridiscente
verde/navy que fluye lento> · fallback CSS: <gradiente> · trigger: client:visible`.
Instalar `ogl` cuenta como dependencia nueva → mencionarlo al reportar (queda autorizado por esta sección).

---

## 18. Cómo Trabajamos — Resumen Maestro (leer SIEMPRE antes de construir una página)

> Proceso de extremo a extremo + las reglas que más nos han costado (cada una nació de un error real).
> Si algo aquí choca con el impulso de "rellenar la plantilla", gana esto.

**0. Identidad.** Cada sitio es BESPOKE, nivel Awwwards/showcase. Rellenar la plantilla base es un
fallo (§15.1). Dos secciones seguidas NO pueden usar el mismo formato.

**1. Planificar primero (§16) — bloqueante.** Estudiar 2–3 referentes del nicho del cliente
(SaaS B2B → Linear, Stripe, Vercel; estudios → Nakula, showcase de lenis). Entregar un **blueprint
sección-por-sección** (formato §16.4) y esperar aprobación. Sin blueprint aprobado NO se escribe código.

**2. Marca.** `contracts/site.json` (marca, navegación, contacto, orderUrl) + `theme.css`
(colores/fuentes del cliente vía `apply-theme.js`). **Logos oficiales tal cual** — si hay que
recolorearlos para fondo oscuro, inlinear el SVG y pintar solo lo necesario, nunca reconstruirlos.

**3. Media obligatoria (§8.1, §16.2).** TODA página lleva imágenes/visuales reales: Magnific
(`images_generate` → `creations_wait` → `media.js save` → `media.js apply`), assets del cliente, o
mockups de producto. Solo texto + cards = NO es premium.

**4. Estructura (§16.3).** Variar formatos por sección. **Software se muestra con su producto**:
tour numerado tipo Linear (1.0, 2.0…) con un mockup de UI propio por feature. Datos/títulos
protagonistas (stats con count-up, labels "01 —", cifras como elemento gráfico).

**5. Tipografía (§15.3).** Peso **máximo 600 — jamás bold (700+)**, ni en CSS ni en la URL de
Google Fonts. Jerarquía por tamaño/espaciado/color. Fuentes con carácter (no Inter/Arial como heading).

**6. Motion.** Init en `astro:page-load` (+ flag global si depende de un evento, §15.6.1 #7).
`pin`/`scrub`/scroll-horizontal y `sticky` transformado SOLO en `gsap.matchMedia('(min-width:768px)')`
con fallback estático en mobile (§15.6.1). `ScrollTrigger.config({ ignoreMobileResize: true })`.
Animar solo `transform`/`opacity`, nunca `transition: all`, `transform-origin` correcto.
`prefers-reduced-motion` siempre con fallback. Revertir `matchMedia` antes de recrear.

**7. WebGL/Shaders (opcional, §17).** Un (1) momento iridiscente fuerte por página (OGL): colores
del tema vía uniforms, fallback CSS obligatorio, pausa fuera de viewport, `dpr ≤ 2`, destruir en swap.

**8. Conversión (§15.7).** CTA primario inconfundible, sticky inteligente, todo el motion guía a la acción.

**9. SEO + interfaz.** `og:image` absoluto OBLIGATORIO (§7.4). `color-scheme: dark` + `<meta theme-color>`,
`text-wrap: balance` en headings, `font-variant-numeric: tabular-nums` en columnas numéricas,
`touch-action: manipulation`.

**10. Verificar ANTES de reportar (§15.8).** Build verde · 375px sin overflow horizontal · F5 no deja
la página estática · navegación interna no la rompe · `grep -rn "font-weight: 7\|font-weight: 8" src/`
vacío · `og:image` presente en el HTML buildeado.

**11. Deploy.** Solo cuando el usuario lo pida. Cada cliente = su propio repo (un repo por cliente);
el template `web-factory-seed` no se contamina con contenido de cliente.

**12. Narrativa primero (§19) + sin secciones básicas/repetidas (§16.2.3, §20).** La página es UNA
historia con arco; cada sección la avanza y conecta con la vecina. Antes de codear una sección, lista
los recursos de la anterior y usa otros. Si una sección se siente "básica", el problema casi siempre es
**dirección de arte**, no el layout — sube atmósfera (§20), no más efectos sueltos.

---

## 19. Diseño Narrativo — la página cuenta UNA historia (leer antes del blueprint)

> Origen: secciones que eran "listas de features" inconexas y se sentían planas. La cura no es más
> motion: es que cada sección sea un capítulo de un relato que progresa.

### 19.1 Principio
El sitio no es un catálogo de bloques: es un **arco narrativo**. El visitante debe poder contar la
historia con solo scrollear. Estructura típica (adaptar al cliente):
`Promesa (hero) → Tensión/problema → La gran idea (cómo funciona) → Prueba (producto en acción /
datos) → Cierre/llamado`. Cada sección responde "¿y entonces qué?" de la anterior.

### 19.2 Reglas
1. **Una frase por sección**: el blueprint declara, en una línea, qué capítulo cuenta y cómo enlaza
   con la anterior y la siguiente ("tras ver el caos manual, mostramos cómo el sistema lo ordena…").
2. **El scroll AVANZA el relato**, no solo decora. Al menos una sección protagonista usa scroll-driven
   donde el CONTENIDO progresa (un dispositivo que cambia de módulo, un embudo que procesa, un chart
   que se dibuja) — distinto de "aparece al entrar al viewport".
3. **Conexión visible entre piezas**: cuando una sección muestra relaciones (entrada→proceso→salida,
   causa→efecto), conéctalas de verdad — cables/flechas/paquetes que viajan, no cajas sueltas.
4. **Continuidad de marca entre secciones**: transiciones de fondo (bg-morph), acentos y tipografía
   coherentes para que se lea como un solo relato, no páginas pegadas.
5. **Datos como personajes**: cifras y estados reales (con count-up, badges, multi-estado) llevan la
   historia; nada de placeholders vacíos.

### 19.3 Ejemplo resuelto (SmartOrder)
- 01 Hero → promesa. 02 Desafíos → tensión (operación manual, caos). **03 El sistema** → la gran idea:
  productos flotan, entran a la bodega, se ordenan, y de ahí salen órdenes/recetas/venta (embudo vivo).
  **04 La plataforma** → prueba: sala de control "OS" donde el scroll recorre cada módulo con su mockup.
  05 Arquitectura → cómo se conecta al POS. Cierre → CTA. Cada sección continúa la anterior.

---

## 20. Catálogo de Escenas y Dirección de Arte (lo que YA funcionó — reutilizar y variar, no reinventar básico)

> Estas escenas nacieron de iteraciones aprobadas. Úsalas como punto de partida de alto nivel y
> **varíalas** (no copiar dos veces seguidas, §16.2.3). El objetivo: nunca volver a entregar una
> sección "tipo plantilla".

### 20.1 Dirección de arte "sala de control" (la que da fuerza)
El look que el Ingeniero aprobó como "con fuerza/personalidad" (vs. el "SaaS limpio" rechazado):
- **Escenario oscuro dramático**: `--bg-primary` + glow radial del acento detrás del foco.
- **Data-viz neón**: el acento (`--accent`) reservado para datos vivos, medidores, badges de estado.
- **Textura**: `scanlines` sutiles (repeating-linear-gradient con `mix-blend-mode: overlay`), grain.
- **Señales de "vivo"**: chip "● en vivo", paquetes que viajan por cables, medidores que llenan.
- **Cifras/labels grandes** como elemento gráfico. Tipografía ≤600 siempre (§15.3).
- Cuándo NO: si el cliente exige claridad sobria total; ahí la fuerza viene de tipografía editorial
  gigante + composición asimétrica (formato "editorial/brutalista-tech"), no de neón.

### 20.2 Escenas scroll-driven probadas
- **Sala de control "OS"** (tour de software): UN dispositivo fijo, su pantalla cambia de módulo 1→N
  con el scroll; rail lateral con índice activo + barra de progreso. El título/descripción del módulo
  viven en el rail (no se duplican en el panel). Mockups grandes, multi-estado, datos reales.
- **Embudo / diagrama vivo** (cómo funciona): chips/objetos flotantes convergen a una caja central,
  se ORDENAN dentro (estante que se llena en secuencia), y de la caja salen **nodos conectados a los
  lados** por cables SVG con **paquetes direccionales** (entrada izq → salida der) que cuentan el flujo.
- **Galería horizontal pinneada** que avanza con el scroll (módulos/portfolio).
- **Chart que se dibuja** al scroll; **ledger** con reglas que se dibujan (usar como máximo en UNA
  sección por página — es el recurso más fácil de sobre-usar).

### 20.3 Cómo subir una sección "básica" (checklist de rescate)
Si una sección se siente sencilla, en orden: (1) ¿tiene una IDEA espacial propia o es una lista?
(2) ¿el scroll avanza contenido o solo aparece? (3) ¿hay profundidad (capas/sticky/parallax) y
atmósfera (glow/grain)? (4) ¿los datos son grandes y reales? (5) ¿conecta con la historia? Subir lo
que falte ANTES de reportar.

---

## 21. Correcciones y Gotchas Técnicos (cada uno costó una iteración — no repetir)

> Bugs reales que encontramos y la regla para no recaer. Revisar al construir motion/scroll/diagramas.

### 21.1 Sticky / pin
- **NUNCA `overflow: hidden` (ni `auto`/`scroll`) en un ancestro de un `position: sticky`**: mata el
  pin en silencio → el stage se va y queda espacio vacío. Usa sin overflow, o `overflow: clip` solo si
  lo verificas. **Verifica** recorriendo ancestros del stage y confirmando que ninguno tiene overflow ≠ visible.
- El pin "bueno" (contenido que avanza con el scroll) sí va en mobile; el pin "malo" (algo que solo se
  transforma sin avanzar) NO (§15.6.1). Escenas scroll-driven complejas: solo en
  `@media (min-width:768px) and (prefers-reduced-motion: no-preference)`, con fallback estático apilado.

### 21.2 Layout / overflow
- **`min-width: 0`** en items de grid/flex que contienen texto o imágenes, para evitar blow-out del
  track (texto cortado, overflow horizontal). El `html { overflow-x: hidden }` es backstop, NO solución:
  arregla el elemento culpable.
- **Contenido dentro de cajas/mockups no se debe cortar**: verifica que el contenido cabe dentro del
  contenedor con `overflow:hidden` (mide top/bottom del contenido vs. la caja), no solo que "se ve".

### 21.3 SVG / diagramas
- **Recolorear logos/SVG**: pinta TODOS los tipos de forma (`path`, `polygon`, `circle`, `rect`…), no
  solo `path`. (La "t" del wordmark era un `polygon` y quedó negra al recolorear solo `path`.)
- **No uses `stroke-dashoffset` para "dibujar" trazos con `vector-effect: non-scaling-stroke` en un
  `viewBox` no uniforme** (`preserveAspectRatio="none"`): el dash no oculta bien. Revela con opacidad
  (y deja que paquetes viajando den la sensación de conexión).
- Cables en coordenadas %: SVG con `viewBox="0 0 100 100"` + `preserveAspectRatio="none"` mapea
  endpoints exactamente a posiciones `%` de los nodos; `vector-effect: non-scaling-stroke` mantiene el
  grosor. Paquetes = `<circle>` con `cx/cy` animados entre `getPointAtLength(0)` y `(L)`.

### 21.4 Verificación con Lenis (smooth scroll)
- El sitio usa **Lenis**: `window.scrollTo` programático se revierte → en headless las escenas con
  `scrub` NO avanzan y `prefers-reduced-motion` por defecto es `reduce` (el motion ni corre).
  Para verificar: **emula `prefers-reduced-motion: no-preference`** y comprueba por estado
  (opacidades/medidas, auditoría de overflow, sticky) o forzando estados, no por scroll real.

### 21.5 Init / re-init (recordatorio §15.6.1 #7)
- Motion en `astro:page-load` (corre en carga, F5 y View Transitions). `ScrollTrigger.config({
  ignoreMobileResize: true })`. Revertir `matchMedia` antes de recrear. Limpiar en `astro:before-swap`.
