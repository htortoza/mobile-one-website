# Web Factory Seed 🏭

Repositorio **template base** para construir sitios web bespoke, nivel showcase, con Astro + GSAP + Lenis.
La metodología completa vive en **`CLAUDE.md`** — léelo antes de construir.

> **`CLAUDE.md` es el cerebro.** Define cómo se diseña y construye cada sitio:
> §15 ADN de diseño · §15.6.1 motion en mobile · §16 planificación con referentes (obligatoria) ·
> §17 WebGL/shaders iridiscentes · **§18 resumen maestro de cómo trabajamos**.

## Uso

Este repositorio es un **GitHub Template**. No trabajes directamente aquí.

### Crear un nuevo proyecto de cliente

1. En GitHub, click en **"Use this template"** → "Create a new repository"
2. Nombra el repo: `cliente-nombre-del-proyecto`
3. Clona el repo nuevo localmente
4. Instala dependencias: `npm install`
5. Crea el contrato del cliente en `contracts/`
6. Abre Claude Code en la carpeta del proyecto

### Estructura

```
web-factory-seed/
├── CLAUDE.md              ← Contrato del agente (leer primero)
├── contracts/             ← Schemas y ejemplos de contratos JSON
├── public/                ← Assets estáticos
└── src/
    ├── components/        ← Reutilizables: Header (dock), Footer, Hero, Features,
    │                         CTA, FAQ, Testimonials, Button, BaseHead, StickyCTA,
    │                         VideoHero, ShaderField (WebGL §17)
    ├── layouts/           ← Layout maestro: motor Lenis/GSAP + View Transitions (no tocar)
    ├── pages/             ← Rutas del sitio (index neutro de arranque + 404)
    ├── styles/theme.css   ← Variables CSS (único archivo de diseño)
    └── utils/
        ├── validate.js    ← Validador de contratos
        ├── generate.js    ← Genera páginas desde contratos
        └── media.js       ← Pipeline de imágenes/video (Magnific → /public → contrato)
```

### Comandos

```bash
npm run dev       # Servidor de desarrollo
npm run build     # Build de producción
npm run validate  # Validar un contrato JSON
```

### Flujo del agente

1. Contrato JSON → `node src/utils/validate.js`
2. Agente genera componentes
3. `npm run build` — debe pasar sin errores
4. Deploy

---

> Para cambios en el template base, abre un PR en este repositorio.
> Los proyectos de clientes existentes no se ven afectados.
