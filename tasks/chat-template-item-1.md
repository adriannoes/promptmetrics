# 🚀 Chat Template - Item 1: Corrigir Carregamento de Dados do n8n

## Contexto para Novo Chat

Copie e cole este template no **novo chat** para começar a implementação:

---

## 🎯 **Objetivo**
Implementar o **Item 1** do PRD: Corrigir o carregamento de dados do n8n no PromptMetrics.

## 📋 **Sub-tarefas do Item 1**
- [ ] 1.1 Investigar problemas de carregamento de dados atuais
- [ ] 1.2 Corrigir edge function receive-analysis para processar payload correto
- [ ] 1.3 Criar tipagem TypeScript para estrutura de dados do n8n
- [ ] 1.4 Atualizar componentes do /my-rank para consumir dados corretos
- [ ] 1.5 Implementar logs detalhados para debug do fluxo
- [ ] 1.6 Testar fluxo completo com payload de exemplo

## 🔧 **Arquivos Principais**
- `supabase/functions/receive-analysis/index.ts` - Edge function que recebe dados do n8n
- `src/hooks/useAnalysisData.ts` - Hook que busca dados da tabela analysis_results
- `src/pages/MyRank.tsx` - Página que exibe resultados
- `src/components/myrank/` - Componentes que consomem os dados
- `src/types/analysis.ts` - Tipagem TypeScript para dados

## 📊 **Payload de Exemplo n8n**
```json
{
  "domain": "pipefy.com",
  "status": "completed",
  "analysis_data": {
    "summary": "Análise completa da marca...",
    "score": 64,
    "recommendations": ["..."],
    "sentiment_trends": [{"month": "Jan", "Pipefy": 70}],
    "ranking_data": [{"month": "Jan", "Pipefy": 6.5}],
    "overall_sentiment": [{"name": "Pipefy", "score": 73}],
    "share_of_rank": [{"month": "Jan", "Pipefy": 13}],
    "competitor_analysis": {"market_share": []},
    "prompt_analysis": {"sentiment_by_llm": {}},
    "strategic_insights": {"growth_opportunities": []}
  }
}
```

## 🚨 **Problema Atual**
Os dados do n8n não estão sendo exibidos corretamente na página `/my-rank`. Possíveis causas:
- Edge function `receive-analysis` não está salvando dados corretamente
- Hook `useAnalysisData` não está recuperando dados
- Componentes não estão consumindo a estrutura correta
- Tipagem TypeScript não corresponde ao payload real

## 🎯 **Tarefa Imediata**
**Comece pela sub-tarefa 1.1**: Investigar problemas de carregamento de dados atuais

**Ações sugeridas:**
1. Verificar logs da edge function `receive-analysis`
2. Testar manualmente o hook `useAnalysisData`
3. Verificar se dados estão sendo salvos na tabela `analysis_results`
4. Comparar estrutura do payload com tipagem atual

## 📝 **Request**
Ajude-me a implementar a **sub-tarefa 1.1** - investigar os problemas de carregamento de dados do n8n. Vamos começar analisando o código atual e identificando onde está o problema.

---

## 🔗 **Referências**
- PRD completo: `tasks/prd-analysis-flow-completion.md`
- Lista de tarefas: `tasks/tasks-prd-analysis-flow-completion.md`
- Payload exemplo: `.cursor/rules/n8n-payload-example` 