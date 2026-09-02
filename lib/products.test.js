import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CATEGORIES,
  CATEGORY_NOTES,
  PRODUCTS,
  byCategory,
  focusProducts,
  restProducts,
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

test('the focus pair is a pair, and the cards it fills need tags', () => {
  const focus = focusProducts();
  assert.equal(focus.length, 2);
  for (const { name, tags } of focus) {
    assert.ok(Array.isArray(tags) && tags.length > 0, `${name} has no tags`);
  }
});

test('focus and rest partition the catalog with nothing lost or doubled', () => {
  assert.equal(focusProducts().length + restProducts().length, PRODUCTS.length);
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
