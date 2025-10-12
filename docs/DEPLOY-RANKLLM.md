# Deploy RankLLM em Produção

## 🚀 Guia de Deploy Completo

### 1. Pré-requisitos

- Servidor Linux/Windows (não macOS)
- Docker e Docker Compose
- JDK 21 instalado
- Mínimo 8GB RAM (recomendado 16GB+)
- 50GB+ espaço em disco

### 2. Opções de Deploy

#### Opção A: Railway (Recomendado)

1. **Criar conta no Railway:**
   ```bash
   npm install -g @railway/cli
   railway login
   ```

2. **Deploy do microserviço:**
   ```bash
   cd rank-llm-service
   railway init
   railway up
   ```

3. **Configurar variáveis de ambiente:**
   ```bash
   railway variables set RANKLLM_SERVICE_URL=https://your-app.railway.app
   railway variables set DEFAULT_MODEL=monot5
   railway variables set LOG_LEVEL=INFO
   ```

#### Opção B: Render

1. **Conectar repositório GitHub**
2. **Configurar build:**
   ```dockerfile
   # Dockerfile já configurado
   ```

3. **Variáveis de ambiente:**
   ```
   RANKLLM_SERVICE_URL=https://your-app.onrender.com
   DEFAULT_MODEL=monot5
   LOG_LEVEL=INFO
   ```

#### Opção C: AWS EC2

1. **Criar instância EC2:**
   - Tipo: t3.large ou maior
   - Ubuntu 22.04 LTS
   - 16GB RAM, 50GB SSD

2. **Configurar servidor:**
   ```bash
   # Instalar Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   
   # Instalar JDK 21
   sudo apt update
   sudo apt install openjdk-21-jdk
   
   # Configurar Docker Compose
   sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   ```

3. **Deploy da aplicação:**
   ```bash
   git clone https://github.com/your-repo/rank-me-llm.git
   cd rank-me-llm/rank-llm-service
   cp env.example .env
   # Editar .env com suas configurações
   docker-compose up -d
   ```

### 3. Configuração do Supabase

1. **Adicionar variável de ambiente:**
   ```bash
   supabase secrets set RANKLLM_SERVICE_URL=https://your-microservice-url.com
   ```

2. **Deploy das Edge Functions:**
   ```bash
   supabase functions deploy trigger-rankllm-analysis
   supabase functions deploy get-rankllm-data
   ```

3. **Executar migrações:**
   ```bash
   supabase db push
   ```

### 4. Configuração de Domínio e SSL

#### Com Nginx (Recomendado)

1. **Instalar Nginx:**
   ```bash
   sudo apt update
   sudo apt install nginx
   ```

2. **Configurar proxy reverso:**
   ```nginx
   # /etc/nginx/sites-available/rankllm
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:8000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

3. **Ativar configuração:**
   ```bash
   sudo ln -s /etc/nginx/sites-available/rankllm /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

4. **Configurar SSL com Let's Encrypt:**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

### 5. Monitoramento e Logs

#### Configurar Logs

1. **Docker logs:**
   ```bash
   docker-compose logs -f rankllm-service
   ```

2. **Nginx logs:**
   ```bash
   sudo tail -f /var/log/nginx/access.log
   sudo tail -f /var/log/nginx/error.log
   ```

#### Health Checks

1. **Endpoint de saúde:**
   ```bash
   curl https://your-domain.com/health
   ```

2. **Monitoramento automático:**
   ```bash
   # Criar script de monitoramento
   #!/bin/bash
   if ! curl -f https://your-domain.com/health > /dev/null; then
       echo "Service is down!" | mail -s "RankLLM Alert" admin@yourdomain.com
   fi
   ```

### 6. Otimizações de Produção

#### Configuração de Recursos

```yaml
# docker-compose.yml otimizado
version: '3.8'
services:
  rankllm-service:
    build: .
    ports:
      - "8000:8000"
    environment:
      - DEFAULT_MODEL=monot5
      - LOG_LEVEL=INFO
      - MAX_DOCUMENTS=50
      - TIMEOUT_SECONDS=180
    volumes:
      - ./cache:/app/cache
      - ./models:/app/models
    restart: unless-stopped
    deploy:
      resources:
        limits:
          memory: 8G
          cpus: '2.0'
        reservations:
          memory: 4G
          cpus: '1.0'
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s
```

#### Cache de Modelos

```python
# app/config.py otimizado
class Config:
    # Cache settings
    MODEL_CACHE_SIZE = 2  # Keep 2 models in memory
    CACHE_TTL = 3600  # 1 hour
    
    # Performance
    MAX_CONCURRENT_REQUESTS = 5
    REQUEST_TIMEOUT = 180
    MODEL_LOAD_TIMEOUT = 300
```

### 7. Backup e Recuperação

#### Backup de Dados

```bash
# Backup do banco de dados
supabase db dump > backup_$(date +%Y%m%d).sql

# Backup dos modelos
tar -czf models_backup_$(date +%Y%m%d).tar.gz ./models/
```

#### Recuperação

```bash
# Restaurar banco
supabase db reset
psql -f backup_20250103.sql

# Restaurar modelos
tar -xzf models_backup_20250103.tar.gz
```

### 8. Troubleshooting

#### Problemas Comuns

1. **Serviço não inicia:**
   ```bash
   # Verificar logs
   docker-compose logs rankllm-service
   
   # Verificar recursos
   docker stats
   ```

2. **Erro de memória:**
   ```bash
   # Aumentar swap
   sudo fallocate -l 4G /swapfile
   sudo chmod 600 /swapfile
   sudo mkswap /swapfile
   sudo swapon /swapfile
   ```

3. **Timeout de requisições:**
   ```bash
   # Ajustar timeout no nginx
   proxy_read_timeout 300s;
   proxy_connect_timeout 300s;
   ```

#### Logs Importantes

```bash
# Logs da aplicação
docker-compose logs -f rankllm-service

# Logs do sistema
journalctl -u docker.service -f

# Logs do nginx
sudo tail -f /var/log/nginx/error.log
```

### 9. Escalabilidade

#### Horizontal Scaling

1. **Load Balancer:**
   ```nginx
   upstream rankllm_backend {
       server localhost:8000;
       server localhost:8001;
       server localhost:8002;
   }
   ```

2. **Docker Swarm:**
   ```bash
   docker swarm init
   docker stack deploy -c docker-compose.yml rankllm
   ```

#### Vertical Scaling

1. **Aumentar recursos:**
   - RAM: 16GB → 32GB
   - CPU: 2 cores → 4 cores
   - SSD: 50GB → 100GB

2. **GPU Support:**
   ```dockerfile
   # Adicionar suporte a GPU
   FROM nvidia/cuda:11.8-runtime-ubuntu22.04
   ```

### 10. Segurança

#### Firewall

```bash
# Configurar UFW
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw enable
```

#### SSL/TLS

```bash
# Renovação automática
sudo crontab -e
# Adicionar: 0 12 * * * /usr/bin/certbot renew --quiet
```

#### Autenticação

```python
# Adicionar autenticação à API
from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer

security = HTTPBearer()

async def verify_token(token: str = Depends(security)):
    if token.credentials != "your-secret-token":
        raise HTTPException(status_code=401, detail="Invalid token")
    return token
```

---

## ✅ Checklist de Deploy

- [ ] Servidor configurado com Docker e JDK 21
- [ ] Microserviço deployado e funcionando
- [ ] Domínio configurado com SSL
- [ ] Supabase configurado com variáveis
- [ ] Edge Functions deployadas
- [ ] Migrações executadas
- [ ] Health checks funcionando
- [ ] Monitoramento configurado
- [ ] Backup configurado
- [ ] Testes end-to-end passando

**Status:** Pronto para produção! 🚀
