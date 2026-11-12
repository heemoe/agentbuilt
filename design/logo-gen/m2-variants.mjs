import { pathToFileURL } from "node:url";
import { pathFrom } from "./lib.mjs";

const STOPS = [
  [0, [196, 181, 253]],
  [0.34, [59, 130, 246]],
  [0.68, [94, 234, 212]],
  [1, [196, 181, 253]],
];

function mix(t) {
  const u = ((t % 1) + 1) % 1;
  let i = 0;
  while (i < STOPS.length - 1 && STOPS[i + 1][0] < u) i += 1;
  const [t0, a] = STOPS[i];
  const [t1, b] = STOPS[i + 1];
  const f = (u - t0) / (t1 - t0);
  const rgb = a.map((channel, k) => Math.round(channel + (b[k] - channel) * f));
  return `#${rgb.map((channel) => channel.toString(16).padStart(2, "0")).join("")}`;
}

export function ringPoints(n, rotation, radius, samples = 180) {
  const exp = 2 / n;
  const points = [];
  for (let i = 0; i <= samples; i++) {
    const t = (i / samples) * Math.PI * 2;
    const c = Math.cos(t);
    const s = Math.sin(t);
    const x = Math.sign(c) * Math.abs(c) ** exp;
    const y = Math.sign(s) * Math.abs(s) ** exp;
    const xr = x * Math.cos(rotation) - y * Math.sin(rotation);
    const yr = x * Math.sin(rotation) + y * Math.cos(rotation);
    points.push([32 + xr * radius, 32 + yr * radius]);
  }
  return points;
}

export function corner(n, rotation, radius, t = Math.PI / 4) {
  const exp = 2 / n;
  const c = Math.cos(t);
  const s = Math.sin(t);
  const x = Math.sign(c) * Math.abs(c) ** exp;
  const y = Math.sign(s) * Math.abs(s) ** exp;
  const xr = x * Math.cos(rotation) - y * Math.sin(rotation);
  const yr = x * Math.sin(rotation) + y * Math.cos(rotation);
  return [32 + xr * radius, 32 + yr * radius];
}

function colorAt(point) {
  const angle = Math.atan2(point[1] - 32, point[0] - 32);
  return mix((angle + Math.PI) / (Math.PI * 2));
}

function angularStroke(n, rotation, radius, width, sectors, prefix) {
  const overlap = Math.min(0.02, (width / 2) / radius);
  const defs = [];
  const parts = [];
  for (let sector = 0; sector < sectors; sector++) {
    const start = (sector / sectors) * Math.PI * 2 - overlap;
    const end = ((sector + 1) / sectors) * Math.PI * 2 + overlap;
    const points = [];
    for (let i = 0; i <= 8; i++) points.push(superPoint(n, rotation, radius, start + ((end - start) * i) / 8));
    const id = `${prefix}${sector}`;
    const from = colorAt(points[0]);
    const to = colorAt(points[points.length - 1]);
    defs.push(
      `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${points[0][0].toFixed(2)}" y1="${points[0][1].toFixed(2)}" x2="${points[points.length - 1][0].toFixed(2)}" y2="${points[points.length - 1][1].toFixed(2)}"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient>`,
    );
    parts.push(
      `<path d="${pathFrom(points)}" fill="none" stroke="url(#${id})" stroke-width="${width}" stroke-linecap="butt" stroke-linejoin="round"/>`,
    );
  }
  return { defs: defs.join("\n"), body: parts.join("\n") };
}

function superPoint(n, rotation, radius, t) {
  const exp = 2 / n;
  const c = Math.cos(t);
  const s = Math.sin(t);
  const x = Math.sign(c) * Math.abs(c) ** exp;
  const y = Math.sign(s) * Math.abs(s) ** exp;
  const xr = x * Math.cos(rotation) - y * Math.sin(rotation);
  const yr = x * Math.sin(rotation) + y * Math.cos(rotation);
  return [32 + xr * radius, 32 + yr * radius];
}

function softGlow(n, rotation, radius, width) {
  return `<path d="${pathFrom(ringPoints(n, rotation, radius, 240))}" fill="none" stroke="url(#fill)" stroke-width="${width + 1.6}" stroke-linecap="round" filter="url(#glow)" opacity="0.8"/>`;
}

function star(cx, cy, radius) {
  const points = [];
  for (let i = 0; i < 8; i++) {
    const angle = -Math.PI / 2 + (i * Math.PI) / 4;
    const r = i % 2 === 0 ? radius : radius * 0.36;
    points.push([cx + Math.cos(angle) * r, cy + Math.sin(angle) * r]);
  }
  return `<path d="${pathFrom(points, true)}" fill="#F4F1EA"/>`;
}

function dot(cx, cy, radius) {
  return `<circle cx="${cx.toFixed(2)}" cy="${cy.toFixed(2)}" r="${radius}" fill="#F4F1EA"/>`;
}

function document(body, extraDefs = "") {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs>
    <linearGradient id="fill" x1="18" y1="18" x2="46" y2="48" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#C4B5FD"/>
      <stop offset="0.5" stop-color="#7AA2FF"/>
      <stop offset="1" stop-color="#5EEAD4"/>
    </linearGradient>
    <filter id="glow" x="-70%" y="-70%" width="240%" height="240%">
      <feGaussianBlur stdDeviation="0.5"/>
    </filter>
    ${extraDefs}
  </defs>
  ${body}
</svg>
`;
}

function upperRight(n, rotation, radius) {
  let best = null;
  let bestScore = -Infinity;
  for (const t of [Math.PI / 4, (3 * Math.PI) / 4, (5 * Math.PI) / 4, (7 * Math.PI) / 4]) {
    const point = corner(n, rotation, radius, t);
    const score = point[0] - point[1];
    if (score > bestScore) {
      bestScore = score;
      best = point;
    }
  }
  return best;
}

const sectorsFor = { large: 144, 32: 64, 16: 32 };

// M2a: tighter nest, inner stroke thinner, angular violet→blue→mint, soft halo on the large mark.
export const m2a = {
  id: "M2a",
  formula: "outer n=4 rot=0; inner n=5 rot=π/8; large r=22/14.2 stroke 5.4/3.8 glow stdDeviation 0.5; 32 r=21/11.2 stroke 5.6/4.0; 16 r=22/9.5 stroke 5.2/3.8; angular #C4B5FD→#3B82F6→#5EEAD4",
  svg({ size = "large" } = {}) {
    const sectors = sectorsFor[size];
    const outerR = size === "32" ? 21 : 22;
    const innerR = size === "16" ? 9.5 : size === "32" ? 11.2 : 14.2;
    const outerW = size === "16" ? 5.2 : size === "32" ? 5.6 : 5.4;
    const innerW = size === "16" ? 3.8 : size === "32" ? 4.0 : 3.8;
    const outer = angularStroke(4, 0, outerR, outerW, sectors, "ao");
    const inner = angularStroke(5, Math.PI / 8, innerR, innerW, sectors, "ai");
    const glow = size === "large" ? `${softGlow(4, 0, outerR, outerW)}\n${softGlow(5, Math.PI / 8, innerR, innerW)}` : "";
    return document(`${glow}\n${outer.body}\n${inner.body}`, `${outer.defs}\n${inner.defs}`);
  },
};

// M2b: looser gap, inner superellipse filled, outer stroke only, rotation π/4.
export const m2b = {
  id: "M2b",
  formula: "outer n=4 rot=0 stroke large/32/16 5.6/6.0/5.4 r=22/21/21; inner filled n=5/5/4 rot=π/4 r=10.5/11/12 gradient #C4B5FD→#7AA2FF→#5EEAD4",
  svg({ size = "large" } = {}) {
    const sectors = sectorsFor[size];
    const outerR = size === "large" ? 22 : 21;
    const outerW = size === "16" ? 5.4 : size === "32" ? 6.0 : 5.6;
    const innerN = size === "16" ? 4 : 5;
    const innerR = size === "16" ? 12 : size === "32" ? 11 : 10.5;
    const outer = angularStroke(4, 0, outerR, outerW, sectors, "bo");
    const inner = ringPoints(innerN, Math.PI / 4, innerR, 180);
    return document(
      `${outer.body}\n<path d="${pathFrom(inner, true)}" fill="url(#fill)"/>`,
      outer.defs,
    );
  },
};

// M2c: original 0.58 gap and π/6, inner stroke slightly thicker, cream accent on the upper-right corner.
export const m2c = {
  id: "M2c",
  formula: "outer n=4 rot=0 r=22/21/21 stroke 5.0/5.4/5.2; inner n=5 rot=π/6 r=12.8/11.4/9.6 stroke 5.6/5.0/4.4; cream 4-point star r=2.6 on the inner upper-right corner (large), or dot r=4.6/5.2 on the outer ring (32/16)",
  svg({ size = "large" } = {}) {
    const sectors = sectorsFor[size];
    const outerR = size === "large" ? 22 : 21;
    const innerR = size === "16" ? 9.6 : size === "32" ? 11.4 : 12.8;
    const outerW = size === "16" ? 5.2 : size === "32" ? 5.4 : 5.0;
    const innerW = size === "16" ? 4.4 : size === "32" ? 5.0 : 5.6;
    const outer = angularStroke(4, 0, outerR, outerW, sectors, "co");
    const inner = angularStroke(5, Math.PI / 6, innerR, innerW, sectors, "ci");
    const [cx, cy] = upperRight(5, Math.PI / 6, innerR);
    let accent;
    if (size === "large") {
      accent = star(cx, cy, 2.6);
    } else {
      const dx = cx - 32;
      const dy = cy - 32;
      const len = Math.hypot(dx, dy) || 1;
      accent = dot(32 + (dx / len) * outerR, 32 + (dy / len) * outerR, size === "16" ? 5.2 : 4.6);
    }
    return document(`${outer.body}\n${inner.body}\n${accent}`, `${outer.defs}\n${inner.defs}`);
  },
};

// M2d: nested rings on a dark n=4 squircle tile.
export const m2d = {
  id: "M2d",
  formula: "tile n=4 r=30/30/31 fill #1c2330/#1c2330/#243044; outer n=4 rot=0 r=16.5/16/15 stroke 4.4/5.2/5.4; inner n=5 rot=π/8 r=9.9/9.2/8.2 stroke 3.2/4.0/4.2; angular #C4B5FD→#3B82F6→#5EEAD4",
  svg({ size = "large" } = {}) {
    const sectors = sectorsFor[size];
    const tileR = size === "16" ? 31 : 30;
    const tileFill = size === "16" ? "#243044" : "#1c2330";
    const outerR = size === "16" ? 15 : size === "32" ? 16 : 16.5;
    const innerR = size === "16" ? 8.2 : size === "32" ? 9.2 : 9.9;
    const outerW = size === "16" ? 5.4 : size === "32" ? 5.2 : 4.4;
    const innerW = size === "16" ? 4.2 : size === "32" ? 4.0 : 3.2;
    const tile = ringPoints(4, 0, tileR, 180);
    const outer = angularStroke(4, 0, outerR, outerW, sectors, "do");
    const inner = angularStroke(5, Math.PI / 8, innerR, innerW, sectors, "di");
    return document(
      `<path d="${pathFrom(tile, true)}" fill="${tileFill}"/>\n${outer.body}\n${inner.body}`,
      `${outer.defs}\n${inner.defs}`,
    );
  },
};

export const variants = [m2a, m2b, m2c, m2d];

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  const which = process.argv[2] ?? "M2a";
  const found = variants.find((variant) => variant.id === which) ?? m2a;
  process.stdout.write(found.svg());
}
