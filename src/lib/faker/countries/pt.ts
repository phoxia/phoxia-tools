import type { CountryData } from '../types';

const pt: CountryData = {
	id: 'pt', flag: '🇵🇹',
	firstNames: [
		'Maria','João','Ana','Francisco','António','Catarina','Manuel','Rita','José','Inês',
		'Pedro','Sofia','Paulo','Beatriz','Carlos','Mariana','Miguel','Carolina','Luís','Leonor',
		'Tiago','Margarida','Nuno','Joana','André','Teresa','Ricardo','Filipa','Diogo','Madalena',
		'Rui','Cláudia','Hugo','Sara','Bruno','Patrícia','Filipe','Sandra','Vasco','Liliana'
	],
	lastNames: [
		'Silva','Santos','Ferreira','Pereira','Oliveira','Costa','Rodrigues','Martins','Sousa','Fernandes',
		'Gonçalves','Gomes','Lopes','Marques','Alves','Almeida','Ribeiro','Pinto','Carvalho','Teixeira',
		'Moreira','Correia','Mendes','Nunes','Soares','Vieira','Monteiro','Cardoso','Rocha','Neves',
		'Coelho','Cruz','Cunha','Pacheco','Duarte','Reis','Simões','Antunes','Matos','Fonseca'
	],
	states: [
		'Aveiro','Beja','Braga','Bragança','Castelo Branco','Coimbra','Évora','Faro','Guarda',
		'Leiria','Lisboa','Portalegre','Porto','Santarém','Setúbal','Viana do Castelo','Vila Real',
		'Viseu','Açores','Madeira'
	],
	cities: [
		'Lisboa','Porto','Vila Nova de Gaia','Amadora','Braga','Coimbra','Funchal','Setúbal',
		'Almada','Aveiro','Viseu','Leiria','Faro','Guimarães','Évora','Portimão','Cascais',
		'Oeiras','Matosinhos','Odivelas','Sintra','Loures','Viana do Castelo','Maia','Seixal'
	],
	domains: ['gmail.com','hotmail.com','outlook.pt','sapo.pt','yahoo.com','iol.pt'],
	phoneMask: '9XX XXX XXX',
	postalCodeMask: 'XXXX-XXX',
	fieldI18nKeys: {},
	docs: {
		nif: { generate: () => { const n = pad(8); return `${n}${checkDigit(n)}`; }, mono: true },
		niss: { generate: () => `${pad(11)}`, mono: true }
	}
};

function pad(n: number): string { return String(Math.floor(Math.random() * Math.pow(10, n))).padStart(n, '0'); }
function checkDigit(s: string): string { const v = [...s].reduce((a, c, i) => a + Number(c) * (9 - i), 0); return String(v % 11 % 10); }

export default pt;
