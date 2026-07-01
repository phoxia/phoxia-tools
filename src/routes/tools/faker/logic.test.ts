import { describe, it, expect } from 'vitest';
import { fakeField, generateRecord, getFields, findCountryForDoc } from './logic';
import { countries, countryList } from '$lib/faker/countries';

describe.each(countryList)('$id · $flag', (country) => {
	const fields = getFields(country);

	it('generates all fields without error and non-empty', () => {
		for (const field of fields) {
			const value = fakeField(field, country);
			expect(value.length).toBeGreaterThan(0);
		}
	});

	it('generates valid email with @', () => {
		expect(fakeField('email', country)).toContain('@');
	});

	it('generates phone matching mask length', () => {
		expect(fakeField('phone', country).length).toBe(country.phoneMask.length);
	});

	it('generates postal code matching mask length', () => {
		expect(fakeField('postalCode', country).length).toBe(country.postalCodeMask.length);
	});

	it('generates state from country state list', () => {
		expect(country.states).toContain(fakeField('state', country));
	});

	it('generates city from country city list', () => {
		expect(country.cities).toContain(fakeField('city', country));
	});

	it('generateRecord returns all fields with string values', () => {
		const record = generateRecord(country);
		for (const field of fields) {
			expect(record).toHaveProperty(field);
			expect(typeof record[field]).toBe('string');
			expect(record[field].length).toBeGreaterThan(0);
		}
	});

	it('generates different records each call', () => {
		const records = Array.from({ length: 5 }, () => generateRecord(country));
		const names = records.map((r) => r['name']);
		expect(new Set(names).size).toBeGreaterThan(1);
	});
});

describe('findCountryForDoc', () => {
	it('finds Brazil for CPF', () => {
		expect(findCountryForDoc('cpf')?.id).toBe('br');
	});

	it('finds Brazil for CNPJ', () => {
		expect(findCountryForDoc('cnpj')?.id).toBe('br');
	});

	it('returns undefined for unknown doc', () => {
		expect(findCountryForDoc('nonexistent')).toBeUndefined();
	});
});

describe('BR document validation', () => {
	it('generates valid CPFs', async () => {
		const { isValidCpf } = await import('../cpf/logic');
		for (let i = 0; i < 5; i++) {
			const cpf = fakeField('cpf', countries['br']);
			expect(isValidCpf(cpf)).toBe(true);
		}
	});

	it('generates valid CNPJs', async () => {
		const { isValidCnpj } = await import('../cnpj/logic');
		for (let i = 0; i < 5; i++) {
			const cnpj = fakeField('cnpj', countries['br']);
			expect(isValidCnpj(cnpj)).toBe(true);
		}
	});
});
