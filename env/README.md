# 🔐 Environment

Esta pasta contém todos os arquivos relacionados às variáveis de ambiente e configuração do projeto:

## Arquivos de Ambiente

- **`env.example`** - Template das variáveis de ambiente necessárias
- **`env.production.example`** - Template específico para produção

## Como usar

### Desenvolvimento
1. Copie o arquivo de exemplo:
   ```bash
   cp env/env.example .env
   ```

2. Preencha as variáveis necessárias no arquivo `.env`

### Produção
1. Use o template de produção:
   ```bash
   cp env/env.production.example .env
   ```

2. Configure as variáveis reais de produção

## ⚠️ Segurança

- **Nunca commite** arquivos `.env` reais no repositório
- Use apenas os arquivos `.example` como templates
- As variáveis reais devem ser configuradas no ambiente de deploy

## Variáveis necessárias

Consulte `env.example` para ver todas as variáveis obrigatórias, incluindo:
- Chaves do Supabase
- URLs de API
- Configurações específicas do ambiente
