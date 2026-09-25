// src/utils/pos-screen.js
// Proyección de una "pantalla" HTML sobre el vidrio del POS real
// (hero-mobile-pos-v2-final.webp) con matrix3d, para que herede la
// perspectiva de la foto. Usado por HowItWorksFlow (Home) y ProductoPosQR.

// Foto 1958×1722. Esquinas reales del vidrio medidas ajustando rectas a cada
// borde de la pantalla: TL, TR, BR, BL.
export const POS_IMG_W = 1958;
export const POS_QUAD = [[766.4, 358.3], [1295.5, 323.6], [1021.1, 1502.9], [485.8, 1449.4]];
// Centro del vidrio en x, como fracción del ancho de la foto.
export const POS_SCREEN_CX = 0.455;

// Homografía rect(w×h) → cuadrilátero, como matrix3d de CSS.
export function quadMatrix(w, h, q) {
  const src = [[0, 0], [w, 0], [w, h], [0, h]];
  const A = [], b = [];
  src.forEach(([x, y], i) => {
    const [u, v] = q[i];
    A.push([x, y, 1, 0, 0, 0, -u * x, -u * y]); b.push(u);
    A.push([0, 0, 0, x, y, 1, -v * x, -v * y]); b.push(v);
  });
  // eliminación gaussiana 8×8
  for (let c = 0; c < 8; c++) {
    let p = c;
    for (let r = c + 1; r < 8; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r;
    [A[c], A[p]] = [A[p], A[c]]; [b[c], b[p]] = [b[p], b[c]];
    for (let r = 0; r < 8; r++) {
      if (r === c) continue;
      const f = A[r][c] / A[c][c];
      for (let k = c; k < 8; k++) A[r][k] -= f * A[c][k];
      b[r] -= f * b[c];
    }
  }
  const [a, bb, c, d, e, f, g, hh] = b.map((v, i) => v / A[i][i]);
  return `matrix3d(${a},${d},0,${g},${bb},${e},0,${hh},0,0,1,0,${c},${f},0,1)`;
}

// Esquinas del vidrio con la foto reflejada en horizontal (scaleX(-1) solo
// sobre el <img>): x → W − x, y el orden TL/TR/BR/BL se intercambia para que
// el contenido de la pantalla NO quede en espejo.
const [TL, TR, BR, BL] = POS_QUAD;
const flip = ([x, y]) => [POS_IMG_W - x, y];
export const POS_QUAD_MIRROR = [flip(TR), flip(TL), flip(BL), flip(BR)];

// Centra el vidrio (no la foto) en su contenedor y proyecta `screen` sobre
// él. `mirror`: POS mirando a la derecha. `minLeft`: la foto nunca empieza
// antes de esa x (px) de su columna — el vidrio se descentra hacia la derecha
// si hace falta. Se re-ejecuta en resize; devuelve la función de limpieza.
export function mountPosScreen(pos, screen, { mirror = false, minLeft = -Infinity } = {}) {
  const device = pos.parentElement;
  const quad = mirror ? POS_QUAD_MIRROR : POS_QUAD;
  const cx = mirror ? 1 - POS_SCREEN_CX : POS_SCREEN_CX;
  const project = () => {
    pos.style.marginLeft = Math.max(minLeft, device.offsetWidth / 2 - pos.offsetWidth * cx) + 'px';
    const s = pos.offsetWidth / POS_IMG_W;
    const q = quad.map(([x, y]) => [x * s, y * s]);
    screen.style.transform = quadMatrix(screen.offsetWidth, screen.offsetHeight, q);
  };
  project();
  const ro = new ResizeObserver(project);
  ro.observe(pos);
  ro.observe(device);
  return () => ro.disconnect();
}
