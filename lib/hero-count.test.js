import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// The hero's open-source count is derived from OPEN_SOURCE_TOOLS rather than
// spelled out, so it cannot drift from the list. What is left to guard is that
// nobody replaces the derivation with a word again.
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
  assert.ok(
    list[1].split(',').filter((s) => s.trim().length > 0).length > 0,
    'the open-source list is empty'
  );
});

// This one is the promise, not a figure. It used to quote Omni's 97.2% and
// 14.9% directly, which made one product's measurements load-bearing for the
// whole company's hero and dated the sentence to Omni's next release. The
// claim that has to survive is that published numbers are reproducible, so
// that is what is pinned; the figures themselves live on the product pages.
test('the hero still promises the numbers can be reproduced', () => {
  assert.match(
    page,
    /measured on a real corpus and replays\s+on yours/,
    'the reproducibility promise is gone from the hero; it is the one claim here a competitor cannot copy'
  );
});
