## Relevant Files

- `src/pages/Analysis.tsx` – Página protegida que recebe `?domain=` e renderiza o Dashboard 2.0 quando há `analysis_data` completo.
- `src/components/analysis/AnalysisDashboard.tsx` – Componente principal do Dashboard 2.0 (abas, gráficos e cards) consumindo dados reais.
- `src/components/analysis/AnalysisDashboard.test.tsx` – Testes unitários dos mapeamentos de `analysis_data` e render básico por aba.
- `src/hooks/useRealTimeAnalysis.ts` – Assinatura Realtime da `analysis_results` filtrada por domínio (fallback para snapshot ao carregar).
- `src/pages/Analysis.test.tsx` – Testes de integração de rota, parsing de domínio e estados (skeleton/erro).
- `supabase/functions/receive-analysis/index.ts` – Ingestão (n8n → Supabase), normalização de metadados e upsert por domínio.
- `supabase/migrations/*.sql` – Migrações relacionadas a `analysis_results` (UNIQUE(domain), eventuais colunas futuras).

### Notes

- Crie/atualize testes ao lado dos arquivos (por exemplo: `MyComponent.tsx` e `MyComponent.test.tsx`).
- Use `npx jest [opcional/caminho/do/arquivo]` para executar testes; sem caminho roda toda a suíte.
- Chamadas externas (Edge Functions, n8n) devem usar HTTPS/TLS; nunca exponha segredos no front. Utilize variáveis via `.env.example`.

## Tasks

- [ ] 1.0 Roteamento e Carregamento de Dados da página `/analysis` (auth guard, `?domain=` com fallbacks, snapshot inicial)
- [ ] 2.0 UI e Componentização do Dashboard 2.0 replicando `/demo` (abas: Dashboard, AI Analysis, Competitors, Strategic Insights)
- [ ] 3.0 Realtime Supabase para `analysis_results` (assinatura por domínio, atualização reativa com fallback para snapshot)
- [ ] 4.0 UX: regras de apresentação (cliente primeiro, Top 5 + “Others”, “Last updated”), i18n (EN/PT‑BR) e A11y (skeleton/erros)
- [ ] 5.0 Testes (TDD) cobrindo mapeamentos por aba e integração da `/analysis`; Telemetria mínima (events `analysis.*`)
- [ ] 6.0 Ajustes mínimos nas Edge Functions para metadados/versionamento de payload e orientação de segurança (HTTPS/TLS)


