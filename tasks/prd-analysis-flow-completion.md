# PRD - Finalização do Fluxo de Análise de Domínio

## Introdução/Overview

O PromptMetrics precisa finalizar o desenvolvimento do fluxo de análise de domínio, que permite aos clientes analisar como suas marcas aparecem em sistemas de IA como ChatGPT, Gemini e Perplexity. O fluxo atual tem duas páginas principais - `/analysis` (para cadastro de domínio) e `/my-rank` (para visualização de resultados) - mas existem problemas de integração, carregamento de dados e experiência do usuário que precisam ser corrigidos para entregar um MVP funcional.

**Problema Principal**: Os dados não estão sendo exibidos corretamente na página `/my-rank`, possivelmente devido a problemas na edge function `receive-analysis` ou no carregamento dos dados vindos do n8n.

**Objetivo**: Entregar um fluxo completo e funcional onde o cliente cadastra seu domínio em `/analysis`, recebe os dados processados pelo n8n via edge function, e visualiza os resultados em `/my-rank` com atualização automática semanal.

## Objetivos

1. **Corrigir o carregamento de dados**: Garantir que os dados enviados pelo n8n sejam corretamente salvos e recuperados
2. **Melhorar a integração**: Criar uma conexão fluída entre `/analysis` e `/my-rank`
3. **Implementar suporte multilíngue**: Adicionar suporte completo a português e inglês
4. **Implementar tratamento de erros**: Adicionar sistema de reporte de erros para o Pipefy
5. **Automatizar atualizações**: Implementar refresh automático quando novos dados chegarem
6. **Otimizar a experiência**: Melhorar feedback visual e estados de carregamento

## User Stories

**Como cliente do PromptMetrics, eu quero:**

1. **Analisar meu domínio**: Cadastrar o domínio da minha empresa em `/analysis` e receber confirmação de que a análise foi iniciada
2. **Visualizar meus resultados**: Acessar `/my-rank` para ver dashboard completo com métricas de como minha marca aparece nos sistemas de IA
3. **Navegar facilmente**: Ter um botão/link claro para ir de `/analysis` para `/my-rank` após submeter minha análise
4. **Receber atualizações**: Ser notificado automaticamente quando novos dados estiverem disponíveis (atualização semanal)
5. **Usar em meu idioma**: Utilizar a plataforma tanto em português quanto em inglês
6. **Reportar problemas**: Quando algo der errado, ter um botão para reportar o erro e receber suporte
7. **Acompanhar o progresso**: Ver o status da minha análise (processando, concluída, falha) com feedback visual claro

## Requisitos Funcionais

### 1. Correção do Carregamento de Dados
- **RF001**: A edge function `receive-analysis` deve corretamente processar e salvar os dados do n8n no formato do payload fornecido
- **RF002**: O hook `useAnalysisData` deve recuperar corretamente os dados da tabela `analysis_results`
- **RF003**: Os componentes do `/my-rank` devem consumir corretamente a estrutura de dados do n8n (ver payload de exemplo)
- **RF004**: Implementar logs detalhados para debug do fluxo de dados

### 2. Integração /analysis → /my-rank
- **RF005**: Adicionar botão "Ver Meu Ranking" na página `/analysis` após submissão bem-sucedida
- **RF006**: Implementar redirecionamento automático para `/my-rank` com parâmetro `?domain=` após análise
- **RF007**: Salvar domínio no localStorage para persistência entre sessões
- **RF008**: Exibir mensagem de "Análise em andamento" quando não há dados ainda

### 3. Suporte Multilíngue
- **RF009**: Implementar todas as strings da interface em português e inglês
- **RF010**: Adicionar seletor de idioma funcional nas páginas `/analysis` e `/my-rank`
- **RF011**: Usar o contexto `LanguageContext` existente para gerenciar idiomas
- **RF012**: Garantir que URLs, botões e mensagens estejam traduzidas

### 4. Tratamento de Erros
- **RF013**: Implementar detecção de erros na edge function `receive-analysis`
- **RF014**: Adicionar botão "Reportar Erro" na página `/my-rank` quando análise falha
- **RF015**: Integrar com webhook do Pipefy: `https://ipaas.pipefy.com/api/v1/webhooks/M9MMr5ClE4WJorSyUgaBD/sync`
- **RF016**: Coletar informações relevantes do erro (domínio, timestamp, erro específico) para envio

### 5. Atualização Automática
- **RF017**: Implementar refresh automático na página `/my-rank` quando novos dados chegarem
- **RF018**: Usar real-time subscription do Supabase para detectar mudanças na tabela `analysis_results`
- **RF019**: Exibir notificação visual quando dados forem atualizados
- **RF020**: Manter polling a cada 5 segundos apenas quando não há dados (estado atual)

### 6. Otimizações de UX
- **RF021**: Melhorar estados de carregamento com skeleton loaders
- **RF022**: Adicionar feedback visual para todas as ações do usuário
- **RF023**: Implementar validação de domínio antes de submeter análise
- **RF024**: Adicionar tooltip explicativo sobre atualização semanal

## Não-Objetivos (Fora do Escopo)

- **NG001**: Múltiplos domínios por cliente (limitado a 1 domínio por cliente para MVP)
- **NG002**: Histórico detalhado de análises (apenas última análise)
- **NG003**: Compartilhamento de análises entre usuários
- **NG004**: Customização de frequência de atualização (fixo em semanal)
- **NG005**: Análise em tempo real (apenas via n8n semanal)
- **NG006**: Exportação de dados/relatórios
- **NG007**: Integração com outros sistemas além do n8n e Pipefy

## Considerações Técnicas

### Edge Functions
- Validar se `receive-analysis` está corretamente configurada no Supabase
- Implementar retry logic para falhas de comunicação com n8n
- Adicionar validação de schema para payload do n8n

### Estrutura de Dados
- Garantir que `analysis_data` JSONB suporte toda a estrutura do payload fornecido
- Implementar tipagem TypeScript para o formato de dados do n8n
- Validar integridade dos dados antes de salvar

### Real-time Updates
- Usar Supabase real-time subscriptions para detectar mudanças
- Implementar debouncing para evitar múltiplas atualizações simultâneas
- Adicionar fallback para navegadores que não suportam websockets

### Multilíngue
- Usar react-i18next ou similar para gerenciar traduções
- Implementar lazy loading de arquivos de idioma
- Garantir SEO para ambos os idiomas

## Métricas de Sucesso

### Métricas Técnicas
- **Taxa de sucesso de análises**: > 95% das análises devem ser processadas corretamente
- **Tempo de carregamento**: Página `/my-rank` deve carregar em < 2 segundos
- **Taxa de erros**: < 5% de erros na edge function `receive-analysis`
- **Precisão de dados**: 100% dos dados do n8n devem ser salvos corretamente

### Métricas de Usuário
- **Conversão análise → visualização**: > 80% dos usuários que fazem análise devem acessar `/my-rank`
- **Tempo de permanência**: Usuários devem ficar > 2 minutos na página `/my-rank`
- **Taxa de reporte de erros**: < 10% dos usuários devem reportar erros
- **Satisfação multilíngue**: Suporte completo a português e inglês sem erros de tradução

## Questões em Aberto

1. **Formato de domínio**: Devemos aceitar apenas domínios sem subdomínio (ex: `pipefy.com`) ou também com subdomínio (ex: `app.pipefy.com`)?

2. **Timeout de análise**: Qual deve ser o timeout máximo para uma análise ficar em "processando" antes de marcar como falha?

3. **Notificações**: Devemos implementar notificações por email quando a análise semanal for concluída?

4. **Cache**: Devemos implementar cache dos dados para melhorar performance, considerando que são atualizados semanalmente?

5. **Validação de domínio**: Devemos validar se o domínio existe/está acessível antes de submeter para análise?

---

**Prioridade**: Alta
**Estimativa**: 2-3 sprints
**Dependências**: n8n configurado, Webhook do Pipefy funcionando
**Riscos**: Possível instabilidade na integração n8n, complexidade do payload de dados 