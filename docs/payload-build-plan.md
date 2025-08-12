## Plano de Build do Payload (n8n → Supabase)

### Objetivo
Alinhar o workflow atual do n8n (`docs/payload/PromptMetrics.json`) para produzir e enviar, via `HTTP Request`, o payload final no formato esperado por `receive-analysis` conforme documentado em `docs/payload/n8n-payload-structure.md`, garantindo consistência dos campos obrigatórios, metadados e boas práticas de segurança.

### Escopo
- Manter a estratégia de múltiplos LLMs e consolidação já presentes no workflow atual.
- Ajustar a montagem do objeto final em `Montar payload` para aderir ao schema alvo.
- Endurecer o envio para a Edge Function (`receive-analysis`) com HMAC opcional e HTTPS/TLS.
- Definir um plano de testes e validação ponta a ponta.

### Referências (para consulta rápida)
- n8n: [Webhook](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/), [HTTP Request](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.httprequest/), [Merge](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.merge/), [Split Out](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.splitout/), [Code/Function](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.code/), [Crypto (HMAC)](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.crypto/), [Credentials](https://docs.n8n.io/credentials/)
- Supabase Edge Functions: [HTTP](https://supabase.com/docs/guides/functions#invoke-from-the-client), [Env Vars](https://supabase.com/docs/guides/functions/secrets)

---

## 1) Estado atual do workflow (resumo orientado a alterações)

Nodes principais em `PromptMetrics.json`:
- `Webhook` → `auth` (IF) → `Setup Search` (agent) com ferramentas `buscaGoogle` (SerpApi) e `Wikipedia` + `Setup Output Parser`/`Setup Search Model`.
- `Top 10 Prompts` (agent) + `Parser 10 Prompts` → `Analysis + Prompts` (Set) → `Split Out` → execução paralela nos LLMs (`OpenAI`, `Gemini`, `Claude`) via `chainLlm` e normalização em `promptResults*` (Set) → `Merge` (3 entradas) → `preparandoRespostasModelos` (Code) agrega `comparative_results`.
- Análise final: `Estrategista de Negócios` (agent) → `Dados Quantitativos` (agent) → `Strategic Insights` (agent) com parsers dedicados; tudo converge em `Juntar respostas` → `Dados para payload` (Set) → `Montar payload` (Code) → `HTTP Request` para `receive-analysis`.

O que já está correto:
- Estrutura geral de enriquecimento (agents) e consolidação.
- Envio final ao endpoint `receive-analysis`.

Gaps principais para o payload alvo:
- Metadados em `analysis_data`: `version`, `generated_at` e `request_id` não são montados no payload atual (a Edge hoje não injeta; recomendado enviar prontos).
- `prompt_analysis.performance_metrics` hoje traz métricas operacionais (tokens/latência). O documento-alvo sugere métricas de menções/sentimento (opcionais, porém preferenciais).
- Assinatura HMAC `x-signature` (opcional/recomendado) ainda não é gerada no fluxo antes do `HTTP Request`.

---

## 2) Alterações propostas por nó (passo a passo)

1. `Estrategista de Negócios` (agent)
   - Garantir que o Output Parser (`Parser Estrategista`) esteja validando e retornando exatamente: `summary`, `score`, `recommendations`, `competitor_analysis`, `strategic_insights`.
   - A saída deve ser enxuta, sem campos extras.

2. `Dados Quantitativos` (agent)
   - Já instruído a gerar apenas: `sentiment_trends`, `ranking_data`, `share_of_rank`, `overall_sentiment` e repassar `summary`, `score`, `recommendations`.
   - Confirmar que fornece ao menos 6 meses em `sentiment_trends` e `ranking_data` (ex.: últimos 6).
   - Cores em `overall_sentiment` são opcionais; a Edge complementa, mas preferimos enviar.

3. `Comparativo de LLMs` (agent) + `Parser Análise LLMs`
   - Utilizado para consolidar `model_assessment` e `synthesized_responses` e gerar `ranking_by_prompt`.
   - Alinhar o contrato para que `ranking_by_prompt` reflita prompts reais e key da marca do cliente.

4. Novo: `Calcular performance_metrics (Code)`
   - Inserir um nó `Code` após `Parser Análise LLMs` (ou após `Juntar respostas`) que gere `prompt_analysis.performance_metrics` no formato preferencial do documento:
     - `total_mentions`, `positive_mentions`, `neutral_mentions`, `negative_mentions`, `sentiment_score`.
   - Estratégia mínima (heurística):
     - `total_mentions` = número de prompts analisados × número de modelos executados.
     - Proporções positivas/negativas/neutras com base em palavras-chave ou um classificador simples via LLM (facultativo nas primeiras iterações; se ausente, manter valores default).
     - `sentiment_score` (0–100) pode ser média ponderada se houver escore por prompt; caso contrário, usar média dos escores dos LLMs se disponíveis.

5. `Montar payload` (Code)
   - Atualizar para montar exatamente o schema alvo (incluindo metadados dentro de `analysis_data`):
     - Adicionar `version: 1`, `generated_at: new Date().toISOString()`, `request_id: uuid`.
     - Manter campos obrigatórios: `summary`, `score`, `recommendations`.
     - Incluir se presentes: `sentiment_trends`, `ranking_data`, `overall_sentiment`, `share_of_rank`, `competitor_analysis`, `strategic_insights`.
     - Em `prompt_analysis`: mapear `model_assessment` → `sentiment_by_llm`; manter `ranking_by_prompt`; e usar a nova chave `performance_metrics` no formato descrito acima.

6. Novo: `Crypto (HMAC)` → `HTTP Request`
   - Adicionar nó `Crypto` (Operation: Hmac) ANTES do `HTTP Request`.
   - Input: o JSON final do `Montar payload` (stringificado).
   - Hash algorithm: `sha256`; Secret: credencial segura `N8N_HMAC_SECRET` (usar credencial/secret do n8n, nunca em texto puro).
   - Conectar saída ao `HTTP Request` e enviar header `x-signature: <hash-base64>`. No `HTTP Request`, usar `Content-Type: application/json`. Evitar enviar chaves `Authorization/apikey` neste endpoint (a Edge não exige; em produção, manter TLS/HTTPS).

7. `HTTP Request`
   - Confirmar URL de produção (HTTPS/TLS) da Edge `receive-analysis`.
   - Habilitar credencial de Header Auth se desejado para separar `x-signature` do corpo do node, mas preferível setar o header dinamicamente a partir do `Crypto`.

Observação: Todos os nós já existentes (e citados) podem ser mantidos. O foco é apenas ajustar o contrato de saída e adicionar a etapa de assinatura.

---

## 3) Segurança e segredos
- Sempre usar HTTPS/TLS para chamadas ao Supabase Functions.
- Nunca embutir segredos em texto no workflow; usar credenciais/secrets do n8n.
- `x-signature`: HMAC-SHA256 do corpo bruto JSON com `N8N_HMAC_SECRET`. Em dev é opcional; em prod recomendado.
- Manter um `.env.example` com placeholders (no repositório) e guardar segredos reais fora do versionamento.

---

## 4) Testes e validação (TDD prático)

Antes de alterar o workflow
- Criar um payload de exemplo (mínimo) conforme sessão “Payload Básico” em `n8n-payload-structure.md` e validar que a Edge responde 200.

Após as alterações
1) Execução no n8n (manual)
   - Rodar o workflow com `domain` de teste (ex.: `pipefy.com`).
   - Verificar no node `HTTP Request` a resposta `success: true` e `data_summary.completeness_score` alto (idealmente 100 quando todas seções forem populadas).

2) Smoke test via Edge `trigger-analysis`
- Com variáveis exportadas localmente (nunca commitar):
  ```bash
  export SUPABASE_ANON_KEY="<sua-anon-key>"  # Define a anon key localmente para testes; não commite
  ```
- Disparar a função (substitua `<project-ref>`):
  ```bash
  curl -i -X POST -H "Content-Type: application/json" \
    -d '{"domain":"example.com"}' \
    https://<project-ref>.functions.supabase.co/trigger-analysis
  ```
  Explicação: chama a função `trigger-analysis` para simular o fluxo n8n end-to-end.

3) Verificar persistência
- Conferir tabela `analysis_results` (via SQL Editor do Supabase ou psql) para o domínio enviado.
  - Chaves esperadas: `domain` (normalizado), `status` (completed), `analysis_data` com campos obrigatórios e metadados.

4) Testes automatizados (sugestão)
- Adicionar um script de integração (Node) que publica um payload de exemplo direto na Edge `receive-analysis` e valida o shape do response (`sections_complete`, `completeness_score`).
- Critério de sucesso: resposta 2xx e `completeness_score ≥ 80` no mínimo (ideal 100 quando campos opcionais presentes).

---

## 5) Critérios de aceite
- Payload final contém, no mínimo: `domain`, `status`, `analysis_data.summary`, `analysis_data.score`, `analysis_data.recommendations`.
- Metadados presentes: `analysis_data.version`, `analysis_data.generated_at`, `analysis_data.request_id`.
- Seções opcionais populadas quando disponíveis: `sentiment_trends`, `ranking_data`, `overall_sentiment`, `share_of_rank`, `competitor_analysis`, `strategic_insights`, `prompt_analysis.sentiment_by_llm`, `prompt_analysis.ranking_by_prompt`, `prompt_analysis.performance_metrics`.
- Resposta da Edge retorna `success: true` e `data_summary` coerente (sem seções faltantes quando foram enviadas).

---

## 6) Plano de rollout
1. Clonar workflow atual no n8n e trabalhar na cópia (evitar impacto em produção).
2. Implementar as alterações dos itens 4 e 5, validar em ambiente de dev.
3. Testes manuais + script de integração.
4. Publicar credenciais/segredos em ambiente seguro do n8n (sem commit).
5. Promover para produção em janela de baixo risco.

Rollback: manter versão anterior do workflow publicada; caso falhas ocorram, reverter o workflow em n8n.

---

## 7) Checklist de implementação
- [ ] `Estrategista de Negócios` + parser alinhados ao contrato.
- [ ] `Dados Quantitativos` gera 6 meses de dados e cores.
- [ ] `Comparativo de LLMs` produz `ranking_by_prompt` coerente.
- [ ] `Calcular performance_metrics (Code)` gera métricas no formato preferencial.
- [ ] `Montar payload` inclui metadados e mapeamentos conforme o documento.
- [ ] `Crypto (HMAC)` gera header `x-signature` (em prod).
- [ ] `HTTP Request` usa HTTPS/TLS e cabeçalhos corretos.
- [ ] Smoke tests executados; persistência verificada em `analysis_results`.

---

## 8) Prompt reutilizável (colar em outro LLM se necessário)

Objetivo: você é um especialista em n8n. Dado o workflow atual (resumo abaixo) e o schema alvo, gere um guia passo a passo para configurar os nós e garantir que o payload final cumpra o contrato.

Contexto do workflow atual (resumo):
- Entrada por `Webhook` com validação `auth` (IF), enriquecimentos via agentes (`Setup Search`, `Top 10 Prompts`, execuções paralelas em `OpenAI/Gemini/Claude`), consolidação em `preparandoRespostasModelos`, análise estratégica (`Estrategista de Negócios`, `Dados Quantitativos`, `Strategic Insights`), merge final, montagem do payload (`Montar payload`) e envio via `HTTP Request` para `receive-analysis`.

Schema alvo (resumo mínimo):
```json
{
  "domain": "example.com",
  "status": "completed",
  "analysis_data": {
    "version": 1,
    "generated_at": "ISO",
    "request_id": "uuid",
    "summary": "...",
    "score": 85,
    "recommendations": ["..."],
    "sentiment_trends": [],
    "ranking_data": [],
    "overall_sentiment": [],
    "share_of_rank": [],
    "competitor_analysis": {},
    "strategic_insights": {},
    "prompt_analysis": {
      "sentiment_by_llm": {},
      "ranking_by_prompt": {},
      "performance_metrics": {
        "total_mentions": 0,
        "positive_mentions": 0,
        "neutral_mentions": 0,
        "negative_mentions": 0,
        "sentiment_score": 0
      }
    }
  }
}
```

Requisitos de segurança:
- Enviar `x-signature` = HMAC-SHA256 do corpo (base64) com `N8N_HMAC_SECRET`. Usar nó `Crypto` do n8n. Sempre HTTPS/TLS.

Instruções esperadas do LLM:
- Descrever configurações de cada nó a ajustar/adicionar.
- Mostrar como passar dados entre nós e montar o corpo final.
- Exemplos de validação e troubleshooting (erros comuns, logs).

---

## 9) Commits e PRs
- Commits: seguir Conventional Commits, atômicos.
  - Ex.: `chore(n8n): add crypto hmac node and update payload assembly`
  - Ex.: `feat(n8n): generate prompt_analysis performance_metrics`
- Pull Requests: pequenos (≤ 10 arquivos ou 300 linhas alteradas), com validação e evidências (prints do n8n, response da Edge).

---

## 10) Observações finais
- Campos opcionais que não forem gerados manterão a UI funcional (a Edge preenche defaults onde aplicável), mas priorize completar as seções para `completeness_score` alto.
- Domínio deve ser normalizado antes do envio (o `trigger-analysis` já normaliza; no n8n, se necessário, normalize em um `Code`/`Set`).


