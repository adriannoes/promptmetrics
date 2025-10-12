# 🏗️ Build

Esta pasta contém todos os arquivos de configuração relacionados ao processo de build e desenvolvimento:

## Arquivos de Build

- **`vite.config.ts`** - Configuração principal do Vite (desenvolvimento)
- **`vite.config.prod.ts`** - Configuração do Vite para produção
- **`vitest.config.ts`** - Configuração do Vitest para testes
- **`postcss.config.js`** - Configuração do PostCSS
- **`tailwind.config.ts`** - Configuração do Tailwind CSS

## Como usar

Estes arquivos são automaticamente utilizados pelo Vite e outras ferramentas de build. Modifique-os apenas se precisar personalizar:

- **Build process** - `vite.config.*`
- **Testing setup** - `vitest.config.ts`
- **CSS processing** - `postcss.config.js` e `tailwind.config.ts`

## Comandos relacionados

```bash
npm run build:prod    # Build de produção
npm run build:analyze # Análise do bundle
npm run dev          # Desenvolvimento
```
