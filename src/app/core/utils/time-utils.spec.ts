import {
  timeStringToUnix,
  formatUnixToTime,
  convertTimeBetweenTimezones,
  isValidTimeFormat,
  formatCountdown,
  remainingMs,
} from './time-utils';

describe('time-utils', () => {
  describe('isValidTimeFormat', () => {
    it('accepts valid HH:mm', () => {
      expect(isValidTimeFormat('00:00')).toBeTrue();
      expect(isValidTimeFormat('23:59')).toBeTrue();
      expect(isValidTimeFormat('9:30')).toBeTrue();
    });

    it('rejects invalid formats', () => {
      expect(isValidTimeFormat('24:00')).toBeFalse();
      expect(isValidTimeFormat('12:60')).toBeFalse();
      expect(isValidTimeFormat('')).toBeFalse();
      expect(isValidTimeFormat('abc')).toBeFalse();
      expect(isValidTimeFormat('1200')).toBeFalse();
    });
  });

  describe('timeStringToUnix', () => {
    it('returns a positive Unix timestamp', () => {
      const ts = timeStringToUnix('22:00', 'America/Sao_Paulo');
      expect(ts).toBeGreaterThan(0);
    });

    it('result is within the last 24 hours or at most 30 min in the future', () => {
      const ts = timeStringToUnix('22:00', 'America/Sao_Paulo');
      const nowSec = Math.floor(Date.now() / 1000);
      // Death times can be in the past (boss died earlier today) or very near future.
      // The only day adjustment is for midnight-crossing: if parsed time is >30 min ahead, subtract 1 day.
      expect(ts).toBeGreaterThanOrEqual(nowSec - 86400);
      expect(ts).toBeLessThanOrEqual(nowSec + 1800);
    });

    it('throws on invalid format', () => {
      expect(() => timeStringToUnix('invalid', 'UTC')).toThrowError();
    });

    it('handles midnight correctly', () => {
      const ts = timeStringToUnix('00:00', 'UTC');
      expect(ts).toBeGreaterThan(0);
    });
  });

  describe('formatUnixToTime', () => {
    it('formats a known timestamp correctly', () => {
      // Unix 0 = 1970-01-01 00:00:00 UTC
      expect(formatUnixToTime(0, 'UTC')).toBe('00:00');
      expect(formatUnixToTime(0, 'UTC', 'HH:mm')).toBe('00:00');
    });

    it('formats with timezone offset', () => {
      // America/Sao_Paulo is UTC-3, so Unix 0 would be 21:00 on 1969-12-31
      const result = formatUnixToTime(0, 'America/Sao_Paulo');
      expect(result).toBe('21:00');
    });

    it('returns --:-- on invalid timezone', () => {
      expect(formatUnixToTime(0, 'Invalid/Zone')).toBe('--:--');
    });
  });

  describe('convertTimeBetweenTimezones', () => {
    it('returns same time when converting to same timezone', () => {
      expect(convertTimeBetweenTimezones('12:00', 'UTC', 'UTC')).toBe('12:00');
    });

    it('returns --:-- on invalid timezone', () => {
      expect(convertTimeBetweenTimezones('12:00', 'Invalid/Zone', 'UTC')).toBe('--:--');
    });
  });

  describe('formatCountdown', () => {
    it('formats zero as 00:00', () => {
      expect(formatCountdown(0)).toBe('00:00');
    });

    it('formats negative as 00:00', () => {
      expect(formatCountdown(-1000)).toBe('00:00');
    });

    it('formats 90 seconds correctly', () => {
      expect(formatCountdown(90_000)).toBe('01:30');
    });

    it('formats 62 minutes correctly', () => {
      expect(formatCountdown(62 * 60 * 1000)).toBe('62:00');
    });
  });

  describe('remainingMs', () => {
    it('returns 0 for past timestamps', () => {
      expect(remainingMs(0)).toBe(0);
    });

    it('returns positive ms for future timestamps', () => {
      const futureSec = Math.floor(Date.now() / 1000) + 3600;
      expect(remainingMs(futureSec)).toBeGreaterThan(0);
    });
  });
});
