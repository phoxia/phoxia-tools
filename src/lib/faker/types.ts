export interface DocGenerator {
	generate: () => string;
	mono?: boolean; // render in monospace font in the table
}

export interface CountryData {
	id: string; // ISO 3166-1 alpha-2: 'br', 'us'
	flag: string; // Emoji flag: '🇧🇷'
	firstNames: string[];
	lastNames: string[];
	states: string[]; // States, provinces, regions
	cities: string[]; // Major cities
	domains: string[]; // Local email domains
	phoneMask: string; // 'X' = random digit, rest literal
	postalCodeMask: string;
	fieldI18nKeys: Record<string, string>; // fieldId -> i18n key in t().tools.faker.fields
	docs: Record<string, DocGenerator>; // Country-specific document fields
}
