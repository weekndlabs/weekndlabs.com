/**
 * Star totalling for the homepage hero.
 *
 * Split out of app/page.tsx so the aggregation rule is testable without a
 * network call. The rule is deliberately strict: a partial total looks
 * authoritative and is wrong, so anything less than a complete set of counts
 * produces no number at all rather than an undercount.
 */

/**
 * Sum the per-repo counts, or null when the set is incomplete or malformed.
 *
 * @param {ReadonlyArray<number | null>} counts one entry per product repo
 * @returns {number | null}
 */
export function totalStars(counts) {
  if (!Array.isArray(counts) || counts.length === 0) return null;
  const usable = counts.every(
    (c) => typeof c === 'number' && Number.isFinite(c) && c >= 0
  );
  if (!usable) return null;
  return counts.reduce((sum, c) => sum + c, 0);
}

/**
 * The trailing clause of the hero sentence.
 *
 * Returns '' when there is no trustworthy total, so the sentence ends at the
 * licence and simply says nothing about stars. The previous behaviour
 * substituted a hardcoded '300+', which drifts out of date and can go outright
 * false. See issue #3.
 *
 * @param {number | null} total
 * @returns {string}
 */
export function starClause(total) {
  if (total === null) return '';
  return `, with ${total.toLocaleString('en-US')} stars on GitHub`;
}
