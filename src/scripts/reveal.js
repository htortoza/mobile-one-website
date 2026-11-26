// src/scripts/reveal.js — Entrada al hacer scroll para elementos con [data-rv] (design system §22).
// Antes este bloque estaba copiado en cada página; las páginas nuevas importan este módulo:
//   <script>import '../../scripts/reveal.js';</script>
// Idempotente: cada elemento se anima una sola vez (data-rv-done), también tras View Transitions.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function reveal() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  gsap.utils.toArray('[data-rv]').forEach((el, i) => {
    if (el.dataset.rvDone) return;
    el.dataset.rvDone = '1';
    gsap.from(el, {
      opacity: 0, y: 30, duration: 0.9, ease: 'expo.out', delay: (i % 3) * 0.08,
      scrollTrigger: { trigger: el, start: 'top 92%', once: true },
    });
  });
}
document.addEventListener('astro:page-load', reveal);
