/**
 * Generates the WeekndLabs mark and every raster the site serves from it.
 *
 * The mark is derived rather than drawn, so it cannot drift from the design
 * system and nobody has to keep a binary in sync by hand. Run it after a token
 * change: `npm run brand`.
 *
 * Three decisions here come straight from @weekndlabs/design 0.4.0.
 *
 * The silhouette is a real superellipse, not a rounded rectangle. Continuous
 * corners are the one signature the system spends anything on, and an icon is
 * the place it reads first, at 16px, before any colour is visible.
 *
 * The ground is two neutral primitives from the package, and the glyph is the
 * system blue. The old mark was amber on navy, and both of those families were
 * deleted in 0.4.0.
 *
 * The W is stroked with round joins rather than filled. A filled letterform
 * would carry its own corner treatment and argue with the silhouette; a stroke
 * with round joins repeats it.
 */
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

/** Package tokens, by name, so a reader can find them in the system. */
const GROUND_TOP = '#2C2C2E'; // neutral.800, the dark theme's muted surface
const GROUND_BOTTOM = '#141416'; // neutral.900, the dark theme's page
const GLYPH = '#409CFF'; // the dark theme's ring, which is the system blue

const SIZE = 1024;

/**
 * A superellipse, |x|^n + |y|^n = 1, sampled as a polygon.
 *
 * n = 5 is the curvature Apple uses. Sampling beats hand-fitting Béziers: the
 * shape is exact by construction, and at 512 points the polygon is
 * indistinguishable from the curve at any size this is ever rendered.
 */
function squircle(size, n = 5, points = 512) {
  const r = size / 2;
  const coords = [];
  for (let i = 0; i < points; i += 1) {
    const t = (i / points) * 2 * Math.PI;
    const cos = Math.cos(t);
    const sin = Math.sin(t);
    const x = Math.sign(cos) * Math.abs(cos) ** (2 / n) * r + r;
    const y = Math.sign(sin) * Math.abs(sin) ** (2 / n) * r + r;
    coords.push(`${x.toFixed(2)},${y.toFixed(2)}`);
  }
  return `M${coords.join('L')}Z`;
}

/**
 * The W, as one polyline.
 *
 * Flat caps and round joins, which is the whole character of the mark. The two
 * top terminals cut on a horizontal, so the letter sits on a line and reads as
 * drawn rather than written; the three vertices stay round, so the corner
 * treatment inside the glyph is the one the silhouette uses.
 *
 * The middle apex stops short of the cap line. Taking it all the way up turns a
 * W into two Vs, and at 16px the counters close up.
 */
const W = 'M272 352 L410 672 L512 438 L614 672 L752 352';
const STROKE = 104;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}" width="${SIZE}" height="${SIZE}" role="img" aria-label="WeekndLabs">
  <defs>
    <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${GROUND_TOP}"/>
      <stop offset="1" stop-color="${GROUND_BOTTOM}"/>
    </linearGradient>
  </defs>
  <path d="${squircle(SIZE)}" fill="url(#ground)"/>
  <path d="${W}" fill="none" stroke="${GLYPH}" stroke-width="${STROKE}"
        stroke-linecap="butt" stroke-linejoin="round"/>
</svg>
`;

/**
 * Chrome renders the SVG on a transparent ground at an exact pixel size.
 *
 * Through a wrapper, not by pointing at the .svg. The file carries width and
 * height so other consumers get a sensible intrinsic size, and Chrome honours
 * them: a 512 window then crops the 1024 drawing instead of scaling it.
 */
function render(svgPath, outPath, size) {
  const wrapper = join(ROOT, `.brand-${size}.html`);
  writeFileSync(
    wrapper,
    `<!doctype html><meta charset="utf-8">` +
      `<style>html,body{margin:0;padding:0;background:transparent}` +
      `img{display:block;width:${size}px;height:${size}px}</style>` +
      `<img src="file://${svgPath}" alt="">`
  );
  return new Promise((resolve, reject) => {
    const chrome = spawn(CHROME, [
      '--headless',
      '--disable-gpu',
      '--no-sandbox',
      '--hide-scrollbars',
      '--default-background-color=00000000',
      `--window-size=${size},${size}`,
      `--screenshot=${outPath}`,
      '--virtual-time-budget=3000',
      `file://${wrapper}`,
    ]);
    chrome.on('error', reject);
    chrome.on('close', (code) => {
      rmSync(wrapper, { force: true });
      return code === 0 ? resolve() : reject(new Error(`chrome exited ${code}`));
    });
  });
}

mkdirSync(join(ROOT, 'public'), { recursive: true });
const svgPath = join(ROOT, 'public/logo.svg');
writeFileSync(svgPath, svg);

/**
 * Packs PNGs into an .ico.
 *
 * An ICO may hold PNG payloads verbatim, which every browser has understood
 * since IE11, so this needs no encoder and no dependency: a 6 byte header, a 16
 * byte directory entry per image, then the files.
 */
function ico(pngs) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // 1 = icon
  header.writeUInt16LE(pngs.length, 4);

  let offset = 6 + pngs.length * 16;
  const entries = [];
  for (const { size, data } of pngs) {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0); // 0 means 256
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt8(0, 2); // palette size, 0 for truecolour
    e.writeUInt8(0, 3); // reserved
    e.writeUInt16LE(1, 4); // colour planes
    e.writeUInt16LE(32, 6); // bits per pixel
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += data.length;
    entries.push(e);
  }
  return Buffer.concat([header, ...entries, ...pngs.map((p) => p.data)]);
}

// One source, four rasters and an icon bundle.
//
// app/favicon.ico is the one that is easy to forget. In the App Router it wins
// over app/icon.png for /favicon.ico, so leaving it behind keeps the old mark
// in the browser tab and in every bookmark while everything else has moved.
const targets = [
  ['public/logo.png', 512],
  ['app/icon.png', 512],
  ['app/apple-icon.png', 180],
];

for (const [file, size] of targets) {
  await render(svgPath, join(ROOT, file), size);
  console.log(`${file.padEnd(22)} ${size}x${size}`);
}

const ICO_SIZES = [16, 32, 48];
const layers = [];
for (const size of ICO_SIZES) {
  const tmp = join(ROOT, `.brand-ico-${size}.png`);
  await render(svgPath, tmp, size);
  layers.push({ size, data: readFileSync(tmp) });
  rmSync(tmp, { force: true });
}
writeFileSync(join(ROOT, 'app/favicon.ico'), ico(layers));
console.log(`app/favicon.ico        ${ICO_SIZES.join(', ')}`);
console.log('public/logo.svg          source');
