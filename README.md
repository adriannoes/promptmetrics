# PromptMetrics - AI Brand Analytics Platform

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1.7-646CFF.svg)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-2.58.0-green.svg)](https://supabase.com)
[![Security](https://img.shields.io/badge/Security-Audited-green.svg)](#security--production-ready)
[![License](https://img.shields.io/badge/License-Private-red.svg)](#license)

## 🌟 Overview

**PromptMetrics** analyzes how AI systems (ChatGPT, Gemini, Perplexity) perceive and describe brands across the web. Companies can understand and optimize their digital presence in AI-generated responses.

### 🎯 Key Features
- **AI Brand Monitoring**: Track how AI systems describe your brand vs competitors
- **Competitive Intelligence**: Understand positioning in AI-generated recommendations
- **Real-time Analysis**: Live dashboard updates from automated AI analysis workflows
- **Multi-LLM Comparison**: Comprehensive dashboards comparing multiple AI models

## 📁 Project Structure

Well-organized structure for maintainability:

```
├── 📁 build/          # Build configs (Vite, Tailwind, PostCSS, Vitest)
├── 📁 ci/             # CI/CD configs (.github, Lighthouse)
├── 📁 config/         # App configs (ESLint, TypeScript, Components)
├── 📁 docs/           # Documentation and guides
├── 📁 env/            # Environment templates
├── 📁 public/         # Static assets and PWA files
├── 📁 scripts/        # Utility scripts (security checks)
├── 📁 src/            # Application source code
│   ├── components/    # React components
│   ├── hooks/         # Custom React hooks
│   ├── pages/         # Route components
│   ├── services/      # API and external services
│   ├── types/         # TypeScript definitions
│   ├── utils/         # Utility functions
│   └── test/          # Test files
└── 📁 supabase/       # Supabase configs and migrations
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ or Bun
- Supabase CLI

### Local Development

```bash
# Clone repository
git clone https://github.com/adriannoes/promptmetrics.git
cd promptmetrics

# Install dependencies
npm install

# Configure environment
cp env/env.example .env.local
# Edit .env.local with your Supabase credentials

# Run security check
npm run security-check

# Start development server
npm run dev
```

### 🔧 Environment Setup

1. **Copy environment template**:
   ```bash
   cp env/env.example .env.local
   ```

2. **Configure Supabase**:
   - Get your project URL and anon key from [Supabase Dashboard](https://app.supabase.com)
   - Update `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env.local`

3. **Security validation**:
   ```bash
   npm run security-check  # Validates environment and security configs
   ```

### Available Scripts

```bash
# Development
npm run dev              # Development server
npm run preview          # Preview production build

# Building
npm run build            # Production build
npm run build:prod       # Optimized production build
npm run build:analyze    # Bundle analysis with visualizer

# Quality & Security
npm run lint             # Run ESLint
npm run test:run         # Run tests
npm run test:coverage    # Test coverage report
npm run security-check   # Security validation
npm run quality-check    # Full quality check (lint + test + security)
npm run lighthouse       # Performance audit

# Deployment
npm run deploy:check     # Pre-deployment validation
```

### Access Application
- **Local**: `http://localhost:5173`
- **Demo**: Click "Try Demo" on landing page

## 🛡️ Security & Production Ready

### 🔒 Security Features
- ✅ **Secure Logging**: Automatic sanitization of sensitive data
- ✅ **Rate Limiting**: Protection against spam and abuse
- ✅ **Environment Validation**: Strict validation of required variables
- ✅ **Audit Trail**: Complete user action monitoring
- ✅ **Access Control**: Role-based permissions with audit logging
- ✅ **CSP Headers**: Content Security Policy with strict defaults
- ✅ **CORS Hardening**: Tightened CORS policies for edge functions
- ✅ **Timing-Safe Comparison**: Secure secret comparison in edge functions
- ✅ **Input Sanitization**: DOMPurify for HTML/SVG sanitization
- ✅ **Credential Protection**: No secrets exposed in frontend code

### 🔐 Security Best Practices
- **Environment Variables**: All sensitive data in environment variables
- **Gitignore Protection**: Comprehensive .gitignore prevents credential leaks
- **Dependency Security**: Regular security audits with `npm audit`
- **Code Splitting**: Reduces attack surface through modular architecture
- **Type Safety**: Full TypeScript coverage prevents runtime vulnerabilities

## 🛠 Technology Stack

### Frontend
- **Framework**: React 18.3.1 + TypeScript 5.6.3 + Vite 7.1.7
- **UI**: Shadcn/ui + Radix UI + Tailwind CSS
- **State**: React Query + Context API
- **Charts**: Recharts
- **Routing**: React Router v6 with lazy loading
- **Forms**: React Hook Form + Zod validation

### Backend/Serverless
- **Database**: Supabase PostgreSQL with RLS
- **Auth**: Supabase Auth + Google OAuth + invite codes
- **Edge Functions**: Supabase (Deno runtime)

### Third-party Services
- **Workflow Automation**: n8n for AI analysis
- **Email**: Supabase Auth
- **Monitoring**: Core Web Vitals + Lighthouse CI

## 📊 Key Features

### 🔐 Authentication
- Supabase Auth + Google OAuth + invite codes
- Demo mode for instant access
- Role-based access (`client`/`admin`)

### 🤖 AI Analysis Pipeline
- Real-time domain analysis via n8n workflows
- Multi-LLM comparison (OpenAI, Gemini, Claude)
- Live dashboard updates

### 🌐 Internationalization
- English (default) + Portuguese (BR)
- Context-based translations

## ⚡ Performance & Optimization

### 🚀 Code Splitting
- **40+ lazy-loaded chunks** for optimal performance
- **Bundle size reduced by ~80%** vs monolithic builds
- **Strategic chunking**: vendor libs, UI components, pages
- **Suspense boundaries** with loading states

### 🎯 Optimizations
- React.memo, useMemo, useCallback applied
- Heavy components lazy loaded
- Database queries optimized

## 📚 Documentation

### 📖 Key Docs
- **[DOCS.md](docs/DOCS.md)** - Complete technical documentation
- **[DEPLOYMENT.md](docs/DEPLOYMENT.md)** - Production deployment guide
- **[N8N Workflows](docs/N8N-WORKFLOWS-README.md)** - AI analysis pipeline guide

### 🔗 Key Routes
- **Landing**: `/`
- **Demo**: `/demo` (or click "Try Demo")
- **Analysis**: `/analysis`
- **Admin**: `/admin` (admin role required)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🔍 Security Audit

### ✅ Security Status
- **No sensitive data exposed** in repository
- **Environment variables properly configured** with validation
- **Dependencies audited** (4 low-severity vulnerabilities in dev dependencies only)
- **Gitignore comprehensive** - prevents credential leaks
- **CSP and CORS hardened** for production security

### 🚨 Security Notes
- **Service role keys** are never exposed in frontend code
- **All secrets** must be configured via environment variables
- **Regular security audits** recommended with `npm audit`
- **Production deployment** requires proper environment configuration

### 🔧 Known Vulnerabilities
- **4 low-severity vulnerabilities** in development dependencies only
- **Affected packages**: `tmp`, `inquirer`, `external-editor` (via `@lhci/cli`)
- **Impact**: Development environment only, no production risk
- **Fix available**: `npm audit fix --force` (may cause breaking changes)

## 📄 License

This project is private and proprietary. All rights reserved.

---

**⚠️ Important**: This is a private repository. Do not share credentials or sensitive configuration outside authorized team members.