import type { CountryData } from '../types';

const es: CountryData = {
	id: 'es', flag: '🇪🇸',
	firstNames: [
		'Lucía','Martín','María','Hugo','Sofía','Mateo','Valeria','Leo','Martina','Daniel',
		'Paula','Alejandro','Alba','Pablo','Julia','Álvaro','Emma','Adrián','Carla','Diego',
		'Sara','Manuel','Claudia','David','Vega','Lucas','Daniela','Izan','Ana','Marcos',
		'Elena','Ángel','Laura','Sergio','Adriana','Javier','Ainhoa','Carlos','Irene','Guillermo'
	],
	lastNames: [
		'García','Rodríguez','González','Fernández','López','Martínez','Sánchez','Pérez','Gómez','Martin',
		'Jiménez','Hernández','Ruiz','Díaz','Moreno','Muñoz','Álvarez','Romero','Alonso','Gutiérrez',
		'Navarro','Torres','Domínguez','Vázquez','Ramos','Gil','Ramírez','Serrano','Blanco','Molina',
		'Morales','Ortega','Delgado','Castro','Ortiz','Rubio','Marín','Sanz','Iglesias','Medina'
	],
	states: [
		'Andalucía','Aragón','Asturias','Baleares','Canarias','Cantabria','Castilla y León',
		'Castilla-La Mancha','Cataluña','Comunidad Valenciana','Extremadura','Galicia',
		'Madrid','Murcia','Navarra','País Vasco','La Rioja'
	],
	cities: [
		'Madrid','Barcelona','Valencia','Sevilla','Zaragoza','Málaga','Murcia','Palma','Las Palmas',
		'Bilbao','Alicante','Córdoba','Valladolid','Vigo','Gijón','Granada','La Coruña','Vitoria',
		'Santa Cruz de Tenerife','Pamplona','Almería','San Sebastián','Santander','León','Oviedo'
	],
	domains: ['gmail.com','hotmail.com','outlook.es','yahoo.es','movistar.es','icloud.com'],
	phoneMask: 'XXX XXX XXX',
	postalCodeMask: 'XXXXX',
	fieldI18nKeys: {},
	docs: {
		dni: { generate: () => `${pad(8)}${'TRWAGMYFPDXBNJZSQVHLCKE'[Number(pad(8)) % 23]}`, mono: true }
	}
};

function pad(n: number): string { return String(Math.floor(Math.random() * Math.pow(10, n))).padStart(n, '0'); }

export default es;
