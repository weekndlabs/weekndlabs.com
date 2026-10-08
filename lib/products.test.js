import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CATEGORIES,
  CATEGORY_NOTES,
  PRODUCTS,
  byCategory,
  starRepos,
} from './products.js';

test('every product is filed under a category the menu renders', () => {
  for (const { name, category } of PRODUCTS) {
    assert.ok(CATEGORIES.includes(category), `${name} is filed under "${category}"`);
  }
});

test('every category says what it is for', () => {
  // The section leans on these instead of an "In focus" badge, so a category
  // without one renders a bare heading and the group loses its reason to exist.
  for (const category of CATEGORIES) {
    assert.ok(CATEGORY_NOTES[category], `${category} has no note`);
  }
  assert.deepEqual(Object.keys(CATEGORY_NOTES).sort(), [...CATEGORIES].sort());
});

test('every product has somewhere to go', () => {
  for (const { name, href } of PRODUCTS) {
    assert.ok(
      href.startsWith('https://') || href.startsWith('/'),
      `${name} points at "${href}"`
    );
  }
});

test('names are unique, so React keys and the nav columns stay stable', () => {
  assert.equal(new Set(PRODUCTS.map((p) => p.name)).size, PRODUCTS.length);
});

test('the stack is three layers, each with something behind it', () => {
  // The stack section is a three-column grid drawn from these, and each column
  // ends in the thing the layer sits in front of. A fourth breaks the grid, and
  // one without an upstream draws a connector into nothing.
  const stack = PRODUCTS.filter((product) => product.layer);
  assert.deepEqual(
    stack.map((product) => product.layer),
    ['Credentials', 'Context', 'Models']
  );
  for (const { name, upstream, tags } of stack) {
    assert.ok(upstream, `${name} has no upstream`);
    assert.ok(Array.isArray(tags) && tags.length > 0, `${name} has no tags`);
  }
});

test('byCategory keeps every product, in the declared column order', () => {
  const groups = byCategory();
  assert.deepEqual(
    groups.map((g) => g.category),
    CATEGORIES.filter((c) => PRODUCTS.some((p) => p.category === c))
  );
  assert.equal(
    groups.reduce((n, g) => n + g.items.length, 0),
    PRODUCTS.length
  );
});

test('byCategory drops a category nothing is filed under', () => {
  const groups = byCategory(PRODUCTS.filter((p) => p.category === CATEGORIES[0]));
  assert.deepEqual(
    groups.map((g) => g.category),
    [CATEGORIES[0]]
  );
});

test('only public repos are named, or the hero loses its star count', () => {
  // The regression this file exists for. A private repo answers 404
  // unauthenticated, totalStars refuses to publish a partial sum, and the hero
  // sentence ends at the licence. Bubo did exactly this in production.
  const named = starRepos();
  assert.ok(named.length > 0);
  for (const repo of named) {
    assert.match(repo, /^[\w.-]+\/[\w.-]+$/);
  }
  for (const name of ['Bubo', 'ForgePod', 'Design System']) {
    const product = PRODUCTS.find((p) => p.name === name);
    assert.equal(product.repo, undefined, `${name} has no public repo to count`);
  }
});
