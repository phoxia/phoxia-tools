import { describe, it, expect } from 'vitest';
import { parseCron, describeField, isValidCron, type CronLocale } from './logic';

const enLocale: CronLocale = {
	dayNames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
	monthNames: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
	descriptions: {
		everyMinute: 'every minute',
		everyHour: 'every hour',
		everyDay: 'every day',
		everyMonth: 'every month',
		everyDow: 'every day of week',
		everyNMinutes: 'every {n} minutes',
		everyNHours: 'every {n} hours',
		atHour: 'at {hour}:00',
		on: 'on {desc}',
		minuteOf: 'minute {min} of {hour}',
		everyN: 'every {n}',
		atField: 'at {field} {part}',
	},
	errorInvalid: 'Invalid cron expression',
};

describe('isValidCron', () => {
	it('accepts 5-field cron', () => expect(isValidCron('* * * * *')).toBe(true));
	it('accepts specific values', () => expect(isValidCron('30 9 * * 1')).toBe(true));
	it('accepts step', () => expect(isValidCron('*/15 * * * *')).toBe(true));
	it('accepts range', () => expect(isValidCron('0 8-18 * * *')).toBe(true));
	it('accepts list', () => expect(isValidCron('0 9,12,17 * * *')).toBe(true));
	it('rejects wrong field count', () => expect(isValidCron('* * * *')).toBe(false));
	it('rejects empty string', () => expect(isValidCron('')).toBe(false));
	it('rejects minute > 59', () => expect(isValidCron('60 * * * *')).toBe(false));
	it('rejects hour > 23', () => expect(isValidCron('* 24 * * *')).toBe(false));
	it('rejects month 0', () => expect(isValidCron('* * * 0 *')).toBe(false));
	it('rejects month > 12', () => expect(isValidCron('* * * 13 *')).toBe(false));
	it('rejects day-of-week > 7', () => expect(isValidCron('* * * * 8')).toBe(false));
});

describe('describeField', () => {
	it('describes wildcard', () => expect(describeField('*', 'minute', enLocale)).toBe('every minute'));
	it('describes step', () => expect(describeField('*/15', 'minute', enLocale)).toBe('every 15 minutes'));
	it('describes exact minute', () => expect(describeField('30', 'minute', enLocale)).toBe('at minute 30'));
	it('describes exact hour', () => expect(describeField('9', 'hour', enLocale)).toBe('at 09:00'));
	it('describes wildcard hour', () => expect(describeField('*', 'hour', enLocale)).toBe('every hour'));
	it('describes range', () => expect(describeField('1-5', 'dow', enLocale)).toBe('Mon–Fri'));
});

describe('parseCron', () => {
	it('parses * * * * *', () => {
		const r = parseCron('* * * * *', enLocale);
		expect(r.valid).toBe(true);
		expect(r.summary).toBeTruthy();
	});
	it('returns invalid for bad cron', () => {
		const r = parseCron('not a cron', enLocale);
		expect(r.valid).toBe(false);
	});
	it('parses 0 9 * * 1', () => {
		const r = parseCron('0 9 * * 1', enLocale);
		expect(r.valid).toBe(true);
		expect(r.summary).toContain('09:00');
		expect(r.summary.toLowerCase()).toContain('mon');
	});
	it('includes next run times', () => {
		const r = parseCron('* * * * *', enLocale);
		expect(r.nextRuns.length).toBe(5);
		for (let i = 1; i < 5; i++) {
			expect(r.nextRuns[i].getTime()).toBeGreaterThan(r.nextRuns[i - 1].getTime());
		}
	});
});
