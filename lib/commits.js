/**
 * Conventional-commit parsing for the activity feed.
 *
 * The feed used to prefix every line with an emoji picked by
 * `message.startsWith('fix')`, which is decoration standing in for the type the
 * message already carries. Reading the real prefix gives the same column an
 * actual meaning, and lets the subject render without repeating it.
 */

const PREFIX = /^([a-z]+)(?:\([^)]*\))?(!)?:\s*(.+)$/i;

/**
 * Split a commit subject into its conventional-commit type and the rest.
 *
 * A message that does not follow the convention keeps its whole subject and
 * reports no type, so nothing is ever dropped from the feed to make it tidy.
 *
 * @param {string} message first line of a commit message
 * @returns {{ type: string | null, subject: string }}
 */
export function parseCommit(message) {
  const line = typeof message === 'string' ? message.trim() : '';
  const match = PREFIX.exec(line);
  if (!match) return { type: null, subject: line };
  const [, type, breaking, subject] = match;
  return { type: `${type.toLowerCase()}${breaking ?? ''}`, subject };
}
