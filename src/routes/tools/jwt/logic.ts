export type JwtResult = {
	header?: Record<string, unknown>;
	payload?: Record<string, unknown>;
	signature?: string;
	raw: { header: string; payload: string; signature: string };
	error?: undefined;
} | {
	error: string;
	header?: undefined;
	payload?: undefined;
	signature?: undefined;
	raw?: undefined;
};

function b64urlDecode(s: string): string {
	const padded = s.replace(/-/g, '+').replace(/_/g, '/').padEnd(s.length + (4 - s.length % 4) % 4, '=');
	return atob(padded);
}

export function decodeJwt(token: string): JwtResult {
	const parts = token.trim().split('.');
	if (parts.length !== 3) return { error: 'A JWT must have exactly 3 parts separated by "."' };

	const [rawHeader, rawPayload, signature] = parts;
	try {
		const header = JSON.parse(b64urlDecode(rawHeader));
		const payload = JSON.parse(b64urlDecode(rawPayload));
		return { header, payload, signature, raw: { header: rawHeader, payload: rawPayload, signature } };
	} catch {
		return { error: 'Failed to decode JWT. Check that the token is valid Base64url JSON.' };
	}
}

export function isExpired(exp: number | undefined): boolean | null {
	if (exp === undefined) return null;
	return Math.floor(Date.now() / 1000) > exp;
}

export function formatExp(exp: number): string {
	return new Date(exp * 1000).toUTCString();
}
