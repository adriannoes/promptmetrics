# Security Policy

## 🔒 Security Overview

PromptMetrics follows industry best practices for security in web applications. This document outlines our security measures and reporting procedures.

## 🛡️ Security Measures

### Environment Security
- **No hardcoded secrets** in source code
- **Environment variables** for all sensitive configuration
- **Comprehensive .gitignore** prevents credential leaks
- **Validation** of required environment variables at startup

### Code Security
- **TypeScript** for type safety and preventing runtime vulnerabilities
- **Input sanitization** using DOMPurify for HTML/SVG content
- **Rate limiting** on authentication endpoints
- **CORS hardening** for edge functions
- **Timing-safe comparison** for secret validation

### Infrastructure Security
- **Supabase RLS** (Row Level Security) for database access control
- **CSP headers** with strict defaults
- **Secure authentication** with Supabase Auth + Google OAuth
- **Audit logging** for all user actions

## 🔍 Security Audit Results

### ✅ Passed Checks
- No sensitive data exposed in repository
- Environment variables properly configured
- Gitignore comprehensive and up-to-date
- Dependencies audited (4 low-severity dev-only vulnerabilities)

### ⚠️ Known Issues
- **4 low-severity vulnerabilities** in development dependencies
  - `tmp` package (arbitrary file write via symlink)
  - `inquirer` and `external-editor` (via `@lhci/cli`)
  - **Impact**: Development environment only
  - **Risk**: Low (no production exposure)

## 🚨 Reporting Security Issues

If you discover a security vulnerability, please:

1. **DO NOT** create a public GitHub issue
2. **DO NOT** share the vulnerability publicly
3. Contact the maintainers privately
4. Provide detailed information about the vulnerability
5. Allow reasonable time for response before disclosure

## 🔧 Security Maintenance

### Regular Tasks
- Run `npm audit` monthly
- Update dependencies regularly
- Review environment variable usage
- Monitor Supabase security logs

### Development Guidelines
- Never commit `.env` files
- Use environment variables for all secrets
- Validate all user inputs
- Follow principle of least privilege
- Regular security code reviews

## 📋 Security Checklist

Before deploying to production:

- [ ] All environment variables configured
- [ ] No secrets in source code
- [ ] Security audit passed (`npm run security-check`)
- [ ] Dependencies updated
- [ ] CSP headers configured
- [ ] CORS policies tightened
- [ ] Rate limiting enabled
- [ ] Input validation in place

## 🔐 Credential Management

### Environment Variables Required
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Never Expose
- Service role keys
- Database passwords
- API secrets
- Private keys
- Any production credentials

## 📞 Contact

For security-related questions or to report vulnerabilities, contact the development team privately.

---

**Last Updated**: December 2024
**Next Review**: January 2025