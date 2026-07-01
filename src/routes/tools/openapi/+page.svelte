<script lang="ts">
	import ToolLayout from '$lib/components/ToolLayout.svelte';
	import { t } from '$lib/i18n/i18n.svelte';
	import { trackToolUsed } from '$lib/analytics/analytics';

	const EXAMPLE = JSON.stringify({
		openapi: '3.1.0',
		info: { title: 'Pet Store API', version: '1.0.0', description: 'Example OpenAPI 3.x spec.' },
		servers: [{ url: 'https://api.petstore.example.com/v1' }],
		paths: {
			'/pets': {
				get:  { summary: 'List all pets', tags: ['pets'], operationId: 'listPets', responses: { '200': { description: 'A list of pets' } } },
				post: { summary: 'Create a pet',  tags: ['pets'], operationId: 'createPet', responses: { '201': { description: 'Created' } } }
			},
			'/pets/{petId}': {
				get:    { summary: 'Info for a pet',    tags: ['pets'],   operationId: 'showPetById',  responses: { '200': { description: 'A pet' } } },
				put:    { summary: 'Update a pet',      tags: ['pets'],   operationId: 'updatePet',    responses: { '200': { description: 'Updated' } } },
				delete: { summary: 'Delete a pet',      tags: ['pets'],   operationId: 'deletePet',    responses: { '204': { description: 'Deleted' } } }
			},
			'/users': {
				get:  { summary: 'List users', tags: ['users'], operationId: 'listUsers',  responses: { '200': { description: 'Users list' } } },
				post: { summary: 'Create user', tags: ['users'], operationId: 'createUser', responses: { '201': { description: 'Created' } } }
			}
		}
	}, null, 2);

	type Endpoint = { method: string; path: string; summary: string; operationId?: string; responses: Record<string, { description: string }> };
	type ParsedSpec = {
		title: string; version: string; description?: string;
		servers: string[];
		tags: Record<string, Endpoint[]>;
		error?: string;
	};

	const METHOD_COLORS: Record<string, string> = {
		get: '#3b82f6', post: '#22c55e', put: '#f59e0b', patch: '#a855f7', delete: '#ef4444', head: '#64748b', options: '#64748b'
	};

	let input = $state(EXAMPLE);
	let expanded = $state(new Set<string>());

	function parse(json: string): ParsedSpec | null {
		if (!json.trim()) return null;
		try {
			const spec = JSON.parse(json);
			if (!spec.openapi) return { title: '', version: '', servers: [], tags: {}, error: t().tools.openapi.errorMissing };

			const title = spec.info?.title ?? t().tools.openapi.untitled;
			const version = spec.info?.version ?? '';
			const description = spec.info?.description;
			const servers = (spec.servers ?? []).map((s: { url: string }) => s.url);

			const tags: Record<string, Endpoint[]> = {};
			for (const [path, pathItem] of Object.entries(spec.paths ?? {})) {
				for (const method of ['get','post','put','patch','delete','head','options']) {
					const op = (pathItem as Record<string, { summary?: string; tags?: string[]; operationId?: string; responses?: Record<string, { description: string }> }>)[method];
					if (!op) continue;
					const tag = op.tags?.[0] ?? 'default';
					if (!tags[tag]) tags[tag] = [];
					tags[tag].push({ method, path, summary: op.summary ?? path, operationId: op.operationId, responses: op.responses ?? {} });
				}
			}
			trackToolUsed('openapi');
			return { title, version, description, servers, tags };
		} catch (e) {
			return { title: '', version: '', servers: [], tags: {}, error: t().tools.openapi.errorParse.replace('{msg}', (e as Error).message) };
		}
	}

	const parsed = $derived(parse(input));

	function toggleTag(tag: string) {
		const next = new Set(expanded);
		if (next.has(tag)) next.delete(tag); else next.add(tag);
		expanded = next;
	}

	function toggleEndpoint(key: string) {
		const next = new Set(expanded);
		if (next.has(key)) next.delete(key); else next.add(key);
		expanded = next;
	}
</script>

<ToolLayout toolId="openapi" title={t().tools.openapi.name} description={t().tools.openapi.desc}>
	<div style="display: flex; flex-direction: column; gap: 1rem;">
		<div>
			<label for="oa-input" style="display: block; font-size: 0.85rem; margin-bottom: 0.375rem; color: var(--color-text-muted);">
				{t().tools.openapi.labelSpec}
			</label>
			<textarea
				id="oa-input"
				bind:value={input}
				spellcheck={false}
				style="
					width: 100%; min-height: 160px; resize: vertical; box-sizing: border-box;
					font-family: var(--font-mono); font-size: 0.78rem; line-height: 1.5;
					background: var(--color-surface); border: 1px solid var(--color-border);
					border-radius: var(--radius); color: var(--color-text); padding: 0.75rem;
				"
			></textarea>
		</div>

		{#if parsed}
			{#if parsed.error}
				<p role="alert" style="color: var(--color-error); font-size: 0.875rem; margin: 0; font-family: var(--font-mono);">{parsed.error}</p>
			{:else}
				<!-- Info card -->
				<div style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius); padding: 1rem 1.25rem;">
					<div style="display: flex; align-items: baseline; gap: 0.75rem; margin-bottom: {parsed.description ? '0.5rem' : '0'};">
						<h2 style="margin: 0; font-size: 1.1rem; color: var(--color-text);">{parsed.title}</h2>
						<span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--color-text-faint); background: color-mix(in srgb, var(--color-accent) 10%, transparent); padding: 0.1rem 0.5rem; border-radius: 99px;">v{parsed.version}</span>
					</div>
					{#if parsed.description}
						<p style="margin: 0 0 0.75rem; font-size: 0.85rem; color: var(--color-text-muted);">{parsed.description}</p>
					{/if}
					{#if parsed.servers.length > 0}
						<div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
							{#each parsed.servers as server}
								<code style="font-size: 0.78rem; font-family: var(--font-mono); color: var(--color-text-muted);">{server}</code>
							{/each}
						</div>
					{/if}
				</div>

				<!-- Endpoints by tag -->
				{#each Object.entries(parsed.tags) as [tag, endpoints]}
					{@const tagOpen = expanded.has(`tag:${tag}`)}
					<div style="border: 1px solid var(--color-border); border-radius: var(--radius); overflow: hidden;">
						<button
							onclick={() => toggleTag(`tag:${tag}`)} aria-expanded={tagOpen}
							style="
								width: 100%; display: flex; justify-content: space-between; align-items: center;
								padding: 0.75rem 1rem; background: var(--color-surface); border: none; cursor: pointer; text-align: left;
							"
						>
							<span style="font-weight: 700; font-size: 0.875rem; color: var(--color-text); text-transform: capitalize;">{tag}</span>
							<span style="font-size: 0.75rem; color: var(--color-text-faint);">{t().tools.openapi.endpointCount.replace('{n}', String(endpoints.length))} {tagOpen ? '▲' : '▼'}</span>
						</button>

						{#if tagOpen}
							<div style="border-top: 1px solid var(--color-border);">
								{#each endpoints as ep, i}
									{@const epKey = `ep:${tag}:${ep.method}:${ep.path}`}
									{@const epOpen = expanded.has(epKey)}
									{@const methodColor = METHOD_COLORS[ep.method] ?? 'var(--color-text-muted)'}
									<div style="border-bottom: {i < endpoints.length - 1 ? '1px solid color-mix(in srgb, var(--color-border) 50%, transparent)' : 'none'};">
										<button
											onclick={() => toggleEndpoint(epKey)} aria-expanded={epOpen}
											style="width: 100%; display: flex; align-items: center; gap: 0.75rem; padding: 0.625rem 1rem; background: transparent; border: none; cursor: pointer; text-align: left;"
										>
											<span style="
												font-family: var(--font-mono); font-size: 0.7rem; font-weight: 800; letter-spacing: 0.04em; text-transform: uppercase;
												min-width: 3.5rem; text-align: center; padding: 0.15rem 0.25rem; border-radius: 3px;
												color: {methodColor}; background: color-mix(in srgb, {methodColor} 12%, transparent);
											">{ep.method}</span>
											<code style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--color-text); flex: 1;">{ep.path}</code>
											<span style="font-size: 0.78rem; color: var(--color-text-muted); white-space: nowrap;">{ep.summary !== ep.path ? ep.summary : ''}</span>
											<span style="color: var(--color-text-faint); font-size: 0.75rem;">{epOpen ? '▲' : '▼'}</span>
										</button>

										{#if epOpen}
											<div style="padding: 0.75rem 1rem 0.875rem; border-top: 1px solid color-mix(in srgb, var(--color-border) 50%, transparent); background: color-mix(in srgb, var(--color-surface) 60%, transparent);">
												{#if ep.operationId}
													<p style="margin: 0 0 0.375rem; font-size: 0.78rem; color: var(--color-text-muted);">
														<strong>{t().tools.openapi.operationId}:</strong> <code style="font-family: var(--font-mono);">{ep.operationId}</code>
													</p>
												{/if}
												{#if Object.keys(ep.responses).length > 0}
													<p style="margin: 0 0 0.25rem; font-size: 0.78rem; font-weight: 600; color: var(--color-text-muted);">{t().tools.openapi.responses}</p>
													<div style="display: flex; flex-direction: column; gap: 0.125rem;">
														{#each Object.entries(ep.responses) as [code, resp]}
															<div style="display: flex; gap: 0.75rem; font-size: 0.78rem; font-family: var(--font-mono);">
																<span style="color: {code.startsWith('2') ? 'var(--color-success)' : code.startsWith('4') ? 'var(--color-error)' : 'var(--color-text-muted)'}; font-weight: 700; min-width: 2.5rem;">{code}</span>
																<span style="color: var(--color-text-muted);">{resp.description}</span>
															</div>
														{/each}
													</div>
												{/if}
											</div>
										{/if}
									</div>
								{/each}
							</div>
						{/if}
					</div>
				{/each}
			{/if}
		{/if}
	</div>
</ToolLayout>
