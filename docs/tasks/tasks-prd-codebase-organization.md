## Relevant Files

- `src/components/analysis/*` - Componentes específicos de análise; mover para `src/features/analysis/components/`.
- `src/components/admin/*` - Componentes administrativos; mover para `src/features/admin/components/`.
- `src/components/demo/*` - Componentes de demo/marketing; avaliar arquivamento ou mover para `src/features/demo/`.
- `src/components/*` (genéricos) - Componentes compartilhados; mover o que for cross‑feature para `src/shared/components/`.
- `src/components/ui/*` - Design system (Shadcn/ui); manter como está.
- `src/hooks/*` - Hooks por domínio para `src/features/*/hooks/` e hooks genéricos em `src/shared/hooks/`.
- `src/services/*` - Serviços por domínio para `src/features/*/services/` e serviços/unidades de infra em `src/shared/services/`.
- `src/lib/*` - Utilidades de biblioteca; mover para `src/shared/lib/`.
- `src/utils/*` - Utilidades genéricas; mover para `src/shared/utils/`.
- `src/contexts/*` - Providers globais; mover para `src/shared/contexts/`.
- `src/pages/*` - Páginas de rota; criar `src/routes/` com wrappers finos e delegar lógica para `src/features/*`.
- `src/types/*` - Tipos por domínio para `src/features/*/types/` e tipos compartilhados em `src/shared/types/`.
- `src/constants/PromptAnalysisData.ts` - Dados/constantes de análise; mover para `src/features/analysis/lib/` (ou `constants/`).
- `vite.config.ts` - Ajustar aliases e revisão de `build.sourcemap` para produção.
- `tsconfig.json`, `tsconfig.app.json` - Reforçar flags de TypeScript (gradual) e paths `@/*`.
- `eslint.config.js` - Ativar avisos para código não usado e regras TS/React; manter rápido de adotar.
- `package.json` - Atualizar `name`, `repository`, `license`, `author`.
- `.gitignore` - Ignorar `reports/` e artefatos (Playwright/Lighthouse, etc.).
- `e2e/*` - Verificar seletores/rotas após reorganização; manter baseURL.
- `README.md`, `docs/DOCS.md` - Atualizar estrutura de pastas e scripts.
- `docs/env.example` → `.env.example` (raiz) - Centralizar exemplo de variáveis.
- `public/lovable-uploads/*` - Avaliar remoção ou mover para `public/assets/` se ainda referenciado.

Testes existentes a revisar após migração:

- `src/components/analysis/AnalysisDashboard.test.tsx`
- `src/components/analysis/dataTransforms.test.ts`
- `src/components/AnalysisResults.test.tsx`
- `src/components/OrganizationDashboard.test.tsx`
- `src/components/FeatureCard.test.tsx`
- `src/components/SectionHeader.test.tsx`
- `src/hooks/useRealTimeAnalysis.test.tsx`
- `src/pages/Analysis.test.tsx`
- `src/pages/Home.test.tsx`
- `src/pages/OrganizationSetup.test.tsx`
- `src/pages/DomainSetup.test.tsx`
- `src/integrations/supabase/__tests__/client-env.test.ts`
- `src/lib/format.test.ts`
- `src/services/redirectService.test.ts`
- `src/utils/domain.test.ts`

### Notes

- Manter testes próximos ao código (ex.: `MyComponent.tsx` e `MyComponent.test.tsx`).
- Antes de mudanças significativas, escrever/atualizar testes (TDD) e manter cobertura.
- Usar HTTPS/TLS para links externos e webhooks; não comitar segredos. Fornecer placeholders em `.env.example`.
- Commits atômicos seguindo Conventional Commits.

## Tasks

- [ ] 1.0 Definir a nova estrutura por domínio/feature e mapeamento de arquivos
  - [x] 1.1 Criar diretórios: `src/features/{analysis,admin,onboarding,demo}/{components,hooks,services,types,lib}` e `src/shared/{components,hooks,services,types,lib,utils,contexts}`
  - [ ] 1.2 Definir convenções de nomes (componentes PascalCase, hooks `useX`, serviços `*Service`, tipos `XProps/DTO`) e locais por domínio vs compartilhado
  - [x] 1.3 Propor aliases: manter `@/*` e adicionar `@shared/*` e `@features/*` no `tsconfig.app.json` (paths)
  - [x] 1.4 Elaborar mapeamento fonte→destino para pastas/arquivos atuais (incluindo `constants/PromptAnalysisData.ts` → `features/analysis/lib/`)
  - [ ] 1.5 Planejar commits atômicos e PRs pequenos (≤10 arquivos ou ≤300 linhas), com descrição clara (Conventional Commits)

- [ ] 2.0 Migrar código para `src/features/*` e `src/shared/*`, ajustando imports/aliases
  - [ ] 2.1 Mover `src/components/analysis/*` → `src/features/analysis/components/` e ajustar imports
  - [ ] 2.2 Mover `src/components/admin/*` → `src/features/admin/components/` e ajustar imports
  - [ ] 2.3 Avaliar `src/components/demo/*` e páginas `Demo*`/`BrandingDemo`/`SocialPlaceholders`: mover para `src/features/demo/` ou arquivar se não usadas
  - [ ] 2.4 Mover hooks de domínio: `useRealTimeAnalysis.ts` → `features/analysis/hooks/`, `useAdminUsers.ts` → `features/admin/hooks/`; hooks genéricos → `shared/hooks/`
  - [ ] 2.5 Mover serviços: `authService.ts`/`redirectService.ts` → `shared/services/` (se usados cross‑feature) e ajustar testes
  - [ ] 2.6 Mover `src/contexts/*` → `src/shared/contexts/` e atualizar imports em `src/App.tsx`
  - [ ] 2.7 Mover `src/lib/*` → `src/shared/lib/` e `src/utils/*` → `src/shared/utils/`; revisar `src/constants/*`
  - [ ] 2.8 Mover `src/types/{analysis,auth}.ts` para `features/analysis/types/` e `shared/types/` conforme escopo
  - [ ] 2.9 Criar `src/routes/` com wrappers finos (por ex.: `routes/AnalysisRoute.tsx`) e delegar UI/logic para `features/*`; atualizar `src/App.tsx`
  - [ ] 2.10 Atualizar aliases/paths no `tsconfig.app.json` e rodar compilação TS para garantir que todos os imports foram corrigidos

- [ ] 3.0 Higienizar artefatos e assets (reports, uploads, demos), e atualizar `.gitignore`
  - [ ] 3.1 Criar `reports/` e mover `lighthouse-report-mobile.json` e `test-results/` para lá
  - [ ] 3.2 Atualizar `.gitignore` para ignorar `reports/`, traces/screenshots de Playwright e artefatos temporários
  - [ ] 3.3 Auditar `public/lovable-uploads/`; se não referenciado, remover; se referenciado, mover para `public/assets/` e atualizar paths
  - [ ] 3.4 Rodar auditoria de dependências e remover as não usadas
        - `npx depcheck` — Audita dependências não utilizadas e arquivos não mapeados.
  - [ ] 3.5 Centralizar variáveis: mover `docs/env.example` para `.env.example` na raiz, garantir placeholders (sem segredos)
  - [ ] 3.6 Atualizar `README.md` e `docs/DOCS.md` com a nova árvore de pastas

- [ ] 4.0 Fortalecer qualidade (TS/ESLint em modo gradual), Vite sourcemaps e metadados do `package.json`
  - [ ] 4.1 ESLint: ativar `@typescript-eslint/no-unused-vars` como "warn" com `{ argsIgnorePattern: "^_" }`
  - [ ] 4.2 TypeScript (gradual): habilitar `strictNullChecks` e `noImplicitAny` inicialmente em diretórios `src/shared/**` e `src/features/analysis/**`; corrigir erros prioritários
  - [ ] 4.3 Vite: desabilitar sourcemaps em produção (`build.sourcemap = false` ou condicional por `mode`); manter em dev
  - [ ] 4.4 `package.json`: atualizar `name` (ex.: `promptmetrics-web`), `repository`, `license`, `author`
  - [ ] 4.5 Opcional: adicionar Husky + commitlint para reforçar Conventional Commits (fora do escopo se preferir simples)

- [ ] 5.0 Garantir estabilidade: atualizar testes, documentação e validar (lint/unit/E2E/Lighthouse)
  - [ ] 5.1 Atualizar imports dos testes listados em "Relevant Files" após migração
  - [ ] 5.2 Executar unit tests e corrigir falhas
        - `npm run test` — Roda a suíte unitária (Vitest + RTL).
  - [ ] 5.3 Executar E2E e revisar snapshots/rotas
        - `npm run test:e2e` — Executa testes E2E (Playwright) com servidor local e bypass de auth.
        - `npm run test:e2e:update` — Atualiza snapshots se necessário após alterações não funcionais.
  - [ ] 5.4 Executar lint e corrigir problemas essenciais
        - `npm run lint` — Roda o ESLint para encontrar problemas de qualidade.
  - [ ] 5.5 Executar Lighthouse (mobile) e validar metas
        - `npm run lighthouse:mobile` — Gera relatório de performance mobile no `reports/`.
        - `npm run lighthouse:check` — Verifica se as metas configuradas foram atingidas.
  - [ ] 5.6 Atualizar documentação (`README.md`, `docs/DOCS.md`) com novas rotas/estrutura e notas de segurança (HTTPS/TLS, `.env.example`).


### 1.4 Mapping fonte→destino (planejado)

- Análise
  - `src/components/analysis/AnalysisDashboard.tsx` → `src/features/analysis/components/AnalysisDashboard.tsx`
  - `src/components/analysis/dataTransforms.ts` → `src/features/analysis/lib/dataTransforms.ts`
  - `src/components/analysis/AnalysisDashboard.test.tsx` → `src/features/analysis/components/AnalysisDashboard.test.tsx`
  - `src/components/analysis/dataTransforms.test.ts` → `src/features/analysis/lib/dataTransforms.test.ts`
  - `src/hooks/useRealTimeAnalysis.ts` → `src/features/analysis/hooks/useRealTimeAnalysis.ts`
  - `src/hooks/useUserAnalysis.ts` → `src/features/analysis/hooks/useUserAnalysis.ts`
  - `src/constants/PromptAnalysisData.ts` → `src/features/analysis/lib/PromptAnalysisData.ts`
  - `src/components/AnalysisResults.tsx` → `src/features/analysis/components/AnalysisResults.tsx`
  - `src/components/AnalysisResults.test.tsx` → `src/features/analysis/components/AnalysisResults.test.tsx`
  - `src/components/AnalysisHistory.tsx` → `src/features/analysis/components/AnalysisHistory.tsx`
  - `src/components/AnalysisProgressModal.tsx` → `src/features/analysis/components/AnalysisProgressModal.tsx`

- Admin
  - `src/components/admin/AdminPromoteUser.tsx` → `src/features/admin/components/AdminPromoteUser.tsx`
  - `src/components/admin/AdminRoleFilter.tsx` → `src/features/admin/components/AdminRoleFilter.tsx`
  - `src/components/admin/AdminUserStats.tsx` → `src/features/admin/components/AdminUserStats.tsx`
  - `src/components/admin/AdminUserTable.tsx` → `src/features/admin/components/AdminUserTable.tsx`
  - `src/components/AdminUserManagement.tsx` → `src/features/admin/components/AdminUserManagement.tsx`
  - `src/hooks/useAdminUsers.ts` → `src/features/admin/hooks/useAdminUsers.ts`

- Onboarding
  - `src/pages/OrganizationSetup.tsx` → wrapper em `src/routes/OrganizationSetupRoute.tsx` + lógicas em `src/features/onboarding/*`
  - `src/pages/DomainSetup.tsx` → wrapper em `src/routes/DomainSetupRoute.tsx` + lógicas em `src/features/onboarding/*`
  - `src/components/OrganizationDashboard.tsx` → `src/features/onboarding/components/OrganizationDashboard.tsx`
  - `src/components/OrganizationHeader.tsx` → `src/features/onboarding/components/OrganizationHeader.tsx`

- Demo/Marketing
  - `src/components/demo/*` → `src/features/demo/components/*`
  - `src/pages/BrandingDemo.tsx` → `src/features/demo/components/BrandingDemo.tsx`
  - `src/pages/SocialPlaceholders.tsx` → `src/features/demo/components/SocialPlaceholders.tsx`
  - `src/pages/Demo.tsx` → `src/features/demo/components/DemoPage.tsx` (se for manter como página direta, fica em `routes/`)

- Compartilhados (shared)
  - `src/lib/*` → `src/shared/lib/*`
  - `src/utils/*` → `src/shared/utils/*`
  - `src/services/authService.ts` → `src/shared/services/authService.ts`
  - `src/services/redirectService.ts` → `src/shared/services/redirectService.ts`
  - `src/services/errorReporting.ts` → `src/shared/services/errorReporting.ts`
  - `src/contexts/*` → `src/shared/contexts/*`
  - `src/types/auth.ts` → `src/shared/types/auth.ts`
  - `src/types/analysis.ts` → `src/features/analysis/types/analysis.ts` (tipos de domínio)
  - `src/components/*` genéricos reutilizáveis (ex.: `FormField`, `PhoneInput`, `LoadingSpinner`, etc.) → `src/shared/components/*`

- Rotas
  - `src/pages/*` → `src/routes/*Route.tsx` wrappers finos e reexport dos componentes de `features/*`

