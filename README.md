# PromptMetrics

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1.7-646CFF.svg)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-2.58.0-green.svg)](https://supabase.com)
[![License](https://img.shields.io/badge/License-Private-red.svg)](#license)

AI brand analytics: see how AI systems (ChatGPT, Gemini, Perplexity) perceive and describe your brand. Monitor positioning, compare with competitors, and use real-time dashboards and RankLLM-based document reranking.

## Features

- **AI brand monitoring** — How AIs describe your brand vs competitors
- **Multi-LLM comparison** — Dashboards across models
- **Document reranking** — RankLLM microservice (Python/FastAPI)
- **Security** — JWT verification, rate limiting, audit logs, API key protection, input sanitization (DOMPurify)

## Stack

- **Frontend:** React 18, TypeScript, Vite, Shadcn/UI, Tailwind, React Query
- **Backend:** Supabase (PostgreSQL, Auth, Edge Functions), RankLLM service (Docker)

## Quick start

**Prerequisites:** Node.js 18+ (or Bun), Supabase CLI

```bash
git clone https://github.com/adriannoes/promptmetrics.git
cd promptmetrics
npm install
cp env/env.example .env.local   # then set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
npm run security-check
npm run dev
```

**App:** http://localhost:5173 — use “Try Demo” on the landing page for a quick tour.

### Scripts

| Command | Description |
|--------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run test:run` | Run tests once |
| `npm run lint` | ESLint |
| `npm run security-check` | Env and security validation |
| `npm run quality-check` | Lint + test + security |

### RankLLM service

```bash
cd rank-llm-service
cp env.example .env   # optional overrides
docker-compose up
```

Set Supabase secrets for production: `RANKLLM_API_KEY`, `RANKLLM_SERVICE_URL`.

## Project layout

```
├── build/              # Vite, Tailwind, Vitest config
├── ci/                 # GitHub Actions, Lighthouse
├── config/             # ESLint, TypeScript, component config
├── env/                # Env templates (env.example, env.production.example)
├── public/             # Static assets, PWA
├── rank-llm-service/   # RankLLM microservice
├── scripts/            # security-check, integration tests
├── src/                # App source (components, pages, services, hooks)
└── supabase/           # Config, migrations, Edge Functions
```

## Security (public repo)

- **Secrets:** Use env vars only; `.gitignore` covers `.env*`, `supabase/.env`, and service secrets. No credentials in repo.
- **Edge Functions:** Use `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` from Supabase env; webhooks use `N8N_WEBHOOK_SECRET` and timing-safe comparison.
- **Submodule:** `rank_llm` is a git submodule — ensure that repo is public or acceptable to expose if you publish this one.
- **Optional:** Run `npm audit` and fix dev/prod dependencies as needed.

## Routes

| Path | Description |
|------|-------------|
| `/` | Landing |
| `/demo` | Demo (or “Try Demo”) |
| `/analysis` | Analysis |
| `/document-ranking` | RankLLM |
| `/admin` | Admin (role required) |

## License

Private and proprietary. All rights reserved.
