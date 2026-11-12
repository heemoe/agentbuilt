import { pathToFileURL } from "node:url";
import { pathFrom, stroke, svgDocument } from "./lib.mjs";

// |x/a|^n + |y/b|^n = 1, x = sgn(cos t)|cos t|^(2/n), y = sgn(sin t)|sin t|^(2/n)
export const formula = "superellipse n=4 scale=1 rot=0; n=5 scale=0.58 rot=π/6; t∈[0,2π]";

function ring(n, rotation, scale) {
  const exp = 2 / n;
  const points = [];
  for (let i = 0; i <= 360; i++) {
    const t = (i / 360) * Math.PI * 2;
    const c = Math.cos(t);
    const s = Math.sin(t);
    const x = Math.sign(c) * Math.abs(c) ** exp;
    const y = Math.sign(s) * Math.abs(s) ** exp;
    const xr = x * Math.cos(rotation) - y * Math.sin(rotation);
    const yr = x * Math.sin(rotation) + y * Math.cos(rotation);
    points.push([32 + xr * 24 * scale, 32 + yr * 24 * scale]);
  }
  return points;
}

export function svg({ favicon = false } = {}) {
  const outer = favicon ? 7.4 : 6.4;
  const inner = favicon ? 6.2 : 5.2;
  return svgDocument(
    [
      stroke(pathFrom(ring(4, 0, 1)), outer),
      stroke(pathFrom(ring(5, Math.PI / 6, 0.58)), inner),
    ].join("\n"),
  );
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) process.stdout.write(svg());
