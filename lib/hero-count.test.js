import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// The hero spells the tool count in words; the grid below it hardcodes one
// <Card> per tool. Nothing links the two, and #3 already showed what a stale
// hardcoded number in this hero costs. Adding a seventh card fails here.
const WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];

test('the hero tool count matches the number of product cards', () => {
  const page = readFileSync(new URL('../app/page.tsx', import.meta.url), 'utf8');
  const cards = page.match(/<Card\b/g) ?? [];
  const stated = page.match(/(\w+) tools in production/);

  assert.ok(stated, 'hero no longer states a tool count; update this test to match the new wording');
  assert.ok(cards.length < WORDS.length, `${cards.length} cards is past what this test can spell`);
  assert.equal(stated[1].toLowerCase(), WORDS[cards.length]);
});
