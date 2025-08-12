## Relevant Files

- `src/pages/Analysis.tsx` – Página protegida que recebe `?domain=` e renderiza o Dashboard 2.0 quando há `analysis_data` completo.
- `src/components/analysis/AnalysisDashboard.tsx` – Componente principal do Dashboard 2.0 (abas, gráficos e cards) consumindo dados reais.
- `src/components/analysis/AnalysisDashboard.test.tsx` – Testes unitários dos mapeamentos de `analysis_data` e render básico por aba.
- `src/hooks/useRealTimeAnalysis.ts` – Assinatura Realtime da `analysis_results` filtrada por domínio (fallback para snapshot ao carregar).
- `src/pages/Analysis.test.tsx` – Testes de integração de rota, parsing de domínio e estados (skeleton/erro).
- `supabase/functions/receive-analysis/index.ts` – Ingestão (n8n → Supabase), normalização de metadados e upsert por domínio.
- `supabase/migrations/*.sql` – Migrações relacionadas a `analysis_results` (UNIQUE(domain), eventuais colunas futuras).
- `.env.example` – Exemplos de variáveis (diagnóstico Realtime e chaves públicas). Nunca commitar segredos reais.

### Notes

- Crie/atualize testes ao lado dos arquivos (por exemplo: `MyComponent.tsx` e `MyComponent.test.tsx`).
- Use `npm test` (Vitest) ou filtre por arquivo com `npm run test -- src/caminho/arquivo.test.tsx`.
- Chamadas externas (Edge Functions, n8n) devem usar HTTPS/TLS; nunca exponha segredos no front. Utilize variáveis via `.env.example`.
- Siga `docs/instructions/process-task-list.mdc`: ao concluir uma sub‑tarefa, marque `[x]`, e pause para aprovação antes de iniciar a próxima.
- Mantenha a seção “Relevant Files” atualizada conforme arquivos forem criados/alterados.

## Tasks

- [x] 0.0 Preparação e Configuração
  - [x] 0.1 Criar/atualizar `.env.example` com chaves/flags de diagnóstico (sem segredos reais):
        - `VITE_DISABLE_REALTIME=` (vazio → Realtime habilitado)
        - `VITE_SUPABASE_URL=` e `VITE_SUPABASE_ANON_KEY=` (placeholders para front)
        - Para Edge Functions: `N8N_HMAC_SECRET=` (apenas ambiente do servidor; não expor no front)
        - Todas as integrações devem usar HTTPS/TLS
  - [x] 0.2 Garantir scripts rápidos (≤60s): `npm run lint`, `npm run typecheck`, `npm test`.

- [ ] 1.0 Roteamento e Carregamento de Dados da página `/analysis` (auth guard, `?domain=` com fallbacks, snapshot inicial)
  - [x] 1.1 Fazer parse de `?domain=` e normalizar com `extractDomain` (remover protocolo/`www.`/trailing `/`).
  - [x] 1.2 Fallback em cascata quando `?domain=` ausente: `localStorage.lastAnalyzedDomain` → `lastSavedWebsiteUrl` → `lastSavedDomain`.
  - [x] 1.3 Proteger rota com `ProtectedRoute` (permitir demo quando aplicável) e exibir skeleton inicial.
  - [x] 1.4 Buscar o último registro em `analysis_results` por domínio (order `updated_at desc`, fallback `created_at`).
  - [x] 1.5 Persistir `lastAnalyzedDomain` no `localStorage` ao carregar dados válidos.
  - [x] 1.6 Estados: skeleton, erro (`role="alert"`), vazio (mensagem amigável e instrução para iniciar análise).
  - [ ] 1.7 Testes em `src/pages/Analysis.test.tsx`: parsing, normalização, cascata de fallbacks, ordering e estados (skeleton/erro/vazio).

- [ ] 2.0 UI e Componentização do Dashboard 2.0 replicando `/demo` (abas: Dashboard, AI Analysis, Competitors, Strategic Insights)
  - [x] 2.1 Criar/ajustar `src/components/analysis/AnalysisDashboard.tsx` com tabs e layout responsivo.
  - [x] 2.2 Mapear `analysis_data` real para cada aba, reusando o que for possível dos componentes de `src/components/demo/*` como referência.
  - [x] 2.3 Implementar componentes de apresentação pequenos (cards/tabelas/gráficos com Recharts) com fallbacks quando campos estiverem ausentes.
  - [x] 2.4 Exibir cabeçalho com domínio e "Last updated" (formatação relativa e absoluta; timezone seguro).
  - [x] 2.5 Empty states por aba com mensagens claras e acessíveis.
  - [x] 2.6 Testes em `src/components/analysis/AnalysisDashboard.test.tsx` cobrindo render mínimo por aba e mapeamentos essenciais.
  - [ ] 2.7 Testes (complemento): validar "cliente primeiro" em todas as abas aplicáveis e Top 5 + "Others" com soma/contagem corretas.

- [ ] 3.0 Realtime Supabase para `analysis_results` (assinatura por domínio, atualização reativa com fallback para snapshot)
  - [ ] 3.1 Integrar `useRealTimeAnalysis(domain)` na página `/analysis` para refetch quando houver INSERT/UPDATE do domínio.
  - [ ] 3.2 Debounce (≥300ms) e throttling de fetch (≥2s) para evitar flood de re-render.
  - [ ] 3.3 Fallback automático para snapshot quando `isConnected === false`; retomar realtime ao reconectar.
  - [x] 3.4 Flag `VITE_DISABLE_REALTIME` para forçar polling-only em diagnóstico (documentar no `.env.example`).
  - [ ] 3.5 Testes: ampliar `useRealTimeAnalysis.test.tsx` e criar integração leve na `/analysis` simulando evento.

- [ ] 4.0 UX: regras de apresentação (cliente primeiro, Top 5 + “Others”, “Last updated”), i18n (EN/PT‑BR) e A11y (skeleton/erros)
  - [ ] 4.1 Aplicar regra "cliente primeiro" nas listas e gráficos (quando houver cliente-alvo).
  - [ ] 4.2 Consolidar Top 5 e agrupar restantes em "Others" com contagem/soma adequada.
  - [ ] 4.3 I18n: adicionar chaves no `LanguageContext` para rótulos, abas, empty states e mensagens de erro (EN/PT‑BR).
  - [ ] 4.4 Acessibilidade: foco visível nos tabs; `aria-selected`, `role=tablist/tab/panel`; mensagens com `aria-live` quando apropriado.
  - [ ] 4.5 Documentar padrões de formatação de datas e números; garantir consistência cross-locale.
  - [ ] 4.6 Testes de acessibilidade e i18n básicos (chaves presentes e renderizadas corretamente).

- [ ] 5.0 Testes (TDD) cobrindo mapeamentos por aba e integração da `/analysis`; Telemetria mínima (events `analysis.*`)
  - [ ] 5.1 Escrever testes antes/ao lado dos componentes (unit e integração leve) e manter snapshots controlados.
  - [ ] 5.2 Cobrir: parsing/fallback do domínio, ordering por `updated_at`, render mínimo por aba, empty states e erros; regra "cliente primeiro"; Top 5 + "Others"; fallback de "Last updated".
  - [x] 5.3 Teste de integração: navegar para `/analysis?domain=...` e validar render do header + "Last updated".
  - [x] 5.4 Telemetria: instrumentar eventos `analysis.view_opened`, `analysis.tab_changed`, `analysis.data_loaded` (no-op seguro se não houver backend de analytics).
  - [ ] 5.5 Atualizar `README.md`/`docs/DOCS.md` com como rodar os testes: `npm test` e filtros por arquivo.

- [ ] 6.0 Ajustes mínimos nas Edge Functions para metadados/versionamento de payload e orientação de segurança (HTTPS/TLS)
  - [ ] 6.1 `receive-analysis`: garantir `updated_at` coerente, `payload_version`, e normalização de campos opcionais.
  - [ ] 6.2 Documentar versão do payload em `docs/payload/n8n-payload-structure.md` e exemplo atualizado em `docs/payload/n8n-payload-example`.
  - [ ] 6.3 Recomendar HTTPS/TLS nas integrações e uso de segredos via variáveis de ambiente; atualizar `.env.example` se necessário.
  - [ ] 6.4 Smoke test com `curl` autenticado (Bearer `$SUPABASE_ANON_KEY`) validando upsert por domínio e refresh em tempo real.
  - [ ] 6.5 `receive-analysis`: validar `x-signature = base64(HMAC_SHA256(body, N8N_HMAC_SECRET))`. Bypass controlado em dev via flag de ambiente. Rejeitar com 4xx quando inválido.