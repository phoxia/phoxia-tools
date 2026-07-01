export type CaseMode = 'camel' | 'pascal' | 'snake' | 'screaming' | 'kebab' | 'upper' | 'lower';

function tokenize(input: string): string[] {
	return input
		.replace(/([a-z])([A-Z])/g, '$1 $2')
		.replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
		.split(/[\s_\-./\\]+/)
		.map((w) => w.toLowerCase())
		.filter(Boolean);
}

export function toCase(input: string, mode: CaseMode): string {
	const words = tokenize(input);
	const modes = {
		camel: () => words.map((w, i) => (i === 0 ? w : w[0].toUpperCase() + w.slice(1))).join(''),
		pascal: () => words.map((w) => w[0].toUpperCase() + w.slice(1)).join(''),
		snake: () => words.join('_').toLowerCase(),
		screaming: () => words.join('_').toUpperCase(),
		kebab: () => words.join('-'),
		upper: () => input.toUpperCase(),
		lower: () => input.toLowerCase(),
	}
	const execMode = modes[mode];
	if (!execMode) return input;
	return execMode();
}
