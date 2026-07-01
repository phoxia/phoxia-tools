import type { CountryData } from '../types';

const ind: CountryData = {
	id: 'in', flag: '🇮🇳',
	firstNames: [
		'Aarav','Aanya','Vihaan','Diya','Reyansh','Ananya','Arjun','Pari','Sai','Myra',
		'Advik','Ishita','Shaurya','Saanvi','Atharv','Shanaya','Krishna','Kavya','Dhruv','Prisha',
		'Ayaan','Kiara','Kabir','Jiya','Rudra','Navya','Shiv','Tara','Rohan','Riya',
		'Dev','Avni','Mohammed','Lakshmi','Ishaan','Anika','Aditya','Aadhya','Raj','Sneha'
	],
	lastNames: [
		'Sharma','Patel','Singh','Kumar','Verma','Gupta','Reddy','Joshi','Mehta','Chopra',
		'Rao','Nair','Menon','Pillai','Das','Malhotra','Kapoor','Kulkarni','Deshmukh','Iyer',
		'Choudhury','Saxena','Jain','Desai','Thakur','Yadav','Mishra','Pandey','Tiwari','Chauhan',
		'Agarwal','Bhat','Banerjee','Chatterjee','Ghosh','Sen','Mukherjee','Dutta','Sethi','Khan'
	],
	states: [
		'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana',
		'Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur',
		'Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu',
		'Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi'
	],
	cities: [
		'Mumbai','Delhi','Bangalore','Hyderabad','Ahmedabad','Chennai','Kolkata','Pune','Jaipur',
		'Lucknow','Surat','Nagpur','Indore','Bhopal','Ludhiana','Patna','Vadodara','Thane',
		'Agra','Visakhapatnam','Coimbatore','Mysore','Ranchi','Guwahati','Chandigarh'
	],
	domains: ['gmail.com','yahoo.co.in','outlook.com','rediffmail.com','hotmail.com','icloud.com'],
	phoneMask: 'XXXXX-XXXXX',
	postalCodeMask: 'XXXXXX',
	fieldI18nKeys: {},
	docs: {
		aadhaar: { generate: () => `${pad(4)} ${pad(4)} ${pad(4)}`, mono: true },
		pan: { generate: () => `${alpha(5)}${pad(4)}${alpha(1)}`, mono: true }
	}
};

function pad(n: number): string { return String(Math.floor(Math.random() * Math.pow(10, n))).padStart(n, '0'); }
function alpha(n: number): string { return Array.from({ length: n }, () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)]).join(''); }

export default ind;
