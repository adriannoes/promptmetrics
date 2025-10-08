# PromptMetrics - AI Brand Analytics Platform

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1.7-646CFF.svg)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-2.58.0-green.svg)](https://supabase.com)

## 🌟 Overview

**PromptMetrics** analyzes how AI systems (ChatGPT, Gemini, Perplexity) perceive and describe brands across the web. Help companies understand and optimize their digital presence in AI responses.

### 🎯 Key Features
- **AI Brand Monitoring**: Track how AI systems describe your brand vs competitors
- **Competitive Intelligence**: Understand your position in AI-generated recommendations
- **Real-time Analysis**: Live dashboard updates from automated AI analysis workflows
- **Multi-LLM Comparison**: Comprehensive dashboards with multiple AI model analysis

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ or Bun
- Supabase CLI

### Local Development

```bash
# Clone the repository
git clone <repository-url>
cd promptmetrics

# Install dependencies
npm install

# Configure environment variables
cp env.example .env.local
# Edit .env.local with your Supabase credentials

# Start development server
npm run dev
```

### Available Scripts

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Run ESLint
```

### Access the Application
- **Local**: `http://localhost:5173`
- **Demo Mode**: Click "Try Demo" on landing page

## 🛡️ Security & Production Ready

### Security Features
- ✅ **Secure Logging**: Automatic sanitization of sensitive data
- ✅ **Rate Limiting**: Protection against spam and abuse
- ✅ **Environment Validation**: Strict validation of required environment variables
- ✅ **Audit Trail**: Complete user action monitoring system
- ✅ **Access Control**: Role-based permissions with audit logging

## 🛠 Technology Stack

### Frontend
- **Framework**: React 18.3.1 + TypeScript 5.6.3 + Vite 7.1.7
- **UI Library**: Shadcn/ui + Radix UI components
- **Styling**: Tailwind CSS
- **State Management**: React Query + React Context
- **Charts**: Recharts for data visualization
- **Routing**: React Router DOM v6 with lazy loading
- **Forms**: React Hook Form + Zod validation

### Backend/Serverless
- **Database**: Supabase PostgreSQL with Row Level Security (RLS)
- **Authentication**: Supabase Auth with custom invite code system
- **Edge Functions**: Supabase Edge Functions (Deno runtime)

### Third-party Services
- **Workflow Automation**: n8n for AI analysis pipeline
- **Social Auth**: Google OAuth
- **Email**: Supabase Auth emails

## 📊 Key Features

### 🔐 Authentication System
- Supabase Auth with email/password + Google OAuth
- Demo mode for instant access without registration
- Invite code system for controlled access
- Role-based access control (`client` and `admin` roles)

### 🤖 AI Analysis Pipeline
- Real-time domain analysis via n8n workflows
- Multi-LLM comparison (OpenAI, Gemini, Claude)
- Comprehensive brand perception analysis
- Live dashboard updates

### 🌐 Internationalization
- English (default) and Portuguese (BR) support
- Context-based translation system

## ⚡ Performance & Optimization

### 🚀 Advanced Code Splitting
- **40+ Lazy-loaded chunks** for optimal loading performance
- **Bundle size reduced by ~80%** compared to monolithic builds
- **Strategic chunking**: React vendor, UI vendor, charts vendor, pages, components
- **Suspense boundaries** with elegant loading states

### 🎯 Component Optimization
- **React.memo, useMemo, useCallback** strategically applied
- **Heavy component lazy loading** (charts, dashboards, etc.)
- **Database query optimization** with field selection and limits

## 🏗 Project Structure

```
src/
├── components/                 # React components
│   ├── common/               # Shared components
│   ├── layout/               # Header, Footer, Navigation
│   ├── marketing/            # Landing page components
│   ├── forms/                # Form components
│   ├── dashboard/            # Analytics components
│   ├── admin/                # Admin components
│   └── ui/                   # Shadcn/ui components
├── contexts/                 # React contexts
├── hooks/                    # Custom React hooks
├── pages/                    # Route components
├── services/                 # Business logic
└── utils/                    # Utility functions
```

## 📚 Documentation

### 📖 Key Documentation
- **[DOCS.md](docs/DOCS.md)** - Complete technical documentation
- **[DEPLOYMENT.md](docs/DEPLOYMENT.md)** - Production deployment guide
- **[N8N Workflows Guide](docs/N8N-WORKFLOWS-README.md)** - Complete n8n migration guide

### 🔗 Key URLs
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

## 📄 License

This project is private and proprietary.

---

**🌟 Built with ❤️ using modern web technologies**
