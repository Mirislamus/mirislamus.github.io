// Career start: June 2018 (WebPult). Full years of experience, computed once for the whole site.
const START_YEAR = 2018;
const START_MONTH = 5; // June, zero-based

export const getExperienceYears = (now: Date = new Date()): number =>
  now.getFullYear() - START_YEAR - (now.getMonth() < START_MONTH ? 1 : 0);
