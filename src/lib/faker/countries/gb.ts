import type { CountryData } from '../types';

const gb: CountryData = {
	id: 'gb', flag: '🇬🇧',
	firstNames: [
		'Oliver','Amelia','George','Isla','Harry','Ava','Jack','Mia','Charlie','Emily',
		'Leo','Grace','Oscar','Sophie','Arthur','Lily','Henry','Freya','Thomas','Isabella',
		'William','Poppy','James','Ella','Alfie','Charlotte','Freddie','Evie','Jacob','Sophia',
		'Alexander','Harper','Archie','Evelyn','Max','Scarlett','Ethan','Lucy','Isaac','Daisy'
	],
	lastNames: [
		'Smith','Jones','Taylor','Brown','Williams','Wilson','Johnson','Davies','Robinson','Wright',
		'Thompson','Evans','Walker','White','Roberts','Green','Hall','Wood','Jackson','Clarke',
		'Patel','Hughes','Edwards','Turner','Martin','Cooper','Hill','Ward','Morris','Moore',
		'Clark','Lee','King','Baker','Harrison','Lewis','Scott','Young','Allen','Anderson'
	],
	states: [
		'Greater London','West Midlands','Greater Manchester','West Yorkshire','Kent','Essex',
		'Merseyside','South Yorkshire','Hampshire','Lancashire','Surrey','Hertfordshire','Tyne and Wear',
		'Nottinghamshire','Staffordshire','Devon','Derbyshire','Cheshire','Leicestershire','Somerset'
	],
	cities: [
		'London','Birmingham','Manchester','Leeds','Liverpool','Sheffield','Bristol','Newcastle',
		'Nottingham','Southampton','Leicester','Portsmouth','Brighton','Coventry','Cardiff',
		'Edinburgh','Glasgow','Belfast','Oxford','Cambridge','York','Bath','Norwich','Reading','Aberdeen'
	],
	domains: ['gmail.com','hotmail.co.uk','outlook.com','yahoo.co.uk','icloud.com','btinternet.com'],
	phoneMask: '07XXX XXXXXX',
	postalCodeMask: '##X# #XX',
	fieldI18nKeys: {},
	docs: {
		nino: { generate: () => `${alpha(2)} ${pad(2)} ${pad(2)} ${pad(2)} ${alpha(1)}`, mono: true }
	}
};

function pad(n: number): string { return String(Math.floor(Math.random() * Math.pow(10, n))).padStart(n, '0'); }
function alpha(n: number): string { return Array.from({ length: n }, () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)]).join(''); }

export default gb;
