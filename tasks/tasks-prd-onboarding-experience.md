## Relevant Files

- `src/pages/DomainSetup.tsx` – Página de onboarding onde o usuário cadastra o domínio e dispara o fluxo de análise.
- `src/pages/OrganizationHome.tsx` **→ será renomeada para** `src/pages/Home.tsx` – Dashboard principal personalizado por domínio.
- `src/pages/Analysis.tsx` – Página que exibe resultados de análise.
- `src/components/OrganizationDashboard.tsx` – Componente com métricas e CTA "Minha Análise".
- `src/components/SmartRedirect.tsx` – Garante redirecionamentos corretos entre `/domain-setup` e `/home` conforme tenha domínio.
- `src/services/redirectService.ts` – Lógica de redirecionamento pós-login.
- `src/App.tsx` – Configuração de rotas.

Edge Functions
- `supabase/functions/trigger-analysis/index.ts` – Dispara workflow no n8n.
- `supabase/functions/receive-analysis/index.ts` – Recebe resultados e grava no DB.

Documentação & Planos
- `product-mgmt/tasks/cleanup-plan.md` – Plano de remoção/refatoração.
- `docs/DOCS.md` – Contexto geral do projeto.
- `.env.example` – Variáveis de ambiente (adicionar `N8N_WEBHOOK_URL`).
- `supabase/config.toml` – Configuração local do Supabase.

### Notes

- Crie/atualize testes ao lado dos arquivos (`*.test.tsx`).
- Use `npm test` para rodar a suíte Jest.
- Chamadas externas (ex.: n8n) devem usar HTTPS/TLS; nunca expor segredos em código.

---

## Tasks

### MVP (rodar localmente com fluxo completo)

- [x] **0.0 Setup Local Mínimo (via MCP)**
  - [x] 0.1 Criar/atualizar `.env.example` e `.env.local` com `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `N8N_WEBHOOK_URL`.
  - [x] 0.2 Obter URL e anon key via MCP: `mcp_supabase_get_project_url` e `mcp_supabase_get_anon_key`.
  - [x] 0.3 Deployar/atualizar Edge Functions via MCP (`mcp_supabase_deploy_edge_function`).
  - [x] 0.4 Validar com `mcp_supabase_get_logs` (edge-function) se as funções respondem em ambiente remoto.
  
  Obs.: `get-analysis-data` já ativo (v17). `trigger-analysis` (v38), `receive-analysis` (v41) e `submit-waitlist` (v43) implantadas.

- [x] **1.0 Limpeza da Codebase**
  - [x] 1.1 Remover páginas: `demo-airbnb`, `Lovable`, `MyRank`, `Changelog`.
  - [x] 1.2 Remover diretórios de componentes órfãos: `components/lovable`, `components/myrank`.
  - [x] 1.3 Atualizar `cleanup-plan.md` marcando itens concluídos.
  - [x] 1.4 Garantir que o build roda sem referências quebradas.

- [ ] **2.0 Refatorar OrganizationHome → Home**
  - [x] 2.1 Renomear arquivo `OrganizationHome.tsx` para `Home.tsx`.
  - [x] 2.2 Ajustar todos os imports que apontam para `OrganizationHome`.
  - [x] 2.3 Atualizar rotas em `App.tsx` – remover rota antiga `/organization`, manter `/home`.
  - [x] 2.4 Atualizar `redirectService.ts` (padronizar retorno `/home`).
  - [x] 2.5 Revisar `SmartRedirect.tsx` para respeitar regra: sem domínio → `/domain-setup`; com domínio → `/home`.
  - [ ] 2.6 Ajustar redirecionamento em `DomainSetup.tsx` para usar `/home` (sem slug), alinhado com rotas e `redirectService`.

  Relevant Files (progresso 2.0)
  - `src/pages/Home.tsx` – substituído pelo conteúdo adaptado do antigo `OrganizationHome` (sem dependência de `slug`).
  - `src/pages/OrganizationHome.tsx` – removido.
  - `src/App.tsx` – confirmado `/home` como rota protegida; `/organization` removida.
  - `src/pages/Home.test.tsx` – testes unitários para carregamento de organização e estados de autorização/analítica.
  - `src/services/redirectService.test.ts` – testes unitários de redirecionamento pós-login.
  - `src/components/SmartRedirect.test.tsx` – testes de integração leves cobrindo sem domínio → `/domain-setup` e com domínio em `/domain-setup` → `/home`.

- [ ] **3.0 Fluxo de Análise (happy-path)**
  - [x] 3.1 Em `DomainSetup.tsx`, confirmar chamada a `trigger-analysis` após salvar domínio.
    - [x] 3.1.1 Criar `src/pages/DomainSetup.test.tsx` cobrindo sucesso (2xx/simulado) e erro no invoke.
  - [x] 3.2 Verificar variável de ambiente `N8N_WEBHOOK_URL` em `.env.local`.
  - [x] 3.3 Garantir que `trigger-analysis` retorna 2xx ou simulador dev.
    - [x] 3.3.1 Documentar smoke test com `curl` e leitura de logs das Edge Functions.
  - [ ] 3.4 Garantir que `receive-analysis` faz upsert correto em `analysis_results`.
    - [x] 3.4.1 Criar migração adicionando UNIQUE em `analysis_results(domain)` para suportar `onConflict: 'domain'`.
    - [ ] 3.4.2 Smoke test via `curl` no `receive-analysis` verificando upsert idempotente por domínio.
  - [ ] 3.5 Criar seed SQL opcional com exemplo de `analysis_results` para testes locais.
  - [ ] 3.6 Documentar teste manual: (a) salvar domínio → (b) observar Home em progresso → (c) inserir um `analysis_results` ou postar no `receive-analysis` → (d) ver Home mudar para "Ver Análise".

  Relevant Files (progresso 3.0)
  - `src/pages/DomainSetup.tsx` – submit salva domínio e dispara `trigger-analysis`.
  - `src/pages/DomainSetup.test.tsx` – testes de sucesso/erro do invoke e validação de domínio.
  - `src/tests/setup.ts` – polyfills de `IntersectionObserver`/`ResizeObserver` para suportar `framer-motion` nos testes.
  - `supabase/functions/trigger-analysis/index.ts` – integração com n8n (ou simulação em dev).
  - `supabase/functions/receive-analysis/index.ts` – upsert dos resultados no DB.
  - `supabase/migrations/<timestamp>-add-unique-constraint-analysis-results-domain.sql` – adiciona UNIQUE(domain) em `analysis_results`.
  - `supabase/migrations/20250809194000-add-unique-constraint-analysis-results-domain.sql` – adiciona UNIQUE(domain) com limpeza de duplicados.
  - `supabase/seed/analysis_results_sample.sql` – seed de exemplo para testes locais.
  - `docs/n8n-payload-structure.md` – adicionada nota sobre fallback de simulação quando `N8N_WEBHOOK_URL` não está configurada.

- [ ] **4.0 Home Personalizado**
  - [ ] 4.1 No novo `Home.tsx`, buscar organização pelo `organization_id` do usuário.
  - [ ] 4.2 Mostrar estados: "Análise em Progresso" vs "Ver Análise".
  - [ ] 4.3 Implementar polling simples (30 s) até análise concluída.
  - [ ] 4.4 Botão "Minha Análise" redireciona para `/analysis` com domínio em query param ou contexto.
  - [ ] 4.5 Textos/i18n mínimos (PT-BR) e acessibilidade básica (roles/aria) para o CTA e estados.

- [ ] **5.0 Página Analysis (primeiro resultado)**
  - [ ] 5.1 Receber domínio via state / localStorage.
  - [ ] 5.2 Buscar dados em `analysis_results` e exibir.
  - [ ] 5.3 Mostrar skeleton enquanto carrega & mensagem de erro se falhar.
  - [ ] 5.4 Garantir responsividade e acessibilidade básica.
  - [ ] 5.5 Validar com um dataset real (por ex., payload do `demo-pm3`) para conferir layout mínimo.

---

### Melhorias Pós-MVP

- [ ] **6.0 Realtime Completo**
  - [ ] 6.1 Substituir polling por Supabase Realtime no canal `analysis_results`.
  - [ ] 6.2 Testar latência e fallback para polling quando websocket falhar.

- [ ] **7.0 Hardening de Edge Functions**
  - [ ] 7.1 Implementar idempotência em `trigger-analysis` (tabela `analysis_requests`).
  - [ ] 7.2 Adicionar assinatura HMAC (n8n → `receive-analysis`).
  - [ ] 7.3 Métricas estruturadas com `supabase.functions.invocations.insert()`.
  - [ ] 7.4 Rastrear `request_id` do DomainSetup até `receive-analysis` (log de correlação).

- [ ] **8.0 Reanálise Manual**
  - [ ] 8.1 Adicionar botão "Nova Análise" na Home.
  - [ ] 8.2 Bloquear spam (rate-limit via função DB `is_rate_limited`).

- [ ] **9.0 UX & UI Enhancements**
  - [ ] 9.1 Modal de progresso com etapas (DomainSetup & Home).
  - [ ] 9.2 Toasts e emails via Supabase SMTP.
  - [ ] 9.3 Dark mode friendly.
  - [ ] 9.4 Breadcrumb e histórico simples na página Analysis.

- [ ] **10.0 Observabilidade & Métricas**
  - [ ] 10.1 Dash Supabase Analytics – monitorar functions.
  - [ ] 10.2 Log pipeline de erros Pipefy → dashboard admin.
  - [ ] 10.3 Métricas de sucesso do PRD (TTFA, conclusão onboarding, clique CTA) por evento custom.

---

### Roadmap Resumido
1. **Semana 1** – Tasks 0-3 (setup local, build rodando, análise chegando).
2. **Semana 2** – Tasks 4-5 (UI/UX mínimo + exibição do resultado).
3. **Semana 3+** – Melhorias 6-10 conforme feedback.
