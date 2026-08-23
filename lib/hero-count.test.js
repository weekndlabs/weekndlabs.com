import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// The hero has stated a tool count twice, hardcoded (#3) and then derived from
// a list (#26). Both were maintenance, and the second still went stale the
// moment the shelf grew. The rule now is that the hero states no count at all,
// which is the only version that stays true as products are added.
const page = readFileSync(new URL('../app/page.tsx', import.meta.url), 'utf8');

// Digits and the words up to twelve, which is as far as anyone would spell one.
const COUNT = /\b(\d+|zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)\s+(open-source\s+)?tools\b/i;

test('the hero states no tool count', () => {
  assert.doesNotMatch(page, COUNT, 'the hero counts its tools again; say what they are, not how many');
  assert.doesNotMatch(page, /COUNT_WORD/, 'the derived count is back; it goes stale the same way a literal does');
});

// This one is the promise, not a figure. It used to quote Omni's percentages
// directly, which made one product's measurements load-bearing for the whole
// company's hero and dated the sentence to Omni's next release. The claim that
// has to survive is that published numbers are reproducible, so that is what is
// pinned; the figures themselves live on the product cards.
test('the hero still promises the numbers can be reproduced', () => {
  assert.match(
    page,
    /measured on a real corpus and replays\s+on yours/,
    'the reproducibility promise is gone from the hero; it is the one claim here a competitor cannot copy'
  );
});
