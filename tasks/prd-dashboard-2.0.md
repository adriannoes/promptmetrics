### Dashboard 2.0 – PRD

#### 1) Introdução / Visão Geral
O Dashboard 2.0 é a evolução da página `/analysis`, oferecendo a mesma experiência visual e funcional do `/demo`, mas alimentada por dados reais vindos do Supabase (via Edge Function `receive-analysis`, preenchida pelo fluxo do n8n). O objetivo é permitir que clientes logados, com organização e domínio configurados, visualizem seu painel de análises com abas e gráficos interativos.

Público-alvo: clientes autenticados que já concluíram o onboarding (organização criada e domínio cadastrado). O `/demo` segue como modo público estático.

Escopo v1: replicar as abas do `/demo` (Dashboard, AI Analysis/Prompts, Competitors, Strategic Insights) consumindo `analysis_data` real. Reagir sempre à última análise disponível do domínio do usuário.

#### 2) Goals (objetivos/KPIs)
- Aumentar o engajamento na página `/analysis` (tempo médio > 60s).
- CTR do botão “View my analysis” na Home > 40% entre usuários com análise concluída.
- Erro de renderização da `/analysis` < 1% das sessões (monitorado via logs/toasts).
- Tempo até primeiro conteúdo útil (LCP percebido na `/analysis`) < 2.5s em conexões comuns (payload local já disponível).

#### 3) User Stories
- Como cliente autenticado, quero ver um painel com meus indicadores (score, trends, ranking) para entender rapidamente minha posição.
- Como cliente, quero navegar entre abas (Dashboard, AI Analysis, Competitors, Strategic Insights) para explorar diferentes dimensões dos dados.
- Como cliente, quero que o painel use meu domínio automaticamente (vindo da Home) e sempre reflita a última análise disponível.
- Como cliente bilíngue, quero alternar entre EN e PT‑BR.

#### 4) Requisitos Funcionais (numerados)
1. A página `/analysis` deve carregar o domínio via `?domain=` (prioridade) com fallback local (`lastAnalyzedDomain`), e renderizar o Dashboard 2.0 se houver `analysis_data` com `status=completed` para este domínio.
2. O Dashboard 2.0 deve replicar as abas do `/demo`:
   2.1. Dashboard: score, sentiment trends (6 meses), ranking trends (6 meses), overall sentiment.
   2.2. AI Analysis (Prompts): visão de métricas agregadas (ex.: performance_metrics), e estruturas para ranking por prompt e sentimento por LLM.
   2.3. Competitors: market share, trends, prioridades estratégicas e oportunidades.
   2.4. Strategic Insights: key_insights, recommendations e action_items.
3. O front deve usar paleta/estilo padrão do `/demo`; cores por item são opcionais no payload.
4. Idiomas: EN padrão e PT‑BR via toggle existente (usar strings do front/i18n).
5. Reagir à última análise disponível do domínio (Realtime Supabase para tabela `analysis_results`, assinatura filtrada por domínio). Em caso de indisponibilidade do Realtime, aceitar o último snapshot ao carregar a página.
6. Estados de erro/skeleton mínimos: enquanto carrega, exibir skeleton; em erro de busca, exibir alerta amigável.
7. A `/analysis` não deve ser acessível sem autenticação; `/demo` continua público.
8. Export (PDF/PNG/CSV) não faz parte do v1.

#### 5) Não‑Objetivos (fora de escopo v1)
- Export/compartilhamento do relatório.
- Edição de prompts pelo usuário final.
- Comparação multi‑domínio ao mesmo tempo.

#### 6) Considerações de Design (UI/UX)
- Reusar o layout e componentes do `/demo` como referência (tabs, gráficos Recharts, badges, cards).
- Responsividade e A11y básicas (roles, aria‑labels, foco visível; já praticadas no projeto).
- Paleta padrão do `/demo`; se o payload fornecer `color`, utilizar; caso contrário, aplicar cor default.

#### 7) Considerações Técnicas
- Dados: Supabase Postgres tabela `analysis_results` com colunas: id, domain, status, analysis_data (JSONB), created_at, updated_at.
- Realtime: canal filtrado por `domain=eq.<domínio>`. Ao receber INSERT/UPDATE, atualizar o painel se o domínio corresponder.
- Segurança: manter autenticação via Supabase; não expor segredos no front; chamadas externas devem usar HTTPS/WSS.
- i18n: strings EN/PT‑BR no front; payload fiel em EN para termos técnicos quando aplicável.
- Performance: payload deve limitar-se a ~6 meses por série; sem limite rígido, mas evitar objetos gigantes sem necessidade.

#### 8) Especificação de Payload (n8n → Edge → Supabase)
Formato salvo em `analysis_results` (coluna `analysis_data`). O conteúdo abaixo define os campos necessários para o Dashboard 2.0.

Topo do item salvo:
```
{
  "domain": "pipefy.com",                // string, normalizado
  "status": "completed",                 // "processing" | "completed" | "failed"
  "request_id": "uuid-...",             // string opcional (rastreio)
  "generated_at": "2025-08-10T23:10Z",  // ISO datetime do processamento
  "version": 1,                           // inteiro, versão do schema
  "analysis_data": { ... }
}
```

Campos dentro de `analysis_data` (todos obrigatórios no v1):
1) Básico
```
summary: string
score: number            // 0-100
recommendations: string[]
```

2) Dashboard (trends e ranking – 6 meses)
```
sentiment_trends: Array<{ month: string, [seriesName: string]: number }>
// ex.: { month: "Jan", "Pipefy": 75, "Competitor1": 68, "Competitor2": 65 }

ranking_data: Array<{ month: string, [seriesName: string]: number }>
// ex.: { month: "Jan", "Pipefy": 2.1, "Competitor1": 2.8, "Competitor2": 3.2 }

overall_sentiment: Array<{ name: string, score: number, color?: string }>
// ex.: [ { name: "Pipefy", score: 77.6, color: "#3B82F6" }, ... ]

share_of_rank: Array<{ month: string, [seriesName: string]: number }>
// ex.: { month: "Jan", "Pipefy": 35, "Competitor1": 28, "Competitor2": 22, "Others": 15 }
```

3) Competitors
```
competitor_analysis: {
  market_share: Array<{ name: string, value: number, color?: string }>,
  market_trends?: Array<{ month: string, [seriesName: string]: number }>,
  strategic_priorities?: Array<{ id: number, title: string, description: string, priority: "high"|"medium"|"low", marketShare?: number }>,
  opportunities?: Array<{ category: string, title: string, description: string, impact: "high"|"medium"|"low", effort: "high"|"medium"|"low" }>
}
```

4) AI Analysis / Prompts
```
prompt_analysis: {
  sentiment_by_llm: Record<string, number>,
  ranking_by_prompt: Record<string, Record<string, number>>, // prompt → (entity→rank)
  performance_metrics?: Record<string, number|string>
}
```

5) Strategic Insights
```
strategic_insights: {
  key_insights?: string[],
  recommendations?: string[],
  action_items?: string[]
}
```

Observações:
- Todos os blocos acima são obrigatórios no v1; campos sinalizados como `?` podem ser vazios, mas o objeto deve existir.
- Meses: fornecer 6 pontos (Jan..Jun, por exemplo) em `sentiment_trends` e `ranking_data`.
- Cores: se não fornecidas, o front aplicará paleta padrão.
- Versionamento: `version` começa em 1; mudanças futuras no schema incrementam este inteiro.
- Rastreabilidade: preencher `request_id` e `generated_at` ajuda suporte e auditoria.

Exemplo resumido do `analysis_data` (omitidos arrays longos):
```
{
  summary: "Análise detalhada...",
  score: 85,
  recommendations: ["Melhorar X", "Explorar Y", "Parcerias Z"],
  sentiment_trends: [ { month: "Jan", Pipefy: 75, Competitor1: 68 }, ... ],
  ranking_data: [ { month: "Jan", Pipefy: 2.1, Competitor1: 2.8 }, ... ],
  overall_sentiment: [ { name: "Pipefy", score: 77.6 }, ... ],
  share_of_rank: [ { month: "Jan", Pipefy: 35, Others: 15 }, ... ],
  competitor_analysis: {
    market_share: [ { name: "Pipefy", value: 35 }, ... ],
    market_trends: [ { month: "Jan", Pipefy: 32, Others: 18 }, ... ],
    strategic_priorities: [ { id: 1, title: "Expandir...", priority: "high" } ],
    opportunities: [ { category: "Product", impact: "high", effort: "medium", title: "...", description: "..." } ]
  },
  prompt_analysis: {
    sentiment_by_llm: { OpenAI: 82, Gemini: 78, Claude: 85 },
    ranking_by_prompt: { workflow_automation: { Pipefy: 1, Competitor1: 2 } },
    performance_metrics: { total_mentions: 247, sentiment_score: 80.2 }
  },
  strategic_insights: {
    key_insights: ["Líder em..."] ,
    recommendations: ["Investir em IA"],
    action_items: ["Campanha Q3"]
  }
}
```

Compatibilidade com payload atual (n8n):
- O payload atual informado traz um envelope de sucesso e um `data_summary`. Para o Dashboard 2.0, o fluxo deve continuar salvando na tabela `analysis_results` um item com `status=completed` e o `analysis_data` conforme especificação acima. O `data_summary` pode continuar existindo apenas para telemetria/validação do fluxo.

#### 9) Métricas de Sucesso
- Engajamento: tempo médio na `/analysis` > 60s.
- Confiabilidade: < 1% de erros de render no Sentry/console.
- Adesão: ≥ 80% dos usuários que têm análise “completed” visualizam ao menos a aba “Dashboard”.

#### 10) Telemetria (proposta)
- analysis.view (page_load): { domain, has_data, status, version }
- analysis.tab_change: { tab, domain }
- analysis.chart_interaction: { chart_id, domain, action: zoom|hover|legend_toggle }
- analysis.realtime_update: { domain, event: INSERT|UPDATE }
- analysis.error: { domain, error_code|message }

Observação: enviar apenas metadados não sensíveis; usar HTTPS/TLS.

#### 11) Versionamento do Payload (proposta)
- `version` (inteiro) em `analysis_data` e `generated_at` ISO string.
- `request_id` (string) para correlacionar DomainSetup → trigger → receive-analysis.
- Política: mudanças breaking incrementam `version` e o front aplica mapeamento por versão quando necessário.

#### 12) Critérios de Aceite (DoD)
- `/analysis` renderiza abas do Dashboard 2.0 com dados reais para um domínio com `status=completed`.
- Realtime: ao alterar/inserir o registro do domínio, o painel reflete o último resultado.
- i18n: EN padrão, PT‑BR disponível via toggle.
- Responsividade/A11y: landmarks, aria‑labels, navegação por teclado.
- Testes unitários para mapeamento dos campos principais e renderização por aba.

#### 13) Plano de Marcos (fatiamento)
- v1 (MVP):
  - Mapear e renderizar: score, summary, recommendations, sentiment_trends (6m), ranking_data (6m), overall_sentiment, share_of_rank.
  - Abas: Dashboard + AI Analysis (métricas agregadas) + Competitors (market_share) + Strategic Insights (listas).
  - Realtime + i18n + responsividade.
- v1.1 Prompts avançado:
  - Render detalhado de `ranking_by_prompt` e `sentiment_by_llm` com filtros.
- v1.2 Competitors avançado:
  - market_trends, prioridades e oportunidades com UI aprimorada e filtros.
- v1.3 Export/Share:
  - Export PDF/PNG, links compartilháveis (se aplicável).

#### 14) Testes (TDD)
- Unit: mapeamento de `analysis_data` → componentes de cada aba; rendering sem erros com dados completos; fallback de i18n.
- Integração: `/analysis?domain=...` carrega e renderiza abas; troca de abas; reação a UPDATE realtime do mesmo domínio.
- e2e (futuro): seed local/POST na `receive-analysis` e verificação visual básica.

#### 15) Questões em Aberto
- Precisamos padronizar nomes de séries (ex.: usar o nome do domínio do cliente como primeira série em trends/ranking)?
- Limites de exibição para número de competidores simultâneos (ex.: top 4 + Others)?
- Precisamos de “last_updated” exibido no UI (ex.: "Last updated: YYYY‑MM‑DD")?


