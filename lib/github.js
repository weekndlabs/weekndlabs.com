/**
 * Request headers for api.github.com.
 *
 * The homepage makes nine calls per revalidation. Unauthenticated that is nine
 * against a budget of 60 per hour shared across whatever else leaves the same
 * IP, and Vercel's egress pool is shared. Authenticated it is nine against
 * 5000. See issue #4.
 *
 * The token stays optional. A clone with no secret configured still builds and
 * still renders; it just spends the anonymous budget.
 *
 * @param {string | undefined} token
 * @returns {Record<string, string>}
 */
export function githubHeaders(token) {
  const headers = { Accept: 'application/vnd.github+json' };

  // An empty or whitespace-only value is what a half-configured deploy leaves
  // behind, and `Authorization: Bearer ` is rejected with a 401 on every call.
  // That turns a 60 per hour budget into zero, which is worse than sending no
  // token at all.
  if (typeof token === 'string' && token.trim() !== '') {
    headers.Authorization = `Bearer ${token.trim()}`;
  }

  return headers;
}

/**
 * One line on stderr when a call fails, so a page that silently loses its star
 * count or its activity feed leaves a trace in the deploy log.
 *
 * Both callers swallow failures on purpose: a missing number beats a wrong one,
 * and a missing feed beats a broken page. What was missing was any way to tell
 * a rate limit apart from a repo that was renamed. See issue #4.
 *
 * @param {string} what
 * @param {string} repo
 * @param {unknown} reason
 */
export function warnGithub(what, repo, reason) {
  console.warn(`[github] ${what} for ${repo} failed: ${reason}`);
}
