export const buildRainWords = (open: boolean, coreSkills: readonly string[]): string[] => {
  const words = coreSkills.map(name => name.toUpperCase());
  return open ? ['HIRE ME', 'OPEN TO WORK', ...words] : words;
};
