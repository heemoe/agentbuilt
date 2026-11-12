import { pathToFileURL } from "node:url";
import { frame, pathFrom, stroke, svgDocument } from "./lib.mjs";

// x(t) = sin(t + π/2), y(t) = sin(3t), t ∈ [0, 2π]
export const formula = "x=sin(t+π/2), y=sin(3t), t∈[0,2π], 721 samples";

export function svg({ favicon = false } = {}) {
  const points = [];
  for (let i = 0; i <= 720; i++) {
    const t = (i / 720) * Math.PI * 2;
    points.push([Math.sin(t + Math.PI / 2), Math.sin(3 * t)]);
  }
  const width = favicon ? 7.2 : 5.6;
  return svgDocument(stroke(pathFrom(frame(points, 10)), width));
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) process.stdout.write(svg());
