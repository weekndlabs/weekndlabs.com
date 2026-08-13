import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// The hero spells a tool count in words. It used to count every product card,
// and #3 already showed what a stale hardcoded number in this hero costs.
//
// It now counts something narrower and easier to get wrong: the tools that are
// actually open source. Bubo and ForgePod ship as products but their repos are
// private, so a claim of "N open-source tools" that counts the cards is false,
// and it was. The number is bound to OPEN_SOURCE_TOOLS in app/page.tsx, and
// this asserts the word in the sentence still matches that list.
const WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];

const page = readFileSync(new URL('../app/page.tsx', import.meta.url), 'utf8');

test('the hero count matches the open-source tool list', () => {
  const list = page.match(/const OPEN_SOURCE_TOOLS = \[([^\]]*)\]/);
  assert.ok(list, 'OPEN_SOURCE_TOOLS is gone; the hero claim has nothing to bind to');
  const named = list[1].split(',').filter((s) => s.trim().length > 0).length;

  const stated = page.match(/(\w+) open-source tools/);
  assert.ok(stated, 'hero no longer states an open-source tool count; update this test to match the new wording');
  assert.ok(named < WORDS.length, `${named} tools is past what this test can spell`);
  assert.equal(stated[1].toLowerCase(), WORDS[named]);
});

// The claim that survives longest is the one nobody re-checks. These two numbers
// are Omni's published figures; if the hero drifts from them the fix is to
// re-measure, not to edit the sentence.
test('the hero quotes the figures Omni publishes', () => {
  assert.ok(page.includes('97.2%'), 'the second-read figure is gone from the hero');
  assert.ok(page.includes('14.9%'), 'the aggregate figure is gone from the hero');
});
