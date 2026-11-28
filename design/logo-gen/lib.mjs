export function pathFrom(points, close = false) {
  const d = points
    .map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(2)} ${p[1].toFixed(2)}`)
    .join(" ");
  return close ? `${d} Z` : d;
}

export function frame(points, pad = 9) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const [x, y] of points) {
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  }
  const scale = (64 - pad * 2) / Math.max(maxX - minX, maxY - minY);
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  return points.map(([x, y]) => [32 + (x - cx) * scale, 32 + (y - cy) * scale]);
}

export function svgDocument(body) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs>
    <linearGradient id="g" x1="6" y1="8" x2="58" y2="56" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#C4B5FD"/>
      <stop offset="0.55" stop-color="#7AA2FF"/>
      <stop offset="1" stop-color="#5EEAD4"/>
    </linearGradient>
  </defs>
  ${body}
</svg>
`;
}

export function stroke(d, width) {
  return `<path d="${d}" fill="none" stroke="url(#g)" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/>`;
}
