import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { extractBlock, parseTokens, themeTokens } from './theme-tokens.js';

const css = readFileSync(new URL('../app/globals.css', import.meta.url), 'utf8');
const tokens = themeTokens(css);

const colourTokens = (/** @type {Record<string, string>} */ set) =>
  Object.fromEntries(Object.entries(set).filter(([name]) => name.startsWith('--c-')));

test('all three token blocks are present', () => {
  // A rename that orphans a selector would otherwise make the drift check below
  // pass vacuously against an empty object.
  for (const role of ['light', 'darkByPreference', 'darkByChoice']) {
    assert.notEqual(tokens[role], null, `${role} block not found`);
    assert.ok(
      Object.keys(colourTokens(tokens[role])).length > 0,
      `${role} declares no --c- tokens`
    );
  }
});

test('the two dark blocks declare identical values', () => {
  // This is #5. Editing one and not the other gives a palette that depends on
  // whether the visitor chose the theme or inherited it from the OS.
  assert.deepEqual(
    colourTokens(tokens.darkByChoice),
    colourTokens(tokens.darkByPreference)
  );
});

test('light and dark declare the same token names', () => {
  // Catches the other half: adding a token to one theme and forgetting the
  // rest, which renders as a transparent or unset colour only in that theme.
  assert.deepEqual(
    Object.keys(colourTokens(tokens.darkByPreference)).sort(),
    Object.keys(colourTokens(tokens.light)).sort()
  );
});

test('every colour token is an RGB triplet', () => {
  // Tailwind wraps these as rgb(var(--c-x) / <alpha-value>). A hex here would
  // build cleanly and then produce an invalid colour at runtime.
  for (const [role, set] of Object.entries(tokens)) {
    for (const [name, value] of Object.entries(colourTokens(set))) {
      assert.match(value, /^\d{1,3} \d{1,3} \d{1,3}$/, `${role} ${name} = "${value}"`);
    }
  }
});

test('extractBlock brace-matches past a nested block', () => {
  const sample = '@media (x) { :root { --a: 1; } } :root[data-theme=\'dark\'] { --b: 2; }';
  assert.deepEqual(parseTokens(extractBlock(sample, '@media')), { '--a': '1' });
  assert.deepEqual(parseTokens(extractBlock(sample, ":root[data-theme='dark']")), { '--b': '2' });
});
