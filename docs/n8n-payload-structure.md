# Estrutura do Payload N8N para Análise Completa

Esta documentação define a estrutura completa do payload que o N8N deve retornar para atualizar todos os gráficos e dados na interface de análise.

## Payload Básico (Já Implementado)

```json
{
  "domain": "pipefy.com",
  "status": "completed",
  "analysis_data": {
    "summary": "Breve resumo da análise da marca...",
    "score": 85,
    "recommendations": [
      "Primeira recomendação de melhoria",
      "Segunda recomendação",
      "Terceira recomendação"
    ]
  }
}
```

## Payload Completo (Para Todos os Gráficos)

```json
{
  "domain": "pipefy.com",
  "status": "completed",
  "analysis_data": {
    // === DADOS BÁSICOS (já implementado) ===
    "summary": "Análise detalhada da marca Pipefy...",
    "score": 85,
    "recommendations": [
      "Melhorar presença em documentações técnicas",
      "Expandir casos de uso em tutoriais",
      "Fortalecer parcerias estratégicas"
    ],

    // === DADOS DO DASHBOARD ===
    "sentiment_trends": [
      { "month": "Jan", "Pipefy": 75, "Competitor1": 68, "Competitor2": 65 },
      { "month": "Feb", "Pipefy": 76, "Competitor1": 69, "Competitor2": 66 },
      { "month": "Mar", "Pipefy": 78, "Competitor1": 70, "Competitor2": 68 },
      { "month": "Apr", "Pipefy": 77, "Competitor1": 71, "Competitor2": 68 },
      { "month": "May", "Pipefy": 79, "Competitor1": 70, "Competitor2": 68 },
      { "month": "Jun", "Pipefy": 78, "Competitor1": 71, "Competitor2": 68 }
    ],
    
    "ranking_data": [
      { "month": "Jan", "Pipefy": 2.1, "Competitor1": 2.8, "Competitor2": 3.2 },
      { "month": "Feb", "Pipefy": 2.0, "Competitor1": 2.7, "Competitor2": 3.1 },
      { "month": "Mar", "Pipefy": 1.9, "Competitor1": 2.6, "Competitor2": 3.0 },
      { "month": "Apr", "Pipefy": 2.0, "Competitor1": 2.5, "Competitor2": 2.9 },
      { "month": "May", "Pipefy": 1.8, "Competitor1": 2.4, "Competitor2": 2.8 },
      { "month": "Jun", "Pipefy": 1.7, "Competitor1": 2.3, "Competitor2": 2.7 }
    ],
    
    "overall_sentiment": [
      { "name": "Pipefy", "score": 77.6, "color": "#3B82F6" },
      { "name": "Competitor1", "score": 73.4, "color": "#10B981" },
      { "name": "Competitor2", "score": 68.8, "color": "#8B5CF6" }
    ],
    
    "share_of_rank": [
      { "month": "Jan", "Pipefy": 35, "Competitor1": 28, "Competitor2": 22, "Others": 15 },
      { "month": "Feb", "Pipefy": 38, "Competitor1": 26, "Competitor2": 21, "Others": 15 },
      { "month": "Mar", "Pipefy": 42, "Competitor1": 25, "Competitor2": 20, "Others": 13 },
      { "month": "Apr", "Pipefy": 45, "Competitor1": 24, "Competitor2": 19, "Others": 12 },
      { "month": "May", "Pipefy": 48, "Competitor1": 23, "Competitor2": 18, "Others": 11 },
      { "month": "Jun", "Pipefy": 52, "Competitor1": 22, "Competitor2": 17, "Others": 9 }
    ],

    // === ANÁLISE DE COMPETIDORES ===
    "competitor_analysis": {
      "market_share": [
        { "name": "Pipefy", "value": 35, "color": "#3B82F6" },
        { "name": "Competitor1", "value": 25, "color": "#10B981" },
        { "name": "Competitor2", "value": 20, "color": "#8B5CF6" },
        { "name": "Others", "value": 20, "color": "#6B7280" }
      ],
      
      "market_trends": [
        { "month": "Jan", "Pipefy": 32, "Competitor1": 28, "Competitor2": 22, "Others": 18 },
        { "month": "Feb", "Pipefy": 33, "Competitor1": 27, "Competitor2": 21, "Others": 19 },
        { "month": "Mar", "Pipefy": 34, "Competitor1": 26, "Competitor2": 21, "Others": 19 },
        { "month": "Apr", "Pipefy": 35, "Competitor1": 25, "Competitor2": 20, "Others": 20 },
        { "month": "May", "Pipefy": 35, "Competitor1": 25, "Competitor2": 20, "Others": 20 },
        { "month": "Jun", "Pipefy": 35, "Competitor1": 25, "Competitor2": 20, "Others": 20 }
      ],
      
      "strategic_priorities": [
        {
          "id": 1,
          "title": "Expandir recursos de automação de processos",
          "description": "35% market share—aprimorar capacidades de automação do Pipefy para superar competidores.",
          "priority": "high",
          "marketShare": 35.0
        },
        {
          "id": 2,
          "title": "Focar em pequenas e médias empresas",
          "description": "Competir com soluções enterprise via onboarding simplificado e recursos para PMEs.",
          "priority": "medium",
          "marketShare": 25.0
        }
      ],
      
      "opportunities": [
        {
          "category": "Product Development",
          "title": "Aproveitar interface no-code do Pipefy para diferenciação competitiva.",
          "description": "A abordagem visual de construção de processos continua sendo única, com competidores focando mais em templates...",
          "impact": "high",
          "effort": "medium"
        },
        {
          "category": "Market Expansion",
          "title": "Capitalizar nas integrações nativas para atrair equipes buscando soluções completas.",
          "description": "Integrações com ferramentas populares diferencia o Pipefy de muitos competidores...",
          "impact": "medium",
          "effort": "low"
        }
      ]
    },

    // === ANÁLISE DE PROMPTS ===
    "prompt_analysis": {
      "sentiment_by_llm": {
        "ChatGPT": 82,
        "Gemini": 78,
        "Claude": 85,
        "Perplexity": 80
      },
      
      "ranking_by_prompt": {
        "workflow_automation": { "Pipefy": 1, "Competitor1": 2, "Competitor2": 3 },
        "process_management": { "Pipefy": 2, "Competitor1": 1, "Competitor2": 3 },
        "team_collaboration": { "Pipefy": 1, "Competitor1": 3, "Competitor2": 2 }
      },
      
      "performance_metrics": {
        "total_mentions": 247,
        "positive_mentions": 198,
        "neutral_mentions": 35,
        "negative_mentions": 14,
        "sentiment_score": 80.2
      }
    },

    // === INSIGHTS ESTRATÉGICOS ===
    "strategic_insights": {
      "key_insights": [
        "Pipefy é consistentemente mencionado como líder em automação visual de processos",
        "Forte presença em discussões sobre transformação digital em PMEs",
        "Oportunidade de expansão no mercado enterprise com recursos avançados"
      ],
      
      "recommendations": [
        "Investir em recursos de IA para automação inteligente de processos",
        "Expandir biblioteca de templates para diferentes indústrias",
        "Fortalecer parcerias com consultores de transformação digital"
      ],
      
      "action_items": [
        "Criar campanha de marketing focada em casos de sucesso de PMEs",
        "Desenvolver certificações para parceiros e consultores",
        "Implementar recursos de analytics avançados nos dashboards"
      ],
      
      "growth_opportunities": [
        "Mercado de automação de processos em crescimento de 23% ao ano",
        "Demanda crescente por soluções no-code/low-code",
        "Oportunidade de expansão internacional"
      ],
      
      "competitive_threats": [
        "Grandes players investindo pesado em automação",
        "Startups especializadas ganhando tração em nichos específicos",
        "Mudanças regulatórias podem impactar alguns segmentos"
      ]
    }
  }
}
```

## Campos Obrigatórios vs Opcionais

### Obrigatórios:
- `domain`: string
- `status`: "processing" | "completed" | "failed"  
- `analysis_data.summary`: string
- `analysis_data.score`: number (0-100)
- `analysis_data.recommendations`: string[]

### Opcionais (usam dados padrão se não fornecidos):
- Todos os campos de `sentiment_trends`, `ranking_data`, etc.
- Se não fornecidos, a interface mostrará dados mock/exemplo

## Notas Importantes:

1. **Cores dos Gráficos**: Use as cores definidas no payload ou deixe vazio para usar cores padrão
2. **Nomes Dinâmicos**: Substitua "Pipefy", "Competitor1", etc. pelos nomes reais da análise
3. **Dados Históricos**: Os arrays de trends devem ter pelo menos 6 meses de dados
4. **Status**: Use "processing" durante análise, "completed" ao finalizar, "failed" em erro

## Como Testar:x

1. Envie o payload via POST para a edge function `receive-analysis`
2. Acesse `/demo` para ver os dados em tempo real
3. Verifique se todos os gráficos foram atualizados corretamente