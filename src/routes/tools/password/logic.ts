const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWER = 'abcdefghijklmnopqrstuvwxyz';
const DIGITS = '0123456789';
const SYMBOLS = '!@#$%^&*()-_=+[]{}|;:,.<>?';

export type PasswordOptions = {
	length: number;
	upper: boolean;
	lower: boolean;
	digits: boolean;
	symbols: boolean;
};

export function generatePassword(opts: PasswordOptions): string {
	let charset = '';
	if (opts.upper) charset += UPPER;
	if (opts.lower) charset += LOWER;
	if (opts.digits) charset += DIGITS;
	if (opts.symbols) charset += SYMBOLS;
	if (!charset) charset = LOWER;

	const arr = new Uint32Array(opts.length);
	crypto.getRandomValues(arr);
	return Array.from(arr, (n) => charset[n % charset.length]).join('');
}

export function calcEntropy(length: number, charsetSize: number): number {
	return length * Math.log2(charsetSize);
}

export function charsetSize(opts: Omit<PasswordOptions, 'length'>): number {
	let size = 0;
	if (opts.upper) size += UPPER.length;
	if (opts.lower) size += LOWER.length;
	if (opts.digits) size += DIGITS.length;
	if (opts.symbols) size += SYMBOLS.length;
	return size || LOWER.length;
}
