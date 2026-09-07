# Portfolio AI Helper

A portfolio-building prototype combining editable project pages with AI-assisted writing and résumé-text extraction.

The design exploration is about helping people turn scattered experience into a coherent portfolio while keeping generated text editable.

## What is implemented

- Portfolio and project creation, editing, and storage.
- File uploads and an attempted PDF-text extraction workflow.
- AI-generated project descriptions and structured profile drafts.
- A React interface backed by Express, PostgreSQL, and Drizzle ORM.

Profile URLs are passed to the model as text; the current server does not retrieve GitHub or LinkedIn pages. Generated claims require review against the original material.

## Local setup

Use Node.js 22 LTS, npm, and a disposable PostgreSQL development database. Set these variables in your shell or development environment:

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string |
| `AI_INTEGRATIONS_OPENAI_API_KEY` | Server-side model credential |
| `AI_INTEGRATIONS_OPENAI_BASE_URL` | OpenAI-compatible endpoint supplied with your credential |
| `PORT` | Optional server port; defaults to `5000` |

The code uses Replit integration variable names. A local `.env` file is not automatically loaded by the current scripts. Do not commit credentials.

```sh
npm ci
npm run db:push  # Applies the schema: use your development database only
npm run dev
```

Open `http://localhost:5000`. Startup seeds sample portfolio data if the users table is empty.

```sh
npm run check
npm run build
npm start
```

## Code map

- `client/src/` — portfolio interface and editing flows.
- `server/routes.ts` — portfolio APIs, uploads, and AI calls.
- `server/storage.ts` and `server/db.ts` — database operations.
- `shared/` — schemas and API definitions.
- `server/replit_integrations/` — model integration helpers.

## Prototype boundaries

Use sample material in a private development environment. Current routes lack user-level authorization, and uploaded files are served under `/uploads`. Upload validation, retention controls, and abuse protection are needed before public multi-user deployment. The PDF extraction path also needs compatibility testing against the installed `pdf-parse` version. Model calls can incur charges; review generated content before publishing it.
