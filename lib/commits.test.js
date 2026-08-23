import test from 'node:test';
import assert from 'node:assert/strict';
import { parseCommit } from './commits.js';

test('a scoped type is split off the subject', () => {
  assert.deepEqual(parseCommit('feat(site): sell the landing page'), {
    type: 'feat',
    subject: 'sell the landing page',
  });
});

test('a breaking marker stays on the type', () => {
  assert.equal(parseCommit('feat(brand)!: a new mark').type, 'feat!');
});

test('a message without a type keeps its whole subject', () => {
  assert.deepEqual(parseCommit('update hero text'), {
    type: null,
    subject: 'update hero text',
  });
});

test('a colon inside the subject is not mistaken for a prefix', () => {
  assert.deepEqual(parseCommit('fix: omni: drop the marker'), {
    type: 'fix',
    subject: 'omni: drop the marker',
  });
});
