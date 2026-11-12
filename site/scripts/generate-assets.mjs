import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Resvg } from "@resvg/resvg-js";
import { inner, svg } from "../../design/logo-gen/m2b.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const site = path.resolve(here, "..");
const repo = path.resolve(site, "..");
const fontFiles = [
  "/usr/share/fonts/truetype/sand-box/google/IBM Plex Sans/IBMPlexSans-VariableFont_wdth,wght.ttf",
  "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc",
  "/tmp/fonts/IBMPlexSans-SemiBold.ttf",
  "/tmp/fonts/IBMPlexSans-Regular.ttf",
  "/tmp/fonts/NotoSansSC-VF.ttf",
].filter((file) => fs.existsSync(file));

const large = inner({ size: "large" });
const faviconMark = inner({ size: "32" });

fs.writeFileSync(path.join(repo, "assets/logo-mark.svg"), svg({ size: "large" }));
fs.writeFileSync(path.join(site, "public/favicon.svg"), svg({ size: "32" }));
fs.writeFileSync(
  path.join(repo, "assets/logo.svg"),
  `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 96" fill="none">
  <rect width="400" height="96" rx="20" fill="#12161b" stroke="rgba(239,236,228,0.2)"/>
  <g transform="translate(16,16)">
    ${large}
  </g>
  <text x="96" y="61" font-family="IBM Plex Sans, sans-serif" font-weight="600" font-size="34" letter-spacing="-0.6" fill="#efece4">What AI Built</text>
</svg>
`,
);
fs.writeFileSync(
  path.join(site, "src/components/LogoMark.astro"),
  `---
interface Props { size?: number; }
const { size = 28 } = Astro.props;
---
<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
${faviconMark}
</svg>
`,
);

function render(svg, outfile, width) {
  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: width },
    font: {
      fontFiles,
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
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 64 64">${faviconMark}</svg>`;
render(favicon32, path.join(site, "public/favicon-32.png"), 32);

const apple = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 64 64">
  <rect width="64" height="64" fill="#0b0d10"/>
  ${large}
</svg>`;
render(apple, path.join(site, "public/apple-touch-icon.png"), 180);

const og = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#0b0d10"/>
  <circle cx="140" cy="-40" r="280" fill="#a78bfa" fill-opacity="0.16"/>
  <circle cx="1100" cy="80" r="240" fill="#5eead4" fill-opacity="0.08"/>
  <g transform="translate(96,215) scale(2.6)">${large}</g>
  <text x="290" y="292" font-family="IBM Plex Sans" font-weight="600" font-size="72" letter-spacing="-1.8" fill="#efece4">What AI Built</text>
  <rect x="292" y="328" width="72" height="3" fill="#7aa2ff"/>
  <text x="292" y="386" font-family="IBM Plex Sans" font-weight="400" font-size="28" fill="#9a968c">Systems projects written with coding agents.</text>
</svg>`;
render(og, path.join(site, "public/og.png"), 1200);

const preview = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
  <rect width="1600" height="900" fill="#0b0d10"/>
  <circle cx="200" cy="0" r="360" fill="#a78bfa" fill-opacity="0.14"/>
  <circle cx="1500" cy="120" r="300" fill="#5eead4" fill-opacity="0.07"/>
  <g transform="translate(180,330) scale(3.4)">${large}</g>
  <text x="430" y="440" font-family="IBM Plex Sans" font-weight="600" font-size="84" letter-spacing="-2" fill="#efece4">What AI Built</text>
  <rect x="432" y="478" width="88" height="4" fill="#7aa2ff"/>
  <text x="432" y="540" font-family="IBM Plex Sans" font-weight="400" font-size="32" fill="#9a968c">Systems projects written with coding agents.</text>
  <text x="430" y="605" font-family="IBM Plex Sans" font-weight="400" font-size="26" fill="#6eb3ae">编程 agent 写出来的系统软件。</text>
</svg>`;
render(preview, path.join(repo, "logo-preview.png"), 1600);
