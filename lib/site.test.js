import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { SITE, llmsTxt, siteGraph } from './site.js';
import { PRODUCTS } from './products.js';

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');

test('one description, short enough to survive a search snippet', () => {
  // The site carried three: one in the meta tag, one for Open Graph and one for
  // Twitter, none of which matched the page. An engine that reads three
  // statements about what a company is trusts none of them.
  assert.ok(SITE.description.length <= 160, `${SITE.description.length} characters`);
  assert.match(SITE.description, /^WeekndLabs builds /, 'it has to say what WeekndLabs is, in a sentence that stands alone');
  for (const file of ['../app/layout.tsx', '../app/manifest.ts']) {
    assert.doesNotMatch(read(file), /description: ['"`]/, `${file} writes a description of its own`);
  }
});

test('the graph names the organisation, the site and every product', () => {
  const graph = siteGraph()['@graph'];
  const types = graph.map((node) => node['@type']);
  assert.deepEqual(types.slice(0, 2), ['Organization', 'WebSite']);

  const apps = graph.filter((node) => node['@type'] === 'SoftwareApplication');
  assert.deepEqual(
    apps.map((app) => app.name),
    PRODUCTS.map((product) => product.name)
  );
  for (const app of apps) {
    assert.match(app.url, /^https:\/\//, `${app.name} has a relative url, which means nothing outside this origin`);
    assert.equal(app.publisher['@id'], graph[0]['@id']);
  }
});

test('the graph claims nothing the site cannot back', () => {
  // No ratings, no offers, no review counts. Each is a field an engine may
  // print as fact, and there is no data behind any of them.
  const json = JSON.stringify(siteGraph());
  assert.doesNotMatch(json, /aggregateRating|reviewCount|"offers"|undefined|null/);
});

test('llms.txt lists every product with an absolute link', () => {
  const text = llmsTxt();
  assert.match(text, /^# WeekndLabs\n\n> /);
  for (const { name } of PRODUCTS) {
    assert.match(text, new RegExp(`- \\[${name}\\]\\(https://`), `${name} is missing`);
  }
  assert.doesNotMatch(text, /[—–]/);
});

test('the organisation is a named company with a founder and one address', () => {
  // A reviewer asking "is this a real company" reads these three before
  // anything else, and for a while the site answered none of them. See #47.
  const [org] = siteGraph()['@graph'];
  assert.equal(org.legalName, SITE.legalName);
  assert.equal(org.founder.name, SITE.founder.name);
  assert.equal(org.email, SITE.email);
  assert.match(llmsTxt(), /- \[About\]\(https:\/\/weekndlabs\.com\/about\)/);
});

test('one contact address, and the pages use it', () => {
  // hi@ was published for months and never checked. The address people are
  // told to write to is the one the maintainer reads, from one constant.
  for (const file of ['../app/page.tsx', '../app/about/page.tsx', '../app/terms-of-service/page.tsx']) {
    const source = read(file);
    assert.doesNotMatch(source, /\b(hi|hello)@weekndlabs\.com/, `${file} names an address nobody verified`);
    assert.match(source, /SITE\.email/, `${file} does not take the address from lib/site.js`);
  }
});
