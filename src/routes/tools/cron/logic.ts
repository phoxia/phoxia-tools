import { t } from '$lib/i18n/i18n.svelte';

export type CronField = 'minute' | 'hour' | 'dom' | 'month' | 'dow';

const FIELD_RANGES: Record<CronField, [number, number]> = {
	minute: [0, 59], hour: [0, 23], dom: [1, 31], month: [1, 12], dow: [0, 7]
};

export interface CronLocale {
	dayNames: string[];
	monthNames: string[];
	descriptions: {
		everyMinute: string;
		everyHour: string;
		everyDay: string;
		everyMonth: string;
		everyDow: string;
		everyNMinutes: string;
		everyNHours: string;
		atHour: string;
		on: string;
		minuteOf: string;
		everyN: string;
		atField: string;
	};
	errorInvalid: string;
}

function inRange(val: number, field: CronField): boolean {
	const [min, max] = FIELD_RANGES[field];
	return val >= min && val <= max;
}

function validatePart(part: string, field: CronField): boolean {
	if (part === '*') return true;
	if (part.startsWith('*/')) {
		const n = Number(part.slice(2));
		return Number.isInteger(n) && n >= 1;
	}
	if (part.includes('-')) {
		const [a, b] = part.split('-').map(Number);
		return inRange(a, field) && inRange(b, field) && a <= b;
	}
	if (part.includes(',')) {
		return part.split(',').every((p) => {
			const n = Number(p);
			return Number.isInteger(n) && inRange(n, field);
		});
	}
	const n = Number(part);
	return Number.isInteger(n) && inRange(n, field);
}

export function isValidCron(expr: string): boolean {
	const parts = expr.trim().split(/\s+/);
	if (parts.length !== 5) return false;
	const fields: CronField[] = ['minute','hour','dom','month','dow'];
	return parts.every((p, i) => validatePart(p, fields[i]));
}

export function describeField(part: string, field: CronField, locale: CronLocale): string {
	if (part === '*') {
		if (field === 'minute') return locale.descriptions.everyMinute;
		if (field === 'hour') return locale.descriptions.everyHour;
		if (field === 'dom') return locale.descriptions.everyDay;
		if (field === 'month') return locale.descriptions.everyMonth;
		return locale.descriptions.everyDow;
	}
	if (part.startsWith('*/')) {
		const n = part.slice(2);
		if (field === 'minute') return locale.descriptions.everyNMinutes.replace('{n}', n);
		if (field === 'hour') return locale.descriptions.everyNHours.replace('{n}', n);
		return t().tools.cron.descriptions.everyN.replace('{n}', n);
	}
	if (part.includes('-') && field === 'dow') {
		const [a, b] = part.split('-').map(Number);
		return `${locale.dayNames[a]}–${locale.dayNames[b]}`;
	}
	if (field === 'hour') {
		const h = Number(part);
		return locale.descriptions.atHour.replace('{hour}', String(h).padStart(2, '0'));
	}
	if (field === 'dow') {
		const partsArr = part.split(',').map((p) => locale.dayNames[Number(p)]);
		return partsArr.join(', ');
	}
	if (field === 'month') {
		const partsArr = part.split(',').map((p) => locale.monthNames[Number(p) - 1]);
		return partsArr.join(', ');
	}
	return t().tools.cron.descriptions.atField.replace('{field}', field).replace('{part}', part);
}

export type CronResult = {
	valid: boolean;
	summary: string;
	nextRuns: Date[];
	error?: string;
};

function matchesCron(date: Date, parts: string[]): boolean {
	const m = date.getMinutes();
	const h = date.getHours();
	const dom = date.getDate();
	const month = date.getMonth() + 1;
	const dow = date.getDay();

	function matches(part: string, val: number, field: CronField): boolean {
		if (part === '*') return true;
		if (part.startsWith('*/')) return val % Number(part.slice(2)) === 0;
		if (part.includes('-')) {
			const [a, b] = part.split('-').map(Number);
			return val >= a && val <= b;
		}
		if (part.includes(',')) return part.split(',').map(Number).includes(val);
		const n = Number(part);
		return field === 'dow' ? (val === n || (n === 7 && val === 0)) : val === n;
	}

	return (
		matches(parts[0], m, 'minute') &&
		matches(parts[1], h, 'hour') &&
		matches(parts[2], dom, 'dom') &&
		matches(parts[3], month, 'month') &&
		matches(parts[4], dow, 'dow')
	);
}

function nextRuns(parts: string[], count: number): Date[] {
	const results: Date[] = [];
	const d = new Date();
	d.setSeconds(0, 0);
	d.setMinutes(d.getMinutes() + 1);

	for (let i = 0; i < 525600 && results.length < count; i++) {
		if (matchesCron(d, parts)) results.push(new Date(d));
		d.setMinutes(d.getMinutes() + 1);
	}
	return results;
}

function buildSummary(parts: string[], locale: CronLocale): string {
	const [min, hr, , , dow] = parts;
	const segments: string[] = [];

	if (min === '*' && hr === '*') {
		segments.push(locale.descriptions.everyMinute);
	} else if (min.startsWith('*/')) {
		segments.push(describeField(min, 'minute', locale));
	} else if (hr !== '*') {
		const hDesc = describeField(hr, 'hour', locale);
		const mSuffix = min === '0' ? '' : ` ${min}`;
		segments.push(hDesc.replace(':00', `:${min.padStart(2, '0')}`));
	} else {
		const desc = locale.descriptions.minuteOf
			.replace('{min}', min)
			.replace('{hour}', describeField(hr, 'hour', locale));
		segments.push(desc);
	}

	if (dow !== '*') segments.push(locale.descriptions.on.replace('{desc}', describeField(dow, 'dow', locale)));

	return segments.join(', ');
}

export function parseCron(expr: string, locale: CronLocale): CronResult {
	if (!isValidCron(expr)) return { valid: false, summary: '', nextRuns: [], error: locale.errorInvalid };
	const parts = expr.trim().split(/\s+/);
	return { valid: true, summary: buildSummary(parts, locale), nextRuns: nextRuns(parts, 5) };
}
