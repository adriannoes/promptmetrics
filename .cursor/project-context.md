# PromptMetrics - Contexto Completo do Projeto

## 📋 Visão Geral do Projeto

**PromptMetrics** é uma plataforma de análise de brand analytics baseada em IA que monitora a presença de marcas em modelos de linguagem como GPT, Claude, Gemini, etc. A plataforma oferece insights estratégicos sobre como marcas são percebidas e rankeadas por diferentes LLMs.

### Proposta de Valor
- **Monitoramento de Brand AI**: Análise em tempo real da presença de marcas em LLMs
- **Inteligência Competitiva**: Comparação com concorrentes no universo AI
- **Insights de Otimização**: Estratégias para melhorar o posicionamento em LLMs
- **Dashboard Analytics**: Visualizações avançadas de dados de performance

### Filosofia Arquitetural: "Ultra-Simple"
O projeto adota uma filosofia de simplicidade extrema, evitando complexidade desnecessária:
- ✅ React + Supabase + Edge Functions + n8n
- ❌ Microserviços, filas de mensagem, múltiplos backends

---

## 🛠 Stack Tecnológico Completo

### Frontend Core
- **React 18.3.1**: Biblioteca principal com componentes funcionais
- **TypeScript**: Tipagem estática em modo strict
- **Vite**: Build tool e dev server
- **React Router DOM 6.26.2**: Roteamento client-side

### UI e Design System
- **Tailwind CSS 3.4.11**: Framework CSS utility-first
- **Shadcn/ui**: Sistema de componentes baseado em Radix UI
- **Radix UI**: Primitivos acessíveis (35+ packages)
- **Lucide React**: Biblioteca de ícones
- **Framer Motion 12.22.0**: Animações avançadas
- **Canvas Confetti**: Efeitos de celebração

### Estado e Formulários
- **TanStack Query 5.56.2**: Server state management
- **React Hook Form 7.53.0**: Gerenciamento de formulários
- **Zod 3.23.8**: Validação de schemas
- **@hookform/resolvers**: Integração RHF + Zod

### Visualização de Dados
- **Recharts 2.12.7**: Biblioteca de gráficos React
- **@number-flow/react**: Animações numéricas
- **DOMPurify**: Sanitização de HTML

### Backend/Serverless
- **Supabase**: BaaS completo (PostgreSQL + Auth + Edge Functions + Realtime)
- **PostgreSQL**: Banco de dados principal
- **Supabase Auth**: Sistema de autenticação
- **Edge Functions**: Serverless functions (Deno runtime)

### Integrações Externas
- **n8n**: Plataforma de automação para análise de dados
- **Google OAuth**: Autenticação social
- **Pipefy**: Webhook para relatórios de erro

### Ferramentas de Desenvolvimento
- **ESLint**: Linting com configuração TypeScript
- **Lovable**: Plataforma de desenvolvimento
- **Bun**: Package manager alternativo

---

## 📁 Estrutura de Arquivos Detalhada

```
├── .cursor/                     # Configurações da IDE e contexto
│   ├── mcp.json                 # MCP configuration
│   ├── rules/                   # Regras de desenvolvimento
│   └── project-context.md       # Este arquivo
├── docs/                        # Documentação do projeto
│   ├── DOCS.md                  # Documentação completa
│   ├── plan.md                  # Plano arquitetural
│   └── n8n-payload-structure.md # Estrutura do payload n8n
├── public/                      # Assets estáticos
│   ├── lovable-uploads/         # Imagens enviadas
│   ├── robots.txt               # SEO
│   └── sitemap.xml              # Mapa do site
├── src/                         # Código fonte principal
│   ├── components/              # Componentes React organizados
│   │   ├── ui/                  # Sistema de componentes base
│   │   ├── forms/               # Componentes de formulário
│   │   ├── admin/               # Interface administrativa
│   │   ├── demo/                # Componentes da demo
│   │   ├── lovable/             # Páginas específicas Lovable
│   │   ├── myrank/              # Páginas específicas MyRank
│   │   └── navigation/          # Componentes de navegação
│   ├── contexts/                # Context providers
│   ├── hooks/                   # Custom hooks
│   ├── integrations/            # Integrações externas
│   │   └── supabase/            # Cliente e tipos Supabase
│   ├── lib/                     # Utilitários
│   ├── pages/                   # Páginas/rotas da aplicação
│   ├── services/                # Camada de serviços
│   ├── types/                   # Definições TypeScript
│   ├── utils/                   # Funções utilitárias
│   ├── constants/               # Dados constantes
│   ├── App.tsx                  # Componente raiz
│   ├── main.tsx                 # Entry point
│   └── index.css                # Estilos globais + design tokens
├── supabase/                    # Configuração Supabase
│   ├── functions/               # Edge Functions
│   │   ├── trigger-analysis/    # Inicia análise n8n
│   │   ├── receive-analysis/    # Recebe resultados n8n
│   │   └── submit-waitlist/     # Gerencia lista de espera
│   ├── migrations/              # Migrações do banco
│   └── config.toml              # Configuração Supabase
├── tasks/                       # Documentação de tarefas
├── tailwind.config.ts           # Configuração Tailwind
├── vite.config.ts               # Configuração Vite
└── package.json                 # Dependências e scripts
```

---

## 🚀 Funcionalidades Principais

### 1. Sistema de Autenticação Multi-camadas
- **Supabase Auth**: Autenticação principal com Google OAuth
- **Demo Mode**: Acesso sem autenticação para demonstração
- **Invite Codes**: Sistema de convites para registro
- **Role-based Access**: Usuários regulares vs. administradores
- **Rate Limiting**: Proteção contra ataques de força bruta

### 2. Pipeline de Análise em Tempo Real
- **Domain Input**: Interface para submissão de domínios
- **n8n Integration**: Processamento via webhook para n8n
- **Real-time Updates**: Supabase Realtime para atualizações live
- **Status Tracking**: Estados: processing → completed → failed

### 3. Dashboard Analytics Avançado
- **Dashboard Tab**: Métricas principais, trends, sentiment
- **Competitor Analysis**: Análise competitiva com market share
- **Prompt Analysis**: Performance por LLM e prompt
- **Strategic Insights**: Recomendações e oportunidades

### 4. Sistema Administrativo
- **User Management**: CRUD de usuários
- **Invitation Codes**: Geração e gerenciamento de códigos
- **Audit Logs**: Rastreamento de ações administrativas
- **Analytics**: Estatísticas de uso

### 5. Internacionalização (i18n)
- **Português (PT-BR)**: Idioma principal
- **English (EN-US)**: Idioma secundário
- **Dynamic Switching**: Troca dinâmica de idioma
- **Context-based**: Textos contextualizados por página

### 6. Acessibilidade (a11y)
- **WCAG Compliance**: Conformidade com diretrizes
- **Keyboard Navigation**: Navegação completa por teclado
- **Screen Reader**: Suporte a leitores de tela
- **High Contrast**: Modo de alto contraste
- **Skip Navigation**: Links de pulo

### 7. Design System Robusto
- **Semantic Tokens**: Sistema de cores baseado em CSS variables
- **Dark/Light Mode**: Suporte completo a temas
- **Responsive Design**: Mobile-first approach
- **Component Variants**: Múltiplas variações de componentes
- **Animation System**: Micro-interações consistentes

---

## 🗃 Arquitetura de Dados

### Banco de Dados (PostgreSQL via Supabase)

#### Tabelas Principais
```sql
-- Perfis de usuário
profiles (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE,
  full_name TEXT,
  role TEXT DEFAULT 'user',
  organization_id UUID,
  invite_code TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Organizações (multi-tenancy)
organizations (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  domain TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Resultados de análise
analysis_results (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  domain TEXT NOT NULL,
  status TEXT DEFAULT 'processing',
  analysis_data JSONB,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Códigos de convite
invitation_codes (
  id UUID PRIMARY KEY,
  code TEXT UNIQUE,
  created_by UUID REFERENCES profiles(id),
  used BOOLEAN DEFAULT false,
  used_by UUID REFERENCES profiles(id),
  used_at TIMESTAMP,
  expires_at TIMESTAMP,
  created_at TIMESTAMP
)

-- Logs de auditoria
audit_logs (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL,
  table_name TEXT,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  created_at TIMESTAMP
)

-- Tentativas de login
login_attempts (
  id UUID PRIMARY KEY,
  email TEXT,
  ip_address INET,
  success BOOLEAN,
  attempted_at TIMESTAMP
)
```

#### Row Level Security (RLS)
- **Profiles**: Usuários só podem ver/editar próprio perfil
- **Analysis Results**: Dados isolados por usuário
- **Organizations**: Acesso baseado em membership
- **Admin Tables**: Apenas administradores

#### Funções do Banco
- `is_current_user_admin()`: Verifica se usuário é admin
- `consume_invitation_code()`: Consome código de convite
- `log_audit_event()`: Registra eventos de auditoria
- `is_rate_limited()`: Verifica rate limiting

### Estrutura de Dados de Análise (TypeScript)
```typescript
interface AnalysisDataStructure {
  // Dados básicos
  summary: string;
  score: number;
  recommendations: string[];
  
  // Dashboard data
  sentiment_trends: SentimentTrendData[];
  ranking_data: RankingData[];
  overall_sentiment: OverallSentimentItem[];
  share_of_rank: ChartDataPoint[];
  
  // Análise competitiva
  competitor_analysis: CompetitorAnalysisData;
  
  // Análise de prompts
  prompt_analysis: PromptAnalysisData;
  
  // Insights estratégicos
  strategic_insights: StrategicInsightsData;
}
```

---

## 🔄 Fluxos de Usuário

### 1. Jornada do Visitante
```
Landing Page → Demo → Signup (c/ invite) → Dashboard
```

### 2. Processo de Análise
```
Domain Input → Trigger Analysis → n8n Processing → 
Real-time Updates → Results Dashboard
```

### 3. Fluxo Administrativo
```
Admin Login → User Management → Invite Codes → 
Audit Logs → System Analytics
```

### 4. Sistema de Convites
```
Admin Gera Código → Usuário Recebe → Signup → 
Código Consumido → Acesso Liberado
```

---

## ⚡ Edge Functions (Supabase)

### 1. `trigger-analysis`
**Localização**: `supabase/functions/trigger-analysis/index.ts`
**Propósito**: Inicia o processo de análise via webhook n8n
**JWT**: Desabilitado (público)

**Fluxo**:
```
POST /trigger-analysis
Body: { domain: "example.com" }
↓
Valida domínio
↓
Chama webhook n8n
↓
Retorna confirmação
```

**Payload para n8n**:
```json
{
  "domain": "example.com",
  "timestamp": "2024-01-01T00:00:00Z",
  "source": "promptmetrics",
  "user_context": { ... }
}
```

### 2. `receive-analysis`
**Localização**: `supabase/functions/receive-analysis/index.ts`
**Propósito**: Recebe e processa resultados da análise do n8n
**JWT**: Habilitado (autenticado)

**Fluxo**:
```
POST /receive-analysis (do n8n)
Body: [{ domain, status, analysis_data }]
↓
Valida payload
↓
Processa dados (cores automáticas, competitors)
↓
Calcula métricas de qualidade
↓
Salva no banco (upsert)
↓
Trigger Realtime update
```

**Processamento de Dados**:
- Extração automática de competitors
- Geração de cores para gráficos
- Cálculo de métricas de completude
- Validação de estrutura de dados

### 3. `submit-waitlist`
**Localização**: `supabase/functions/submit-waitlist/index.ts`
**Propósito**: Gerencia submissões da lista de espera
**JWT**: Desabilitado (público)

**Fluxo**:
```
POST /submit-waitlist
Body: { name, email, phone }
↓
Valida dados
↓
Envia para webhook Pipefy
↓
Retorna confirmação
```

---

## 🧩 Componentes e Páginas

### Páginas Principais (`src/pages/`)
- **Index**: Landing page com hero, pricing, FAQ
- **Demo**: Dashboard demo com dados mock
- **DemoPM3**: Dashboard com dados reais (análise Airbnb)
- **Login/Signup**: Autenticação com invite codes
- **Analysis**: Dashboard principal pós-login
- **Admin**: Interface administrativa completa
- **Home**: Dashboard organizacional
- **DomainSetup**: Configuração de domínio para análise

### Sistema de Componentes UI (`src/components/ui/`)
Baseado em Shadcn/ui com customizações:
- **button**: Múltiplas variantes (default, destructive, outline, etc.)
- **card**: Containers com padding e bordas consistentes
- **dialog**: Modais acessíveis
- **form**: Integração React Hook Form + Zod
- **tabs**: Navegação por abas
- **toast**: Notificações temporárias
- **chart**: Wrapper para Recharts com tema consistente

### Componentes Especializados
- **AccessibilityPanel**: Controles de acessibilidade
- **AnalysisProgressModal**: Modal de progresso em tempo real
- **RealTimeNotification**: Notificações via Supabase Realtime
- **LanguageSelector**: Seletor de idioma
- **PhoneInput**: Input de telefone internacionalizado

### Componentes Demo (`src/components/demo/`)
- **DashboardTab**: Métricas principais e trends
- **CompetitorAnalysisTab**: Análise competitiva
- **PromptAnalysisTab**: Performance por LLM
- **StrategicInsightsTab**: Insights e recomendações
- **PromptFlashCards**: Visualização de prompts
- **SentimentAnalysis**: Análise de sentimento

---

## 🎣 Custom Hooks

### Autenticação (`src/hooks/`)
- **useAuthState**: Estado global de autenticação
- **useSupabaseAuth**: Integração com Supabase Auth
- **useDemoAuth**: Lógica de autenticação demo
- **usePostLoginRedirect**: Redirecionamento pós-login

### Dados (`src/hooks/`)
- **useAnalysisData**: Fetch de dados de análise
- **useRealTimeAnalysis**: Subscrições Realtime
- **useUserAnalysis**: Análises do usuário logado
- **usePromptFilters**: Filtros de prompt analysis

### Admin (`src/hooks/`)
- **useAdminUsers**: Gerenciamento de usuários
- **useContactForm**: Formulário de contato

### UI (`src/hooks/`)
- **use-media-query**: Responsive breakpoints
- **use-mobile**: Detecção de dispositivo móvel
- **use-toast**: Sistema de notificações

---

## 🔧 Services (`src/services/`)

### authService.ts
Camada de abstração para autenticação:
```typescript
- signIn(email, password, inviteCode?)
- signUp(email, password, inviteCode)
- signOut()
- resetPassword(email)
- getCurrentUser()
```

### errorReporting.ts
Sistema de relatório de erros:
```typescript
- reportError(error, context)
- reportToPipefy(errorData)
```

### redirectService.ts
Lógica de redirecionamento:
```typescript
- getPostLoginRedirect(user)
- handleDemoRedirect()
- validateRoute(path)
```

---

## ⚙️ Configurações

### Vite (`vite.config.ts`)
```typescript
- Plugin React SWC
- Path aliases (@/)
- Build optimization
- Dev server configuration
```

### Tailwind (`tailwind.config.ts`)
```typescript
- Design tokens integration
- Custom colors from CSS variables
- Typography plugin
- Animation extensions
- Component layer organization
```

### Supabase (`supabase/config.toml`)
```toml
- Project ID: racfoelvuhdifnekjsro
- API port: 54321
- DB port: 54322
- Studio port: 54323
- Public functions: trigger-analysis, submit-waitlist
```

### TypeScript (`tsconfig.json`)
```json
- Strict mode enabled
- Path mapping
- Modern target (ES2020)
- JSX: react-jsx
```

---

## 🏗 Decisões Arquiteturais Importantes

### 1. Por que Supabase?
- **Rapidez de desenvolvimento**: BaaS completo
- **Real-time nativo**: Subscriptions automáticas
- **Edge Functions**: Serverless sem complexidade
- **PostgreSQL**: Banco robusto e familiar
- **Autenticação integrada**: Social login out-of-the-box

### 2. Sistema de Cores Automáticas
- Edge function gera cores automaticamente para competitors
- Evita necessidade de definir cores no n8n
- Consistência visual garantida
- Baseado em palette pré-definida

### 3. Real-time vs Polling
- **Escolhido**: Supabase Realtime
- **Vantagem**: Atualizações instantâneas
- **Performance**: Menor carga no servidor
- **UX**: Feedback imediato ao usuário

### 4. Estrutura de Componentes
- **Atomic Design**: Atoms → Molecules → Organisms
- **Feature-based**: Componentes agrupados por funcionalidade
- **Reusabilidade**: Sistema de variantes consistente
- **Acessibilidade**: ARIA labels e keyboard navigation

### 5. Gestão de Estado
- **Server State**: TanStack Query para cache e sincronização
- **Client State**: React Context para estado global
- **Form State**: React Hook Form para formulários
- **Evitado**: Redux/Zustand (complexidade desnecessária)

### 6. Tipagem TypeScript
- **Strict mode**: Máxima segurança de tipos
- **Interface segregation**: Tipos específicos por contexto
- **Geração automática**: Tipos Supabase via CLI
- **Validação runtime**: Zod para validação de dados

---

## 🔐 Segurança

### Row Level Security (RLS)
- Todas as tabelas principais têm RLS habilitado
- Políticas baseadas em `auth.uid()`
- Isolamento completo entre usuários/organizações

### Rate Limiting
- Função `is_rate_limited()` no banco
- Proteção contra ataques de força bruta
- Limite configurável por tempo/tentativas

### Validação de Dados
- Zod schemas para validação client-side
- Validação adicional nas Edge Functions
- Sanitização com DOMPurify

### Auditoria
- Log de todas as ações administrativas
- Rastreamento de mudanças de papel
- Histórico de tentativas de login

---

## 📊 Monitoramento e Analytics

### Supabase Analytics
- Logs de Edge Functions automáticos
- Métricas de performance do banco
- Monitoramento de autenticação

### Audit Logs
- Tabela dedicada para auditoria
- Trigger automático em mudanças críticas
- Interface admin para visualização

### Error Reporting
- Integração com Pipefy para erros críticos
- Context capture para debugging
- Alertas automáticos

---

## 🚀 Deploy e Ambientes

### Desenvolvimento
- Supabase local via CLI
- Hot reload com Vite
- Banco local PostgreSQL

### Produção
- Supabase hosted
- Edge Functions auto-deploy
- CDN para assets estáticos

### CI/CD
- Deploy automático via Lovable
- Migrações de banco automáticas
- Rollback rápido se necessário

---

## 📈 Performance

### Frontend
- Code splitting por rota
- Lazy loading de componentes
- React Query cache
- Image optimization

### Backend
- Edge Functions globalmente distribuídas
- Conexões PostgreSQL pooled
- Índices otimizados no banco

### Caching
- TanStack Query para dados
- Supabase cache automático
- CDN para assets

---

## 🔮 Roadmap e Extensibilidade

### Próximas Features
- Export de relatórios (PDF/Excel)
- Webhooks para integração
- API pública
- Multi-organização avançada

### Arquitetura Preparada Para
- Múltiplos provedores de LLM
- Análises customizáveis
- Integrações third-party
- Escalabilidade horizontal

---

## 📚 Recursos e Documentação

### Documentação Interna
- `docs/DOCS.md`: Documentação completa
- `docs/plan.md`: Plano arquitetural
- `docs/n8n-payload-structure.md`: Estrutura de dados

### Recursos Externos
- [Supabase Docs](https://supabase.com/docs)
- [Shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Query](https://tanstack.com/query/)

---

## 🎯 Pontos de Entrada para Desenvolvimento

### Para Novos Recursos
1. Definir tipos em `src/types/`
2. Criar componentes em `src/components/`
3. Implementar hooks em `src/hooks/`
4. Adicionar rotas em `App.tsx`
5. Atualizar Edge Functions se necessário

### Para Mudanças no Banco
1. Usar ferramenta de migração
2. Atualizar tipos TypeScript
3. Ajustar RLS policies
4. Testar com dados reais

### Para Mudanças de UI
1. Verificar design tokens em `index.css`
2. Atualizar componentes base se necessário
3. Manter consistência com Shadcn/ui
4. Testar responsividade

---

*Este documento serve como referência completa para entender toda a arquitetura, tecnologias e decisões do projeto PromptMetrics. Deve ser atualizado conforme o projeto evolui.*