# 🔄 CI/CD

Esta pasta contém todas as configurações de Continuous Integration e Continuous Deployment:

## Arquivos de CI

- **`.github/`** - Workflows do GitHub Actions
  - `workflows/ci.yml` - Pipeline de CI/CD principal
- **`.lighthouserc.json`** - Configuração do Lighthouse CI para auditorias de performance

## Como usar

### GitHub Actions
Os workflows em `.github/workflows/` são executados automaticamente:
- **Push para main** - Executa testes, lint, build e auditorias
- **Pull Requests** - Validação completa antes do merge

### Lighthouse CI
Executa auditorias automáticas de performance, acessibilidade, SEO e PWA:

```bash
npm run lighthouse  # Executa auditorias
```

## Métricas monitoradas

- **Performance** ≥ 90 pontos
- **Acessibilidade** ≥ 90 pontos
- **Best Practices** ≥ 90 pontos
- **SEO** ≥ 90 pontos
- **PWA** ≥ 90 pontos
