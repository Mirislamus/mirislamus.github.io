const START_YEAR = 2018;
const START_MONTH = 5;

export const getExperienceYears = (now: Date = new Date()): number =>
  now.getFullYear() - START_YEAR - (now.getMonth() < START_MONTH ? 1 : 0);
