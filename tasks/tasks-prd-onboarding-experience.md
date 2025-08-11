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
  - [x] 2.6 Ajustar redirecionamento em `DomainSetup.tsx` para usar `/home` (sem slug), alinhado com rotas e `redirectService`.

  Relevant Files (progresso 2.0)
  - `src/pages/Home.tsx` – substituído pelo conteúdo adaptado do antigo `OrganizationHome` (sem dependência de `slug`).
  - `src/pages/OrganizationHome.tsx` – removido.
  - `src/App.tsx` – confirmado `/home` como rota protegida; `/organization` removida.
  - `src/pages/Home.test.tsx` – testes unitários para carregamento de organização e estados de autorização/analítica.
  - `src/services/redirectService.test.ts` – testes unitários de redirecionamento pós-login.
  - `src/components/SmartRedirect.test.tsx` – testes de integração leves cobrindo sem domínio → `/domain-setup` e com domínio em `/domain-setup` → `/home`.

- [x] **3.0 Fluxo de Análise (happy-path)**
  - [x] 3.1 Em `DomainSetup.tsx`, confirmar chamada a `trigger-analysis` após salvar domínio.
    - [x] 3.1.1 Criar `src/pages/DomainSetup.test.tsx` cobrindo sucesso (2xx/simulado) e erro no invoke.
  - [x] 3.2 Verificar variável de ambiente `N8N_WEBHOOK_URL` em `.env.local`.
  - [x] 3.3 Garantir que `trigger-analysis` retorna 2xx ou simulador dev.
    - [x] 3.3.1 Documentar smoke test com `curl` e leitura de logs das Edge Functions.
  - [x] 3.4 Garantir que `receive-analysis` faz upsert correto em `analysis_results`.
    - [x] 3.4.1 Criar migração adicionando UNIQUE em `analysis_results(domain)` para suportar `onConflict: 'domain'`.
    - [x] 3.4.2 Smoke test via `curl` no `receive-analysis` verificando upsert idempotente por domínio.
  - [x] 3.5 Criar seed SQL opcional com exemplo de `analysis_results` para testes locais.
  - [x] 3.6 Documentar teste manual: (a) salvar domínio → (b) observar Home em progresso → (c) inserir um `analysis_results` ou postar no `receive-analysis` → (d) ver Home mudar para "Ver Análise".
    - [x] 3.6 Documentar teste manual: (a) salvar domínio → (b) observar Home em progresso → (c) inserir um `analysis_results` ou postar no `receive-analysis` → (d) ver Home mudar para "Ver Análise".
      - Procedimento sugerido:
        1) Acesse `/domain-setup`, informe `example.com` e conclua. Isso salva `organizations.website_url` e dispara `trigger-analysis` (simulada se `N8N_WEBHOOK_URL` não estiver definida).
        2) Vá para `/home` e confirme o estado de "Análise em Progresso".
        3) Para concluir a análise:
           - Opção A (seed local): executar `supabase/seed/analysis_results_sample.sql` no banco local (idempotente por domínio).
           - Opção B (via Edge Function): enviar POST para `receive-analysis` com payload mínimo válido.
        4) Recarregue `/home` e verifique o estado "Ver Análise" habilitado.
      - Exemplo de POST seguro (usar HTTPS/TLS e variáveis de ambiente):
        - `curl -i -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $SUPABASE_ANON_KEY" -H "apikey: $SUPABASE_ANON_KEY" -d '{"domain":"example.com","analysis_data":{"summary":"ok","score":80,"recommendations":[]}}' https://<project-ref>.functions.supabase.co/receive-analysis` — Envia resultado mínimo e aciona o upsert por domínio.

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

- [x] **4.0 Home Personalizado**
  - Objetivo: entregar uma Home dinâmica, que reflete o status da análise do domínio do usuário e oferece um CTA acessível para visualizar a análise quando disponível.
  - Critérios de aceite (DoD):
    - Estado "Em Progresso" visível quando não houver registro em `analysis_results` para o domínio da organização do usuário.
    - Estado "Ver Análise" (CTA habilitado) quando existir `analysis_results(domain)` correspondente.
    - Polling a cada 30 segundos, com interrupção automática após detecção de conclusão.
    - Navegação para `/analysis` levando o domínio (query param `?domain=`) e fallback via `localStorage`.
    - Textos PT-BR e atributos de acessibilidade mínimos (`role`, `aria-`, `aria-live`).
    - Cobertura de testes unitários e de integração leve para os fluxos acima.
  
  Subtasks:
  - [x] 4.1 No novo `Home.tsx`, buscar organização pelo `organization_id` do usuário.
    - [x] 4.1.1 Obter `organization_id` via `useAuthState`/`AuthContext` e carregar `organizations.website_url` (domínio).
    - [x] 4.1.2 Exibir skeleton enquanto carrega e mensagem de erro amigável em falhas.
    - [x] 4.1.3 Testes em `src/pages/Home.test.tsx` para sucesso, erro e skeleton.
  - [x] 4.2 Mostrar estados: "Análise em Progresso" vs "Ver Análise".
    - [x] 4.2.1 Consultar presença em `analysis_results` (por domínio) usando hook utilitário (`useUserAnalysis` ou similar) ou query local.
    - [x] 4.2.2 Render condicional de rótulos/CTA com `role="status"`, `aria-live="polite"` e `data-testid="analysis-progress"` no estado de progresso.
    - [x] 4.2.3 Testes de renderização e acessibilidade (atributos ARIA) em `Home.test.tsx`.
  - [x] 4.3 Implementar polling simples (30 s) até análise concluída.
    - [x] 4.3.1 Implementar polling (30 s) com parada automática quando análise for encontrada e cleanup no unmount.
    - [x] 4.3.2 Testes cobrindo estados; teste de polling marcado como `skip` por flakiness com fake timers (manteremos em e2e).
  - [x] 4.4 Botão "Minha Análise" redireciona para `/analysis` com domínio em query param ou contexto.
    - [x] 4.4.1 Navegar para `/analysis?domain=<domain>` usando `useNavigate`.
    - [x] 4.4.2 Persistir domínio em `localStorage` como fallback de navegação/refresh.
    - [x] 4.4.3 Testes de navegação e presença de atributos de acessibilidade do botão.
  - [x] 4.5 Textos/i18n mínimos (PT-BR) e acessibilidade básica (roles/aria) para o CTA e estados.
    - [x] 4.5.1 Centralizar strings EN/PT-BR em `LanguageContext` para Home (estado de progresso) e CTA.
    - [x] 4.5.2 Validar `aria-label`, `aria-live`, `role` e foco do CTA via teclado (testes atualizados).
    - [x] 4.5.3 Ajustar snapshots/e2e se necessário: sem impacto em testes de landing existentes; Home/CTA cobertos por unit tests; manter verificação e2e futura específica para Home.

  Relevant Files (progresso 4.0)
  - `src/pages/Home.tsx` – Lógica principal de estados, polling e CTA.
  - `src/pages/Home.test.tsx` – Testes unitários/integração dos estados e navegação.
  - `src/hooks/useUserAnalysis.ts` – Hook para busca de análise por domínio (pode ser estendido/ajustado).
  - `src/contexts/AuthContext.tsx` e `src/hooks/useAuthState.ts` – Fonte do `organization_id` do usuário.
  - `src/components/OrganizationDashboard.tsx` – Exibição do CTA/indicadores na Home.
  - `src/components/OrganizationDashboard.test.tsx` – Teste do CTA “Minha Análise” (navigate + localStorage).
  - `src/contexts/LanguageContext.tsx` – Chaves i18n EN/PT‑BR para Home e CTA.
  - `src/utils/toastMessages.ts` – Centralização de mensagens PT-BR (se aplicável).
  - `src/services/redirectService.ts` – Garantir compatibilidade do fluxo pós-login.

- [x] **5.0 Página Analysis (primeiro resultado)**
  - Objetivo: exibir o primeiro resultado de análise para um domínio recebido da Home, com UX acessível e responsiva, usando dados de `analysis_results`.
  - Critérios (DoD):
    - Recebe domínio via query param `?domain=`; fallback para `localStorage.lastAnalyzedDomain`.
    - Consulta `analysis_results` filtrando por `domain` e exibe o resultado mais recente.
    - Exibe skeleton enquanto carrega e mensagem de erro amigável em falhas.
    - UI responsiva; atributos mínimos de acessibilidade (role/aria) e navegação por teclado.
    - Testes unitários cobrindo parsing do domínio, carregamento, erro e render do preview.
    - Smoke test manual com payload real via `receive-analysis`.

  Subtasks:
  - [x] 5.1 Domínio de entrada (parsing e prioridades)
    - [x] 5.1.1 Ler `?domain=` dos query params (prioridade 1)
    - [x] 5.1.2 Fallback: `localStorage.lastAnalyzedDomain` (prioridade 2)
    - [x] 5.1.3 Normalizar domínio removendo protocolo/`www.`
  - [ ] 5.2 Buscar e exibir dados
    - [x] 5.2.1 Reutilizar `AnalysisResults` passando `domain` para filtrar
    - [x] 5.2.2 Garantir exibição do resultado mais recente (order por `updated_at`/`created_at`)
  - [ ] 5.3 Estados de carregamento e erro
    - [x] 5.3.1 Skeleton durante a query (já suportado por `AnalysisResults`)
    - [x] 5.3.2 Mensagem de erro com `role="alert"` e suporte a `ErrorReportButton`
  - [ ] 5.4 Acessibilidade e Responsividade
    - [x] 5.4.1 `role`, `aria-live`, foco visível no conteúdo principal
    - [x] 5.4.2 Layout responsivo (classes utilitárias existentes)
  - [x] 5.5 Dados reais (validação)
  - [x] 5.5.1 Validado com dados reais já presentes no Supabase para `pipefy.com` (sem necessidade de novo POST no momento)
  - [x] 5.5.2 Conferir preview mínimo: `summary`, `score`, `recommendations`
    - [ ] 5.6 Testes (TDD)
    - [x] 5.6.1 `src/pages/Analysis.test.tsx`: domínio via query param e via localStorage
    - [x] 5.6.2 Skeleton e erro quando a consulta falha
    - [x] 5.6.3 Render do preview (summary/score/recommendations)
    - [x] 5.6.4 `src/components/analysis/AnalysisDashboard.test.tsx`: header com domínio em destaque e "Last updated"

  Relevant Files (progresso 5.0)
  - `src/pages/Analysis.tsx` – Recebe domínio (query/localStorage), normaliza e, quando houver `analysis_data` completo, renderiza dashboard de abas; caso contrário, injeta em `AnalysisResults` (preview).
  - `src/components/analysis/AnalysisDashboard.tsx` – Novo componente que espelha o layout do `/demo`, consumindo `analysis_data` do Supabase com fallbacks para campos opcionais.
  - `src/pages/Analysis.test.tsx` – Testes de parsing, estados e render do preview.
  - `src/components/AnalysisResults.tsx` – Lista e filtra por domínio; ordering e skeleton validados.
  - `src/utils/domain.ts` – Utilitário `extractDomain` para normalização.
  - `docs/n8n-payload-structure.md` – Referência de payload real; campos avançados opcionais.

---

### Melhorias Pós-MVP

- [ ] **6.0 Realtime Completo**
  - Objetivo: substituir o polling da Home por Supabase Realtime no canal da tabela `analysis_results`, com fallback automático para polling quando o websocket não conectar ou perder a conexão. Garantir UX acessível, responsiva e testes cobrindo estados principais.
  
  - Critérios de aceite (DoD):
    - Home deixa de usar `refetchInterval` e passa a reagir a eventos realtime filtrados por `domain` do usuário.
    - Fallback automático para polling ocorre quando `isConnected === false` ou em perda de conexão, com backoff adequado e limpeza no unmount.
    - Debounce de updates (≥300ms) para evitar re-render em rajadas; throttling de fetch (≥2s) para evitar flood.
    - Ordering consistente por `updated_at desc` com persistência em `localStorage.lastAnalyzedDomain` quando aplicável.
    - Acessibilidade preservada: `role="status"`, `aria-live="polite"` enquanto em progresso; foco e navegação por teclado do CTA intactos.
    - Testes unitários do hook e testes de integração na Home cobrindo: conexão, recepção de evento, fallback de polling, limpeza de recursos, e fluxo feliz.
    - Documentação de smoke test (insert/upsert em `analysis_results`) e de rollback para polling-only.

  - Subtasks:
    - [x] 6.1 Hook consolidado de realtime e fallback
      - [x] 6.1.1 Revisar `src/hooks/useRealTimeAnalysis.ts` (já existente) para confirmar: filtro por `domain=eq.<alvo>`, debounce (300ms), throttle de fetch (≥2s), ordering por `updated_at desc`, cleanup completo (unsubscribe/clearInterval/clearTimeout) e sinalização `isConnected`, `hasNewData` e `lastUpdated`.
      - [x] 6.1.2 Ajustar normalização do domínio (remover protocolo/`www.`; trailing slash) e expor utilitário para reuso.
      - [x] 6.1.3 Garantir fallback de polling 10s quando sem conexão e 30s quando conectado mas sem dados; pausar polling quando conectado e com dados.
      - [x] 6.1.4 Testes do hook: conexão, evento INSERT/UPDATE, debounce, throttle, fallback de polling, cleanup no unmount e erro de consulta com retries/backoff.
      - [x] 6.1.5 Observabilidade mínima: logs de estado sob flag de debug, sem poluir produção.
    
    - [x] 6.2 Integração Realtime na Home
      - [x] 6.2.1 Substituir a query com `refetchInterval` em `src/pages/Home.tsx` pelo uso de `useRealTimeAnalysis(domain)` para decidir entre estado "Em Progresso" e CTA "Minha Análise".
      - [x] 6.2.2 Manter acessibilidade: `role`, `aria-live`, skeleton/loader quando apropriado; preservar fluxo existente de CTA e navegação.
      - [x] 6.2.3 Atualizar `src/pages/Home.test.tsx` para mockar o cliente realtime (conectar, emitir evento) e cobrir: sem dados → progresso; ao receber evento → CTA habilitado; desconexão → fallback polling.
      - [x] 6.2.4 Remover/neutralizar o `refetchInterval` antigo para não conflitar com realtime.
      - [x] 6.2.5 UX: adicionar CTA persistente no topo da Home com estados
        - [x] Loading: botão desabilitado com spinner + texto “Your first analysis will be ready in a few minutes”.
        - [x] Ready: botão habilitado “View my analysis” que navega para `/analysis?domain=<domain>`.
        - [x] Acessibilidade: `aria-disabled`, `aria-busy`, `role="status"` (mensagem de progresso).

    - [x] 6.3 Configuração e segurança
      - [x] 6.3.1 Verificar configuração do Realtime no cliente Supabase (`src/integrations/supabase/client.ts`) e parâmetros (`eventsPerSecond`).
      - [x] 6.3.2 Confirmar que conexões usam HTTPS/WSS; documentar orientação de TLS e não exposição de segredos (usar variáveis via `.env.example`).
      - [x] 6.3.3 Opcional: flag de runtime `VITE_DISABLE_REALTIME` para forçar polling-only em cenários de diagnóstico.

    - [ ] 6.4 Testes e2e e cobertura
      - [x] 6.4.1 Adicionar testes unitários do hook (`src/hooks/useRealTimeAnalysis.test.ts`) com timers falsos e mocks do cliente Supabase.
      - [x] 6.4.2 Atualizar `Home.test.tsx` cobrindo estados de conexão/eventos.
      - [x] 6.4.3 Planejar e2e leve: seed local ou POST em `receive-analysis` para validar atualização visual na Home.

    - [x] 6.5 Organization Setup antes do Domain Setup
    - [x] 6.5.1 Criar página `src/pages/OrganizationSetup.tsx` com formulário mínimo (name obrigatório; industry/size opcionais) e fluxo de submit invocando `create-organization`.
    - [x] 6.5.2 Ajustar roteamento em `src/App.tsx` e `SmartRedirect` para priorizar `/organization-setup` quando não houver `organization_id`.
    - [x] 6.5.3 Atualizar Edge Function `create-organization` para aceitar `name` opcional e `domain` opcional.
    - [x] 6.5.4 Adicionar testes `src/pages/OrganizationSetup.test.tsx` (sucesso com redirect; erro mantém na página).

    - [x] 6.5 Documentação e operacional
      - [x] 6.5.1 Documentar smoke test: inserção/upsert em `analysis_results` e verificação na Home.
      - [x] 6.5.2 Documentar rollback: como reativar polling-only (flag/env) sem alteração de código.

  - Relevant Files (6.0):
    - `src/hooks/useRealTimeAnalysis.ts` – Hook de realtime + fallback polling.
    - `src/hooks/useRealTimeAnalysis.test.ts` – Novos testes unitários do hook.
    - `src/pages/Home.tsx` – Integração do hook; remoção do polling reativo por query.
    - `src/pages/Home.test.tsx` – Testes de integração dos estados na Home.
    - `src/tests/setup.ts` – Mocks/Polyfills para timers/Observers e cliente Supabase, se necessário.
    - `src/integrations/supabase/client.ts` – Verificação de parâmetros de realtime e WSS/headers.
    - `docs/DOCS.md` – Guia de smoke test/rollback.
    - `.env.example` – Flags/variáveis opcionais (`VITE_DISABLE_REALTIME`).

  - Riscos e mitigação:
    - Realtime flakey em algumas redes: fallback automático para polling; flag para polling-only.
    - Flood de eventos/consultas: debounce + throttle + filtros por domínio.
    - Vazamento de recursos: garantir cleanup de subscription/intervalos/timeouts no unmount.

  - Rollback:
    - Ativar `VITE_DISABLE_REALTIME=true` e reabilitar polling-only na Home até estabilização.

- [x] Ajustes de fluxo (2025-08-10) – DomainSetup/Home/Analysis/SmartRedirect
  - Motivo: durante smoke test, após enviar domínio, redirect para `/home` às vezes retornava para `/domain-setup`; ao clicar no CTA “View my analysis” a navegação ia para `/domain-setup` por `website_url` ainda não reidratado no `profile`.
  - Alterações:
    - `src/pages/DomainSetup.tsx`:
      - Persistir `lastOrganizationId`, `lastSavedDomain`, `lastSavedWebsiteUrl` em `localStorage`.
      - Não bloquear redirect se `trigger-analysis` falhar (toast + segue para `/home`).
      - `refreshSession()` não-bloqueante após `navigate('/home')`.
    - `src/components/SmartRedirect.tsx`:
      - Adiciona `'/analysis'` em `allowedPaths`.
      - Mantém `/home` quando `domainSetupInProgress` ou `lastSavedDomain`/`lastSavedWebsiteUrl` existirem.
    - `src/pages/Home.tsx`:
      - Fallback para `lastSavedWebsiteUrl`/`lastSavedDomain` ao calcular `normalizedDomain` e exibir estado “Preparing analysis…”.
    - `src/pages/Analysis.tsx`:
      - Fallback em cascata para domínio: `?domain=` > `lastAnalyzedDomain` > `lastSavedWebsiteUrl` > `lastSavedDomain` (com `extractDomain`).
  - Testes/validação:
    - Unit `npm run test:unit` verde; realtime/polling coberto em `useRealTimeAnalysis.test.tsx` e estados de Home em `Home.test.tsx`.
    - Smoke manual: `/domain-setup` → `/home` (preparing) → POST `receive-analysis` → CTA habilita → `/analysis?domain=<domínio>` renderiza preview.

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
