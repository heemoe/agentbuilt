import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { variants } from "./m2-variants.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(path.join(here, "../../site/package.json"));
const { Resvg } = require("@resvg/resvg-js");
const sharp = require("sharp");

const fontFiles = [
  "/tmp/fonts/IBMPlexSans-SemiBold.ttf",
  "/tmp/fonts/IBMPlexSans-Regular.ttf",
  "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
].filter((file) => fs.existsSync(file));

const font = { fontFiles, loadSystemFonts: true, defaultFontFamily: "IBM Plex Sans" };

function stage(svg) {
  const body = svg.replace(/<\?xml[^>]*>/, "").replace(/<svg[^>]*>/, "").replace("</svg>", "");
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" fill="#0b0d10"/>
  ${body}
</svg>`;
}

function png(svg, width) {
  return new Resvg(svg, {
    fitTo: { mode: "width", value: width },
    font,
    background: "#0b0d10",
  }).render().asPng();
}

const out = process.argv[2] ?? path.join(here, "out");
fs.mkdirSync(out, { recursive: true });

const renders = [];
for (const variant of variants) {
  const large = png(stage(variant.svg({ size: "large" })), 640);
  const icon32 = png(stage(variant.svg({ size: "32" })), 32);
  const icon16 = png(stage(variant.svg({ size: "16" })), 16);
  renders.push({ variant, large, icon32, icon16 });
  console.log(variant.id, variant.formula);
}

const columns = renders.length;
const pitch = 390;
const sheetW = pitch * columns + 48;
const sheetH = 640;
const tiles = [];

for (const [index, item] of renders.entries()) {
  const left = 24 + index * pitch;
  const large = await sharp(item.large).resize(330, 330, { fit: "contain", background: "#0b0d10" }).png().toBuffer();
  const up32 = await sharp(item.icon32).resize(128, 128, { kernel: "nearest" }).png().toBuffer();
  const up16 = await sharp(item.icon16).resize(64, 64, { kernel: "nearest" }).png().toBuffer();
  tiles.push({ input: large, left: left + 18, top: 24 });
  tiles.push({ input: up32, left: left + 36, top: 470 });
  tiles.push({ input: up16, left: left + 200, top: 502 });
}

const labelSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${sheetW}" height="${sheetH}">
  ${renders
    .map((item, index) => {
      const cx = 24 + index * pitch + pitch / 2;
      const left = 24 + index * pitch;
      return `<text x="${cx}" y="418" text-anchor="middle" font-family="DejaVu Sans" font-weight="700" font-size="28" fill="#F4F1EA">${item.variant.id}</text>
      <text x="${left + 100}" y="622" text-anchor="middle" font-family="DejaVu Sans" font-size="16" fill="#9A968C">32</text>
      <text x="${left + 232}" y="622" text-anchor="middle" font-family="DejaVu Sans" font-size="16" fill="#9A968C">16</text>`;
    })
    .join("")}
</svg>`;
tiles.push({
  input: new Resvg(labelSvg, { fitTo: { mode: "width", value: sheetW }, font, background: "rgba(0,0,0,0)" }).render().asPng(),
  left: 0,
  top: 0,
});

const contact = path.join(out, "marks_m2_refined_contact.png");
await sharp({
  create: { width: sheetW, height: sheetH, channels: 4, background: "#0b0d10" },
}).composite(tiles).png().toFile(contact);

const favorite = renders[0];
const mark = await sharp(favorite.large).resize(400, 400, { fit: "contain", background: "#0b0d10" }).png().toBuffer();
const ogText = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <text x="500" y="292" font-family="IBM Plex Sans" font-weight="600" font-size="64" letter-spacing="-2" fill="#F4F1EA">What AI Built</text>
  <rect x="502" y="322" width="72" height="3" fill="#7AA2FF"/>
  <text x="502" y="378" font-family="IBM Plex Sans" font-size="26" fill="#9A968C">Systems projects written with coding agents.</text>
</svg>`;
const ogLabels = new Resvg(ogText, { fitTo: { mode: "width", value: 1200 }, font, background: "rgba(0,0,0,0)" }).render().asPng();
const og = path.join(out, "mark_m2a_og.png");
await sharp({
  create: { width: 1200, height: 630, channels: 4, background: "#0b0d10" },
})
  .composite([
    { input: mark, left: 72, top: 115 },
    { input: ogLabels, left: 0, top: 0 },
  ])
  .png()
  .toFile(og);

console.log(contact);
console.log(og);
