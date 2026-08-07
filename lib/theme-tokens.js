/**
 * Reads custom properties out of a stylesheet.
 *
 * This used to police a duplicated dark palette, back when the site declared
 * its own tokens twice, once for `prefers-color-scheme` and once for
 * `data-theme`, because CSS cannot share a block between them. Since 0.4.0 the
 * site declares no colours at all: they come from @weekndlabs/design, and the
 * theme is decided in one line of script before first paint.
 *
 * So the parser stayed and the rule it enforces flipped. A colour declared here
 * is a colour the package's contrast gate cannot measure, which is how a value
 * that fails AA gets onto the site with every test green.
 *
 * Only used by the test. Nothing at runtime imports this.
 */

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
 * Every custom property the stylesheet declares anywhere, with the selector it
 * was declared under.
 *
 * @param {string} css
 * @returns {Array<{ selector: string, name: string, value: string }>}
 */
export function declaredProperties(css) {
  const out = [];
  for (const [, selector, body] of css.matchAll(/([^{}@;]+)\{([^{}]*)\}/g)) {
    for (const [name, value] of Object.entries(parseTokens(body))) {
      out.push({ selector: selector.trim().replace(/\s+/g, ' '), name, value });
    }
  }
  return out;
}
