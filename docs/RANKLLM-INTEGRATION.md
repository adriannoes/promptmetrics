# Integração RankLLM - Documentação Completa

## 🎯 Visão Geral

Esta documentação descreve a integração completa do RankLLM como uma nova funcionalidade independente no sistema PromptMetrics, permitindo reranking avançado de documentos usando modelos LLM state-of-the-art.

## 🏗️ Arquitetura Implementada

### Componentes Principais

1. **Microserviço Python** (`rank-llm-service/`)
   - FastAPI com RankLLM
   - Docker containerizado
   - Suporte a múltiplos modelos

2. **Edge Functions Supabase**
   - `trigger-rankllm-analysis` - Inicia análise
   - `get-rankllm-data` - Recupera resultados

3. **Frontend React**
   - Página `/document-ranking`
   - Componentes especializados
   - Controle de acesso por organização

4. **Banco de Dados**
   - Tabela `rankllm_results`
   - Feature flags por organização
   - RLS policies

## 📁 Estrutura de Arquivos

```
rank-me-llm/
├── rank-llm-service/                 # Microserviço Python
│   ├── app/
│   │   ├── main.py                  # FastAPI app
│   │   ├── models.py                 # Pydantic models
│   │   ├── reranker.py              # RankLLM wrapper
│   │   └── config.py                 # Configuração
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── requirements.txt
│   └── README.md
├── supabase/
│   ├── functions/
│   │   ├── trigger-rankllm-analysis/
│   │   └── get-rankllm-data/
│   └── migrations/
│       ├── 20250103000000_rankllm_results.sql
│       └── 20250103000001_analysis_method_preference.sql
├── src/
│   ├── pages/
│   │   └── DocumentRanking.tsx       # Página principal
│   ├── components/dashboard/rankllm/
│   │   ├── RankLLMInput.tsx         # Formulário de entrada
│   │   ├── RankLLMResults.tsx       # Exibição de resultados
│   │   └── ModelSelector.tsx        # Seletor de modelos
│   ├── components/admin/
│   │   └── AnalysisMethodSettings.tsx # Configuração admin
│   ├── hooks/
│   │   └── useRankLLMAccess.ts      # Hook de acesso
│   └── types/
│       └── rankllm.ts              # Types TypeScript
└── docs/
    └── RANKLLM-INTEGRATION.md       # Esta documentação
```

## 🚀 Como Usar

### 1. Configuração do Microserviço

```bash
cd rank-llm-service
docker-compose up --build
```

### 2. Configurar Variáveis de Ambiente

No Supabase, adicionar:
```
RANKLLM_SERVICE_URL=http://localhost:8000
```

### 3. Executar Migrações

```bash
supabase db reset
# ou
supabase migration up
```

### 4. Acessar a Interface

1. Fazer login no sistema
2. Navegar para `/document-ranking`
3. Configurar análise de documentos

## 🔧 Configuração por Organização

### Administradores

1. Acessar configurações da organização
2. Selecionar método de análise:
   - **N8N**: Método original
   - **RankLLM**: Novo método
   - **Both**: Usuários escolhem

### Usuários

- Acesso automático baseado na configuração da organização
- Interface adaptativa conforme permissões

## 📊 Modelos Disponíveis

| Modelo | Tipo | Tamanho | Memória | Uso |
|--------|------|---------|---------|-----|
| MonoT5 | Pointwise | 3B | 6GB | Geral |
| RankZephyr | Listwise | 7B | 14GB | Máxima precisão |
| RankVicuna | Listwise | 7B | 14GB | Balanceado |
| DuoT5 | Pairwise | 3B | 6GB | Alta precisão |

## 🔒 Controle de Acesso

### RLS Policies

```sql
-- Usuários podem ver resultados da sua organização
CREATE POLICY "Users can view their organization rankllm results"
ON public.rankllm_results FOR SELECT
TO authenticated
USING (domain IN (SELECT website_url FROM organizations WHERE ...));

-- Apenas admins podem gerenciar
CREATE POLICY "Only admins can manage rankllm results"
ON public.rankllm_results FOR ALL
TO authenticated
USING (is_current_user_admin());
```

### Funções de Verificação

```sql
-- Verificar se usuário pode acessar RankLLM
SELECT can_access_rankllm(auth.uid());

-- Obter método preferido da organização
SELECT get_user_analysis_method(auth.uid());
```

## 🧪 Testes

### Teste Manual

1. **Microserviço:**
   ```bash
   curl http://localhost:8000/health
   ```

2. **Edge Function:**
   ```bash
   curl -X POST https://your-project.supabase.co/functions/v1/trigger-rankllm-analysis \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"domain": "test.com", "query": "test", "documents": []}'
   ```

3. **Frontend:**
   - Acessar `/document-ranking`
   - Testar formulário
   - Verificar resultados

### Teste de Integração

```bash
# 1. Iniciar microserviço
cd rank-llm-service && docker-compose up

# 2. Testar edge function
# 3. Testar frontend
# 4. Verificar banco de dados
```

## 🚨 Troubleshooting

### Problemas Comuns

1. **Microserviço não inicia:**
   - Verificar JDK 21 instalado
   - Verificar memória disponível (mín. 4GB)
   - Verificar logs: `docker-compose logs`

2. **Edge Function falha:**
   - Verificar `RANKLLM_SERVICE_URL`
   - Verificar conectividade
   - Verificar logs do Supabase

3. **Frontend não carrega:**
   - Verificar permissões de usuário
   - Verificar configuração da organização
   - Verificar console do navegador

### Logs Importantes

```bash
# Microserviço
docker-compose logs -f rankllm-service

# Supabase Edge Functions
# Verificar no dashboard do Supabase

# Frontend
# Console do navegador (F12)
```

## 📈 Monitoramento

### Métricas do Microserviço

- Health check: `GET /health`
- Modelos disponíveis: `GET /models`
- Uso de memória e CPU

### Métricas do Banco

```sql
-- Análises por organização
SELECT domain, COUNT(*) as total_analyses
FROM rankllm_results 
GROUP BY domain;

-- Performance por modelo
SELECT model_used, AVG(ranking_data->>'metrics'->>'processing_time_ms') as avg_time
FROM rankllm_results 
GROUP BY model_used;
```

## 🔄 Rollback

### Reversão Completa

1. **Desabilitar feature flag:**
   ```sql
   UPDATE organizations 
   SET preferred_analysis_method = 'n8n' 
   WHERE preferred_analysis_method IN ('rankllm', 'both');
   ```

2. **Parar microserviço:**
   ```bash
   docker-compose down
   ```

3. **Remover rota (opcional):**
   - Comentar rota em `App.tsx`
   - Remover link na navegação

### Reversão Parcial

- Manter microserviço rodando
- Alterar apenas configuração da organização
- Usuários perdem acesso, mas dados preservados

## 🎯 Próximos Passos

### Melhorias Planejadas

1. **Performance:**
   - Cache de modelos
   - Processamento em lote
   - Otimização de memória

2. **Funcionalidades:**
   - Mais modelos
   - Métricas avançadas
   - Exportação de dados

3. **UI/UX:**
   - Comparação lado a lado
   - Histórico de análises
   - Dashboard de métricas

### Roadmap

- [ ] Testes automatizados
- [ ] CI/CD pipeline
- [ ] Monitoramento avançado
- [ ] Documentação de API
- [ ] SDK para integração

## 📚 Referências

- [RankLLM GitHub](https://github.com/castorini/rank_llm)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Docker Documentation](https://docs.docker.com/)

---

**Status da Implementação:** ✅ Completa
**Última Atualização:** Janeiro 2025
**Versão:** 1.0.0
