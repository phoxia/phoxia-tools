import type { CountryData } from '$lib/faker/types';
import { countryList } from '$lib/faker/countries';

const COMMON_FIELDS = ['name', 'email', 'phone', 'postalCode', 'state', 'city'] as const;

function pick<T>(arr: T[]): T {
	return arr[Math.floor(Math.random() * arr.length)];
}

function applyMask(mask: string): string {
	return mask
		.replace(/X/g, () => String(Math.floor(Math.random() * 10)))
		.replace(/#/g, () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)]);
}

function pad(n: number): string {
	return String(Math.floor(Math.random() * Math.pow(10, n))).padStart(n, '0');
}

export function getFields(country: CountryData): string[] {
	return [...COMMON_FIELDS, ...Object.keys(country.docs)];
}

export function isCommonField(field: string): boolean {
	return (COMMON_FIELDS as readonly string[]).includes(field);
}

export function fakeField(field: string, country: CountryData): string {
	switch (field) {
		case 'name':
			return `${pick(country.firstNames)} ${pick(country.lastNames)}`;
		case 'email': {
			const name = pick(country.firstNames)
				.toLowerCase()
				.normalize('NFD')
				.replace(/[̀-ͯ]/g, '');
			return `${name}${pad(2)}@${pick(country.domains)}`;
		}
		case 'phone':
			return applyMask(country.phoneMask);
		case 'postalCode':
			return applyMask(country.postalCodeMask);
		case 'state':
			return pick(country.states);
		case 'city':
			return pick(country.cities);
		default: {
			const doc = country.docs[field];
			return doc ? doc.generate() : '';
		}
	}
}

export function generateRecord(country: CountryData): Record<string, string> {
	const fields = getFields(country);
	return Object.fromEntries(fields.map((f) => [f, fakeField(f, country)]));
}

export function findCountryForDoc(docId: string): CountryData | undefined {
	return countryList.find((c) => docId in c.docs);
}
