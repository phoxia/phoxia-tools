import { tools } from '$lib/tools/registry';
import { countryList } from '$lib/faker/countries';

// ponytail: static lastmod, update on deploy
const LASTMOD = '2026-07-01';
const BASE = 'https://tools.phoxia.org';

const COMMON_FIELDS = ['name', 'email', 'phone', 'postalCode', 'state', 'city'];

function fakerSeoUrls(): string[] {
	const urls: string[] = [];
	// Common fields × countries
	for (const country of countryList) {
		for (const field of COMMON_FIELDS) {
			urls.push(`${BASE}/tools/faker?field=${field}&country=${country.id}`);
		}
	}
	// Document-specific fields (auto-detect country)
	const seen = new Set<string>();
	for (const country of countryList) {
		for (const docId of Object.keys(country.docs)) {
			if (!seen.has(docId)) {
				seen.add(docId);
				urls.push(`${BASE}/tools/faker?field=${docId}`);
			}
		}
	}
	return urls;
}

export function GET() {
	const staticRoutes = [BASE, `${BASE}/privacy`, `${BASE}/terms`];
	const toolRoutes = tools.map((t) => `${BASE}${t.route}`);
	const seoRoutes = fakerSeoUrls();
	const urls = [...staticRoutes, ...toolRoutes, ...seoRoutes];

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url><loc>${url}</loc><lastmod>${LASTMOD}</lastmod></url>`).join('\n')}
</urlset>`;

	return new Response(xml, {
		headers: { 'Content-Type': 'application/xml' }
	});
}
