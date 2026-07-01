import type { CountryData } from '../types';

const fr: CountryData = {
	id: 'fr', flag: '🇫🇷',
	firstNames: [
		'Emma','Gabriel','Louise','Raphaël','Jade','Louis','Alice','Arthur','Chloé','Jules',
		'Lina','Adam','Léa','Lucas','Manon','Hugo','Camille','Liam','Sarah','Nathan',
		'Inès','Ethan','Anna','Paul','Eva','Théo','Juliette','Tom','Zoé','Maël',
		'Ambre','Antoine','Romane','Mathis','Clara','Noé','Margaux','Enzo','Jeanne','Sacha'
	],
	lastNames: [
		'Martin','Bernard','Thomas','Petit','Robert','Richard','Durand','Dubois','Moreau','Laurent',
		'Simon','Michel','Lefebvre','Leroy','Roux','David','Bertrand','Morel','Fournier','Girard',
		'Bonnet','Dupont','Lambert','Fontaine','Rousseau','Vincent','Muller','Lefèvre','Faure','Andre',
		'Mercier','Blanc','Guerin','Boyer','Garnier','Chevalier','Francois','Legrand','Gauthier','Perrin'
	],
	states: [
		'Île-de-France','Auvergne-Rhône-Alpes','Nouvelle-Aquitaine','Occitanie','Hauts-de-France',
		'Grand Est','Provence-Alpes-Côte d\'Azur','Pays de la Loire','Bretagne','Normandie',
		'Bourgogne-Franche-Comté','Centre-Val de Loire','Corse'
	],
	cities: [
		'Paris','Marseille','Lyon','Toulouse','Nice','Nantes','Strasbourg','Montpellier','Bordeaux',
		'Lille','Rennes','Reims','Saint-Étienne','Le Havre','Toulon','Grenoble','Dijon','Angers',
		'Nîmes','Villeurbanne','Clermont-Ferrand','Aix-en-Provence','Brest','Limoges','Tours'
	],
	domains: ['gmail.com','outlook.fr','yahoo.fr','orange.fr','free.fr','laposte.net'],
	phoneMask: '0X XX XX XX XX',
	postalCodeMask: 'XXXXX',
	fieldI18nKeys: {},
	docs: {
		nir: { generate: () => `${pad(1)} ${pad(2)} ${pad(2)} ${pad(5)} ${pad(3)} ${pad(2)}`, mono: true },
		siret: { generate: () => `${pad(14)}`, mono: true }
	}
};

function pad(n: number): string { return String(Math.floor(Math.random() * Math.pow(10, n))).padStart(n, '0'); }

export default fr;
