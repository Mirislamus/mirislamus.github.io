export interface WorkHours {
  timezone: string;
  // ISO weekdays: 1 = Monday ... 7 = Sunday
  days: number[];
  from: string; // "10:00"
  to: string; // "19:00"
}

const WEEKDAYS: Record<string, number> = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 };

const toMinutes = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

// True while `now` falls inside the working days and hours, judged in the given time zone (not the
// visitor's): the start is included, the end is not.
export const isWithinWorkHours = (now: Date, { timezone, days, from, to }: WorkHours): boolean => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(now);

  const value = (type: string) => parts.find(part => part.type === type)?.value ?? '';
  const minutes = Number(value('hour')) * 60 + Number(value('minute'));

  return days.includes(WEEKDAYS[value('weekday')]) && minutes >= toMinutes(from) && minutes < toMinutes(to);
};
