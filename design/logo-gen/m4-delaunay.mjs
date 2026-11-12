import { pathToFileURL } from "node:url";
import { pathFrom, stroke, svgDocument } from "./lib.mjs";

// Bowyer–Watson Delaunay on fixed W seeds; keep an edge when both ends and its midpoint satisfy |x|^4+|y|^4 ≤ 1.05
export const formula = "Delaunay seeds (−0.72,0.62),(−0.36,−0.62),(0,0.18),(0.36,−0.62),(0.72,0.62),(−0.2,0.05),(0.2,0.05),(0,0.72); clip |x|^4+|y|^4≤1.05";

const seeds = [
  [-0.72, 0.62],
  [-0.36, -0.62],
  [0, 0.18],
  [0.36, -0.62],
  [0.72, 0.62],
  [-0.2, 0.05],
  [0.2, 0.05],
  [0, 0.72],
];

function circumcircle(a, b, c) {
  const det = 2 * (a[0] * (b[1] - c[1]) + b[0] * (c[1] - a[1]) + c[0] * (a[1] - b[1]));
  if (Math.abs(det) < 1e-9) return null;
  const a2 = a[0] ** 2 + a[1] ** 2;
  const b2 = b[0] ** 2 + b[1] ** 2;
  const c2 = c[0] ** 2 + c[1] ** 2;
  const ux = (a2 * (b[1] - c[1]) + b2 * (c[1] - a[1]) + c2 * (a[1] - b[1])) / det;
  const uy = (a2 * (c[0] - b[0]) + b2 * (a[0] - c[0]) + c2 * (b[0] - a[0])) / det;
  return [ux, uy, (ux - a[0]) ** 2 + (uy - a[1]) ** 2];
}

function delaunay(points) {
  const verts = [[-4, -4], [4, -4], [0, 4], ...points];
  let triangles = [[0, 1, 2]];
  for (let index = 3; index < verts.length; index++) {
    const point = verts[index];
    const bad = [];
    const keep = [];
    for (const triangle of triangles) {
      const circle = circumcircle(verts[triangle[0]], verts[triangle[1]], verts[triangle[2]]);
      if (circle && (point[0] - circle[0]) ** 2 + (point[1] - circle[1]) ** 2 < circle[2] * 1.0000001) bad.push(triangle);
      else keep.push(triangle);
    }
    const edges = [];
    for (const triangle of bad) {
      for (const edge of [[triangle[0], triangle[1]], [triangle[1], triangle[2]], [triangle[2], triangle[0]]]) {
        const found = edges.findIndex((other) => (other[0] === edge[0] && other[1] === edge[1]) || (other[0] === edge[1] && other[1] === edge[0]));
        if (found >= 0) edges.splice(found, 1);
        else edges.push(edge);
      }
    }
    triangles = keep;
    for (const edge of edges) triangles.push([edge[0], edge[1], index]);
  }
  const unique = new Set();
  const result = [];
  for (const triangle of triangles) {
    if (triangle.some((vertex) => vertex < 3)) continue;
    for (const [i, j] of [[triangle[0], triangle[1]], [triangle[1], triangle[2]], [triangle[2], triangle[0]]]) {
      const key = `${Math.min(i, j)}:${Math.max(i, j)}`;
      if (unique.has(key)) continue;
      unique.add(key);
      result.push([verts[i], verts[j]]);
    }
  }
  return result;
}

function inside(x, y) {
  return Math.abs(x) ** 4 + Math.abs(y) ** 4 <= 1.05;
}

export function svg({ favicon = false } = {}) {
  const edges = delaunay(seeds).filter(([a, b]) => {
    const mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    return inside(a[0], a[1]) && inside(b[0], b[1]) && inside(mid[0], mid[1]);
  });
  const toPx = ([x, y]) => [32 + x * 26, 32 - y * 26];
  const lines = edges.map(([a, b]) => stroke(pathFrom([toPx(a), toPx(b)]), favicon ? 5.6 : 4.4));
  const dots = favicon
    ? ""
    : seeds
        .filter(([x, y]) => inside(x, y))
        .map(([x, y]) => {
          const [px, py] = toPx([x, y]);
          return `<circle cx="${px.toFixed(2)}" cy="${py.toFixed(2)}" r="2.3" fill="#F4F1EA"/>`;
        })
        .join("\n");
  return svgDocument(`${lines.join("\n")}\n${dots}`);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) process.stdout.write(svg());
