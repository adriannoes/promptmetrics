# 🚀 Guia de Deploy para Produção

Este documento contém todas as informações necessárias para fazer o deploy seguro do sistema em produção.

## 📋 Pré-requisitos

### 1. **Variáveis de Ambiente Obrigatórias**

Crie um arquivo `.env.production` com as seguintes variáveis:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....

# Environment
NODE_ENV=production
```

### 2. **Configuração do Supabase**

#### Edge Functions Secrets
Configure os seguintes secrets no Supabase Dashboard:

```bash
# n8n Integration
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/analysis

# Waitlist Integration (opcional)
WAITLIST_WEBHOOK_URL=https://your-waitlist-service.com/webhook

# Environment
ENVIRONMENT=production
```

#### RLS Policies
Certifique-se de que as seguintes políticas RLS estão ativas:

```sql
-- Profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Organizations table  
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- Analysis results table
ALTER TABLE analysis_results ENABLE ROW LEVEL SECURITY;
```

## 🔧 Configuração de Build

### 1. **Build de Produção**

```bash
# Instalar dependências
npm install

# Build para produção
npm run build

# Verificar se o build foi bem-sucedido
npm run preview
```

### 2. **Verificação de Segurança**

Antes do deploy, execute as verificações de segurança:

```bash
# Verificar se não há console.log em produção
npm run build
grep -r "console.log" dist/ || echo "✅ Nenhum console.log encontrado"

# Verificar se variáveis de ambiente estão configuradas
echo "VITE_SUPABASE_URL: $VITE_SUPABASE_URL"
echo "VITE_SUPABASE_ANON_KEY: ${VITE_SUPABASE_ANON_KEY:0:20}..."
```

## 🌐 Deploy em Diferentes Plataformas

### **Vercel**

1. **Configurar variáveis de ambiente:**
   ```bash
   vercel env add VITE_SUPABASE_URL
   vercel env add VITE_SUPABASE_ANON_KEY
   ```

2. **Deploy:**
   ```bash
   vercel --prod
   ```

### **Netlify**

1. **Configurar variáveis de ambiente no dashboard:**
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

2. **Deploy:**
   ```bash
   netlify deploy --prod
   ```

### **AWS S3 + CloudFront**

1. **Build e upload:**
   ```bash
   npm run build
   aws s3 sync dist/ s3://your-bucket-name --delete
   ```

2. **Invalidar cache:**
   ```bash
   aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
   ```

## 🔒 Configurações de Segurança

### 1. **Headers de Segurança**

Configure os seguintes headers no seu servidor:

```nginx
# Nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://*.supabase.co wss://*.supabase.co;" always;
```

### 2. **HTTPS Obrigatório**

Certifique-se de que:
- ✅ HTTPS está habilitado
- ✅ Certificado SSL é válido
- ✅ Redirecionamento HTTP → HTTPS está configurado

### 3. **Rate Limiting**

Configure rate limiting no seu servidor:

```nginx
# Nginx rate limiting
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=auth:10m rate=5r/s;

location /api/ {
    limit_req zone=api burst=20 nodelay;
}

location /auth/ {
    limit_req zone=auth burst=10 nodelay;
}
```

## 📊 Monitoramento

### 1. **Logs de Aplicação**

O sistema inclui monitoramento automático de logs. Configure integração com:

- **Sentry** (recomendado)
- **LogRocket**
- **DataDog**
- **New Relic**

### 2. **Métricas de Performance**

Monitore as seguintes métricas:

- Tempo de resposta da API
- Taxa de erro
- Uso de memória
- Tempo de carregamento da página

### 3. **Alertas**

Configure alertas para:

- Taxa de erro > 5%
- Tempo de resposta > 2s
- Uso de memória > 80%
- Falhas de autenticação > 10/min

## 🧪 Testes Pós-Deploy

### 1. **Testes Funcionais**

```bash
# Testar autenticação
curl -X POST https://your-domain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'

# Testar análise
curl -X POST https://your-domain.com/api/analysis \
  -H "Content-Type: application/json" \
  -d '{"domain":"example.com"}'
```

### 2. **Testes de Segurança**

- ✅ Verificar se dados sensíveis não aparecem nos logs
- ✅ Testar rate limiting
- ✅ Verificar headers de segurança
- ✅ Testar HTTPS

### 3. **Testes de Performance**

- ✅ Tempo de carregamento < 3s
- ✅ Lighthouse score > 90
- ✅ Core Web Vitals dentro dos limites

## 🔄 Rollback

Em caso de problemas, execute o rollback:

```bash
# Vercel
vercel rollback

# Netlify
netlify rollback

# AWS
aws s3 sync s3://your-bucket-name-backup/ s3://your-bucket-name/ --delete
```

## 📞 Suporte

Em caso de problemas:

1. Verificar logs de aplicação
2. Verificar métricas de monitoramento
3. Verificar status do Supabase
4. Contatar equipe de desenvolvimento

## ✅ Checklist de Deploy

- [ ] Variáveis de ambiente configuradas
- [ ] Build de produção executado com sucesso
- [ ] Testes de segurança passaram
- [ ] Headers de segurança configurados
- [ ] HTTPS habilitado
- [ ] Rate limiting configurado
- [ ] Monitoramento configurado
- [ ] Testes pós-deploy executados
- [ ] Documentação atualizada
- [ ] Equipe notificada sobre o deploy

---

**⚠️ IMPORTANTE:** Sempre teste em ambiente de staging antes de fazer deploy em produção!
