# Product Requirement Document: Experiência de Onboarding e Uso Inicial

## Introdução/Overview

Este documento descreve os requisitos para otimizar a experiência de onboarding e uso inicial do PromptMetrics, com foco especial na **first-time user experience**. O objetivo é criar um fluxo linear, simples e eficiente que leve o usuário do primeiro login até sua primeira análise sem distrações ou funcionalidades desnecessárias. 

### Filosofia: Simplicidade Extrema
- **Menos é mais**: Remover tudo que não é essencial para o primeiro uso
- **Fluxo linear**: Evitar múltiplas opções que confundam o usuário
- **Feedback imediato**: Mostrar progresso e valor em cada etapa

## Objetivos (Goals)

1. **Reduzir tempo para primeira análise**: Usuário deve conseguir ver sua primeira análise em menos de 5 minutos após o login
2. **Aumentar taxa de conclusão do onboarding**: Atingir 90% de usuários completando a configuração do domínio
3. **Melhorar clareza da navegação**: 100% dos usuários devem encontrar o botão de análise sem ajuda
4. **Garantir feedback em tempo real**: Usuário deve ter visibilidade clara do progresso da análise

## User Stories

1. **Como novo usuário**, quero configurar meu domínio rapidamente para começar a analisar minha presença em LLMs
2. **Como usuário com domínio configurado**, quero acessar facilmente minhas análises a partir da página inicial
3. **Como usuário aguardando análise**, quero ver o progresso em tempo real e estimativa de conclusão
4. **Como usuário retornando**, quero ver imediatamente o status da minha última análise e poder iniciar uma nova

## Requisitos Funcionais

### 1. Fluxo de Onboarding
1.1. O sistema deve detectar automaticamente se o usuário tem domínio configurado após login
1.2. Se não tiver domínio, redirecionar para `/domain-setup`
1.3. A página `/domain-setup` deve validar o formato do domínio em tempo real
1.4. Após salvar domínio, iniciar análise automaticamente via `trigger-analysis` Edge Function
1.5. Redirecionar para `/home/{organization-slug}` com indicador de análise em progresso

### 2. Página Home da Organização
2.1. Adicionar botão proeminente "Minha Análise" no `OrganizationDashboard`
2.2. O botão deve ter estados visuais diferentes:
   - "Ver Análise" (quando há análise concluída)
   - "Análise em Progresso" (quando análise está sendo processada)
   - "Iniciar Análise" (quando não há análise ou falhou)
2.3. Implementar card de status da análise mostrando:
   - Data da última análise
   - Score geral
   - Botão de ação principal
2.4. O botão deve redirecionar para `/analysis` mantendo contexto da organização

### 3. Integração com Edge Functions
3.1. `trigger-analysis` deve ser chamada automaticamente após configurar domínio
3.2. Implementar polling ou WebSocket para atualizar status em tempo real
3.3. `receive-analysis` deve notificar o frontend quando análise for concluída
3.4. Adicionar tratamento de erros com opção de retry

### 4. Página de Análise
4.1. Adaptar `/analysis` para reconhecer contexto organizacional
4.2. Pré-preencher domínio da organização quando acessada via `/home`
4.3. Mostrar histórico de análises filtrado pela organização atual
4.4. Adicionar breadcrumb: Home > {Organization} > Análise

### 5. Feedback e Progresso
5.1. Implementar modal de progresso durante análise com:
   - Barra de progresso estimada
   - Mensagens de status ("Analisando SEO...", "Verificando competitors...")
   - Tempo estimado restante
5.2. Notificações toast quando análise for concluída
5.3. Email de notificação quando análise estiver pronta (opcional)

## Non-Goals (Fora de Escopo)

1. Não incluir configurações avançadas de análise nesta fase
2. Não implementar análise comparativa entre múltiplos domínios
3. Não adicionar customização de frequência de análise automática
4. Não incluir exportação de relatórios

## 🧹 Limpeza da Codebase (Páginas para Remoção)

### Páginas Desnecessárias para First-Time Experience
As seguintes páginas devem ser **removidas** para simplificar o fluxo inicial:

#### 1. Páginas Demo Desnecessárias
- **`/demo-airbnb`** (demo-airbnb.tsx) - Dados mock complexos desnecessários
- **`/lovable`** (Lovable.tsx) - Página específica para parceiro, não core

#### 2. Páginas Funcionalmente Redundantes
- **`/my-rank`** (MyRank.tsx) - Funcionalidade duplicada com `/analysis`

#### 3. Páginas Demo Essenciais (MANTER)
- **`/demo`** (Demo.tsx) - **MANTER**: Essencial para leads entenderem o produto
- **`/demo-pm3`** (DemoPM3.tsx) - **MANTER**: Benchmark para testar Edge Functions com dados reais

#### 4. Consolidação de Home
- **`/home`** será a página principal personalizada por domínio/organização
- **`/organization`** (OrganizationHome.tsx) será renomeada para Home.tsx

#### 3. Páginas Secundárias
- **`/changelog`** (Changelog.tsx) - Pode ser movido para modal ou seção no footer

### Fluxo Simplificado Proposto
```
Login → /domain-setup (se necessário) → /home (personalizado por domínio) → /analysis
```

### Benefícios da Limpeza
1. **Redução de 27% nas páginas**: De 15 para 11 páginas focadas
2. **Menor surface de bugs**: Menos código para manter
3. **Foco no essencial**: Usuário tem path claro mas demos úteis preservadas
4. **Melhor conversão**: /demo mantida para leads, /demo-pm3 para benchmark
5. **Home unificado**: Uma página principal que se adapta ao contexto

## Considerações de Design

1. **Botão "Minha Análise"**:
   - Usar componente CTAButton existente
   - Ícone: BarChart3 da lucide-react
   - Cores: Gradiente azul-indigo quando ativo
   - Posição: Card destacado no OrganizationDashboard

2. **Modal de Progresso**:
   - Usar componente Dialog do shadcn/ui
   - Animações com Framer Motion
   - Design consistente com AuroraBackground

3. **Estados Visuais**:
   - Loading: Spinner animado com skeleton
   - Erro: Alert com opção de retry
   - Sucesso: Confetti animation

## Considerações Técnicas

1. **Modificações necessárias**:
   - Atualizar `OrganizationDashboard` para incluir seção de análise
   - Criar hook `useAnalysisStatus` para gerenciar estado
   - Implementar contexto `AnalysisContext` para compartilhar estado
   - Adicionar rota `/analysis` com suporte a parâmetros organizacionais

2. **Integrações**:
   - Usar Supabase Realtime para atualizações de status
   - Cache com TanStack Query para otimizar requisições
   - Integrar com sistema de notificações existente

3. **Performance**:
   - Implementar debounce na validação de domínio
   - Lazy loading para componentes de análise
   - Prefetch de dados quando hover no botão

4. **Arquivos para Remoção**:
   ```
   src/pages/demo-airbnb.tsx
   src/pages/Lovable.tsx
   src/pages/MyRank.tsx
   src/pages/Changelog.tsx
   
   src/components/lovable/*
   src/components/myrank/*
   ```

5. **Refatoração Necessária**:
   - **Renomear**: `OrganizationHome.tsx` → `Home.tsx`
   - **Atualizar rotas**: `/home/{slug}` → `/home` (personalizado por domínio no Supabase)
   - **Remover rotas**: `/lovable`, `/my-rank`, `/changelog`, `/demo-airbnb`
   - **Manter rotas**: `/`, `/login`, `/signup`, `/demo`, `/demo-pm3`, `/domain-setup`, `/home`, `/analysis`, `/admin`

6. **Lógica de Personalização da Home**:
   - Consultar domínio (único) do usuário no Supabase
   - Renderizar dashboard específico baseado no `website_url` da organização
   - Sem suporte a múltiplas organizações/invites nesta fase
   - Manter componente OrganizationDashboard integrado à Home principal

## Métricas de Sucesso

1. **Taxa de Conclusão do Onboarding**: 90% dos usuários completam configuração de domínio
2. **Tempo para Primeira Análise**: < 5 minutos do login até visualização
3. **Taxa de Cliques no Botão**: > 80% dos usuários clicam em "Minha Análise" na primeira visita
4. **Taxa de Retry em Erros**: < 10% dos usuários precisam tentar novamente
5. **NPS do Onboarding**: > 8.0

## 📋 Plano de Implementação

### Fase 1: Limpeza da Codebase (Semana 1)
1. **Remover páginas desnecessárias** (Demo, DemoPM3, Lovable, etc.)
2. **Consolidar rotas** no App.tsx
3. **Limpar componentes órfãos** (demo/*, lovable/*, myrank/*)
4. **Atualizar redirecionamentos** para fluxo simplificado

### Fase 2: Melhorar OrganizationDashboard (Semana 2)
1. **Adicionar seção de análise** com botão proeminente
2. **Implementar estados visuais** (análise disponível, em progresso, erro)
3. **Integrar com Edge Functions** existentes
4. **Adicionar feedback em tempo real**
5. **Garantir suporte a reanálise manual** caso usuário deseje atualizar indicadores

### Fase 3: Otimizar Análise (Semana 3)
1. **Melhorar contexto organizacional** na página /analysis
2. **Implementar modal de progresso**
3. **Adicionar notificações** toast/email
4. **Testes de usabilidade** com usuários reais

## Questões Abertas

1. ~~Devemos permitir múltiplos domínios por organização no futuro?~~ **Resolvido**: Não para v1
2. ~~Como lidar com análises que demoram mais de 10 minutos?~~ **Resolvido**: Usuário permanece na Home; sem timeout/retry automático nesta fase.
3. ~~Precisamos de um tutorial interativo para primeiro uso?~~ **Resolvido**: Não, foco em simplicidade
4. ~~Devemos adicionar templates de domínio para facilitar?~~ **Resolvido**: Não para v1
5. Como integrar com planos de assinatura (limites de análise)?
6. **Nova**: Como comunicar que demos foram removidas para usuários existentes?

---

*Documento criado em: ${new Date().toISOString()}*
*Versão: 1.0*
