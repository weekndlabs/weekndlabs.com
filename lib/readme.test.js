import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// The README has documented a site that did not exist twice now: a retired
// palette and typeface in #2, and in #34 a tool count, the wrong accent colour
// and tokens that had moved out of globals.css a release earlier. Nothing
// checked it either time, so these pin the two claims that rot on their own.
const readme = readFileSync(new URL('../README.md', import.meta.url), 'utf8');

// Same rule as the hero: say what the tools are, never how many. The count is
// wrong the moment a product ships, and nobody edits a README for that.
const COUNT = /\b(\d+|zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)\s+(shipped\s+)?(open-source\s+)?(developer\s+)?tools\b/i;

test('the README states no tool count', () => {
  assert.doesNotMatch(readme, COUNT, 'the README counts the tools; say what they are, not how many');
});

test('the README carries no em or en dash', () => {
  // House rule is zero, and noticing them while writing has already failed.
  const hits = [...readme.matchAll(/.{0,40}[—–].{0,40}/g)].map((m) => m[0]);
  assert.deepEqual(hits, []);
});
