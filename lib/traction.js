/**
 * The counts in the proof section, apart from stars.
 *
 * Same rule as lib/stars.js and for the same reason: these figures are read by
 * people deciding whether the lab is real, so an incomplete answer produces no
 * number at all rather than a smaller one.
 */

/**
 * Releases in a repo, from one `releases?per_page=1` response.
 *
 * At one per page the number of the last page is the number of releases, which
 * costs a single call however many there are.
 *
 * @param {string | null} link the response's Link header
 * @param {number | undefined} bodyLength entries in the page that came back
 * @returns {number | null}
 */
export function releaseCount(link, bodyLength) {
  if (!link) return Number.isInteger(bodyLength) ? bodyLength : null;
  const last = link.match(/[?&]page=(\d+)>;\s*rel="last"/);
  return last ? Number(last[1]) : null;
}

/**
 * People who have a commit in any of the repos, counted once each.
 *
 * @param {ReadonlyArray<ReadonlyArray<string> | null>} lists logins, one list per repo
 * @returns {number | null}
 */
export function uniqueContributors(lists) {
  if (!Array.isArray(lists) || lists.length === 0) return null;
  if (!lists.every(Array.isArray)) return null;
  return new Set(lists.flat().filter((login) => !login.endsWith('[bot]'))).size;
}
