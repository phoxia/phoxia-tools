# Phoxia Tools

Free developer tools that run entirely in your browser. No data leaves your machine.

[https://tools.phoxia.org](https://tools.phoxia.org)

## Tools

### Developer

- **JSON** : Format, validate, minify, and tree-view JSON
- **Base64** : Encode/decode Base64 text
- **UUID** : Generate UUID v4
- **Timestamp** : Unix timestamp ↔ human-readable date
- **JWT** : Decode JWT header and payload
- **Hash** : MD5, SHA-1, SHA-256, SHA-512
- **Password** : Generate random passwords with configurable strength
- **Regex** : Test and explain regular expressions
- **cURL** : Parse cURL commands to readable HTTP requests
- **Cron** : Describe cron expressions in plain English
- **Diff** : Side-by-side text diff

### Text

- **URL** : Encode/decode URL components
- **Case** : Convert between casing styles (camel, snake, kebab, pascal, etc.)
- **Slug** : Generate URL slugs from text
- **Markdown** : Preview Markdown as HTML

### Reference

- **HTTP Status** : Reference of HTTP status codes with descriptions
- **OpenAPI** : Parse and display OpenAPI/Swagger specs

### Brazil

- **CPF** : Validate and generate CPF numbers (pt-BR only)
- **CNPJ** : Validate and generate CNPJ numbers (pt-BR only)
- **Faker** : Generate realistic Brazilian fake data (pt-BR only)

## Stack

| Layer     | Choice                           |
| --------- | -------------------------------- |
| Framework | SvelteKit (SSR + client)         |
| Styling   | Tailwind CSS 4                   |
| Icons     | Lucide Svelte                    |
| Fonts     | Geist, Inter, JetBrains Mono     |
| Testing   | Vitest                           |
| Hosting   | Vercel (adapter-vercel)          |
| Analytics | Google Analytics (consent-gated) |

## Features

- **Client-side only** : all tools run in the browser, no server-side processing
- **i18n** : English (en-US) and Brazilian Portuguese (pt-BR)
- **Dark/light theme** : system-preference detection with manual toggle
- **Consent banner** : GDPR-compliant cookie/analytics consent
- **Responsive** : works on desktop and mobile

## Developing

```sh
npm install
npm run dev
```

## Building

```sh
npm run build
npm run preview
```

## Testing

```sh
npm test
npm run test:watch
```

## License

[AGPLv3](LICENSE)
