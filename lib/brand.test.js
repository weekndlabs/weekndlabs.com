import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { themes } from '@weekndlabs/design';

const script = readFileSync(new URL('../scripts/make-brand.mjs', import.meta.url), 'utf8');
const svg = readFileSync(new URL('../public/logo.svg', import.meta.url), 'utf8');

/** oklch out of the package, hex out of the mark. Compare in one space. */
const toHex = (oklch) => {
  const [l, c, h] = oklch.match(/[\d.]+/g).map(Number);
  const hr = (h * Math.PI) / 180;
  const [ll, aa, bb] = [l, c * Math.cos(hr), c * Math.sin(hr)];
  const cube = (t) => t * t * t;
  const [ls, ms, ss] = [
    cube(ll + 0.3963377774 * aa + 0.2158037573 * bb),
    cube(ll - 0.1055613458 * aa - 0.0638541728 * bb),
    cube(ll - 0.0894841775 * aa - 1.291485548 * bb),
  ];
  const lin = [
    4.0767416621 * ls - 3.3077115913 * ms + 0.2309699292 * ss,
    -1.2684380046 * ls + 2.6097574011 * ms - 0.3413193965 * ss,
    -0.0041960863 * ls - 0.7034186147 * ms + 1.707614701 * ss,
  ];
  return (
    '#' +
    lin
      .map((v) => {
        const s = v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055;
        return Math.round(Math.min(1, Math.max(0, s)) * 255)
          .toString(16)
          .padStart(2, '0');
      })
      .join('')
      .toUpperCase()
  );
};

test('the mark is drawn in package tokens, not in hexes of its own', () => {
  // A logo is the one asset nobody rebuilds when a token moves, so it is the
  // one most likely to be left behind holding the old palette. This fails when
  // the system's blue or its dark neutrals change and the mark has not been
  // regenerated with `npm run brand`.
  const expected = {
    GROUND_TOP: toHex(themes.dark.muted),
    GROUND_BOTTOM: toHex(themes.dark.background),
    GLYPH: toHex(themes.dark.ring),
  };
  for (const [name, hex] of Object.entries(expected)) {
    assert.match(
      script,
      new RegExp(`const ${name} = '${hex}'`, 'i'),
      `${name} should be ${hex}, the package's value. Update it and run npm run brand.`
    );
    assert.ok(svg.toUpperCase().includes(hex), `${hex} is not in logo.svg, so it is stale`);
  }
});

test('the mark carries no colour the system does not define', () => {
  const hexes = [...svg.matchAll(/#[0-9a-fA-F]{6}/g)].map((m) => m[0].toUpperCase());
  const allowed = new Set([
    toHex(themes.dark.muted),
    toHex(themes.dark.background),
    toHex(themes.dark.ring),
  ]);
  for (const hex of hexes) {
    assert.ok(allowed.has(hex), `logo.svg uses ${hex}, which is not a package role`);
  }
});
