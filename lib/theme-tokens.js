/**
 * Reads the theme token blocks out of app/globals.css.
 *
 * The dark palette is declared twice, once for visitors whose OS asks for dark
 * and once for visitors who clicked the toggle. CSS has no way to share one
 * block between a media query and a selector, and light-dark() is unavailable
 * here because Tailwind's alpha modifiers need channel triplets rather than a
 * colour. So the duplication stays and this parser exists to police it.
 *
 * Only used by the test. Nothing at runtime imports this.
 */

/** Selectors that must carry a token set, keyed by the role they serve. */
export const BLOCKS = {
  light: ':root {',
  darkByPreference: ":root:not([data-theme='light'])",
  darkByChoice: ":root[data-theme='dark']",
};

/**
 * The body of the first block introduced by `selector`, brace-matched so a
 * nested media query does not truncate it.
 *
 * @param {string} css
 * @param {string} selector
 * @returns {string | null}
 */
export function extractBlock(css, selector) {
  const at = css.indexOf(selector);
  if (at === -1) return null;
  const open = css.indexOf('{', at);
  if (open === -1) return null;

  let depth = 0;
  for (let i = open; i < css.length; i += 1) {
    if (css[i] === '{') depth += 1;
    else if (css[i] === '}') {
      depth -= 1;
      if (depth === 0) return css.slice(open + 1, i);
    }
  }
  return null;
}

/**
 * Custom properties declared directly in a block body.
 *
 * @param {string} block
 * @returns {Record<string, string>}
 */
export function parseTokens(block) {
  /** @type {Record<string, string>} */
  const tokens = {};
  for (const [, name, value] of block.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
    tokens[name] = value.trim();
  }
  return tokens;
}

/**
 * @param {string} css
 * @returns {Record<keyof typeof BLOCKS, Record<string, string>>}
 */
export function themeTokens(css) {
  const out = /** @type {any} */ ({});
  for (const [role, selector] of Object.entries(BLOCKS)) {
    const block = extractBlock(css, selector);
    out[role] = block === null ? null : parseTokens(block);
  }
  return out;
}
