-- Optional seed for local development of analysis_results
-- Safe to run multiple times: uses ON CONFLICT(domain) DO UPDATE

INSERT INTO public.analysis_results (domain, status, analysis_data, updated_at)
VALUES (
  'example.com',
  'completed',
  '{
    "summary": "Análise de demonstração gerada para ambiente local.",
    "score": 82,
    "recommendations": [
      "Aprimorar documentação técnica para devs.",
      "Publicar estudos de caso no blog.",
      "Expandir integrações nativas."
    ],
    "sentiment_trends": [
      { "month": "Jan", "Brand": 75, "Competitor1": 68, "Competitor2": 65 },
      { "month": "Feb", "Brand": 77, "Competitor1": 69, "Competitor2": 66 },
      { "month": "Mar", "Brand": 78, "Competitor1": 70, "Competitor2": 67 }
    ],
    "ranking_data": [
      { "month": "Jan", "Brand": 2.1, "Competitor1": 2.8, "Competitor2": 3.2 },
      { "month": "Feb", "Brand": 2.0, "Competitor1": 2.7, "Competitor2": 3.1 },
      { "month": "Mar", "Brand": 1.9, "Competitor1": 2.6, "Competitor2": 3.0 }
    ],
    "overall_sentiment": [
      { "name": "Brand", "score": 78.2, "color": "#3B82F6" },
      { "name": "Competitor1", "score": 73.4, "color": "#10B981" },
      { "name": "Competitor2", "score": 68.8, "color": "#8B5CF6" }
    ],
    "share_of_rank": [
      { "month": "Jan", "Brand": 35, "Competitor1": 28, "Competitor2": 22, "Others": 15 },
      { "month": "Feb", "Brand": 38, "Competitor1": 26, "Competitor2": 21, "Others": 15 }
    ],
    "competitor_analysis": {
      "market_share": [
        { "name": "Brand", "value": 36, "color": "#3B82F6" },
        { "name": "Competitor1", "value": 26, "color": "#10B981" },
        { "name": "Competitor2", "value": 19, "color": "#8B5CF6" },
        { "name": "Others", "value": 19, "color": "#6B7280" }
      ]
    },
    "strategic_insights": {
      "key_insights": [
        "Brand lidera conversas em automação de processos.",
        "Oportunidade em conteúdos para PMEs."
      ],
      "action_items": [
        "Campanha de marketing para PMEs.",
        "Programa de parceiros e certificações."
      ]
    },
    "prompt_analysis": {
      "sentiment_by_llm": { "ChatGPT": 82, "Gemini": 78, "Claude": 84 }
    }
  }'::jsonb,
  now()
)
ON CONFLICT (domain) DO UPDATE SET
  status = EXCLUDED.status,
  analysis_data = EXCLUDED.analysis_data,
  updated_at = now();


