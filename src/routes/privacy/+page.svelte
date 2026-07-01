<script lang="ts">
	import LegalLayout from '$lib/components/LegalLayout.svelte';
	import { t, getLang } from '$lib/i18n/i18n.svelte';
	import { ShieldCheck } from '$lib/icons';

	const lang = $derived(getLang());

	type Section = { id: string; title: string; content: string };

	const enSections: Section[] = [
		{
			id: 'who-we-are',
			title: '1. Who we are',
			content:
				'Phoxia Tools is a free developer toolsite at tools.phoxia.org, operated by Phoxia ' +
				'(Lucas Christian). All tools run entirely in your browser. Your inputs never leave your device.\n\n' +
				'Source code: github.com/phoxia-org/phoxia-tools (AGPLv3)\n' +
				'Contact: privacy@phoxia.org'
		},
		{
			id: 'what-we-collect',
			title: '2. What we collect',
			content:
				'All tools run client-side. Your inputs (JWT tokens, passwords, CPFs, JSON, etc.) are never sent to any server.\n\n' +
				'If you accept cookies, we collect:\n\n' +
				'Usage analytics via Google Analytics 4: which tools you use, time on page, traffic source. Your inputs are never collected.\n\n' +
				'Advertising data via Google AdSense: Google may use cookies to show relevant ads based on your browsing activity.\n\n' +
				'Server logs: our hosting provider (Vercel) automatically logs your IP address, request path, and HTTP status. Retained for 30 days for security and operational purposes.',
		},
		{
			id: 'never-collect',
			title: '3. What we never collect',
			content:
				'The content of any tool input (passwords, tokens, CPFs, JSON, etc.).\n' +
				'No user accounts or email addresses.\n' +
				'No payment information.\n' +
				'No cross-site tracking beyond what Google Analytics and AdSense do with your consent.\n' +
				'No browser fingerprinting by Phoxia.',
		},
		{
			id: 'consent',
			title: '4. Consent and cookies',
			content:
				'Before setting any analytics or advertising cookies, we ask for your explicit consent via the banner shown on your first visit.\n\n' +
				'Your consent preference is stored in your browser\'s localStorage under the key "phoxia-consent" as { value, version, timestamp }. ' +
				'No consent data is sent to our servers.\n\n' +
				'You can withdraw consent at any time via the "Cookie settings" link in the footer. This removes the stored preference and reloads the banner.\n\n' +
				'Cookies and local storage used on this site:\n\n' +
				'phoxia-consent\n' +
				'  Type: localStorage (not a cookie)\n' +
				'  Provider: Phoxia (first-party)\n' +
				'  Purpose: Stores your consent preference\n' +
				'  Category: Essential\n' +
				'  Retention: Until you clear browser storage or revoke consent\n\n' +
				'phoxia-lang\n' +
				'  Type: localStorage (not a cookie)\n' +
				'  Provider: Phoxia (first-party)\n' +
				'  Purpose: Stores your language preference (en / pt-BR)\n' +
				'  Category: Essential\n' +
				'  Retention: Until you clear browser storage\n\n' +
				'phoxia-mode\n' +
				'  Type: localStorage (not a cookie)\n' +
				'  Provider: Phoxia (first-party)\n' +
				'  Purpose: Stores your theme preference (dark / light / system)\n' +
				'  Category: Essential\n' +
				'  Retention: Until you clear browser storage\n\n' +
				'_ga\n' +
				'  Type: HTTP cookie\n' +
				'  Provider: Google LLC (third-party)\n' +
				'  Purpose: Distinguishes users for Google Analytics 4\n' +
				'  Category: Analytics\n' +
				'  Retention: 2 years\n\n' +
				'_ga_<container-id>\n' +
				'  Type: HTTP cookie\n' +
				'  Provider: Google LLC (third-party)\n' +
				'  Purpose: Persists session state in Google Analytics 4\n' +
				'  Category: Analytics\n' +
				'  Retention: 2 years\n\n' +
				'Google AdSense cookies\n' +
				'  Type: HTTP cookies (various names)\n' +
				'  Provider: Google LLC (third-party)\n' +
				'  Purpose: Ad delivery, frequency capping, and conversion tracking\n' +
				'  Category: Advertising\n' +
				'  Retention: Varies, see policies.google.com/technologies/ads\n\n' +
				'All analytics and advertising cookies are set only after you accept. Essential localStorage items are set on first visit regardless of consent.'
		},
		{
			id: 'legal-basis',
			title: '5. Legal basis',
			content:
				'Analytics and advertising: your explicit consent (LGPD Art. 7 VI / GDPR Art. 6(1)(a) / CCPA).\n\n' +
				'Server logs: legitimate interest in security and service availability (LGPD Art. 7 IX / GDPR Art. 6(1)(f)).\n\n' +
				'You may withdraw consent at any time without affecting the lawfulness of processing based on consent before its withdrawal.'
		},
		{
			id: 'retention',
			title: '6. Retention',
			content:
				'Server logs: 30-day rolling window, automatically purged by Vercel.\n\n' +
				'Google Analytics data: 14 months (configured in GA4 settings).\n\n' +
				'Your localStorage preferences persist until you clear your browser storage or revoke consent via "Cookie settings".'
		},
		{
			id: 'international',
			title: '7. International data transfers',
			content:
				'Phoxia itself does not transfer your data outside your browser. All tools run client-side and no tool input is sent to any server.\n\n' +
				'However, our third-party providers (Google Analytics, Google AdSense, Vercel) may process data in the United States or other jurisdictions. These providers rely on:\n\n' +
				'Standard Contractual Clauses (SCCs) approved by the European Commission, see Google\'s Data Processing Amendment at business.safety.google/adsprocessorterms.\n' +
				'EU-US Data Privacy Framework (Google LLC is certified).\n\n' +
				'Where applicable under LGPD (Art. 33), transfers to countries without an adequacy decision by the Brazilian ANPD are safeguarded by the SCCs referenced above.\n\n' +
				'If you have questions about cross-border data flows: privacy@phoxia.org'
		},
		{
			id: 'rights',
			title: '8. Your rights (LGPD / GDPR / CCPA)',
			content:
				'Regardless of where you are located, you have the right to:\n\n' +
				'Access: request a copy of any personal data we hold.\n' +
				'Rectification: request correction of inaccurate data.\n' +
				'Deletion: request deletion of your data.\n' +
				'Portability: receive your data in a machine-readable format.\n' +
				'Objection: object to processing based on legitimate interest.\n' +
				'Complaint: ANPD (Brazil: gov.br/anpd), ICO (UK), or the DPA of your EU member state.\n\n' +
				'For data processed by Google, visit myaccount.google.com.\n' +
				'For all other requests: privacy@phoxia.org'
		},
		{
			id: 'security',
			title: '9. Security',
			content:
				'All connections use TLS 1.3. Because all tools run in your browser, no tool input is transmitted. There is nothing on our servers to compromise.\n\n' +
				'To report a security vulnerability: security@phoxia.org. We respond within 72 hours.'
		},
		{
			id: 'changes',
			title: '10. Changes to this policy',
			content:
				'Material changes will be announced in our public GitHub repository ' +
				'(github.com/phoxia-org/phoxia-tools) at least 14 days before taking effect. ' +
				'The "last updated" date at the top of this page reflects the most recent revision.'
		},
		{
			id: 'contact',
			title: '11. Contact',
			content:
				'Privacy inquiries: privacy@phoxia.org\n' +
				'Security vulnerabilities: security@phoxia.org\n' +
				'General contact: contact@phoxia.org\n' +
				'ANPD (Brazil): gov.br/anpd'
		}
	];

	const ptSections: Section[] = [
		{
			id: 'who-we-are',
			title: '1. Quem somos',
			content:
				'O Phoxia Tools é um site gratuito de ferramentas para desenvolvedores em tools.phoxia.org, ' +
				'operado pela Phoxia (Lucas Christian). Todas as ferramentas rodam inteiramente no seu browser. Seus inputs nunca saem do seu dispositivo.\n\n' +
				'Código-fonte: github.com/phoxia-org/phoxia-tools (AGPLv3)\n' +
				'Contato: privacy@phoxia.org'
		},
		{
			id: 'what-we-collect',
			title: '2. O que coletamos',
			content:
				'Todas as ferramentas rodam no lado do cliente. Seus inputs (tokens JWT, senhas, CPFs, JSON, etc.) nunca são enviados a nenhum servidor.\n\n' +
				'Se você aceitar cookies, coletamos:\n\n' +
				'Analytics de uso via Google Analytics 4: quais ferramentas você usa, tempo na página, fonte de tráfego. Seus inputs nunca são coletados.\n\n' +
				'Dados de publicidade via Google AdSense: o Google pode usar cookies para exibir anúncios relevantes com base na sua atividade de navegação.\n\n' +
				'Logs do servidor: nosso provedor de hospedagem (Vercel) registra automaticamente seu endereço IP, caminho da requisição e status HTTP. Retidos por 30 dias para fins de segurança e operação.',
		},
		{
			id: 'never-collect',
			title: '3. O que nunca coletamos',
			content:
				'O conteúdo de nenhum input das ferramentas (senhas, tokens, CPFs, JSON, etc.).\n' +
				'Sem contas de usuário ou endereços de e-mail.\n' +
				'Sem informações de pagamento.\n' +
				'Sem rastreamento cross-site além do que Google Analytics e AdSense fazem com seu consentimento.\n' +
				'Sem fingerprinting de navegador pela Phoxia.',
		},
		{
			id: 'consent',
			title: '4. Consentimento e cookies',
			content:
				'Antes de definir qualquer cookie de analytics ou publicidade, solicitamos seu consentimento explícito via banner exibido na sua primeira visita.\n\n' +
				'Sua preferência de consentimento é armazenada no localStorage do seu browser sob a chave "phoxia-consent" como { value, version, timestamp }. ' +
				'Nenhum dado de consentimento é enviado aos nossos servidores.\n\n' +
				'Você pode revogar o consentimento a qualquer momento pelo link "Configurações de cookies" no rodapé. Isso remove a preferência armazenada e recarrega o banner.\n\n' +
				'Cookies e armazenamento local usados neste site:\n\n' +
				'phoxia-consent\n' +
				'  Tipo: localStorage (não é um cookie)\n' +
				'  Fornecedor: Phoxia (primeira parte)\n' +
				'  Finalidade: Armazena sua preferência de consentimento\n' +
				'  Categoria: Essencial\n' +
				'  Retenção: Até você limpar o armazenamento ou revogar consentimento\n\n' +
				'phoxia-lang\n' +
				'  Tipo: localStorage (não é um cookie)\n' +
				'  Fornecedor: Phoxia (primeira parte)\n' +
				'  Finalidade: Armazena sua preferência de idioma (pt-BR / en)\n' +
				'  Categoria: Essencial\n' +
				'  Retenção: Até você limpar o armazenamento do browser\n\n' +
				'phoxia-mode\n' +
				'  Tipo: localStorage (não é um cookie)\n' +
				'  Fornecedor: Phoxia (primeira parte)\n' +
				'  Finalidade: Armazena sua preferência de tema (escuro / claro / sistema)\n' +
				'  Categoria: Essencial\n' +
				'  Retenção: Até você limpar o armazenamento do browser\n\n' +
				'_ga\n' +
				'  Tipo: Cookie HTTP\n' +
				'  Fornecedor: Google LLC (terceira parte)\n' +
				'  Finalidade: Distingue usuários para o Google Analytics 4\n' +
				'  Categoria: Analytics\n' +
				'  Retenção: 2 anos\n\n' +
				'_ga_<id-do-container>\n' +
				'  Tipo: Cookie HTTP\n' +
				'  Fornecedor: Google LLC (terceira parte)\n' +
				'  Finalidade: Mantém o estado da sessão no Google Analytics 4\n' +
				'  Categoria: Analytics\n' +
				'  Retenção: 2 anos\n\n' +
				'Cookies do Google AdSense\n' +
				'  Tipo: Cookies HTTP (vários nomes)\n' +
				'  Fornecedor: Google LLC (terceira parte)\n' +
				'  Finalidade: Exibição de anúncios, limite de frequência e conversões\n' +
				'  Categoria: Publicidade\n' +
				'  Retenção: Variável, veja policies.google.com/technologies/ads\n\n' +
				'Todos os cookies de analytics e publicidade são definidos apenas após sua aceitação. Itens essenciais em localStorage são definidos na primeira visita, independentemente do consentimento.'
		},
		{
			id: 'legal-basis',
			title: '5. Base legal',
			content:
				'Analytics e publicidade: seu consentimento explícito (LGPD Art. 7 VI / GDPR Art. 6(1)(a) / CCPA).\n\n' +
				'Logs do servidor: interesse legítimo em segurança e disponibilidade do serviço (LGPD Art. 7 IX / GDPR Art. 6(1)(f)).\n\n' +
				'Você pode revogar o consentimento a qualquer momento, sem afetar a licitude do tratamento realizado com base no consentimento antes de sua revogação.'
		},
		{
			id: 'retention',
			title: '6. Retenção',
			content:
				'Logs do servidor: janela rotativa de 30 dias, purgados automaticamente pela Vercel.\n\n' +
				'Dados do Google Analytics: 14 meses (configurado nas definições do GA4).\n\n' +
				'Suas preferências no localStorage persistem até que você limpe o armazenamento do browser ou revogue o consentimento via "Configurações de cookies".'
		},
		{
			id: 'international',
			title: '7. Transferência internacional de dados',
			content:
				'A Phoxia em si não transfere seus dados para fora do seu browser. Todas as ferramentas rodam no lado do cliente e nenhum input é enviado a servidores.\n\n' +
				'No entanto, nossos provedores terceiros (Google Analytics, Google AdSense, Vercel) podem processar dados nos Estados Unidos ou em outras jurisdições. Esses provedores se baseiam em:\n\n' +
				'Cláusulas Contratuais Padrão (SCCs) aprovadas pela Comissão Europeia, veja a Emenda de Processamento de Dados do Google em business.safety.google/adsprocessorterms.\n' +
				'EU-US Data Privacy Framework (Google LLC é certificada).\n\n' +
				'Quando aplicável sob a LGPD (Art. 33), transferências para países sem decisão de adequação pela ANPD são resguardadas pelas SCCs mencionadas acima.\n\n' +
				'Dúvidas sobre fluxos transfronteiriços de dados: privacy@phoxia.org'
		},
		{
			id: 'rights',
			title: '8. Seus direitos (LGPD / GDPR / CCPA)',
			content:
				'Independentemente de onde você estiver, você tem o direito de:\n\n' +
				'Acesso: solicitar uma cópia de quaisquer dados pessoais que mantemos.\n' +
				'Retificação: solicitar a correção de dados incorretos.\n' +
				'Exclusão: solicitar a exclusão dos seus dados.\n' +
				'Portabilidade: receber seus dados em formato legível por máquina.\n' +
				'Oposição: opor-se ao tratamento baseado em interesse legítimo.\n' +
				'Reclamação: ANPD (Brasil: gov.br/anpd), ICO (Reino Unido) ou a autoridade de proteção de dados do seu país.\n\n' +
				'Para dados tratados pelo Google, acesse myaccount.google.com.\n' +
				'Para demais solicitações: privacy@phoxia.org'
		},
		{
			id: 'security',
			title: '9. Segurança',
			content:
				'Todas as conexões utilizam TLS 1.3. Como todas as ferramentas rodam no seu browser, nenhum input é transmitido. Não há nada em nossos servidores que possa ser comprometido.\n\n' +
				'Para reportar uma vulnerabilidade de segurança: security@phoxia.org. Respondemos em até 72 horas.'
		},
		{
			id: 'changes',
			title: '10. Alterações nesta política',
			content:
				'Mudanças relevantes serão anunciadas em nosso repositório público no GitHub ' +
				'(github.com/phoxia-org/phoxia-tools) pelo menos 14 dias antes de entrarem em vigor. ' +
				'A data de "última atualização" no topo desta página reflete a revisão mais recente.'
		},
		{
			id: 'contact',
			title: '11. Contato',
			content:
				'Questões de privacidade: privacy@phoxia.org\n' +
				'Vulnerabilidades de segurança: security@phoxia.org\n' +
				'Contato geral: contact@phoxia.org\n' +
				'ANPD (Brasil): gov.br/anpd'
		}
	];

	const sections = $derived(lang === 'pt-BR' ? ptSections : enSections);
	const lastUpdated = $derived(
		lang === 'pt-BR'
			? 'Última atualização: 1 de julho de 2026 · Versão 1.1'
			: 'Last updated: July 1, 2026 · Version 1.1'
	);
</script>

<svelte:head>
	<title>{t().seo.siteName} • {t().privacyPage.title}</title>
	<meta name="description" content={t().seo.privacyDescription} />
	<meta property="og:title" content={t().seo.siteName + ' • ' + t().privacyPage.title} />
	<meta property="og:description" content={t().seo.privacyDescription} />
	<meta property="og:url" content="https://tools.phoxia.org/privacy" />
	<meta property="og:type" content="website" />
	<meta name="twitter:title" content={t().seo.siteName + ' • ' + t().privacyPage.title} />
	<meta name="twitter:description" content={t().seo.privacyDescription} />
	<link rel="canonical" href="https://tools.phoxia.org/privacy" />
</svelte:head>

<LegalLayout
	title={t().privacyPage.title}
	icon={ShieldCheck}
	{lastUpdated}
	tocLabel={t().common.tocLabel}
	{sections}
/>
