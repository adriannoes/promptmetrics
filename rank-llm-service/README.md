# RankLLM Service

Microserviço Python para reranking de documentos usando RankLLM.

## 🚀 Quick Start

### Desenvolvimento Local

1. **Pré-requisitos:**
   - Docker e Docker Compose
   - JDK 21 (para PySerini/Anserini)
   - Python 3.11+

2. **Executar com Docker:**
   ```bash
   cd rank-llm-service
   docker-compose up --build
   ```

3. **Testar o serviço:**
   ```bash
   curl http://localhost:8000/health
   ```

### Endpoints Disponíveis

- `GET /health` - Health check
- `GET /models` - Listar modelos disponíveis
- `POST /rerank` - Reranking de documentos
- `GET /models/{model_name}` - Informações de modelo específico

### Exemplo de Uso

```bash
curl -X POST http://localhost:8000/rerank \
  -H "Content-Type: application/json" \
  -d '{
    "query": "machine learning algorithms",
    "documents": [
      {
        "id": "doc1",
        "content": "Neural networks are powerful ML algorithms...",
        "title": "Introduction to Neural Networks"
      }
    ],
    "model": "monot5",
    "domain": "example.com"
  }'
```

## 🏗️ Arquitetura

### Modelos Suportados

| Modelo | Tipo | Tamanho | Memória | Uso Recomendado |
|--------|------|---------|---------|-----------------|
| MonoT5 | Pointwise | 3B | 6GB | Geral, eficiência |
| RankZephyr | Listwise | 7B | 14GB | Máxima precisão |
| RankVicuna | Listwise | 7B | 14GB | Balanceado |
| DuoT5 | Pairwise | 3B | 6GB | Alta precisão |

### Configuração

Variáveis de ambiente:

```bash
# API Configuration
API_HOST=0.0.0.0
API_PORT=8000
DEFAULT_MODEL=monot5

# Model Configuration
RANKLLM_MODEL_DIR=/app/models
RANKLLM_CACHE_DIR=/app/cache

# Performance
MAX_DOCUMENTS=100
MAX_QUERY_LENGTH=512
MAX_DOCUMENT_LENGTH=1024
TIMEOUT_SECONDS=300
```

## 🐳 Deploy

### Docker Compose (Recomendado)

```yaml
version: '3.8'
services:
  rankllm-service:
    build: .
    ports:
      - "8000:8000"
    environment:
      - RANKLLM_SERVICE_URL=http://localhost:8000
    volumes:
      - ./cache:/app/cache
      - ./models:/app/models
    deploy:
      resources:
        limits:
          memory: 8G
```

### Deploy em Produção

1. **Railway/Render/AWS:**
   ```bash
   # Build e push da imagem
   docker build -t rankllm-service .
   docker tag rankllm-service your-registry/rankllm-service:latest
   docker push your-registry/rankllm-service:latest
   ```

2. **Configurar variáveis de ambiente:**
   - `RANKLLM_SERVICE_URL` no Supabase
   - Recursos mínimos: 4GB RAM, 2 CPU cores

## 📊 Monitoramento

### Health Check

```bash
curl http://localhost:8000/health
```

Resposta:
```json
{
  "status": "healthy",
  "models_available": ["monot5", "zephyr", "vicuna", "duot5"],
  "uptime": 3600.5,
  "version": "1.0.0"
}
```

### Logs

```bash
docker-compose logs -f rankllm-service
```

## 🔧 Desenvolvimento

### Estrutura do Projeto

```
rank-llm-service/
├── app/
│   ├── main.py          # FastAPI app
│   ├── models.py        # Pydantic models
│   ├── reranker.py      # RankLLM wrapper
│   └── config.py        # Configuration
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
└── README.md
```

### Adicionar Novo Modelo

1. Adicionar configuração em `config.py`:
```python
AVAILABLE_MODELS["novo_modelo"] = {
    "name": "Novo Modelo",
    "type": "listwise",
    "model_path": "path/to/model",
    "description": "Descrição do modelo",
    "memory_requirement": "8GB",
    "recommended_for": ["accuracy"]
}
```

2. Implementar inicialização em `reranker.py`:
```python
def _get_reranker(self, model_name: str):
    if model_name == "novo_modelo":
        self.models["novo_modelo"] = NovoModeloReranker()
```

## 🚨 Troubleshooting

### Problemas Comuns

1. **Erro de memória:**
   - Aumentar limite de memória no Docker
   - Usar modelo menor (MonoT5 ao invés de RankZephyr)

2. **JDK não encontrado:**
   - Verificar se JDK 21 está instalado
   - Verificar variável JAVA_HOME

3. **Modelo não carrega:**
   - Verificar conectividade com HuggingFace
   - Verificar espaço em disco para cache

### Logs de Debug

```bash
# Ativar logs detalhados
export LOG_LEVEL=DEBUG
docker-compose up
```

## 📚 Referências

- [RankLLM Documentation](https://github.com/castorini/rank_llm)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Docker Documentation](https://docs.docker.com/)
