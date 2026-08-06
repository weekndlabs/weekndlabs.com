import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { extractBlock, parseTokens, declaredProperties } from './theme-tokens.js';

const css = readFileSync(new URL('../app/globals.css', import.meta.url), 'utf8');
const config = readFileSync(new URL('../tailwind.config.ts', import.meta.url), 'utf8');
const layout = readFileSync(new URL('../app/layout.tsx', import.meta.url), 'utf8');

test('the stylesheet declares no colour of its own', () => {
  // The whole point of adopting the package. A value declared here is a value
  // its contrast gate cannot measure, so a colour that fails AA reaches the
  // site with every test in both repos green.
  const declared = declaredProperties(css).filter(({ name }) => !name.startsWith('--tw-'));
  assert.deepEqual(
    declared,
    [],
    `globals.css declares ${declared.map((d) => d.name).join(', ')}. Use a package role instead.`
  );
});

test('the design package is the only source of colour in the Tailwind theme', () => {
  // A literal in the config is the same failure as a literal in the CSS, and
  // easier to miss because it reads like configuration rather than design.
  assert.match(config, /presets: \[design\]/, 'the package preset is not applied');
  const literals = [...config.matchAll(/^\s*[\w-]+: *"(#[0-9a-fA-F]{3,8}|rgb\(|oklch\()/gm)];
  assert.deepEqual(literals.map((m) => m[0].trim()), [], 'a raw colour is set in the Tailwind theme');
});

test('every site colour alias resolves to a package token', () => {
  // `brand` is allowed to exist, because the system has no name for a colour
  // used as a brand mark. It is not allowed to hold a value.
  const colours = extractBlock(config, 'colors: {');
  assert.ok(colours, 'the colors block is gone, so this test would pass vacuously');
  const values = [...colours.matchAll(/: *"([^"]+)"/g)].map((m) => m[1]);
  assert.ok(values.length > 0, 'no alias found to check');
  for (const value of values) {
    assert.match(value, /var\(--wl-/, `${value} does not read a package token`);
  }
});

test('the theme is always written to the attribute, never left to the fallback', () => {
  // The package emits its palettes under [data-theme] and falls back to dark
  // under :where(:root). If the attribute can be missing, a visitor with no
  // stored choice gets that fallback, and a light site renders dark.
  assert.match(layout, /data-theme="light"/, 'the server-rendered default is missing');
  assert.match(layout, /prefers-color-scheme: dark/, 'the script does not consult the OS preference');
  assert.match(layout, /dataset\.theme *= *t/, 'the script does not set the attribute');
});

test('the stored theme key and its values are unchanged', () => {
  // weekndlabs.com/design is same-origin with this site and reads this key to
  // match the chrome around its panels. Renaming either breaks that page, and
  // it breaks silently, over there.
  assert.match(layout, /localStorage\.getItem\('theme'\)/);
  assert.match(layout, /'light'/);
  assert.match(layout, /'dark'/);
});

test('extractBlock brace-matches past a nested block', () => {
  const sample = '@media (x) { :root { --a: 1; } } :root[data-theme=\'dark\'] { --b: 2; }';
  assert.deepEqual(parseTokens(extractBlock(sample, '@media')), { '--a': '1' });
  assert.deepEqual(parseTokens(extractBlock(sample, ":root[data-theme='dark']")), { '--b': '2' });
});

test('declaredProperties reports the selector a property was declared under', () => {
  const sample = ':root { --a: 1; } .card { --b: 2; }';
  assert.deepEqual(declaredProperties(sample), [
    { selector: ':root', name: '--a', value: '1' },
    { selector: '.card', name: '--b', value: '2' },
  ]);
});
