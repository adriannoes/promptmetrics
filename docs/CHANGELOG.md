# Changelog – Dashboard 2.0

## 2025-08-12

### Added
- Página `/analysis` integrada ao `useRealTimeAnalysis` com snapshot inicial e assinatura por domínio.
- `AnalysisDashboard` com abas (Dashboard, AI Analysis, Strategic Insights), gráficos Recharts e empty states acessíveis.
- I18n (EN/PT‑BR) de rótulos, abas e mensagens; utilitários i18n de data/número (`src/lib/format.ts`).
- Regras “cliente primeiro” e “Top 5 + Others” com utilitários puros e testes.

### Changed
- Estados skeleton/erro/vazio na `/analysis` e “Last updated” com fallback seguro (`generated_at` → `updated_at`).
- Acessibilidade de tabs (`role=tablist/tab/panel`, foco visível) e mensagens `aria-live`.
- Tipagem forte de `analysis_data` no dashboard (remoção de `any`).

### Security
- `receive-analysis`: verificação HMAC opcional via header `x-signature` (base64 HMAC‑SHA256 do corpo).
- Bypass de desenvolvimento controlado via `ALLOW_INSECURE_DEV=true`; recomendações de uso de HTTPS/TLS documentadas.

### Tests
- `/analysis`: fallbacks de domínio em cascata, skeleton/erro/vazio, ordering por `updated_at` e header “Last updated”.
- `AnalysisDashboard`: empty states por aba e fallback de “Last updated”.
- Utilitários: “cliente primeiro” e “Top 5 + Others” com soma correta de “Others”.

### Docs
- Instruções de testes (`npm test` e filtro por arquivo) no `README.md` e `docs/DOCS.md`.
- Estrutura de payload e segurança (HMAC/HTTPS) em `docs/payload/n8n-payload-structure.md`.

---

## English Summary

### Added
- `/analysis` page with `useRealTimeAnalysis` (initial snapshot + domain subscription).
- `AnalysisDashboard` tabs with Recharts and accessible empty states.
- i18n (EN/PT‑BR) strings and i18n formatters for date/number.
- “client first” and “Top 5 + Others” rules with tested utilities.

### Security
- Optional HMAC check in `receive-analysis` via `x-signature` (base64 HMAC‑SHA256 body), dev bypass via `ALLOW_INSECURE_DEV`.

### Tests & Docs
- Broad unit/integration coverage for analysis/dashboard; updated README/DOCS test instructions and payload docs.
