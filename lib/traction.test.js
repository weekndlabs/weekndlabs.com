import test from 'node:test';
import assert from 'node:assert/strict';
import { releaseCount, uniqueContributors } from './traction.js';

const LINK =
  '<https://api.github.com/repositories/1/releases?per_page=1&page=2>; rel="next", ' +
  '<https://api.github.com/repositories/1/releases?per_page=1&page=68>; rel="last"';

test('the last page of a one-per-page listing is the release count', () => {
  assert.equal(releaseCount(LINK, 1), 68);
});

test('no Link header means the first page was the only one', () => {
  // GitHub omits the header when everything fits, so a repo with one release
  // or none is counted from the body it sent.
  assert.equal(releaseCount(null, 1), 1);
  assert.equal(releaseCount(null, 0), 0);
});

test('a Link header with no last page gives no count rather than a guess', () => {
  assert.equal(releaseCount('<https://api.github.com/x?page=2>; rel="next"', 1), null);
  assert.equal(releaseCount(null, undefined), null);
});

test('a person who contributes to two repos is one contributor', () => {
  assert.equal(uniqueContributors([['ana', 'budi'], ['budi', 'citra']]), 3);
});

test('bots are not people', () => {
  assert.equal(uniqueContributors([['ana', 'dependabot[bot]', 'github-actions[bot]']]), 1);
});

test('one failed lookup discards the count rather than undercounting', () => {
  // Same rule as totalStars: a partial figure looks authoritative and is wrong.
  assert.equal(uniqueContributors([['ana'], null]), null);
  assert.equal(uniqueContributors([]), null);
  assert.equal(uniqueContributors(undefined), null);
});
