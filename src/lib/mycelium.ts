export type Overlay = "none" | "leaf" | "flower";

export type Palette = {
  id: string;
  name: string;
  bgEdge: string;
  bgCenter: string;
  ground: string;
  root: string;
  tip: string;
  glow: string;
  leaf: string;
  vein: string;
  petal: string;
  center: string;
  spore: string;
};

export const PALETTES: Palette[] = [
  {
    id: "espora",
    name: "Espora",
    bgEdge: "#07110c",
    bgCenter: "#163024",
    ground: "#050c09",
    root: "#cbb892",
    tip: "#f4ecd4",
    glow: "#e2c27a",
    leaf: "#8eae72",
    vein: "#e4f0c8",
    petal: "#f0d7a4",
    center: "#d15a32",
    spore: "#f3e6c0",
  },
  {
    id: "brasa",
    name: "Brasa",
    bgEdge: "#120804",
    bgCenter: "#3a1a10",
    ground: "#0c0604",
    root: "#e8a07a",
    tip: "#ffd7a8",
    glow: "#ff7a3c",
    leaf: "#d97848",
    vein: "#ffd0a8",
    petal: "#ffb07a",
    center: "#ffe3b0",
    spore: "#ffc49a",
  },
  {
    id: "escarcha",
    name: "Escarcha",
    bgEdge: "#071016",
    bgCenter: "#163040",
    ground: "#05090e",
    root: "#b7c9d4",
    tip: "#f4fbfc",
    glow: "#9fd8e4",
    leaf: "#7eaea6",
    vein: "#dff4f0",
    petal: "#d5eaf2",
    center: "#f0d48a",
    spore: "#e7f6f8",
  },
  {
    id: "azafran",
    name: "Azafrán",
    bgEdge: "#140e06",
    bgCenter: "#3a2a12",
    ground: "#0c0904",
    root: "#e0a15a",
    tip: "#ffe6b0",
    glow: "#ffb703",
    leaf: "#c6a35a",
    vein: "#f6e6bf",
    petal: "#ffd56a",
    center: "#8f3418",
    spore: "#ffe1a8",
  },
  {
    id: "niscalo",
    name: "Níscalo",
    bgEdge: "#101208",
    bgCenter: "#243018",
    ground: "#0a0c06",
    root: "#d4895a",
    tip: "#f6ddc4",
    glow: "#ef8a45",
    leaf: "#a3b56a",
    vein: "#e7efc4",
    petal: "#f0a36a",
    center: "#f8efd4",
    spore: "#f6d2b0",
  },
];

export function paletteById(id: string): Palette {
  return PALETTES.find((p) => p.id === id) ?? PALETTES[0];
}

const NOTES = ["Do", "Do♯", "Re", "Re♯", "Mi", "Fa", "Fa♯", "Sol", "Sol♯", "La", "La♯", "Si"];
const PENTATONIC = [0, 2, 4, 7, 9];

export type Voice = {
  hz: number;
  note: string;
  pulseHz: number;
  ratio: number;
  cutoff: number;
  partial: number;
  detune: number;
};

function quantizePentatonic(freq: number): { hz: number; note: string } {
  const midi = 69 + 12 * Math.log2(freq / 440);
  const rounded = Math.round(midi);
  let best = rounded;
  let bestDist = 99;
  for (let n = rounded - 6; n <= rounded + 6; n++) {
    const pc = ((n % 12) + 12) % 12;
    if (!PENTATONIC.includes(pc)) continue;
    const dist = Math.abs(n - midi);
    if (dist < bestDist) {
      bestDist = dist;
      best = n;
    }
  }
  const pc = ((best % 12) + 12) % 12;
  const oct = Math.floor(best / 12) - 1;
  return {
    hz: 440 * 2 ** ((best - 69) / 12),
    note: `${NOTES[pc]}${oct}`,
  };
}

export function harmonyRatio(angleDeg: number): number {
  if (angleDeg < 20) return 1;
  if (angleDeg < 32) return 6 / 5;
  if (angleDeg < 46) return 4 / 3;
  if (angleDeg < 62) return 3 / 2;
  return 5 / 3;
}

export function voiceOf(input: {
  wavelength: number;
  angle: number;
  depth: number;
  length: number;
}): Voice {
  const wavelength = clamp(input.wavelength, 12, 160);
  const raw = 9200 / wavelength;
  const tuned = quantizePentatonic(raw);
  const pulseHz = clamp(tuned.hz / 380, 0.16, 1.25);
  const lengthT = clamp((input.length - 40) / 120, 0, 1);
  return {
    hz: tuned.hz,
    note: tuned.note,
    pulseHz,
    ratio: harmonyRatio(input.angle),
    cutoff: 340 + (1 - lengthT) * 1500,
    partial: clamp((input.depth - 2) * 0.022, 0.03, 0.14),
    detune: 3 + (Math.abs(Math.round(input.angle)) % 8),
  };
}

export type HyphaKind = "stipe" | "hypha" | "mat" | "link";

export type Hypha = {
  ax: number;
  ay: number;
  bx: number;
  by: number;
  depth: number;
  born: number;
  span: number;
  width: number;
  phase: number;
  amp: number;
  wavelength: number;
  kind: HyphaKind;
  isTip: boolean;
  leafy: boolean;
  bloom: boolean;
  ornament: number;
  childCount: number;
};

type Spore = { x: number; y: number; r: number; p: number; speed: number };
type Mote = { x: number; y: number; r: number; a: number };

export type Colony = {
  hyphae: Hypha[];
  spores: Spore[];
  motes: Mote[];
  width: number;
  height: number;
  dpr: number;
  pulseHz: number;
  seed: number;
};

type Job = {
  x: number;
  y: number;
  angle: number;
  len: number;
  depth: number;
  born: number;
  parent: number;
};

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

export function mixHex(a: string, b: string, t: number): string {
  const A = hexToRgb(a);
  const B = hexToRgb(b);
  const u = clamp(t, 0, 1);
  const r = Math.round(A[0] + (B[0] - A[0]) * u);
  const g = Math.round(A[1] + (B[1] - A[1]) * u);
  const bl = Math.round(A[2] + (B[2] - A[2]) * u);
  return `rgb(${r} ${g} ${bl})`;
}

function withAlpha(hex: string, alpha: number): string {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r},${g},${b},${alpha})`;
}

export function generateColony(opts: {
  width: number;
  height: number;
  dpr: number;
  angleDeg: number;
  depth: number;
  length: number;
  wavelength: number;
  seed: number;
}): Colony {
  const width = Math.max(2, opts.width);
  const height = Math.max(2, opts.height);
  const dpr = opts.dpr;
  const maxDepth = clamp(Math.round(opts.depth), 2, 8);
  const angleDeg = clamp(opts.angleDeg, 8, 80);
  const length = clamp(opts.length, 30, 160);
  const wavelength = clamp(opts.wavelength, 12, 160);
  const rand = mulberry32(opts.seed || 1);
  const voice = voiceOf({ wavelength, angle: angleDeg, depth: maxDepth, length });
  const baseLen = (length / 100) * height * 0.22;
  const wavePx = (wavelength / 48) * baseLen * 0.46;
  const hyphae: Hypha[] = [];
  const CAP = 1400;

  const pushHypha = (
    partial: Omit<Hypha, "isTip" | "leafy" | "bloom" | "childCount">,
    parent: number,
  ) => {
    const index = hyphae.length;
    hyphae.push({ ...partial, isTip: false, leafy: false, bloom: false, childCount: 0 });
    if (parent >= 0) hyphae[parent].childCount += 1;
    return index;
  };

  for (let i = 0; i < 12; i++) {
    const horizontal = i < 9;
    const ang = horizontal
      ? (rand() < 0.5 ? 0 : Math.PI) + (rand() - 0.5) * 0.55
      : Math.PI / 2 + (rand() - 0.5) * 0.5;
    const len = (horizontal ? 36 + rand() * 78 : 16 + rand() * 28) * dpr;
    const x = width * (0.16 + rand() * 0.68);
    const y = height * 0.86 + (rand() - 0.35) * 10 * dpr;
    pushHypha(
      {
        ax: x,
        ay: y,
        bx: x + Math.cos(ang) * len,
        by: y + Math.sin(ang) * len * (horizontal ? 0.28 : 1),
        depth: 0,
        born: rand() * 0.05,
        span: 0.24,
        width: (horizontal ? 1.25 : 0.9) * dpr,
        phase: rand() * Math.PI * 2,
        amp: wavePx * 0.06,
        wavelength: wavePx,
        kind: "mat",
        ornament: rand(),
      },
      -1,
    );
  }

  const primaries = 5;
  const fan = 0.92 + rand() * 0.38;
  const queue: Job[] = [];
  for (let i = 0; i < primaries; i++) {
    const t = i / (primaries - 1);
    queue.push({
      x: width / 2 + (t - 0.5) * 18 * dpr,
      y: height * 0.86,
      angle: -Math.PI / 2 + (t - 0.5) * fan,
      len: baseLen * (0.7 + Math.sin(t * Math.PI) * 0.4),
      depth: 0,
      born: t * 0.035,
      parent: -1,
    });
  }

  let qh = 0;
  while (qh < queue.length && hyphae.length < CAP) {
    const job = queue[qh++];
    if (job.len < 5 * dpr) continue;
    const wander = (rand() - 0.5) * 0.12;
    const angle = job.angle + wander;
    const ex = job.x + Math.cos(angle) * job.len;
    const ey = job.y + Math.sin(angle) * job.len;
    const ornament = rand();
    const index = pushHypha(
      {
        ax: job.x,
        ay: job.y,
        bx: ex,
        by: ey,
        depth: job.depth,
        born: clamp(job.born, 0, 0.7),
        span: 0.32,
        width: (job.depth === 0 ? 2.55 : Math.max(0.62, 1.9 - job.depth * 0.2)) * dpr,
        phase: rand() * Math.PI * 2,
        amp: Math.max(dpr * 1.4, Math.min(job.len * 0.15, wavePx * 0.36)),
        wavelength: Math.max(8 * dpr, wavePx),
        kind: job.depth === 0 ? "stipe" : "hypha",
        ornament,
      },
      job.parent,
    );

    if (job.depth >= maxDepth || hyphae.length >= CAP) continue;
    const spread = (angleDeg * Math.PI) / 180;
    const nextDepth = job.depth + 1;
    const born = (nextDepth / maxDepth) * 0.58 + rand() * 0.035;
    const shrink = 0.62 + rand() * 0.1;
    const lift = (a: number) => (Math.sin(a) > 0.02 ? a - Math.sin(a) * 0.72 : a);
    const enqueue = (a: number, lenMul: number) => {
      const aa = lift(a);
      const len = job.len * shrink * lenMul;
      if (len < 4 * dpr) return;
      queue.push({ x: ex, y: ey, angle: aa, len, depth: nextDepth, born, parent: index });
    };

    if (rand() < 0.16 && nextDepth < maxDepth) {
      enqueue(angle + (rand() - 0.5) * 0.2, 1.14);
    } else {
      enqueue(angle - spread * (0.8 + rand() * 0.38), 0.9 + rand() * 0.14);
      enqueue(angle + spread * (0.8 + rand() * 0.38), 0.9 + rand() * 0.14);
      if (rand() < 0.2 && nextDepth < maxDepth - 1) {
        enqueue(angle + (rand() - 0.5) * spread * 0.3, 1.04);
      }
    }
  }

  for (const h of hyphae) {
    if (h.kind === "mat") continue;
    h.isTip = h.childCount === 0;
    const outer = h.depth >= maxDepth - 1;
    h.leafy = h.isTip && outer && h.ornament > 0.28;
    h.bloom = h.isTip && outer && h.ornament > 0.72;
  }

  const tips = hyphae.filter((h) => h.isTip);
  const used = new Set<number>();
  let links = 0;
  const minD = width * 0.018;
  const maxD = width * 0.075;
  for (let i = 0; i < tips.length && links < 72; i++) {
    if (used.has(i)) continue;
    let best = -1;
    let bestD = Infinity;
    for (let j = i + 1; j < tips.length; j++) {
      if (used.has(j)) continue;
      const dx = tips[i].bx - tips[j].bx;
      const dy = tips[i].by - tips[j].by;
      const d = Math.hypot(dx, dy);
      if (d > minD && d < maxD && d < bestD) {
        bestD = d;
        best = j;
      }
    }
    if (best < 0 || rand() > 0.72) continue;
    used.add(i);
    used.add(best);
    const a = tips[i];
    const b = tips[best];
    pushHypha(
      {
        ax: a.bx,
        ay: a.by,
        bx: b.bx,
        by: b.by,
        depth: maxDepth,
        born: 0.8 + rand() * 0.04,
        span: 0.18,
        width: 0.7 * dpr,
        phase: rand() * Math.PI * 2,
        amp: wavePx * 0.07,
        wavelength: Math.max(8 * dpr, wavePx),
        kind: "link",
        ornament: rand(),
      },
      -1,
    );
    links += 1;
  }

  const spores: Spore[] = [];
  for (let i = 0; i < 42; i++) {
    spores.push({
      x: rand() * width,
      y: rand() * height,
      r: (0.6 + rand() * 1.5) * dpr,
      p: rand() * Math.PI * 2,
      speed: (8 + rand() * 22) * dpr,
    });
  }
  const motes: Mote[] = [];
  for (let i = 0; i < 160; i++) {
    motes.push({
      x: rand() * width,
      y: rand() * height,
      r: (0.35 + rand() * 0.9) * dpr,
      a: 0.03 + rand() * 0.07,
    });
  }

  return { hyphae, spores, motes, width, height, dpr, pulseHz: voice.pulseHz, seed: opts.seed };
}

function pointAt(hy: Hypha, t: number, time: number, pulse: number) {
  const dx = hy.bx - hy.ax;
  const dy = hy.by - hy.ay;
  const len = Math.hypot(dx, dy) || 1;
  const px = -dy / len;
  const py = dx / len;
  const amp = hy.amp * (1 + pulse * 0.2);
  const wave = Math.sin((len * t) / hy.wavelength * Math.PI * 2 + hy.phase + time * 0.35);
  return {
    x: hy.ax + dx * t + px * wave * amp,
    y: hy.ay + dy * t + py * wave * amp,
  };
}

function strokeHypha(
  ctx: CanvasRenderingContext2D,
  hy: Hypha,
  eased: number,
  time: number,
  pulse: number,
) {
  const dx = hy.bx - hy.ax;
  const dy = hy.by - hy.ay;
  const len = Math.hypot(dx, dy) || 1;
  const samples = clamp(Math.ceil(len / Math.max(6, hy.wavelength * 0.42)), 4, 20);
  ctx.beginPath();
  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const drawT = Math.min(t, eased);
    const p = pointAt(hy, drawT, time, pulse);
    if (i === 0) ctx.moveTo(p.x, p.y);
    else ctx.lineTo(p.x, p.y);
    if (t >= eased) break;
  }
  ctx.stroke();
  return eased < 1 ? pointAt(hy, eased, time, pulse) : null;
}

function drawLeaf(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number,
  size: number,
  palette: Palette,
  pulse: number,
  tint: string,
) {
  ctx.save();
  ctx.translate(x, y);
  for (const s of [-1, 1]) {
    ctx.save();
    ctx.rotate(angle + s * (0.62 + pulse * 0.06));
    ctx.beginPath();
    ctx.fillStyle = tint;
    ctx.ellipse(size * 0.72, 0, size * 0.74, size * 0.28, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.strokeStyle = palette.vein;
    ctx.lineWidth = Math.max(0.6, size * 0.07);
    ctx.moveTo(size * 0.05, 0);
    ctx.lineTo(size * 1.3, 0);
    ctx.stroke();
    ctx.restore();
  }
  ctx.restore();
}

function drawFlower(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number,
  size: number,
  palette: Palette,
  pulse: number,
  petal: string,
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(pulse * 0.18 + angle * 0.15);
  const petals = 5;
  ctx.fillStyle = petal;
  for (let i = 0; i < petals; i++) {
    const a = (i / petals) * Math.PI * 2;
    ctx.beginPath();
    ctx.ellipse(
      Math.cos(a) * size * 0.4,
      Math.sin(a) * size * 0.4,
      size * 0.4,
      size * 0.22,
      a,
      0,
      Math.PI * 2,
    );
    ctx.fill();
  }
  ctx.beginPath();
  ctx.fillStyle = palette.center;
  ctx.arc(0, 0, size * 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function drawColony(
  ctx: CanvasRenderingContext2D,
  colony: Colony,
  growth: number,
  time: number,
  palette: Palette,
  overlay: Overlay,
) {
  const { width, height, dpr } = colony;
  const pulse = Math.sin(time * colony.pulseHz * Math.PI * 2);
  ctx.clearRect(0, 0, width, height);
  const bg = ctx.createRadialGradient(width * 0.5, height * 0.62, height * 0.04, width * 0.5, height * 0.58, Math.max(width, height) * 0.72);
  bg.addColorStop(0, palette.bgCenter);
  bg.addColorStop(1, palette.bgEdge);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  const light = ctx.createRadialGradient(width * 0.5, height * 0.4, 8, width * 0.5, height * 0.42, height * 0.5);
  light.addColorStop(0, withAlpha(palette.glow, 0.16));
  light.addColorStop(1, withAlpha(palette.glow, 0));
  ctx.fillStyle = light;
  ctx.fillRect(0, 0, width, height);

  ctx.beginPath();
  ctx.ellipse(width * 0.5, height * 0.875, width * 0.2, Math.max(4, height * 0.012), 0, 0, Math.PI * 2);
  ctx.fillStyle = withAlpha(palette.root, 0.16);
  ctx.fill();

  ctx.fillStyle = palette.tip;
  for (const m of colony.motes) {
    ctx.globalAlpha = m.a;
    ctx.beginPath();
    ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  for (const pass of [0, 1]) {
    for (const hy of colony.hyphae) {
      const local = clamp((growth - hy.born) / hy.span, 0, 1);
      if (local <= 0) continue;
      const eased = 1 - (1 - local) ** 3;
      const color = mixHex(palette.root, palette.tip, hy.kind === "mat" ? 0.15 : hy.depth / 7);
      if (pass === 0) {
        if (hy.kind === "link") continue;
        ctx.strokeStyle = palette.glow;
        ctx.globalAlpha = (hy.kind === "stipe" ? 0.2 : 0.1) * (0.45 + 0.55 * eased);
        ctx.lineWidth = hy.width * (hy.kind === "stipe" ? 3.4 : 2.6);
      } else {
        ctx.strokeStyle = color;
        ctx.globalAlpha = (hy.kind === "link" ? 0.38 : 0.94) * (0.35 + 0.65 * eased);
        ctx.lineWidth = hy.width;
      }
      const tip = strokeHypha(ctx, hy, eased, time, pulse);
      if (pass === 1 && tip && hy.kind !== "mat") {
        ctx.globalAlpha = 0.9;
        ctx.fillStyle = palette.glow;
        ctx.beginPath();
        ctx.arc(tip.x, tip.y, Math.max(dpr, hy.width * 0.85), 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
  ctx.globalAlpha = 1;

  if (overlay !== "none") {
    for (const hy of colony.hyphae) {
      const show = overlay === "leaf" ? hy.leafy : hy.bloom;
      if (!show) continue;
      const local = clamp((growth - hy.born) / hy.span, 0, 1);
      if (local < 0.94) continue;
      const tip = pointAt(hy, 1, time, pulse);
      const ang = Math.atan2(hy.by - hy.ay, hy.bx - hy.ax);
      const hero = hy.ornament > 0.88;
      if (overlay === "leaf") {
        const tint = mixHex(palette.leaf, palette.tip, hy.ornament * 0.35);
        drawLeaf(ctx, tip.x, tip.y, ang, (4.2 + hy.ornament * 5.5) * dpr, palette, pulse, tint);
      } else {
        const petal = mixHex(palette.petal, palette.tip, hy.ornament * 0.35);
        drawFlower(
          ctx,
          tip.x,
          tip.y,
          ang,
          (hero ? 8.5 : 4.6 + hy.ornament * 3.2) * dpr,
          palette,
          pulse,
          petal,
        );
      }
    }
  }

  ctx.fillStyle = palette.spore;
  for (const s of colony.spores) {
    const drift = Math.sin(time * 0.45 + s.p) * 10 * dpr;
    let y = (s.y - time * s.speed) % height;
    if (y < 0) y += height;
    ctx.globalAlpha = 0.18 + 0.22 * (0.5 + 0.5 * Math.sin(time * 1.4 + s.p));
    ctx.beginPath();
    ctx.arc(s.x + drift, y, s.r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}
