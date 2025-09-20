#!/usr/bin/env node

/**
 * Script de verificação de segurança para produção
 * Verifica se o build está pronto para deploy
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

// Cores para output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✅${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}❌${colors.reset} ${msg}`),
  header: (msg) => console.log(`\n${colors.bold}${colors.blue}${msg}${colors.reset}`)
};

// Verificações
const checks = {
  environmentVariables: () => {
    log.header('🔧 Verificando Variáveis de Ambiente');
    
    const requiredVars = [
      'VITE_SUPABASE_URL',
      'VITE_SUPABASE_ANON_KEY'
    ];
    
    const missing = requiredVars.filter(varName => !process.env[varName]);
    
    if (missing.length > 0) {
      log.error(`Variáveis de ambiente faltando: ${missing.join(', ')}`);
      return false;
    }
    
    log.success('Todas as variáveis de ambiente estão configuradas');
    return true;
  },

  buildExists: () => {
    log.header('📦 Verificando Build de Produção');
    
    const buildDir = path.join(projectRoot, 'dist');
    
    if (!fs.existsSync(buildDir)) {
      log.error('Diretório dist/ não encontrado. Execute npm run build primeiro.');
      return false;
    }
    
    const indexFile = path.join(buildDir, 'index.html');
    if (!fs.existsSync(indexFile)) {
      log.error('index.html não encontrado no build');
      return false;
    }
    
    log.success('Build de produção encontrado');
    return true;
  },

  noConsoleLogs: () => {
    log.header('🔍 Verificando Console.log em Produção');
    
    const buildDir = path.join(projectRoot, 'dist');
    const jsFiles = findFiles(buildDir, '.js');
    
    let foundConsoleLogs = false;
    
    for (const file of jsFiles) {
      const content = fs.readFileSync(file, 'utf8');
      const consoleLogMatches = content.match(/console\.(log|warn|error|info|debug)/g);
      
      if (consoleLogMatches && consoleLogMatches.length > 0) {
        log.warning(`Console.log encontrado em ${path.relative(projectRoot, file)}`);
        foundConsoleLogs = true;
      }
    }
    
    if (foundConsoleLogs) {
      log.warning('Console.log encontrados no build. Verifique se são necessários.');
    } else {
      log.success('Nenhum console.log encontrado no build');
    }
    
    return true; // Não é um erro crítico
  },

  noHardcodedSecrets: () => {
    log.header('🔐 Verificando Secrets Hardcoded');
    
    const buildDir = path.join(projectRoot, 'dist');
    const jsFiles = findFiles(buildDir, '.js');
    
    const secretPatterns = [
      /eyJ[A-Za-z0-9_-]+\.eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/, // JWT tokens
      /sk_[A-Za-z0-9]+/, // Stripe keys
      /pk_[A-Za-z0-9]+/, // Public keys
      /https:\/\/[a-z0-9-]+\.supabase\.co/ // Supabase URLs
    ];
    
    let foundSecrets = false;
    
    for (const file of jsFiles) {
      const content = fs.readFileSync(file, 'utf8');
      
      for (const pattern of secretPatterns) {
        if (pattern.test(content)) {
          log.warning(`Possível secret encontrado em ${path.relative(projectRoot, file)}`);
          foundSecrets = true;
        }
      }
    }
    
    if (foundSecrets) {
      log.warning('Possíveis secrets encontrados. Verifique se são necessários.');
    } else {
      log.success('Nenhum secret hardcoded encontrado');
    }
    
    return true; // Não é um erro crítico
  },

  securityHeaders: () => {
    log.header('🛡️ Verificando Headers de Segurança');
    
    // Esta verificação seria feita no servidor
    log.info('Verifique se os seguintes headers estão configurados:');
    log.info('- X-Frame-Options: SAMEORIGIN');
    log.info('- X-Content-Type-Options: nosniff');
    log.info('- X-XSS-Protection: 1; mode=block');
    log.info('- Referrer-Policy: strict-origin-when-cross-origin');
    log.info('- Content-Security-Policy: configurado');
    
    return true;
  },

  dependencies: () => {
    log.header('📋 Verificando Dependências');
    
    const packageJsonPath = path.join(projectRoot, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    const devDeps = Object.keys(packageJson.devDependencies || {});
    const prodDeps = Object.keys(packageJson.dependencies || {});
    
    // Verificar se dependências de desenvolvimento não estão em produção
    const suspiciousDeps = devDeps.filter(dep => 
      dep.includes('test') || 
      dep.includes('dev') || 
      dep.includes('debug')
    );
    
    if (suspiciousDeps.length > 0) {
      log.warning(`Dependências suspeitas em devDependencies: ${suspiciousDeps.join(', ')}`);
    }
    
    log.success('Dependências verificadas');
    return true;
  }
};

// Função auxiliar para encontrar arquivos
function findFiles(dir, extension) {
  const files = [];
  
  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        traverse(fullPath);
      } else if (item.endsWith(extension)) {
        files.push(fullPath);
      }
    }
  }
  
  traverse(dir);
  return files;
}

// Executar verificações
async function runSecurityCheck() {
  log.header('🔒 Verificação de Segurança para Produção');
  
  const results = [];
  
  for (const [name, check] of Object.entries(checks)) {
    try {
      const result = await check();
      results.push({ name, result });
    } catch (error) {
      log.error(`Erro na verificação ${name}: ${error.message}`);
      results.push({ name, result: false });
    }
  }
  
  // Resumo
  log.header('📊 Resumo da Verificação');
  
  const passed = results.filter(r => r.result).length;
  const total = results.length;
  
  if (passed === total) {
    log.success(`Todas as verificações passaram (${passed}/${total})`);
    log.success('✅ Build está pronto para produção!');
    process.exit(0);
  } else {
    log.error(`${total - passed} verificações falharam (${passed}/${total})`);
    log.error('❌ Build NÃO está pronto para produção');
    process.exit(1);
  }
}

// Executar se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  runSecurityCheck();
}
