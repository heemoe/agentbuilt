import { pathToFileURL } from "node:url";

// M2b: outer n=4 squircle stroke, filled inner superellipse rotated π/4.
// large/32/16: outer r 22/21/21, stroke 5.6/6.0/5.4; inner n 5/5/4, r 10.5/11/12.
// Fill #C4B5FD → #7AA2FF → #5EEAD4. Outer stroke is the same ramp around the ring.

const STOPS = [
  [0, [196, 181, 253]],
  [0.34, [59, 130, 246]],
  [0.68, [94, 234, 212]],
  [1, [196, 181, 253]],
];

const GEOMETRY = {
  large: { outerR: 22, outerW: 5.6, innerN: 5, innerR: 10.5, sectors: 144 },
  32: { outerR: 21, outerW: 6.0, innerN: 5, innerR: 11, sectors: 64 },
  16: { outerR: 21, outerW: 5.4, innerN: 4, innerR: 12, sectors: 32 },
};

export const formula =
  "outer n=4 rot=0 stroke large/32/16 5.6/6.0/5.4 r=22/21/21; inner filled n=5/5/4 rot=π/4 r=10.5/11/12 gradient #C4B5FD→#7AA2FF→#5EEAD4";

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

function pathFrom(points, close = false) {
  const d = points
    .map((point, index) => `${index ? "L" : "M"}${point[0].toFixed(2)} ${point[1].toFixed(2)}`)
    .join(" ");
  return close ? `${d} Z` : d;
}

function colorAt(point) {
  const angle = Math.atan2(point[1] - 32, point[0] - 32);
  return mix((angle + Math.PI) / (Math.PI * 2));
}

function angularStroke(n, rotation, radius, width, sectors) {
  const overlap = Math.min(0.02, width / 2 / radius);
  const defs = [];
  const parts = [];
  for (let sector = 0; sector < sectors; sector++) {
    const start = (sector / sectors) * Math.PI * 2 - overlap;
    const end = ((sector + 1) / sectors) * Math.PI * 2 + overlap;
    const points = [];
    for (let i = 0; i <= 8; i++) points.push(superPoint(n, rotation, radius, start + ((end - start) * i) / 8));
    const id = `m2b${sector}`;
    defs.push(
      `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${points[0][0].toFixed(2)}" y1="${points[0][1].toFixed(2)}" x2="${points.at(-1)[0].toFixed(2)}" y2="${points.at(-1)[1].toFixed(2)}"><stop offset="0" stop-color="${colorAt(points[0])}"/><stop offset="1" stop-color="${colorAt(points.at(-1))}"/></linearGradient>`,
    );
    parts.push(
      `<path d="${pathFrom(points)}" fill="none" stroke="url(#${id})" stroke-width="${width}" stroke-linecap="butt" stroke-linejoin="round"/>`,
    );
  }
  return { defs: defs.join("\n"), body: parts.join("\n") };
}

function ringPoints(n, rotation, radius, samples = 180) {
  const points = [];
  for (let i = 0; i <= samples; i++) points.push(superPoint(n, rotation, radius, (i / samples) * Math.PI * 2));
  return points;
}

export function inner({ size = "large" } = {}) {
  const spec = GEOMETRY[size] ?? GEOMETRY.large;
  const outer = angularStroke(4, 0, spec.outerR, spec.outerW, spec.sectors);
  const diamond = ringPoints(spec.innerN, Math.PI / 4, spec.innerR, 180);
  return `<defs>
    <linearGradient id="m2b-fill" x1="18" y1="18" x2="46" y2="48" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#C4B5FD"/>
      <stop offset="0.5" stop-color="#7AA2FF"/>
      <stop offset="1" stop-color="#5EEAD4"/>
    </linearGradient>
    ${outer.defs}
  </defs>
  ${outer.body}
  <path d="${pathFrom(diamond, true)}" fill="url(#m2b-fill)"/>`;
}

export function svg({ size = "large" } = {}) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
${inner({ size })}
</svg>
`;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) process.stdout.write(svg({ size: process.argv[2] ?? "large" }));
