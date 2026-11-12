import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as m1 from "./m1-lissajous.mjs";
import * as m2 from "./m2-superellipse.mjs";
import * as m3 from "./m3-lorenz.mjs";
import * as m4 from "./m4-delaunay.mjs";
import * as m5 from "./m5-rose.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(path.join(here, "../../site/package.json"));
const { Resvg } = require("@resvg/resvg-js");
const sharp = require("sharp");

const concepts = [
  ["M1", m1],
  ["M2", m2],
  ["M3", m3],
  ["M4", m4],
  ["M5", m5],
];

const fontFiles = [
  "/tmp/fonts/IBMPlexSans-SemiBold.ttf",
  "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
].filter((file) => fs.existsSync(file));

function render(svg, file, width) {
  const png = new Resvg(svg, {
    fitTo: { mode: "width", value: width },
    font: { fontFiles, loadSystemFonts: false, defaultFontFamily: "IBM Plex Sans" },
    background: "rgba(0,0,0,0)",
  }).render().asPng();
  fs.writeFileSync(file, png);
}

function stage(svg, size) {
  const body = svg.replace(/<\?xml[^>]*>/, "").replace(/<svg[^>]*>/, "").replace("</svg>", "");
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64">
  <rect width="64" height="64" fill="#0b0d10"/>
  ${body}
</svg>`;
}

const out = process.argv[2] ?? path.join(here, "out");
fs.mkdirSync(out, { recursive: true });

const largeFiles = [];
for (const [label, mod] of concepts) {
  const id = label.toLowerCase();
  const large = stage(mod.svg({ favicon: false }), 800);
  const favicon = stage(mod.svg({ favicon: true }), 32);
  const largeFile = path.join(out, `mark_${id}_large.png`);
  render(large, largeFile, 800);
  render(favicon, path.join(out, `mark_${id}_favicon_32.png`), 32);
  largeFiles.push([label, largeFile]);
  console.log(label, mod.formula);
}

const cell = 300;
const sheetW = cell * concepts.length;
const sheetH = 360;
const tiles = [];
for (const [index, [label, file]] of largeFiles.entries()) {
  const image = await sharp(file).resize(250, 250, { fit: "contain", background: "#0b0d10" }).png().toBuffer();
  tiles.push({ input: image, left: index * cell + 25, top: 20 });
}
const labelSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${sheetW}" height="${sheetH}">
  ${largeFiles.map(([label], index) => `<text x="${index * cell + cell / 2}" y="330" text-anchor="middle" font-family="DejaVu Sans" font-weight="700" font-size="28" fill="#F4F1EA">${label}</text>`).join("")}
</svg>`;
const labels = new Resvg(labelSvg, {
  fitTo: { mode: "width", value: sheetW },
  font: { fontFiles, loadSystemFonts: true, defaultFontFamily: "DejaVu Sans" },
  background: "rgba(0,0,0,0)",
}).render().asPng();
tiles.push({ input: labels, left: 0, top: 0 });
await sharp({
  create: { width: sheetW, height: sheetH, channels: 4, background: "#0b0d10" },
}).composite(tiles).png().toFile(path.join(out, "marks_m1_m5_contact.png"));
console.log("contact", path.join(out, "marks_m1_m5_contact.png"));
