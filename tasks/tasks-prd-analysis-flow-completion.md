# Task List - Finalização do Fluxo de Análise de Domínio

## Relevant Files

### Edge Functions
- `supabase/functions/receive-analysis/index.ts` - Edge function que recebe dados do n8n e salva no banco
- `supabase/functions/trigger-analysis/index.ts` - Edge function que inicia análise no n8n

### Hooks e Utilitários
- `src/hooks/useAnalysisData.ts` - Hook que busca dados da tabela analysis_results
- `src/types/analysis.ts` - Tipagem TypeScript para estrutura de dados de análise
- `src/services/errorReporting.ts` - Serviço para reportar erros ao Pipefy (novo)
- `src/utils/domainValidation.ts` - Utilitário para validação de domínio (novo)

### Páginas Principais
- `src/pages/Analysis.tsx` - Página de cadastro de domínio
- `src/pages/MyRank.tsx` - Página principal que exibe os resultados da análise

### Componentes de Análise
- `src/components/DomainAnalysisInput.tsx` - Componente de input para domínio
- `src/components/AnalysisResults.tsx` - Componente que exibe resultados históricos

### Componentes MyRank
- `src/components/myrank/MyRankDashboardTab.tsx` - Componente do dashboard com métricas principais
- `src/components/myrank/MyRankPromptAnalysisTab.tsx` - Componente de análise de prompts
- `src/components/myrank/MyRankCompetitorAnalysisTab.tsx` - Componente de análise competitiva
- `src/components/myrank/MyRankStrategicInsightsTab.tsx` - Componente de insights estratégicos

### Componentes UI/UX
- `src/components/ErrorReportButton.tsx` - Botão para reportar erros (novo)
- `src/components/LoadingSkeletons.tsx` - Skeleton loaders melhorados (novo)
- `src/components/NavigationButton.tsx` - Botão "Ver Meu Ranking" (novo)
- `src/components/RealTimeNotification.tsx` - Notificação de dados atualizados (novo)

### Multilíngue
- `src/i18n/index.ts` - Configuração do sistema de tradução (novo)
- `src/i18n/locales/pt.json` - Traduções em português (novo)
- `src/i18n/locales/en.json` - Traduções em inglês (novo)
- `src/contexts/LanguageContext.tsx` - Contexto de idioma (já existe)

### Notes

- Implementação completa do fluxo de análise de domínio para MVP
- Prioridade: Item 1 (carregamento de dados) deve ser implementado primeiro
- Payload de exemplo disponível em `.cursor/rules/n8n-payload-example`
- Edge functions do Supabase precisam ser testadas em ambiente local
- Usar react-i18next para sistema de tradução multilíngue
- Webhook do Pipefy para reporte de erros: `https://ipaas.pipefy.com/api/v1/webhooks/M9MMr5ClE4WJorSyUgaBD/sync`
- Implementar real-time subscriptions do Supabase para atualizações automáticas
- Cada tarefa principal pode ser implementada em sessões/chats separados
- Testar fluxo completo: /analysis → n8n → receive-analysis → /my-rank

## Tasks

- [ ] 1.0 Corrigir o carregamento de dados do n8n
  - [ ] 1.1 Investigar problemas de carregamento de dados atuais
  - [ ] 1.2 Corrigir edge function receive-analysis para processar payload correto
  - [ ] 1.3 Criar tipagem TypeScript para estrutura de dados do n8n
  - [ ] 1.4 Atualizar componentes do /my-rank para consumir dados corretos
  - [ ] 1.5 Implementar logs detalhados para debug do fluxo
  - [ ] 1.6 Testar fluxo completo com payload de exemplo

- [ ] 2.0 Melhorar integração /analysis → /my-rank
  - [ ] 2.1 Adicionar botão "Ver Meu Ranking" na página /analysis
  - [ ] 2.2 Implementar redirecionamento automático para /my-rank
  - [ ] 2.3 Salvar domínio no localStorage para persistência
  - [ ] 2.4 Exibir mensagem "Análise em andamento" quando não há dados

- [ ] 3.0 Implementar suporte multilíngue completo
  - [ ] 3.1 Configurar sistema de tradução (react-i18next)
  - [ ] 3.2 Criar arquivos de tradução para português e inglês
  - [ ] 3.3 Traduzir todas as strings da página /analysis
  - [ ] 3.4 Traduzir todas as strings da página /my-rank
  - [ ] 3.5 Implementar seletor de idioma funcional
  - [ ] 3.6 Testar mudança de idioma em tempo real

- [ ] 4.0 Implementar tratamento de erros e reporte
  - [ ] 4.1 Adicionar detecção de erros na edge function receive-analysis
  - [ ] 4.2 Criar componente de botão "Reportar Erro"
  - [ ] 4.3 Implementar integração com webhook do Pipefy
  - [ ] 4.4 Coletar informações relevantes do erro para envio
  - [ ] 4.5 Adicionar estados de erro nas páginas /analysis e /my-rank

- [ ] 5.0 Automatizar atualizações em tempo real
  - [ ] 5.1 Implementar real-time subscription do Supabase
  - [ ] 5.2 Otimizar polling para quando não há dados
  - [ ] 5.3 Adicionar notificação visual quando dados são atualizados
  - [ ] 5.4 Implementar debouncing para evitar múltiplas atualizações

- [ ] 6.0 Otimizar experiência do usuário
  - [ ] 6.1 Melhorar estados de carregamento com skeleton loaders
  - [ ] 6.2 Adicionar feedback visual para todas as ações
  - [ ] 6.3 Implementar validação de domínio antes de submeter
  - [ ] 6.4 Adicionar tooltips explicativos sobre atualização semanal
  - [ ] 6.5 Melhorar responsividade das páginas 