import { execFileSync } from 'node:child_process';

// The date of the last commit (falls back to the build time when git is unavailable).
// One value for the sitemap and the structured data, so they never disagree.
let cached: Date | undefined;

export const getLastModified = (): Date => (cached ??= readLastModified());

const readLastModified = (): Date => {
  try {
    const iso = execFileSync('git', ['log', '-1', '--format=%cI'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    const date = new Date(iso);
    if (!Number.isNaN(date.getTime())) return date;
  } catch {
    // no git or no commits
  }
  return new Date();
};
