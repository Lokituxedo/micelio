import { writeFileSync } from "node:fs";
import { chromium } from "playwright";

const W = 1200;
const H = 630;
const CX = 600;
const CY = 318;
const RX = 292;
const RY = 172;

const INK = "#07110c";
const BONE = "#e7f0e4";
const GOLD = "#e2c27a";
const CELADON = "#8fb58a";

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(0x5e1c10);

function clearing(x, y) {
  const nx = (x - CX) / RX;
  const ny = (y - CY) / RY;
  return Math.hypot(nx, ny);
}

const paths = [];
const spores = [];

function stroke(x, y, c1x, c1y, ex, ey, width, color, opacity) {
  paths.push(
    `<path d="M ${x.toFixed(1)} ${y.toFixed(1)} Q ${c1x.toFixed(1)} ${c1y.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}" fill="none" stroke="${color}" stroke-width="${width.toFixed(2)}" stroke-linecap="round" stroke-opacity="${opacity.toFixed(3)}"/>`,
  );
}

function grow(x, y, angle, length, width, depth, color, inward) {
  if (depth <= 0 || length < 12 || width < 0.35) {
    const d = clearing(x, y);
    if (d > 0.72 && x > 28 && y > 28 && x < W - 28 && y < H - 28) {
      const r = 1.1 + rand() * (width > 1.4 ? 3.4 : 2.1);
      const fill = rand() < 0.55 ? GOLD : rand() < 0.5 ? BONE : CELADON;
      spores.push({ x, y, r, fill, glow: rand() < 0.35 });
    }
    return;
  }
  const turn = (rand() - 0.5) * (inward ? 0.7 : 0.95);
  const ang2 = angle + turn;
  const ex = x + Math.cos(ang2) * length;
  const ey = y + Math.sin(ang2) * length;
  if (ex < 8 || ey < 8 || ex > W - 8 || ey > H - 8) {
    return;
  }
  const dEnd = clearing(ex, ey);
  if (!inward && dEnd < 0.62) return;
  if (inward && dEnd < 0.78) {
    if (dEnd > 0.7) {
      spores.push({
        x: ex,
        y: ey,
        r: 1.6 + rand() * 2.2,
        fill: rand() < 0.6 ? GOLD : BONE,
        glow: true,
      });
    }
    return;
  }
  const c1x = x + Math.cos(angle) * length * 0.55 + (rand() - 0.5) * 16;
  const c1y = y + Math.sin(angle) * length * 0.55 + (rand() - 0.5) * 16;
  const fade = inward ? 1 : Math.min(1, Math.max(0.12, (dEnd - 0.7) / 0.45));
  const opacity = (0.35 + rand() * 0.5) * fade;
  stroke(x, y, c1x, c1y, ex, ey, width, color, opacity);
  if (rand() < 0.22 && width > 1.1 && dEnd > 0.95) {
    spores.push({
      x: (x + ex) / 2,
      y: (y + ey) / 2,
      r: 1.3 + rand() * 1.6,
      fill: BONE,
      glow: false,
    });
  }
  const nextColor = rand() < 0.18 ? GOLD : rand() < 0.12 ? BONE : color;
  grow(
    ex,
    ey,
    ang2 + (rand() - 0.5) * 0.25,
    length * (0.68 + rand() * 0.16),
    width * (0.72 + rand() * 0.08),
    depth - 1,
    nextColor,
    inward,
  );
  const branchP = inward ? 0.42 : 0.55;
  if (rand() < branchP && depth > 1) {
    const side = rand() < 0.5 ? -1 : 1;
    grow(
      ex,
      ey,
      ang2 + side * (0.45 + rand() * 0.7),
      length * (0.42 + rand() * 0.28),
      width * 0.62,
      depth - 1,
      rand() < 0.28 ? GOLD : CELADON,
      inward,
    );
  }
}

// Outward wreath — hyphae leave the clearing and colonize the frame.
const outward = 18;
for (let i = 0; i < outward; i++) {
  const t = (i / outward) * Math.PI * 2 + 0.15;
  const jitter = (rand() - 0.5) * 0.18;
  const a = t + jitter;
  const x = CX + Math.cos(a) * RX * 0.96;
  const y = CY + Math.sin(a) * RY * 0.96;
  const radial = Math.atan2(y - CY, x - CX);
  const color = rand() < 0.72 ? CELADON : GOLD;
  grow(x, y, radial + (rand() - 0.5) * 0.4, 54 + rand() * 36, 2.4 + rand() * 1.3, 6, color, false);
  if (rand() < 0.65) {
    grow(x, y, radial + (rand() < 0.5 ? -0.8 : 0.8), 36 + rand() * 24, 1.4, 5, CELADON, false);
  }
}

// Inward growth from the margins, stopping at the wreath.
const edgeSeeds = [
  ...Array.from({ length: 7 }, (_, i) => [(i + 0.6) * (W / 8), 18 + rand() * 36, Math.PI / 2]),
  ...Array.from({ length: 7 }, (_, i) => [(i + 0.6) * (W / 8), H - 18 - rand() * 36, -Math.PI / 2]),
  ...Array.from({ length: 3 }, (_, i) => [18 + rand() * 28, (i + 0.7) * (H / 4), 0]),
  ...Array.from({ length: 3 }, (_, i) => [W - 18 - rand() * 28, (i + 0.7) * (H / 4), Math.PI]),
];
for (const [x, y, angle] of edgeSeeds) {
  grow(x, y, angle + (rand() - 0.5) * 0.5, 48 + rand() * 40, 1.8 + rand() * 1.1, 5, rand() < 0.25 ? GOLD : CELADON, true);
}

// A few corner fans, denser and finer.
const corners = [
  [36, 36, Math.PI * 0.25],
  [W - 36, 36, Math.PI * 0.75],
  [36, H - 36, -Math.PI * 0.25],
  [W - 36, H - 36, -Math.PI * 0.75],
];
for (const [x, y, angle] of corners) {
  for (let k = 0; k < 3; k++) {
    grow(x, y, angle + (k - 1) * 0.28, 70 + rand() * 30, 1.5, 5, k === 1 ? GOLD : CELADON, true);
  }
}

const sporeSvg = spores
  .map((s) => {
    const glow = s.glow
      ? `<circle cx="${s.x.toFixed(1)}" cy="${s.y.toFixed(1)}" r="${(s.r * 3.2).toFixed(1)}" fill="${s.fill}" opacity="0.13"/>`
      : "";
    return `${glow}<circle cx="${s.x.toFixed(1)}" cy="${s.y.toFixed(1)}" r="${s.r.toFixed(2)}" fill="${s.fill}"/>`;
  })
  .join("");

const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8"/>
<style>
  html, body { margin: 0; width: ${W}px; height: ${H}px; background: ${INK}; overflow: hidden; }
  .stage { position: relative; width: ${W}px; height: ${H}px; }
  svg { position: absolute; inset: 0; display: block; }
  .lockup {
    position: absolute; inset: 0;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 16px;
    transform: translateY(-2px);
  }
  h1 {
    margin: 0;
    font-family: "Liberation Serif", "DejaVu Serif", serif;
    font-weight: 700;
    font-size: 108px;
    line-height: 0.9;
    letter-spacing: 0.16em;
    color: ${GOLD};
    padding-left: 0.16em;
    text-shadow: 0 0 22px rgba(226, 194, 122, 0.28), 0 2px 0 rgba(7, 17, 12, 0.4);
  }
  .ornament { display: flex; align-items: center; gap: 10px; }
  .ornament i {
    width: 5px; height: 5px; border-radius: 50%; background: ${GOLD}; display: block; opacity: 0.9;
  }
  .ornament span { width: 132px; height: 1px; background: ${GOLD}; opacity: 0.8; display: block; }
  .sub {
    margin: 0;
    font-family: "Liberation Sans", "DejaVu Sans", sans-serif;
    font-weight: 400;
    font-size: 13px;
    letter-spacing: 0.46em;
    color: ${BONE};
    opacity: 0.82;
    padding-left: 0.46em;
  }
</style>
</head>
<body>
  <div class="stage">
    <svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
      <defs>
        <radialGradient id="well" cx="50%" cy="50.5%" r="42%">
          <stop offset="0%" stop-color="${INK}" stop-opacity="0.78"/>
          <stop offset="58%" stop-color="${INK}" stop-opacity="0.42"/>
          <stop offset="100%" stop-color="${INK}" stop-opacity="0"/>
        </radialGradient>
        <radialGradient id="wash" cx="50%" cy="62%" r="70%">
          <stop offset="0%" stop-color="#143024" stop-opacity="0.55"/>
          <stop offset="55%" stop-color="#0b1a12" stop-opacity="0.2"/>
          <stop offset="100%" stop-color="${INK}" stop-opacity="0"/>
        </radialGradient>
        <radialGradient id="goldwash" cx="22%" cy="78%" r="42%">
          <stop offset="0%" stop-color="${GOLD}" stop-opacity="0.09"/>
          <stop offset="100%" stop-color="${GOLD}" stop-opacity="0"/>
        </radialGradient>
        <radialGradient id="celwash" cx="82%" cy="18%" r="40%">
          <stop offset="0%" stop-color="${CELADON}" stop-opacity="0.10"/>
          <stop offset="100%" stop-color="${CELADON}" stop-opacity="0"/>
        </radialGradient>
        <filter id="soft" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.4"/>
        </filter>
        <filter id="grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="7" result="n"/>
          <feColorMatrix in="n" type="saturate" values="0"/>
        </filter>
      </defs>
      <rect width="${W}" height="${H}" fill="${INK}"/>
      <rect width="${W}" height="${H}" fill="url(#wash)"/>
      <rect width="${W}" height="${H}" fill="url(#goldwash)"/>
      <rect width="${W}" height="${H}" fill="url(#celwash)"/>
      <g filter="url(#soft)" opacity="0.55">${paths.join("")}</g>
      <g>${paths.join("")}</g>
      <g>${sporeSvg}</g>
      <ellipse cx="${CX}" cy="${CY}" rx="360" ry="210" fill="url(#well)"/>
      <rect width="${W}" height="${H}" filter="url(#grain)" opacity="0.045"/>
    </svg>
    <div class="lockup">
      <h1 id="title">MICELIO</h1>
      <div class="ornament"><i></i><span></span><i></i></div>
      <p class="sub" id="sub">GENERATIVE INSTRUMENT</p>
    </div>
  </div>
</body>
</html>`;

writeFileSync("/workspace/.grok/og-card.html", html);

const browser = await chromium.launch({ args: ["--no-sandbox", "--disable-dev-shm-usage"] });
const page = await browser.newPage({
  viewport: { width: W, height: H },
  deviceScaleFactor: 2,
});
await page.goto("file:///workspace/.grok/og-card.html");
await page.evaluate(() => document.fonts.ready);
const box = await page.evaluate(() => {
  const t = document.getElementById("title").getBoundingClientRect();
  const s = document.getElementById("sub").getBoundingClientRect();
  return {
    title: { x: t.x, y: t.y, w: t.width, h: t.height, right: t.right, bottom: t.bottom },
    sub: { x: s.x, y: s.y, w: s.width, h: s.height, right: s.right, bottom: s.bottom },
    text: document.getElementById("title").textContent,
  };
});
console.log(JSON.stringify(box, null, 2));
await page.screenshot({ path: "/workspace/.grok/og-raw.png", type: "png" });
await browser.close();
console.log("screenshot done", paths.length, "paths", spores.length, "spores");
