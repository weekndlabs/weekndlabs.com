/**
 * Derives every raster the site serves from public/logo.svg.
 *
 * The mark in that file is the maintainer's, redrawn from a 640x99 PNG because
 * a 99px raster cannot fill a 512px icon. Its blues are its own. The ground the
 * icons sit on is still the design package's, and lib/brand.test.js pins it.
 * Run after changing either: `npm run brand`.
 *
 * Needs `rsvg-convert` on PATH (`brew install librsvg`). The previous version
 * drove a Chrome binary at a fixed path, and stopped working when it moved.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const GROUND = '#141416'; // neutral.900, the dark theme's page

const mark = readFileSync(join(ROOT, 'public/logo.svg'), 'utf8');
const [, , , width, height] = mark.match(/viewBox="([\d.]+) ([\d.]+) ([\d.]+) ([\d.]+)"/).map(Number);

/**
 * The mark centred in a square, at `fill` of its width.
 *
 * `ground` is the corner radius of the dark tile as a fraction of the side, or
 * null for no tile at all. iOS cuts its own corners, so that one is square.
 */
function square(size, fill, ground) {
  const w = size * fill;
  const h = (w * height) / width;
  const tile =
    ground === null ? '' : `<rect width="${size}" height="${size}" rx="${size * ground}" fill="${GROUND}"/>`;
  const placed = mark.replace(
    /<svg[^>]*>/,
    `<svg x="${(size - w) / 2}" y="${(size - h) / 2}" width="${w}" height="${h}" viewBox="0 0 ${width} ${height}">`
  );
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">${tile}${placed}</svg>`;
}

const png = (svg, size) =>
  execFileSync('rsvg-convert', ['-w', String(size), '-h', String(size)], { input: svg });

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

// app/favicon.ico is the one that is easy to forget. In the App Router it wins
// over app/icon.png for /favicon.ico, so leaving it behind keeps the old mark
// in the browser tab and in every bookmark while everything else has moved.
const targets = [
  ['public/logo.png', 512, 0.62, 0.22],
  ['app/icon.png', 512, 0.62, 0.22],
  ['app/apple-icon.png', 180, 0.62, 0],
];

for (const [file, size, fill, ground] of targets) {
  writeFileSync(join(ROOT, file), png(square(size, fill, ground), size));
  console.log(`${file.padEnd(22)} ${size}x${size}`);
}

// No tile in the tab. At 16px a tile leaves the W nine pixels wide, and the
// bare mark reads on a light tab strip and a dark one alike.
const ICO_SIZES = [16, 32, 48];
writeFileSync(
  join(ROOT, 'app/favicon.ico'),
  ico(ICO_SIZES.map((size) => ({ size, data: png(square(size, 1, null), size) })))
);
console.log(`app/favicon.ico        ${ICO_SIZES.join(', ')}`);
