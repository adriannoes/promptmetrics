## PRD: Refatoração Visual da Landing Page (mantendo o design atual) e Unificação de Marca

### 1) Introdução / Visão Geral
Este documento descreve as melhorias de UX/UI na landing page do produto, mantendo o design atual e priorizando consistência visual, acessibilidade, performance e reutilização de componentes. Também inclui a unificação de marca para o nome oficial “PromptMetrics”. As mudanças serão entregues em duas fases (dois PRs) com testes como etapa final para validação antes de release estável.

### 2) Objetivos
- Melhorar a experiência visual sem alterar a identidade atual, reduzindo ruído e aumentando consistência entre seções.
- Unificar a marca para “PromptMetrics” em páginas públicas e, na medida do possível, área logada.
- Corrigir navegação mobile para âncoras internas (ex.: Pricing, FAQ).
- Remover duplicação de providers na landing e logs de debug.
- Introduzir componentes reutilizáveis para headers de seção, elementos decorativos e cartões de destaque.
- Aumentar acessibilidade e performance (respeitar `prefers-reduced-motion`, reduzir custos de blur/sombra em mobile, lazy-load de media não crítica).

### 3) User Stories
- Como visitante mobile, quero clicar nos itens do menu e rolar suavemente até a seção correta (Pricing/FAQ), para encontrar informações rapidamente.
- Como visitante, quero ver uma marca consistente (“PromptMetrics”) em todo o site, para aumentar confiança e clareza.
- Como visitante em dispositivos de entrada mais fracos, quero animações e efeitos visuais suaves e não intrusivos, para uma navegação estável.
- Como equipe de produto, quero reduzir duplicações e componentes ad-hoc de seção, para facilitar manutenção e evolução visual.

### 4) Requisitos Funcionais (numerados)
1. Navegação mobile deve rolar para âncoras internas existentes:
   - Passar `onSectionScroll` também para `MobileNav`.
   - Garantir rolagem suave para `#pricing` e `#faq`.
   - Critério de aceite: clicar em Pricing/FAQ no menu mobile rola para a seção correta com smooth scroll.

2. Remover `console.log` de produção na landing (`Index`).
   - Critério de aceite: sem logs de debug no console em produção.

3. Evitar providers duplicados na landing:
   - Manter `LanguageProvider` e `AccessibilityProvider` centralizados em `App`.
   - Remover duplicações em `Index` sem quebrar contexto.
   - Critério de aceite: a landing funciona normalmente (traduções e acessibilidade), sem warnings e sem duplicidade de providers.

4. Unificação de marca para “PromptMetrics”:
   - Substituir “RankMeLLM” por “PromptMetrics” em header, footer e página `Home` (área logada) quando aplicável.
   - Critério de aceite: labels e títulos exibem “PromptMetrics” de forma consistente.

5. Link “Changelog” no rodapé:
   - Temporariamente desativar o link (ou apontar para uma âncora existente) até definirmos rota estável.
   - Critério de aceite: não há navegação quebrada para `/changelog`.

6. Otimização do link/imagem NVIDIA no footer:
   - Utilizar `<a target="_blank" rel="noopener noreferrer">` envolvendo a imagem com `loading="lazy"` e `decoding="async"`.
   - Critério de aceite: abre em nova aba com segurança; imagem carrega de forma não-bloqueante.

7. Extração de componentes reutilizáveis (sem alterar o visual atual):
   - `SectionHeader` (props: `icon`, `tag`, `title`, `subtitle`, `align?`, `dangerouslySetInnerHTML?`).
   - `DecorativeBlobs` (props: posição, tamanho, cor/gradiente, blur; pode ter presets por seção).
   - `FeatureCard` (ícone, título, descrição), aplicável a `Problem`/`Transformation`.
   - Critério de aceite: seções continuam visualmente idênticas; código reduz duplicação.

8. Redução de ruído visual e custo em mobile (mantendo o design):
   - Aplicar `md:` nos efeitos de hover/scale mais pesados, reduzir `backdrop-blur` e sombras intensas em telas pequenas.
   - Respeitar `prefers-reduced-motion` (desabilitar animações não essenciais quando ativo).
   - Critério de aceite: aparência preservada; em mobile e/ou com motion reduzido, o site permanece leve e estável.

9. Acessibilidade de navegação:
   - Adicionar `aria-current`/estados de foco quando apropriado.
   - Critério de aceite: auditoria axe sem erros críticos em header/footer/landing.

10. Lazy-load de imagens não críticas (fora do Hero).
   - Critério de aceite: imagens secundárias com `loading="lazy"` e sem regressão visual.

### 5) Não-Objetivos (fora de escopo na Fase 1/2)
- Mudanças de copy, A/B testing e novos conteúdos.
- Redesign amplo (cores, tipografia, grid) além de pequenos ajustes condicionais.
- Criação/ativação da página de Changelog (apenas desativar o link ou apontar para âncora).
- Integração de analytics/experimentos (pode ser considerado depois).

### 6) Considerações de Design (UI/UX)
- Manter hierarquia tipográfica já aplicada (badge > título > subtítulo) em todas as seções através de `SectionHeader`.
- Preservar a estética glassmorphism light, reduzindo intensidade em mobile (menor blur/sombra).
- Preservar CTA e grids existentes; apenas normalizar `py`/`mb` entre seções (ex.: `py-24 md:py-32`).
- Garantir consistência de ícones e espaçamentos (ícones em tamanhos proporcionais, gaps padronizados).

### 7) Considerações Técnicas
- Centralizar providers em `App` para evitar múltiplos contextos.
- Onde houver rolagem por código, preferir `<a href="#id">` quando possível (melhor semântica/teclado), mantendo smooth scroll.
- Utilizar `prefers-reduced-motion` para condicionar animações (keyframes utilitários ou variantes em `framer-motion`).
- A imagem do footer deve ser envolta por `<a>` com HTTPS/TLS e `rel="noopener noreferrer"` para mitigar tab-nabbing.
- Lazy-load e `decoding="async"` para imagens não críticas.

### 8) Fases e Entregas (2 PRs)
PR1 — Correções rápidas e unificação de marca:
- Passar `onSectionScroll` para `MobileNav` (Pricing/FAQ).
- Remover `console.log` em `Index`.
- Remover duplicação de providers em `Index`.
- Unificar marca para “PromptMetrics” (header/footer/Home).
- Desativar link “Changelog” (ou apontar para âncora existente provisória).
- Otimização do link/imagem NVIDIA (lazy + segurança em nova aba).
- Aceite: navegação mobile corrigida, marca consistente, sem providers duplicados, sem link quebrado, footer seguro e lazy.

PR2 — Componentização e ajustes de motion/performance:
- Extrair `SectionHeader`, `DecorativeBlobs`, `FeatureCard` e aplicar nas seções pertinentes.
- Ajustar efeitos visuais por breakpoint; respeitar `prefers-reduced-motion`.
- Padronizar espaçamentos verticais e pequenos refinamentos de consistência.
- Aceite: UI visualmente inalterada, redução de duplicação, melhora de performance e acessibilidade em mobile.

### 9) Métricas de Sucesso
- Navegação: 100% de sucesso em rolar para `#pricing`/`#faq` via menu mobile (teste manual + E2E).
- Performance: Lighthouse mobile Performance ≥ 90; LCP ≤ 2.5s na landing em rede boa; evitar regressões de CLS.
- Acessibilidade: Sem erros críticos em axe na landing (header, seções principais, footer).
- Consistência de marca: 0 ocorrências de “RankMeLLM” nas páginas afetadas.

### 10) Plano de Testes (executado ao final de cada PR)
- Unit (Jest/RTL):
  - `SectionHeader`: render com variações de props, título com/sem HTML seguro, presença de ícone/badge.
  - `FeatureCard`: render e responsividade básica de classes utilitárias.
- Acessibilidade (axe):
  - Rodar varredura na landing (Hero, Pricing, FAQ, Form) e header/footer; corrigir violações.
- E2E (Playwright):
  - Navegação mobile: abrir menu, clicar em Pricing/FAQ e verificar âncora na viewport.
  - CTA Hero: rola para `#form` (scrollIntoView).
  - Footer NVIDIA: abre em nova aba com `rel="noopener"`.
- Visual regression por breakpoint (sm/md/lg):
  - Capturas de Hero, Pricing, FAQ, Form; validar diferenças toleráveis.

### 11) Perguntas em Aberto
- “Changelog”: preferimos ocultar o link (sem layout shift) ou apontar para uma âncora existente até existir a página?
- Área logada: a unificação de marca deve ser aplicada integralmente agora (ex.: `Home`) ou somente onde tocarmos na landing neste ciclo?
- Metas quantitativas de conversão (ex.: CTR do Hero para `#form`): queremos estabelecer uma meta (ex.: +15%) já neste ciclo, ou apenas garantir estabilidade e medir depois?

### 12) Anexos / Referências
- Código atual da landing e componentes (`Header`, `Hero`, `Problem`, `Transformation`, `Pricing`, `FAQ`, `ContactForm`, `Footer`).
- Boas práticas de segurança: uso de `rel="noopener noreferrer"` e navegação HTTPS/TLS para links externos.


