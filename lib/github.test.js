import test from 'node:test';
import assert from 'node:assert/strict';
import { githubHeaders } from './github.js';

test('no token means the anonymous budget, not a broken header', () => {
  assert.deepEqual(githubHeaders(undefined), { Accept: 'application/vnd.github+json' });
});

test('a token is sent as a bearer', () => {
  assert.equal(githubHeaders('ghp_example').Authorization, 'Bearer ghp_example');
});

test('surrounding whitespace is stripped rather than sent', () => {
  // A value pasted into a dashboard field usually arrives with a newline.
  assert.equal(githubHeaders('  ghp_example\n').Authorization, 'Bearer ghp_example');
});

test('an empty or blank token is dropped, not sent as an empty bearer', () => {
  // The regression this guard exists for. GITHUB_TOKEN="" in a half-configured
  // deploy would send `Bearer ` and earn a 401 on all nine calls, turning a
  // 60 per hour budget into zero.
  for (const blank of ['', '   ', '\n', '\t ']) {
    assert.equal('Authorization' in githubHeaders(blank), false, `"${blank}" was sent`);
  }
});
