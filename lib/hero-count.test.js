import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// The hero's open-source count is derived from OPEN_SOURCE_TOOLS rather than
// spelled out, so it cannot drift from the list. What is left to guard is that
// nobody replaces the derivation with a word again, and that the two figures
// stay the ones Omni publishes.
//
// The count used to be bound to the number of <Card> elements. That invariant
// is what let the page claim six open-source tools while two of them sit in
// private repos: every card counted, so the test was green and the sentence
// was false.
const page = readFileSync(new URL('../app/page.tsx', import.meta.url), 'utf8');

test('the hero derives its count instead of stating one', () => {
  assert.match(
    page,
    /\{COUNT_WORD\[OPEN_SOURCE_TOOLS\.length\]\} open-source tools/,
    'the hero count is hardcoded again; derive it from OPEN_SOURCE_TOOLS'
  );
  const list = page.match(/const OPEN_SOURCE_TOOLS = \[([^\]]*)\]/);
  assert.ok(list, 'OPEN_SOURCE_TOOLS is gone; the hero claim has nothing to bind to');
  const named = list[1].split(',').filter((s) => s.trim().length > 0).length;
  assert.ok(named > 0, 'the open-source list is empty');
});

// The claim that survives longest is the one nobody re-checks. If the hero
// drifts from these, the fix is to re-measure, not to reword.
test('the hero quotes the figures Omni publishes', () => {
  assert.ok(page.includes('97.2%'), 'the second-read figure is gone from the hero');
  assert.ok(page.includes('14.9%'), 'the aggregate figure is gone from the hero');
});
