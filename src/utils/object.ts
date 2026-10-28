export const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export const isOneOf = <T extends string>(list: readonly T[], value: unknown): value is T =>
  list.some(item => item === value);

export const fromKeys = <K extends string, V>(keys: readonly K[], valueOf: (key: K) => V): Record<K, V> =>
  Object.fromEntries(keys.map(key => [key, valueOf(key)])) as Record<K, V>;
