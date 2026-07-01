import type { LocaleShape } from './types';

const ptBR: LocaleShape = {
	nav: {
		home: 'Ferramentas',
		allTools: 'Todas as ferramentas',
		skipToContent: 'Pular para o conteúdo',
		toggleTheme: 'Alternar tema',
		toggleLang: 'Idioma',
		mainNavAria: 'Navegação principal'
	},
	home: {
		title: 'Ferramentas para devs que ficam no seu browser.',
		subtitle: 'Tudo roda localmente. Nenhum dado sai da sua máquina.',
		categories: { dev: 'Dev diário', text: 'Texto e encoding', br: 'Brasil', reference: 'Referência' }
	},
	seo: {
		homeTitle: 'Phoxia Tools • Ferramentas para devs que ficam no seu browser',
		homeDescription: 'Ferramentas gratuitas para devs que rodam direto no seu navegador. Formatador JSON, encode/decode Base64, inspetor JWT, testador de regex, gerador de hash, cron builder e mais. Nenhum dado enviado a servidores.',
		privacyDescription: 'Como o phoxia tools coleta, usa e protege seus dados. Política de privacidade para analytics e anúncios.',
		termsDescription: 'Termos de uso do phoxia tools: uso aceitável, propriedade intelectual, isenções e limitações de responsabilidade.',
		siteName: 'Phoxia Tools'
	},
	aria: {
		homeLogo: 'Phoxia Tools, início',
		footerNav: 'Navegação do rodapé',
		allTools: 'Todas as ferramentas',
		toc: 'Índice',
		discord: 'Phoxia no Discord',
		github: 'Phoxia Tools no GitHub'
	},
	tools: {
		json: {
			name: 'JSON Formatter', desc: 'Formata, minifica e valida JSON.',
			placeholder: '{"chave": "valor"}',
			errorSize: 'Erro: input excede o limite de 500 KB'
		},
		base64: {
			name: 'Base64', desc: 'Encode e decode de strings Base64.',
			placeholder: 'Texto ou string base64…',
			errorSize: 'Erro: input excede o limite de 500 KB'
		},
		uuid: {
			name: 'Gerador de UUID', desc: 'Gera UUIDs v4.',
			labelCount: 'Quantidade',
			generatedCount: '{n} UUIDs'
		},
		timestamp: {
			name: 'Timestamp Unix', desc: 'Converte entre epoch Unix e datas legíveis.',
			labelInput: 'Timestamp Unix ou data ISO', placeholder: '1609459200 ou 2021-01-01T00:00:00Z',
			parse: 'Converter', now: 'Agora',
			labelUnix: 'Unix (s)', labelUnixMs: 'Unix (ms)', labelIso: 'ISO 8601', labelUtc: 'UTC',
			errorInvalidTimestamp: 'Timestamp inválido', errorCannotParse: 'Não foi possível interpretar: "{input}"'
		},
		url: {
			name: 'Codificar/Decodificar URL', desc: 'Encode e decode de componentes de URL.',
			placeholder: 'https://exemplo.com/caminho?q=olá mundo',
			parseUrl: 'Analisar URL',
			errorInvalid: 'URL inválida: "{input}"'
		},
		case: {
			name: 'Formatar Texto', desc: 'Converte entre camelCase, snake_case, PascalCase e mais.',
			placeholder: 'olá mundo ou olaMundo ou ola-mundo…',
			labels: { camel: 'camelCase', pascal: 'PascalCase', snake: 'snake_case', screamingSnake: 'SCREAMING_SNAKE', kebab: 'kebab-case', upper: 'MAIÚSCULAS', lower: 'minúsculas' },
			examples: { camel: 'olaMundo', pascal: 'OlaMundo', snake: 'ola_mundo', screamingSnake: 'OLA_MUNDO', kebab: 'ola-mundo', upper: 'OLA MUNDO', lower: 'ola mundo' }
		},
		jwt: {
			name: 'JWT Inspector', desc: 'Decodifica e inspeciona tokens JWT.',
			labelToken: 'Token JWT', placeholder: 'Cole seu JWT aqui…',
			example: 'Exemplo',
			expired: 'Expirado', valid: 'Válido',
			header: 'Header', payload: 'Payload', signature: 'Assinatura',
			errorParts: 'Um JWT deve ter exatamente 3 partes separadas por "."',
			errorDecode: 'Falha ao decodificar JWT. Verifique se o token é um JSON Base64url válido.'
		},
		hash: {
			name: 'Gerador de Hash', desc: 'Gera hashes SHA-256, SHA-512 e MD5.',
			placeholder: 'Texto para gerar hash…',
			errorSize: 'Erro: input excede o limite de 500 KB'
		},
		password: {
			name: 'Gerador de Senha', desc: 'Gera senhas seguras com medidor de entropia.',
			labelLength: 'Tamanho', labelCount: 'Quantidade',
			labelUpper: 'A-Z', labelLower: 'a-z', labelDigits: '0-9', labelSymbols: '!@#…',
			entropy: 'Entropia', bits: 'bits',
			strength: { weak: 'Fraca', fair: 'Razoável', good: 'Boa', strong: 'Forte', veryStrong: 'Muito forte' }
		},
		httpStatus: {
			name: 'Status HTTP', desc: 'Referência de todos os códigos de status HTTP.',
			placeholder: 'Buscar por código, nome ou descrição…',
			noResults: 'Nenhum código encontrado para "{query}".',
			groups: {
				informational: '1xx Informativo',
				success: '2xx Sucesso',
				redirection: '3xx Redirecionamento',
				clientError: '4xx Erro do Cliente',
				serverError: '5xx Erro do Servidor'
			},
			codes: {
				'100': { name: 'Continue', desc: 'Servidor recebeu a requisição inicial; cliente deve continuar.' },
				'101': { name: 'Switching Protocols', desc: 'Servidor está trocando para o protocolo solicitado no cabeçalho Upgrade.' },
				'102': { name: 'Processing', desc: 'Servidor recebeu e está processando a requisição, sem resposta ainda.' },
				'103': { name: 'Early Hints', desc: 'Usado com cabeçalho Link para pré-carregar recursos enquanto o servidor prepara a resposta.' },
				'200': { name: 'OK', desc: 'Requisição bem-sucedida. Resposta depende do método: GET retorna recurso, POST retorna resultado.' },
				'201': { name: 'Created', desc: 'Requisição bem-sucedida e um novo recurso foi criado.' },
				'202': { name: 'Accepted', desc: 'Requisição aceita para processamento, mas ainda não concluída.' },
				'203': { name: 'Non-Authoritative Information', desc: 'Metadados retornados são de uma cópia de terceiros, não do servidor de origem.' },
				'204': { name: 'No Content', desc: 'Requisição bem-sucedida mas sem conteúdo no corpo da resposta.' },
				'205': { name: 'Reset Content', desc: 'Servidor solicita que o cliente redefina o documento que enviou esta requisição.' },
				'206': { name: 'Partial Content', desc: 'Servidor entregando apenas parte do recurso devido a um cabeçalho Range.' },
				'207': { name: 'Multi-Status', desc: 'Transmite informações sobre múltiplos recursos, adequado para múltiplos códigos de status.' },
				'208': { name: 'Already Reported', desc: 'Membros de uma ligação DAV já enumerados anteriormente nesta resposta.' },
				'226': { name: 'IM Used', desc: 'Servidor atendeu um GET para o recurso; resposta é uma representação do resultado.' },
				'300': { name: 'Multiple Choices', desc: 'Requisição tem mais de uma resposta possível. Usuário deve escolher uma.' },
				'301': { name: 'Moved Permanently', desc: 'Recurso movido permanentemente para nova URL. Atualize seus links.' },
				'302': { name: 'Found', desc: 'Recurso temporariamente movido para URL diferente. Continue usando a URL original.' },
				'303': { name: 'See Other', desc: 'Servidor redirecionando cliente para outro recurso, geralmente um GET.' },
				'304': { name: 'Not Modified', desc: 'Recurso em cache não foi modificado. Use a versão em cache.' },
				'305': { name: 'Use Proxy', desc: 'Recurso solicitado deve ser acessado através do proxy especificado.' },
				'307': { name: 'Temporary Redirect', desc: 'Recurso temporariamente movido. Repita a requisição com mesmo método para nova URL.' },
				'308': { name: 'Permanent Redirect', desc: 'Recurso permanentemente movido. Repita a requisição com mesmo método para nova URL.' },
				'400': { name: 'Bad Request', desc: 'Servidor não pode processar requisição devido a erro do cliente (sintaxe malformada).' },
				'401': { name: 'Unauthorized', desc: 'Autenticação é necessária e falhou ou não foi fornecida.' },
				'402': { name: 'Payment Required', desc: 'Reservado para uso futuro. Sistemas de pagamento digital podem usar este código.' },
				'403': { name: 'Forbidden', desc: 'Servidor entendeu a requisição mas se recusa a autorizá-la.' },
				'404': { name: 'Not Found', desc: 'Servidor não encontrou o recurso solicitado.' },
				'405': { name: 'Method Not Allowed', desc: 'Método de requisição conhecido mas não suportado pelo recurso de destino.' },
				'406': { name: 'Not Acceptable', desc: 'Servidor não pode produzir resposta que corresponda aos cabeçalhos Accept.' },
				'407': { name: 'Proxy Authentication Required', desc: 'Autenticação exigida por um servidor proxy.' },
				'408': { name: 'Request Timeout', desc: 'Servidor atingiu o tempo limite esperando pela requisição.' },
				'409': { name: 'Conflict', desc: 'Requisição conflita com o estado atual do recurso de destino.' },
				'410': { name: 'Gone', desc: 'Recurso de destino não está mais disponível no servidor de origem, sem endereço de encaminhamento.' },
				'411': { name: 'Length Required', desc: 'Servidor exige cabeçalho Content-Length para processar a requisição.' },
				'412': { name: 'Precondition Failed', desc: 'Uma ou mais condições nos cabeçalhos da requisição foram avaliadas como falsas.' },
				'413': { name: 'Content Too Large', desc: 'Entidade da requisição é maior que os limites definidos pelo servidor.' },
				'414': { name: 'URI Too Long', desc: 'URI da requisição é mais longa do que o servidor está disposto a interpretar.' },
				'415': { name: 'Unsupported Media Type', desc: 'Formato de mídia dos dados solicitados não é suportado pelo servidor.' },
				'416': { name: 'Range Not Satisfiable', desc: 'Servidor não pode atender ao intervalo de bytes solicitado.' },
				'417': { name: 'Expectation Failed', desc: 'Servidor não pode atender aos requisitos do cabeçalho Expect.' },
				'418': { name: "I'm a teapot", desc: 'Servidor se recusa a fazer café porque é um bule. (RFC 2324)' },
				'421': { name: 'Misdirected Request', desc: 'Requisição direcionada a um servidor incapaz de produzir resposta.' },
				'422': { name: 'Unprocessable Content', desc: 'Servidor entende o tipo de conteúdo, mas não pode processar as instruções.' },
				'423': { name: 'Locked', desc: 'O recurso sendo acessado está bloqueado.' },
				'424': { name: 'Failed Dependency', desc: 'Requisição falhou porque uma requisição anterior falhou.' },
				'425': { name: 'Too Early', desc: 'Servidor não está disposto a arriscar processar uma requisição que pode ser repetida.' },
				'426': { name: 'Upgrade Required', desc: 'Servidor recusa requisição usando protocolo atual. Atualize para TLS/1.3+.' },
				'428': { name: 'Precondition Required', desc: 'Servidor de origem exige que a requisição seja condicional.' },
				'429': { name: 'Too Many Requests', desc: 'Usuário enviou muitas requisições em um determinado período (limite de taxa).' },
				'431': { name: 'Request Header Fields Too Large', desc: 'Servidor recusando requisição porque campos de cabeçalho são muito grandes.' },
				'451': { name: 'Unavailable For Legal Reasons', desc: 'Servidor negou requisição devido a demandas legais. (RFC 7725)' },
				'500': { name: 'Internal Server Error', desc: 'Servidor encontrou uma condição inesperada que o impediu de atender a requisição.' },
				'501': { name: 'Not Implemented', desc: 'Servidor não suporta a funcionalidade necessária para atender a requisição.' },
				'502': { name: 'Bad Gateway', desc: 'Servidor recebeu uma resposta inválida de um servidor upstream.' },
				'503': { name: 'Service Unavailable', desc: 'Servidor temporariamente incapaz de lidar com a requisição (sobrecarregado ou em manutenção).' },
				'504': { name: 'Gateway Timeout', desc: 'Servidor não recebeu resposta em tempo hábil de um servidor upstream.' },
				'505': { name: 'HTTP Version Not Supported', desc: 'Versão HTTP usada na requisição não é suportada pelo servidor.' },
				'506': { name: 'Variant Also Negotiates', desc: 'Negociação de conteúdo transparente resulta em referência circular.' },
				'507': { name: 'Insufficient Storage', desc: 'Servidor incapaz de armazenar a representação necessária para concluir a requisição.' },
				'508': { name: 'Loop Detected', desc: 'Servidor detectou um loop infinito ao processar a requisição.' },
				'510': { name: 'Not Extended', desc: 'Extensões adicionais à requisição são necessárias para o servidor atendê-la.' },
				'511': { name: 'Network Authentication Required', desc: 'Cliente precisa se autenticar para obter acesso à rede.' }
			}
		},
		cpf: { name: 'Gerador de CPF', desc: 'Gera números de CPF brasileiros válidos para testes.' },
		cnpj: { name: 'Gerador de CNPJ', desc: 'Gera números de CNPJ brasileiros válidos para testes.' },
		faker: {
			name: 'Gerador de Pessoas',
			desc: 'Gera dados fictícios de pessoas para testes. Selecione um país, escolha os campos, copie como JSON ou CSV.',
			labelCount: 'Registros',
			labelCountry: 'País',
			json: 'JSON', csv: 'CSV',
			countries: {
				br: 'Brasil', us: 'Estados Unidos', gb: 'Reino Unido',
				pt: 'Portugal', ar: 'Argentina', mx: 'México', it: 'Itália',
				ca: 'Canadá', au: 'Austrália', de: 'Alemanha', fr: 'França',
				es: 'Espanha', jp: 'Japão', in: 'Índia'
			},
			fields: {
				nome: 'Nome', cpf: 'CPF', cnpj: 'CNPJ', telefone: 'Telefone',
				email: 'Email', cep: 'CEP', cidade: 'Cidade', estado: 'Estado',
				name: 'Nome', phone: 'Telefone', postalCode: 'CEP',
				state: 'Estado / Região', city: 'Cidade',
				ssn: 'SSN', ein: 'EIN', nino: 'NINO', nif: 'NIF',
				niss: 'NISS', dni: 'DNI', cuit: 'CUIT', rfc: 'RFC', curp: 'CURP',
				codiceFiscale: 'Codice Fiscale', partitaIva: 'P. IVA',
				sin: 'SIN', tfn: 'TFN', steuerId: 'Steuer-ID',
				nir: 'NIR', siret: 'SIRET', myNumber: 'My Number',
				aadhaar: 'Aadhaar', pan: 'PAN'
			}
		},
		regex: {
			name: 'Regex Tester', desc: 'Testa expressões regulares com destaque em tempo real.',
			labelPattern: 'Padrão', labelFlags: 'Flags', hintEmptyPattern: 'Digite um padrão para começar a buscar',
			labelTestString: 'Texto de teste',
			labelMatches: 'Matches', matchCount: '{n} matches',
			labelCaptureGroups: 'Grupos de captura', matchLabel: 'Match {n}',
			flags: { global: 'Global', caseInsensitive: 'Case-insensitive', multiline: 'Multilinha', dotAll: 'Dot-all' }
		},
		markdown: {
			name: 'Markdown Preview', desc: 'Visualiza Markdown com suporte a GitHub Flavored Markdown.',
			split: 'Dividido', preview: 'Preview',
			copyHtml: 'Copiar HTML',
			example: '# Título\n\n**Negrito** e *itálico*.\n\n- Item 1\n- Item 2\n\n`código inline`\n\n```js\nconsole.log("olá");\n```'
		},
		curl: {
			name: 'cURL Converter', desc: 'Converte comandos cURL para fetch ou axios.',
			labelCommand: 'Comando cURL', placeholder: 'curl https://api.exemplo.com …',
			example: 'Exemplo',
			fetch: 'fetch', axios: 'axios',
			errorNotCurl: 'Não é um comando curl',
			errorNoUrl: 'Nenhuma URL encontrada no comando curl'
		},
		cron: {
			name: 'Cron Builder', desc: 'Monta e explica expressões cron visualmente.',
			labelExpression: 'Expressão cron (min hora dom mês dow)', placeholder: '* * * * *',
			examples: { everyMinute: 'Cada minuto', every15Min: 'A cada 15 min', dailyAt9: 'Diário às 9h', weekdaysAt9: 'Dias úteis às 9h', everySunday: 'Todo domingo', firstOfMonth: 'Primeiro do mês' },
			labels: { min: 'min', hour: 'hora', dom: 'dom', month: 'mês', dow: 'dow' },
			runs: 'Executa', nextExecutions: 'Próximas 5 execuções',
			errorInvalid: 'Expressão cron inválida',
			dayNames: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
			monthNames: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
			descriptions: {
				everyMinute: 'cada minuto', everyHour: 'cada hora', everyDay: 'cada dia',
				everyMonth: 'cada mês', everyDow: 'cada dia da semana',
				everyNMinutes: 'a cada {n} minutos', everyNHours: 'a cada {n} horas',
				atHour: 'às {hour}:00', on: 'em {desc}', minuteOf: 'minuto {min} de {hour}',
				everyN: 'a cada {n}', atField: 'em {field} {part}'
			}
		},
		slug: {
			name: 'Gerador de Slugs', desc: 'Converte texto em slugs para URLs.',
			labelInput: 'Texto de entrada', placeholder: 'Seu texto aqui…',
			labelSeparator: 'Separador', labelSlug: 'Slug'
		},
		diff: {
			name: 'Comparador de Texto', desc: 'Compara dois textos lado a lado.',
			labelOriginal: 'Original', labelModified: 'Modificado',
			added: '+{n} adicionados', removed: '−{n} removidos', noDifferences: 'Sem diferenças'
		},
		openapi: {
			name: 'OpenAPI Viewer', desc: 'Valida e visualiza specs OpenAPI 3.x.',
			labelSpec: 'Spec OpenAPI 3.x (JSON)',
			errorMissing: 'Campo "openapi" ausente. Cole uma spec JSON OpenAPI 3.x válida.',
			errorParse: 'Erro de parsing JSON: {msg}',
			untitled: 'Sem título',
			endpointCount: '{n} endpoints',
			operationId: 'operationId', responses: 'Respostas'
		}
	},
	consent: {
		message: 'Cookies ajudam a manter esse projeto vivo e gratuito para todos.',
		bannerPrivacy: 'Veja como usamos cookies',
		accept: 'Aceitar',
		decline: 'Recusar',
		privacyLink: 'Política de Privacidade',
		revoke: 'Configurações de cookies'
	},
	footer: {
		tagline: 'Ferramentas que rodam no seu browser.',
		privacy: 'Privacidade',
		terms: 'Termos',
		contact: 'Contato',
		github: 'GitHub',
		license: 'AGPLv3',
		legal: 'AGPLv3 · tools.phoxia.org',
		discord: 'Discord'
	},
	common: {
		dark: 'Escuro',
		light: 'Claro',
		system: 'Sistema',
		copy: 'Copiar',
		copied: 'Copiado!',
		clear: 'Limpar',
		generate: 'Gerar',
		encode: 'Codificar',
		decode: 'Decodificar',
		format: 'Formatar',
		minify: 'Minificar',
		error: 'Erro',
		inputPlaceholder: 'Cole o input aqui…',
		outputPlaceholder: 'O resultado aparecerá aqui',
		inputTooLarge: 'Input excede o limite de 500 KB.',
		tocLabel: 'Conteúdo',
		valid: 'Válido',
		invalid: 'Inválido',
		count: 'Quantidade',
		copyAll: 'Copiar todos',
		example: 'Exemplo',
		parse: 'Converter',
		now: 'Agora',
		length: 'Tamanho',
		original: 'Original',
		modified: 'Modificado',
		noResults: 'Nenhum resultado para "{query}".'
	},
	privacyPage: { title: 'Política de Privacidade' },
	termsPage: { title: 'Termos de Uso' }
};

export default ptBR;
