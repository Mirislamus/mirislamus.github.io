// Words that now and then run down a column of the Hero rain: a call to action and the core stack.
// The call to action is only there while the "open to new projects" status is on.
export const buildRainWords = (open: boolean, coreSkills: readonly string[]): string[] => {
  const words = coreSkills.map(name => name.toUpperCase());
  return open ? ['HIRE ME', 'OPEN TO WORK', ...words] : words;
};
