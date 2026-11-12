import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Resvg } from "@resvg/resvg-js";

const here = path.dirname(fileURLToPath(import.meta.url));
const site = path.resolve(here, "..");
const repo = path.resolve(site, "..");
const fontFile = "/usr/share/fonts/truetype/sand-box/google/IBM Plex Sans/IBMPlexSans-VariableFont_wdth,wght.ttf";
const cjkFile = "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc";

const mark = fs.readFileSync(path.join(repo, "assets/logo-mark.svg"), "utf8");
// extract inner graphic without svg wrapper for reuse
const inner = mark.replace(/<svg[^>]*>/, "").replace("</svg>", "");

function render(svg, outfile, width) {
  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: width },
    font: {
      fontFiles: [fontFile, cjkFile].filter((f) => fs.existsSync(f)),
      loadSystemFonts: true,
      defaultFontFamily: "IBM Plex Sans",
    },
    background: "rgba(0,0,0,0)",
  });
  const png = resvg.render().asPng();
  fs.mkdirSync(path.dirname(outfile), { recursive: true });
  fs.writeFileSync(outfile, png);
  console.log("wrote", outfile, png.length, "bytes");
}

const favicon32 = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 64 64">${inner}</svg>`;
render(favicon32, path.join(site, "public/favicon-32.png"), 32);

const apple = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 64 64">${inner}</svg>`;
render(apple, path.join(site, "public/apple-touch-icon.png"), 180);

const og = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#0b0d10"/>
  <circle cx="140" cy="-40" r="280" fill="#d4893a" fill-opacity="0.12"/>
  <circle cx="1100" cy="80" r="240" fill="#6eb3ae" fill-opacity="0.09"/>
  <g transform="translate(96,215) scale(2.6)">${inner}</g>
  <text x="290" y="300" font-family="IBM Plex Sans" font-weight="600" font-size="86" letter-spacing="-2.5" fill="#efece4">AgentBuilt</text>
  <rect x="290" y="332" width="72" height="3" fill="#d4893a"/>
  <text x="290" y="390" font-family="IBM Plex Sans" font-weight="400" font-size="28" fill="#9a968c">Systems projects written with coding agents.</text>
</svg>`;
render(og, path.join(site, "public/og.png"), 1200);

const preview = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
  <rect width="1600" height="900" fill="#0b0d10"/>
  <circle cx="200" cy="0" r="360" fill="#d4893a" fill-opacity="0.10"/>
  <circle cx="1500" cy="120" r="300" fill="#6eb3ae" fill-opacity="0.08"/>
  <g transform="translate(180,330) scale(3.4)">${inner}</g>
  <text x="430" y="455" font-family="IBM Plex Sans" font-weight="600" font-size="112" letter-spacing="-3.5" fill="#efece4">AgentBuilt</text>
  <rect x="430" y="490" width="88" height="4" fill="#d4893a"/>
  <text x="430" y="555" font-family="IBM Plex Sans" font-weight="400" font-size="32" fill="#9a968c">Systems projects written with coding agents.</text>
  <text x="430" y="605" font-family="IBM Plex Sans" font-weight="400" font-size="26" fill="#6eb3ae">编程 agent 写出来的系统软件。</text>
</svg>`;
render(preview, path.join(repo, "logo-preview.png"), 1600);
