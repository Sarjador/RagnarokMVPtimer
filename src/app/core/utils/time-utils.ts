import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const TIME_FORMAT = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

/**
 * Parses a HH:mm death-time string interpreted in `inputTz` and returns a
 * Unix timestamp (in **seconds**).
 *
 * MVP deaths always happen in the past (or right now), so this function
 * interprets the time as today's date. The only exception is the midnight-
 * crossing case: if the parsed time is more than 30 minutes in the future,
 * it was actually yesterday's time (e.g. entering "23:55" at "00:10").
 */
export function timeStringToUnix(timeString: string, inputTz: string): number {
  if (!TIME_FORMAT.test(timeString)) {
    throw new Error(`Invalid time format: "${timeString}". Expected HH:mm`);
  }

  const now = dayjs().tz(inputTz);
  let time = dayjs.tz(`${now.format('YYYY-MM-DD')} ${timeString}`, 'YYYY-MM-DD HH:mm', inputTz);

  // If the parsed time is more than 30 min in the future, assume it was yesterday
  // (handles midnight-crossing: entering "23:50" at "00:05" the next day).
  if (time.isAfter(now.add(30, 'minute'))) {
    time = time.subtract(1, 'day');
  }

  return time.unix();
}

/**
 * Formats a Unix timestamp (seconds) as a time string in `displayTz`.
 * Returns `'--:--'` if formatting fails.
 */
export function formatUnixToTime(
  unixTimestamp: number,
  displayTz: string,
  format = 'HH:mm',
): string {
  try {
    return dayjs.unix(unixTimestamp).tz(displayTz).format(format);
  } catch {
    return '--:--';
  }
}

/**
 * Converts a HH:mm time string from one timezone to another.
 * Returns `'--:--'` on error.
 */
export function convertTimeBetweenTimezones(
  timeString: string,
  fromTz: string,
  toTz: string,
): string {
  try {
    const now = dayjs().tz(fromTz);
    const sourceTime = dayjs.tz(
      `${now.format('YYYY-MM-DD')} ${timeString}`,
      'YYYY-MM-DD HH:mm',
      fromTz,
    );
    return sourceTime.tz(toTz).format('HH:mm');
  } catch {
    return '--:--';
  }
}

/** Returns the current time formatted in the given timezone. */
export function getCurrentTimeInTimezone(tz: string, format = 'HH:mm'): string {
  try {
    return dayjs().tz(tz).format(format);
  } catch {
    return '--:--';
  }
}

/** Returns true if the string is a valid IANA timezone identifier. */
export function isValidTimezone(tz: string): boolean {
  try {
    dayjs().tz(tz);
    return true;
  } catch {
    return false;
  }
}

/** Returns true if the string matches HH:mm format. */
export function isValidTimeFormat(timeString: string): boolean {
  return typeof timeString === 'string' && TIME_FORMAT.test(timeString);
}

/**
 * Returns the remaining milliseconds until `targetUnixSeconds`.
 * Returns 0 if the target is in the past.
 */
export function remainingMs(targetUnixSeconds: number): number {
  return Math.max(0, targetUnixSeconds * 1000 - Date.now());
}

/** Formats a millisecond duration as mm:ss (e.g., "07:42"). */
export function formatCountdown(ms: number): string {
  if (ms <= 0) return '00:00';
  const totalSecs = Math.floor(ms / 1000);
  const mins = Math.floor(totalSecs / 60);
  const secs = totalSecs % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}
