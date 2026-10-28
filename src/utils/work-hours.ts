import { isRecord } from '@/utils/object';
export interface WorkHours {
  timezone: string;
  days: number[];
  from: string;
  to: string;
}

export const isWorkHours = (value: unknown): value is WorkHours =>
  isRecord(value) &&
  typeof value.timezone === 'string' &&
  typeof value.from === 'string' &&
  typeof value.to === 'string' &&
  Array.isArray(value.days) &&
  value.days.every(day => typeof day === 'number');

const WEEKDAYS: Record<string, number> = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 };

const toMinutes = (time: string) => {
  const [hours = 0, minutes = 0] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

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

  return days.includes(WEEKDAYS[value('weekday')] ?? 0) && minutes >= toMinutes(from) && minutes < toMinutes(to);
};
