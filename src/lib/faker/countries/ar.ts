import type { CountryData } from '../types';

const ar: CountryData = {
	id: 'ar', flag: '🇦🇷',
	firstNames: [
		'Sofía','Mateo','Valentina','Benjamín','Isabella','Joaquín','Martina','Nicolás','Camila','Santiago',
		'Luciana','Juan','Catalina','Facundo','Milagros','Lautaro','Lucía','Franco','Emilia','Ignacio',
		'Agustina','Tomás','Jazmín','Lucas','Morena','Matías','Guadalupe','Federico','Julieta','Bautista',
		'Valentino','Florencia','Axel','Victoria','Alejandro','Lourdes','Gabriel','Malena','Thiago','Antonella'
	],
	lastNames: [
		'González','Rodríguez','Gómez','Fernández','López','Martínez','Díaz','Pérez','Sánchez','Romero',
		'García','Torres','Álvarez','Ruiz','Ramírez','Flores','Acosta','Benítez','Medina','Herrera',
		'Castillo','Pereyra','Castro','Suárez','Morales','Ortiz','Vargas','Gutiérrez','Ponce','Juárez',
		'Ríos','Maidana','Sosa','Molina','Luna','Cabrera','Domínguez','Ferreyra','Blanco','Aguirre'
	],
	states: [
		'Buenos Aires','CABA','Catamarca','Chaco','Chubut','Córdoba','Corrientes','Entre Ríos','Formosa',
		'Jujuy','La Pampa','La Rioja','Mendoza','Misiones','Neuquén','Río Negro','Salta','San Juan',
		'San Luis','Santa Cruz','Santa Fe','Santiago del Estero','Tierra del Fuego','Tucumán'
	],
	cities: [
		'Buenos Aires','Córdoba','Rosario','Mendoza','La Plata','San Miguel de Tucumán','Mar del Plata',
		'Salta','Santa Fe','Corrientes','Bahía Blanca','Resistencia','Posadas','Neuquén','Paraná',
		'Formosa','San Salvador de Jujuy','Santiago del Estero','Comodoro Rivadavia','Río Gallegos','Ushuaia'
	],
	domains: ['gmail.com','hotmail.com','yahoo.com.ar','outlook.com','live.com.ar'],
	phoneMask: 'XX XXXX-XXXX',
	postalCodeMask: '#XXXX###',
	fieldI18nKeys: {},
	docs: {
		dni: { generate: () => `${pad(2)}.${pad(3)}.${pad(3)}`, mono: true },
		cuit: { generate: () => `${pad(2)}-${pad(8)}-${pad(1)}`, mono: true }
	}
};

function pad(n: number): string { return String(Math.floor(Math.random() * Math.pow(10, n))).padStart(n, '0'); }

export default ar;
