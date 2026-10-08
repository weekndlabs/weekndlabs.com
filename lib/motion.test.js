import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');
const section = read('../components/SectionFadeIn.tsx');
const css = read('../app/globals.css');
const pkg = JSON.parse(read('../package.json'));

// The section wrapper used to render opacity-0 on the server and flip it in a
// useEffect, so the page was blank until hydration and stayed blank with
// JavaScript off. See issue #41.
test('a section is visible in the HTML the server sends', () => {
  assert.doesNotMatch(section, /opacity-0/, 'a section starts hidden again');
  assert.doesNotMatch(section, /use client|useEffect|useState/, 'the reveal depends on script again');
});

test('the reveal only runs where it is supported and wanted', () => {
  // Outside these two gates a section has to be plain and visible: that is the
  // whole fallback for Firefox and for anyone who asked for reduced motion.
  const gated = css.match(
    /@media \(prefers-reduced-motion: no-preference\) \{[\s\S]*@supports \(animation-timeline: view\(\)\) \{[\s\S]*\.reveal\b/
  );
  assert.ok(gated, '.reveal is not behind both the motion preference and the @supports check');
  assert.equal(css.split('animation-timeline: view();').length - 1, 1, 'a scroll timeline is set outside the gate');
});

test('timed motion uses the design package durations', () => {
  const timed = css.match(/animation:[^;]*\d+m?s[^;]*;/g) ?? [];
  assert.deepEqual(timed, [], 'an animation hardcodes a duration instead of a --wl-duration token');
});

test('framer-motion stays out until something imports it', () => {
  assert.equal(pkg.dependencies['framer-motion'], undefined);
});
