export type LocaleShape = {
	nav: {
		home: string;
		allTools: string;
		skipToContent: string;
		toggleTheme: string;
		toggleLang: string;
		mainNavAria: string;
	};
	home: {
		title: string;
		subtitle: string;
		categories: {
			dev: string;
			text: string;
			br: string;
			reference: string;
		};
	};
	seo: {
		homeTitle: string;
		homeDescription: string;
		privacyDescription: string;
		termsDescription: string;
		siteName: string;
	};
	aria: {
		homeLogo: string;
		footerNav: string;
		allTools: string;
		toc: string;
		discord: string;
		github: string;
	};
	tools: {
		json: {
			name: string; desc: string;
			placeholder: string;
			errorSize: string;
		};
		base64: {
			name: string; desc: string;
			placeholder: string;
			errorSize: string;
		};
		uuid: {
			name: string; desc: string;
			labelCount: string;
			generatedCount: string;
		};
		timestamp: {
			name: string; desc: string;
			labelInput: string; placeholder: string;
			parse: string; now: string;
			labelUnix: string; labelUnixMs: string; labelIso: string; labelUtc: string;
			errorInvalidTimestamp: string; errorCannotParse: string;
		};
		url: {
			name: string; desc: string;
			placeholder: string;
			parseUrl: string;
			errorInvalid: string;
		};
		case: {
			name: string; desc: string;
			placeholder: string;
			labels: { camel: string; pascal: string; snake: string; screamingSnake: string; kebab: string; upper: string; lower: string };
			examples: { camel: string; pascal: string; snake: string; screamingSnake: string; kebab: string; upper: string; lower: string };
		};
		jwt: {
			name: string; desc: string;
			labelToken: string; placeholder: string;
			example: string;
			expired: string; valid: string;
			header: string; payload: string; signature: string;
			errorParts: string; errorDecode: string;
		};
		hash: {
			name: string; desc: string;
			placeholder: string;
			errorSize: string;
		};
		password: {
			name: string; desc: string;
			labelLength: string; labelCount: string;
			labelUpper: string; labelLower: string; labelDigits: string; labelSymbols: string;
			entropy: string; bits: string;
			strength: { weak: string; fair: string; good: string; strong: string; veryStrong: string };
		};
		httpStatus: {
			name: string; desc: string;
			placeholder: string; noResults: string;
			groups: { informational: string; success: string; redirection: string; clientError: string; serverError: string };
			codes: Record<string, { name: string; desc: string }>;
		};
		cpf: { name: string; desc: string };
		cnpj: { name: string; desc: string };
		faker: {
			name: string; desc: string;
			labelCount: string;
			labelCountry: string;
			json: string; csv: string;
			countries: Record<string, string>;
			fields: Record<string, string>;
		};
		regex: {
			name: string; desc: string;
			labelPattern: string; labelFlags: string; hintEmptyPattern: string;
			labelTestString: string;
			labelMatches: string; matchCount: string;
			labelCaptureGroups: string; matchLabel: string;
			flags: { global: string; caseInsensitive: string; multiline: string; dotAll: string };
		};
		markdown: {
			name: string; desc: string;
			split: string; preview: string;
			copyHtml: string;
			example: string;
		};
		curl: {
			name: string; desc: string;
			labelCommand: string; placeholder: string;
			example: string;
			fetch: string; axios: string;
			errorNotCurl: string; errorNoUrl: string;
		};
		cron: {
			name: string; desc: string;
			labelExpression: string; placeholder: string;
			examples: { everyMinute: string; every15Min: string; dailyAt9: string; weekdaysAt9: string; everySunday: string; firstOfMonth: string };
			labels: { min: string; hour: string; dom: string; month: string; dow: string };
			runs: string; nextExecutions: string;
			errorInvalid: string;
			dayNames: string[];
			monthNames: string[];
			descriptions: { everyMinute: string; everyHour: string; everyDay: string; everyMonth: string; everyDow: string; everyNMinutes: string; everyNHours: string; atHour: string; on: string; minuteOf: string; everyN: string; atField: string };
		};
		slug: {
			name: string; desc: string;
			labelInput: string; placeholder: string;
			labelSeparator: string; labelSlug: string;
		};
		diff: {
			name: string; desc: string;
			labelOriginal: string; labelModified: string;
			added: string; removed: string; noDifferences: string;
		};
		openapi: {
			name: string; desc: string;
			labelSpec: string;
			errorMissing: string; errorParse: string;
			untitled: string;
			endpointCount: string;
			operationId: string; responses: string;
		};
	};
	consent: {
		message: string;
		bannerPrivacy: string;
		accept: string;
		decline: string;
		privacyLink: string;
		revoke: string;
	};
	footer: {
		tagline: string;
		privacy: string;
		terms: string;
		contact: string;
		github: string;
		license: string;
		legal: string;
		discord: string;
	};
	common: {
		dark: string;
		light: string;
		system: string;
		copy: string;
		copied: string;
		clear: string;
		generate: string;
		encode: string;
		decode: string;
		format: string;
		minify: string;
		error: string;
		inputPlaceholder: string;
		outputPlaceholder: string;
		inputTooLarge: string;
		tocLabel: string;
		valid: string;
		invalid: string;
		count: string;
		copyAll: string;
		example: string;
		parse: string;
		now: string;
		length: string;
		original: string;
		modified: string;
		noResults: string;
	};
	privacyPage: { title: string };
	termsPage: { title: string };
};
