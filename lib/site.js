/**
 * What the site says it is, to anything that is not a person reading the page:
 * search engines, link previews, the manifest, and the crawlers behind answer
 * engines.
 *
 * It lives in one file because it used to live in four and they disagreed.
 */
import { PRODUCTS } from './products.js';

export const SITE = {
  name: 'WeekndLabs',
  url: 'https://weekndlabs.com',
  title: 'WeekndLabs | Open-source infrastructure for AI agents',
  description:
    'WeekndLabs builds open-source infrastructure for AI agents: Selat for credentials, Omni for context, Heimsense for model routing. Built in Indonesia.',
  github: 'https://github.com/weekndlabs',
};

const absolute = (href) => (href.startsWith('/') ? `${SITE.url}${href}` : href);

/**
 * schema.org JSON-LD for the whole site.
 *
 * Only what the catalog already states. No ratings, offers or review counts:
 * an engine may print any of those as fact, and there is nothing behind them.
 *
 * @param {ReadonlyArray<import('./products.js').Product>} [products]
 */
export function siteGraph(products = PRODUCTS) {
  const org = `${SITE.url}/#organization`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': org,
        name: SITE.name,
        url: SITE.url,
        logo: `${SITE.url}/logo.png`,
        description: SITE.description,
        sameAs: [SITE.github],
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE.url}/#website`,
        name: SITE.name,
        url: SITE.url,
        publisher: { '@id': org },
      },
      ...products.map((product) => ({
        '@type': 'SoftwareApplication',
        name: product.name,
        url: absolute(product.href),
        description: product.description,
        applicationCategory: 'DeveloperApplication',
        publisher: { '@id': org },
      })),
    ],
  };
}

/**
 * /llms.txt, in the shape llmstxt.org describes: a title, a one-line summary,
 * then sections of links.
 *
 * @param {ReadonlyArray<import('./products.js').Product>} [products]
 */
export function llmsTxt(products = PRODUCTS) {
  const lines = [
    `# ${SITE.name}`,
    '',
    `> ${SITE.description}`,
    '',
    '## Products',
    '',
    ...products.map((product) => `- [${product.name}](${absolute(product.href)}): ${product.blurb}`),
    '',
    '## Pages',
    '',
    `- [Philosophy](${SITE.url}/philosophy): licensing, and how the lab pays for itself`,
    `- [Source](${SITE.github}): every open-source repository`,
    '',
  ];
  return lines.join('\n');
}
