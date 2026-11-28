import { pathToFileURL } from "node:url";
import { frame, pathFrom, stroke, svgDocument } from "./lib.mjs";

// dx/dt = σ(y−x), dy/dt = x(ρ−z)−y, dz/dt = xy−βz; plot (x, z)
export const formula = "Lorenz σ=10 ρ=28 β=8/3, RK4 dt=0.008, two longest x>0/x<0 wings, 36-bin radial envelope";

function rk4(state, dt, derive) {
  const a = derive(state);
  const b = derive(state.map((value, i) => value + (dt * a[i]) / 2));
  const c = derive(state.map((value, i) => value + (dt * b[i]) / 2));
  const d = derive(state.map((value, i) => value + dt * c[i]));
  return state.map((value, i) => value + (dt / 6) * (a[i] + 2 * b[i] + 2 * c[i] + d[i]));
}

function lorenz([x, y, z]) {
  const sigma = 10;
  const rho = 28;
  const beta = 8 / 3;
  return [sigma * (y - x), x * (rho - z) - y, x * y - beta * z];
}

function envelope(segment, bins = 36) {
  const cx = segment.reduce((sum, p) => sum + p[0], 0) / segment.length;
  const cy = segment.reduce((sum, p) => sum + p[1], 0) / segment.length;
  const best = Array(bins).fill(null);
  for (const point of segment) {
    const angle = Math.atan2(point[1] - cy, point[0] - cx);
    const radius = Math.hypot(point[0] - cx, point[1] - cy);
    const bin = Math.floor(((angle + Math.PI) / (2 * Math.PI)) * bins) % bins;
    if (!best[bin] || radius > best[bin].radius) best[bin] = { point, radius, angle };
  }
  let points = best.filter(Boolean).sort((a, b) => a.angle - b.angle).map((item) => item.point);
  for (let pass = 0; pass < 2; pass++) {
    points = points.map((point, index) => {
      const prev = points[(index - 1 + points.length) % points.length];
      const next = points[(index + 1) % points.length];
      return [(prev[0] + 2 * point[0] + next[0]) / 4, (prev[1] + 2 * point[1] + next[1]) / 4];
    });
  }
  return points;
}

function wings() {
  let state = [1, 1, 1];
  const points = [];
  for (let i = 0; i < 9000; i++) {
    state = rk4(state, 0.008, lorenz);
    if (i > 2000 && i % 2 === 0) points.push([state[0], state[2]]);
  }
  const segments = [];
  let current = [points[0]];
  for (let i = 1; i < points.length; i++) {
    if (Math.sign(points[i][0]) !== Math.sign(points[i - 1][0]) && current.length > 20) {
      segments.push(current);
      current = [];
    }
    current.push(points[i]);
  }
  segments.sort((a, b) => b.length - a.length);
  return [envelope(segments[0]), envelope(segments[1])];
}

export function svg({ favicon = false } = {}) {
  const curves = wings();
  const flat = curves.flat();
  const fitted = frame(flat, 8);
  const counts = curves.map((curve) => curve.length);
  let cursor = 0;
  const paths = counts.map((count) => {
    const slice = fitted.slice(cursor, cursor + count);
    cursor += count;
    return stroke(pathFrom(slice, true), favicon ? 5.4 : 4.2);
  });
  return svgDocument(paths.join("\n"));
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) process.stdout.write(svg());
