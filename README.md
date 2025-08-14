## PromptMetrics – Analytics de Marca com IA

Plataforma que analisa como sistemas de IA (ChatGPT, Gemini, Perplexity) descrevem sua marca na web. O objetivo é dar visibilidade competitiva e recomendações acionáveis para melhorar sua presença em respostas de IA.

### Sumário
- Visão Geral
- Tecnologias
- URLs e Navegação
- Como rodar localmente
- Estrutura de pastas
- Fluxos principais
- Testes
- Segurança e variáveis de ambiente
- Deploy
- Links úteis

---

### Visão Geral
O PromptMetrics oferece:
- Monitoramento de marca assistido por IA (comparativo com concorrentes)
- Inteligência competitiva baseada em recomendações geradas por IA
- Dashboard em tempo real com resultados de análise automatizada

Mais detalhes em `docs/DOCS.md`.

### Tecnologias
- Frontend: React 18 + TypeScript + Vite
- UI: Shadcn/ui + Radix UI + Tailwind CSS
- Estado/Dados: React Query (@tanstack/react-query) + React Context
- Autenticação/DB: Supabase (Auth, Postgres com RLS, Edge Functions)
- Workflow: n8n (pipeline de análise)
- Testes: Vitest + React Testing Library, Playwright (E2E)

### URLs e Navegação
- Landing: `/`
- Demo: `/demo`
- Home (dashboard): `/home`
- Analysis: `/analysis`
- Domain Setup (onboarding): `/domain-setup`
- Admin: `/admin` (apenas admin)

### Como rodar localmente
Pré‑requisitos:
- Node.js 18+
- npm

Passos:
```bash
npm ci
npm run dev
```
Acesse `http://localhost:8080`.

Variáveis de ambiente:
- Crie `.env.local` com base em `.env.example` na raiz (nunca comite segredos).
- Necessárias: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `N8N_WEBHOOK_URL`.

### Estrutura de pastas (resumo)
- `src/contexts/` – Autenticação, idioma e acessibilidade
- `src/integrations/supabase/` – Cliente Supabase e tipos
- `src/pages/` – Páginas de rota (Home, Analysis, DomainSetup, etc.)
- `src/components/` – Componentes UI (Shadcn/ui) e específicos (ex.: `OrganizationDashboard`)
- `supabase/functions/` – Edge Functions (`trigger-analysis`, `receive-analysis`, `submit-waitlist`)
- `supabase/migrations/` – Schema do banco

### Fluxos principais
- Autenticação: Supabase Auth + modo Demo
- Onboarding: `/domain-setup` → configura domínio → redireciona para `/home`
- Análise: `trigger-analysis` chama n8n → resultados inseridos por `receive-analysis` → `Home` exibe progresso/resultado

### Testes
Comandos principais:
```bash
# Executa toda a suíte unitária (Vitest + RTL)
npm test

# Filtra por arquivo específico (ex.: página Analysis)
npm run test -- src/pages/Analysis.test.tsx

# E2E (Playwright)
npm run test:e2e

# Lighthouse (mobile)
npm run lighthouse:mobile && npm run lighthouse:check
```
Notas:
- Para diagnóstico de realtime nos testes, use `localStorage.setItem('VITE_DISABLE_REALTIME','true')` quando necessário.

### Segurança e variáveis de ambiente
- Nunca exponha chaves sensíveis; use `.env.local` e mantenha um `.env.example` de referência.
- Recomendado uso de HTTPS/TLS para chamadas externas (n8n, APIs, etc.).

### Deploy
- Build: `npm run build`
- Preview estático: `npm run preview`
- Hospedagem atual: Lovable. Supabase gerencia DB/Auth/Functions.

### Links úteis
- Documentação detalhada: `docs/DOCS.md`
- Edge Functions: `supabase/functions/`
- Banco de dados e migrações: `supabase/migrations/`
- UI base: `src/components/ui/`
