import { execFileSync } from 'node:child_process';

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
  } catch {}
  return new Date();
};
