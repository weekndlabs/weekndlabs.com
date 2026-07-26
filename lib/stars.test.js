import test from 'node:test';
import assert from 'node:assert/strict';
import { totalStars, starClause } from './stars.js';

test('sums a complete set', () => {
  assert.equal(totalStars([316, 10, 4, 3]), 333);
});

test('one failed lookup discards the total rather than undercounting', () => {
  // The whole point of #3: 316+10+3 = 329 is a plausible-looking lie.
  assert.equal(totalStars([316, 10, null, 3]), null);
});

test('rejects a malformed or empty set', () => {
  assert.equal(totalStars([]), null);
  assert.equal(totalStars(undefined), null);
  assert.equal(totalStars([316, NaN]), null);
  assert.equal(totalStars([316, -1]), null);
});

test('no total means the sentence says nothing about stars', () => {
  // Guards the regression this file exists for: any hardcoded digits creeping
  // back into the fallback path fails here.
  assert.equal(starClause(null), '');
});

test('a real total is rendered with a thousands separator', () => {
  assert.equal(starClause(333), ', with 333 stars on GitHub');
  assert.equal(starClause(1234), ', with 1,234 stars on GitHub');
});
