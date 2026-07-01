<script lang="ts">
	import LegalLayout from '$lib/components/LegalLayout.svelte';
	import { t, getLang } from '$lib/i18n/i18n.svelte';
	import { Scale } from '$lib/icons';

	const lang = $derived(getLang());

	type Section = { id: string; title: string; content: string };

	const enSections: Section[] = [
		{
			id: 'about',
			title: '1. About phoxia tools',
			content:
				'phoxia tools (tools.phoxia.org) is a free developer toolsite operated by Phoxia (Lucas Christian). ' +
				'It provides client-side utilities for developers: JSON formatting, Base64 encoding, UUID generation, ' +
				'JWT inspection, CPF/CNPJ generation (for testing), and more.\n\n' +
				'All tools run entirely in your browser. No user accounts or subscriptions are required. ' +
				'Source code is available at github.com/phoxia-org/phoxia-tools under AGPLv3.'
		},
		{
			id: 'acceptable-use',
			title: '2. Acceptable use',
			content:
				'You may use phoxia tools for any lawful purpose. You may not:\n\n' +
				'Use CPF or CNPJ generators to create fraudulent documents or impersonate real individuals or companies. ' +
				'These tools are strictly for software testing and development purposes.\n\n' +
				'Attempt to gain unauthorized access to any server or system associated with phoxia tools.\n' +
				'Interfere with the website\'s availability (e.g., denial-of-service attacks).\n' +
				'Use automated tools to scrape the site in ways that degrade performance for other users.\n' +
				'Use phoxia tools to distribute malware, spam, or illegal content.'
		},
		{
			id: 'no-warranty',
			title: '3. No warranty on outputs',
			content:
				'All tools are provided "as is" and "as available," without warranty of any kind. ' +
				'Phoxia does not warrant that outputs are error-free, accurate, or fit for any particular purpose.\n\n' +
				'Always verify tool outputs before using them in production systems, security-sensitive contexts, or legal documents. ' +
				'Phoxia is not responsible for any damages arising from the use of these tools.'
		},
		{
			id: 'intellectual-property',
			title: '4. Intellectual property',
			content:
				'Source code of phoxia tools is licensed under the GNU Affero General Public License v3.0 (AGPLv3). ' +
				'You may use, study, modify, and distribute it under the terms of that license. ' +
				'The full license text is available in our GitHub repository.\n\n' +
				'The Phoxia name, wordmark, and logo are part of Phoxia\'s project identity. ' +
				'Please do not use them in ways that imply endorsement or affiliation without prior written permission.'
		},
		{
			id: 'third-party',
			title: '5. Third-party services',
			content:
				'phoxia tools integrates the following third-party services (only when you consent to cookies):\n\n' +
				'Google Analytics 4: usage analytics. See policies.google.com/privacy\n' +
				'Google AdSense: advertising. See policies.google.com/technologies/ads\n\n' +
				'Phoxia is not responsible for the practices of these services. ' +
				'You can decline cookies at any time via the "Cookie settings" link in the footer.'
		},
		{
			id: 'limitation-of-liability',
			title: '6. Limitation of liability',
			content:
				'To the fullest extent permitted by applicable law, Phoxia and its contributors shall not be liable ' +
				'for any indirect, incidental, special, consequential, or punitive damages arising from your use of ' +
				'or inability to use phoxia tools, even if advised of the possibility of such damages.\n\n' +
				'This limitation applies regardless of the theory of liability: contract, tort, negligence, ' +
				'strict liability, or otherwise.'
		},
		{
			id: 'governing-law',
			title: '7. Governing law',
			content:
				'These terms are governed by the laws of Brazil. The Brazilian Data Protection Authority (ANPD) ' +
				'has jurisdiction over privacy matters under the LGPD (Lei Geral de Proteção de Dados, Law No. 13.709/2018).\n\n' +
				'For users in the European Union, we make reasonable efforts to comply with the GDPR. ' +
				'For users in other jurisdictions, we make reasonable efforts to comply with applicable local law.'
		},
		{
			id: 'changes',
			title: '8. Changes to these terms',
			content:
				'We may update these terms at any time. Material changes will be announced in our public GitHub repository ' +
				'(github.com/phoxia-org/phoxia-tools) at least 14 days before taking effect.\n\n' +
				'Continued use of phoxia tools after changes take effect constitutes acceptance of the revised terms.'
		},
		{
			id: 'contact',
			title: '9. Contact',
			content:
				'Questions about these terms: legal@phoxia.org\n' +
				'Privacy inquiries: privacy@phoxia.org\n' +
				'General contact: contact@phoxia.org'
		}
	];

	const ptSections: Section[] = [
		{
			id: 'about',
			title: '1. Sobre o phoxia tools',
			content:
				'O phoxia tools (tools.phoxia.org) é um site gratuito de ferramentas para desenvolvedores, operado pela Phoxia (Lucas Christian). ' +
				'Oferece utilitários client-side para devs: formatação de JSON, encoding Base64, geração de UUID, ' +
				'inspeção de JWT, geração de CPF/CNPJ (para testes), entre outros.\n\n' +
				'Todas as ferramentas rodam inteiramente no seu browser. Nenhuma conta de usuário ou assinatura é necessária. ' +
				'O código-fonte está disponível em github.com/phoxia-org/phoxia-tools sob a licença AGPLv3.'
		},
		{
			id: 'acceptable-use',
			title: '2. Uso aceitável',
			content:
				'Você pode usar o phoxia tools para qualquer finalidade lícita. Você não pode:\n\n' +
				'Usar os geradores de CPF ou CNPJ para criar documentos fraudulentos ou se passar por pessoas físicas ou jurídicas reais. ' +
				'Essas ferramentas são estritamente para fins de teste e desenvolvimento de software.\n\n' +
				'Tentar obter acesso não autorizado a qualquer servidor ou sistema associado ao phoxia tools.\n' +
				'Interferir na disponibilidade do site (ex.: ataques de negação de serviço).\n' +
				'Usar ferramentas automatizadas para raspar o site de forma que degrade a performance para outros usuários.\n' +
				'Usar o phoxia tools para distribuir malware, spam ou conteúdo ilegal.'
		},
		{
			id: 'no-warranty',
			title: '3. Sem garantia sobre os resultados',
			content:
				'Todas as ferramentas são fornecidas "como estão" e "conforme disponíveis", sem garantia de qualquer tipo. ' +
				'A Phoxia não garante que os resultados estejam livres de erros, sejam precisos ou adequados a qualquer finalidade específica.\n\n' +
				'Sempre verifique os resultados das ferramentas antes de utilizá-los em sistemas de produção, contextos de segurança ou documentos legais. ' +
				'A Phoxia não se responsabiliza por quaisquer danos decorrentes do uso dessas ferramentas.'
		},
		{
			id: 'intellectual-property',
			title: '4. Propriedade intelectual',
			content:
				'O código-fonte do phoxia tools é licenciado sob a GNU Affero General Public License v3.0 (AGPLv3). ' +
				'Você pode usar, estudar, modificar e distribuí-lo sob os termos dessa licença. ' +
				'O texto completo da licença está disponível em nosso repositório no GitHub.\n\n' +
				'O nome Phoxia, logotipo e identidade visual são de propriedade da Phoxia. ' +
				'Por favor, não os utilize de forma que implique endosso ou afiliação sem autorização prévia e por escrito.'
		},
		{
			id: 'third-party',
			title: '5. Serviços de terceiros',
			content:
				'O phoxia tools integra os seguintes serviços de terceiros (somente com seu consentimento):\n\n' +
				'Google Analytics 4: analytics de uso. Veja policies.google.com/privacy\n' +
				'Google AdSense: publicidade. Veja policies.google.com/technologies/ads\n\n' +
				'A Phoxia não se responsabiliza pelas práticas desses serviços. ' +
				'Você pode recusar cookies a qualquer momento pelo link "Configurações de cookies" no rodapé.'
		},
		{
			id: 'limitation-of-liability',
			title: '6. Limitação de responsabilidade',
			content:
				'Na máxima extensão permitida pela lei aplicável, a Phoxia e seus colaboradores não serão responsáveis ' +
				'por quaisquer danos indiretos, incidentais, especiais, consequenciais ou punitivos decorrentes do uso ou ' +
				'da impossibilidade de uso do phoxia tools, mesmo que tenham sido avisados da possibilidade de tais danos.\n\n' +
				'Essa limitação se aplica independentemente da teoria de responsabilidade: contrato, ato ilícito, ' +
				'negligência, responsabilidade objetiva ou outra.'
		},
		{
			id: 'governing-law',
			title: '7. Lei aplicável',
			content:
				'Estes termos são regidos pelas leis do Brasil. A Autoridade Nacional de Proteção de Dados (ANPD) ' +
				'tem jurisdição sobre questões de privacidade nos termos da LGPD (Lei nº 13.709/2018).\n\n' +
				'Para usuários na União Europeia, envidamos esforços razoáveis para cumprir o GDPR. ' +
				'Para usuários em outras jurisdições, envidamos esforços razoáveis para cumprir a legislação local aplicável.'
		},
		{
			id: 'changes',
			title: '8. Alterações nestes termos',
			content:
				'Podemos atualizar estes termos a qualquer momento. Mudanças relevantes serão anunciadas em nosso repositório público no GitHub ' +
				'(github.com/phoxia-org/phoxia-tools) pelo menos 14 dias antes de entrarem em vigor.\n\n' +
				'O uso contínuo do phoxia tools após as mudanças entrarem em vigor constitui aceitação dos termos revisados.'
		},
		{
			id: 'contact',
			title: '9. Contato',
			content:
				'Dúvidas sobre estes termos: legal@phoxia.org\n' +
				'Questões de privacidade: privacy@phoxia.org\n' +
				'Contato geral: contact@phoxia.org'
		}
	];

	const sections = $derived(lang === 'pt-BR' ? ptSections : enSections);
	const lastUpdated = $derived(
		lang === 'pt-BR'
			? 'Última atualização: 27 de junho de 2026 · Versão 1.0'
			: 'Last updated: June 27, 2026 · Version 1.0'
	);
</script>

<svelte:head>
	<title>{t().seo.siteName} • {t().termsPage.title}</title>
	<meta name="description" content={t().seo.termsDescription} />
	<meta property="og:title" content={t().seo.siteName + ' • ' + t().termsPage.title} />
	<meta property="og:description" content={t().seo.termsDescription} />
	<meta property="og:url" content="https://tools.phoxia.org/terms" />
	<meta property="og:type" content="website" />
	<meta name="twitter:title" content={t().seo.siteName + ' • ' + t().termsPage.title} />
	<meta name="twitter:description" content={t().seo.termsDescription} />
	<link rel="canonical" href="https://tools.phoxia.org/terms" />
</svelte:head>

<LegalLayout
	title={t().termsPage.title}
	icon={Scale}
	{lastUpdated}
	tocLabel={t().common.tocLabel}
	{sections}
/>
