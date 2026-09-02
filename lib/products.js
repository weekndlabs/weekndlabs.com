/**
 * The catalog, and the only place it is written down.
 *
 * It used to live twice: a SHIPPED array in app/page.tsx for the rows, and a
 * pair of hand-written Card calls above it for the two in focus, with the navbar
 * carrying nothing but a hash link to the section. Adding a product meant
 * editing both, and the two drifted. See issue #28.
 *
 * Ordering is the display order inside a category, and CATEGORIES is the
 * display order of the columns in the nav menu and the groups on the landing.
 */

/** Column order in the nav menu, group order on the landing page. */
export const CATEGORIES = [
  'Agent infrastructure',
  'Model routing',
  'Dev workflow',
  'Desktop and foundations',
];

/**
 * What each category is for, in the reader's terms rather than ours.
 *
 * The section used to split on "In focus" and "Also shipped", which said which
 * two we cared about this month and nothing about what any of them do. The
 * categories already carry that, so they carry the sentence too.
 */
export const CATEGORY_NOTES = {
  'Agent infrastructure':
    'Credentials and context: the two things every agent needs and nobody wants to write twice.',
  'Model routing':
    'One endpoint in front of every provider, so changing model is a config change and not a rewrite.',
  'Dev workflow':
    'The work around the agent, from the pull request it opens to the assumption you have not tested yet.',
  'Desktop and foundations':
    'The tokens the rest is built on, and the one that runs on your Mac.',
};

/**
 * @typedef {object} Product
 * @property {string} name
 * @property {typeof CATEGORIES[number]} category
 * @property {string} version shipped version, or the stage when there is no number
 * @property {string} href where the product actually lives
 * @property {string} blurb one line, for the nav menu
 * @property {string} description the landing copy
 * @property {string[]} [tags] only the focus pair renders these
 * @property {boolean} [focus] gets a card at the top of the section
 * @property {string} [repo] owner/name, and only when the repo is public
 */

/** @type {ReadonlyArray<Product>} */
export const PRODUCTS = [
  {
    name: 'Selat',
    category: 'Agent infrastructure',
    version: 'v0.1.2',
    href: 'https://selat.weekndlabs.com',
    repo: 'fajarhide/selat',
    focus: true,
    tags: ['TypeScript', 'MCP', 'OAuth', 'Gateway'],
    blurb: 'One OAuth grant your agents share, over MCP and REST alike.',
    description:
      "Every agent you write ends up holding somebody else's OAuth. Selat holds it instead: connect GitHub, Google or Discord once from a browser, and your agent keeps one bearer that never rotates under it. MCP and REST see the same catalog, so Claude Desktop and a runtime you wrote yourself call the same tools.",
  },
  {
    name: 'Omni',
    category: 'Agent infrastructure',
    version: 'v0.7.3',
    href: 'https://omni.weekndlabs.com',
    repo: 'fajarhide/omni',
    focus: true,
    tags: ['Rust', 'Agentic AI', 'MCP', 'Context Engine'],
    blurb: 'Hands back a handle instead of output the agent already paid for.',
    description:
      'Your agent pays twice for output it has already seen. OMNI hands back a retrievable handle instead: 97.2% off a file it reads twice, 89.6% off file reads across the corpus. Nothing deleted, nothing invented, and every number replays on your own history.',
  },
  {
    name: 'Heimsense',
    category: 'Model routing',
    version: 'v0.1.3',
    href: 'https://github.com/fajarhide/heimsense',
    repo: 'fajarhide/heimsense',
    blurb: 'Point Claude Code at whichever model you want to pay for.',
    description:
      'Point Claude Code at any LLM. A Go proxy that routes your agent traffic to whichever model you actually want to pay for.',
  },
  {
    name: 'AI PR Describer',
    category: 'Dev workflow',
    version: 'v1.1.4',
    href: 'https://github.com/marketplace/actions/ai-pull-request-describer',
    repo: 'fajarhide/ai-pr-describer',
    blurb: 'Reads the diff and writes the pull request description.',
    description:
      'Reads the diff and writes the pull request description. Any OpenAI-compatible model, one step from the Actions marketplace.',
  },
  {
    // No repo key. ForgePod and Bubo are private, so api.github.com answers 404
    // for them unauthenticated, and totalStars refuses to publish a partial
    // total. Listing either one here deletes the hero's star count outright,
    // which is exactly what shipped once already.
    name: 'ForgePod',
    category: 'Dev workflow',
    version: 'Beta',
    href: 'https://forgepod.dev',
    blurb: 'Ship the smallest thing that tests the assumption.',
    description:
      'Write down the assumption, ship the smallest thing that tests it, then watch what users do instead of what they said they would.',
  },
  {
    name: 'Bubo',
    category: 'Desktop and foundations',
    version: 'v1.4',
    href: 'https://bubo.weekndlabs.com',
    blurb: 'Names the app making your Mac heavy and quits it.',
    description:
      'Names the app making your Mac heavy and quits it in one click. Menu bar only, no daemon.',
  },
  {
    name: 'Design System',
    category: 'Desktop and foundations',
    version: 'v0.5.0',
    href: '/design',
    blurb: 'The colour, type and spacing tokens under everything here.',
    description:
      'Colour, type and spacing tokens behind every product here. A test fails the build when a contrast ratio drops below WCAG.',
  },
];

/** The two that get cards at the top of the section, in declaration order. */
export const focusProducts = () => PRODUCTS.filter((p) => p.focus);

/** Everything else, as rows. */
export const restProducts = () => PRODUCTS.filter((p) => !p.focus);

/**
 * The catalog as columns, skipping any category nothing is filed under so the
 * menu never renders an empty heading.
 *
 * @param {ReadonlyArray<Product>} [products]
 * @returns {{ category: string, items: Product[] }[]}
 */
export function byCategory(products = PRODUCTS) {
  return CATEGORIES.map((category) => ({
    category,
    items: products.filter((p) => p.category === category),
  })).filter((group) => group.items.length > 0);
}

/** Public repos only, for the star total and the activity feed. */
export const starRepos = () => PRODUCTS.filter((p) => p.repo).map((p) => p.repo);
