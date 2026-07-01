import type { IconComponent } from '$lib/icons';
import {
	Braces, Binary, Fingerprint, Clock, Link, CaseSensitive,
	ShieldCheck, Hash, KeyRound, Globe, Database,
	Regex, FileText, Terminal, CalendarClock, Link2, GitCompare, BookOpen
} from '$lib/icons';

export type Category = 'dev' | 'text' | 'br' | 'reference';

export type ToolEntry = {
	id: string;
	route: string;
	category: Category;
	icon: IconComponent;
};

export const tools: ToolEntry[] = [
	{ id: 'json',        route: '/tools/json',        category: 'dev',       icon: Braces },
	{ id: 'base64',      route: '/tools/base64',      category: 'text',      icon: Binary },
	{ id: 'uuid',        route: '/tools/uuid',        category: 'dev',       icon: Fingerprint },
	{ id: 'timestamp',   route: '/tools/timestamp',   category: 'dev',       icon: Clock },
	{ id: 'url',         route: '/tools/url',         category: 'text',      icon: Link },
	{ id: 'case',        route: '/tools/case',        category: 'text',      icon: CaseSensitive },
	{ id: 'jwt',         route: '/tools/jwt',         category: 'dev',       icon: ShieldCheck },
	{ id: 'hash',        route: '/tools/hash',        category: 'dev',       icon: Hash },
	{ id: 'password',    route: '/tools/password',    category: 'dev',       icon: KeyRound },
	{ id: 'httpStatus',  route: '/tools/http-status', category: 'reference', icon: Globe },
	{ id: 'faker',       route: '/tools/faker',       category: 'dev',       icon: Database },
	{ id: 'regex',       route: '/tools/regex',       category: 'dev',       icon: Regex },
	{ id: 'markdown',    route: '/tools/markdown',    category: 'text',      icon: FileText },
	{ id: 'curl',        route: '/tools/curl',        category: 'dev',       icon: Terminal },
	{ id: 'cron',        route: '/tools/cron',        category: 'dev',       icon: CalendarClock },
	{ id: 'slug',        route: '/tools/slug',        category: 'text',      icon: Link2 },
	{ id: 'diff',        route: '/tools/diff',        category: 'dev',       icon: GitCompare },
	{ id: 'openapi',     route: '/tools/openapi',     category: 'reference', icon: BookOpen }
];

export function getToolsByCategory(): Record<Category, ToolEntry[]> {
	return {
		dev:       tools.filter((t) => t.category === 'dev'),
		text:      tools.filter((t) => t.category === 'text'),
		br:        tools.filter((t) => t.category === 'br'),
		reference: tools.filter((t) => t.category === 'reference')
	};
}

export function findTool(id: string): ToolEntry | undefined {
	return tools.find((t) => t.id === id);
}
