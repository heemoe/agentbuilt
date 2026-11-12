import { pathToFileURL } from "node:url";
import { frame, pathFrom, stroke, svgDocument } from "./lib.mjs";

// r(θ) = cos(3θ), then rotate the plane by −π/2
export const formula = "r=cos(3θ), θ∈[0,2π], rotated by −π/2, 721 samples";

export function svg({ favicon = false } = {}) {
  const points = [];
  for (let i = 0; i <= 720; i++) {
    const theta = (i / 720) * Math.PI * 2;
    const radius = Math.cos(3 * theta);
    const angle = theta - Math.PI / 2;
    points.push([radius * Math.cos(angle), radius * Math.sin(angle)]);
  }
  return svgDocument(stroke(pathFrom(frame(points, 9)), favicon ? 6.6 : 5.2));
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) process.stdout.write(svg());
