## Relevant Files

- `src/components/Header.tsx` - Navegação principal; deve passar `onSectionScroll` para o `MobileNav` e manter semântica/acessibilidade.
- `src/components/MobileNav.tsx` - Menu mobile; consumir `onSectionScroll`, âncoras para `#pricing`/`#faq` e estados ARIA.
- `src/components/navigation/DesktopNav.tsx` - Itens de navegação desktop; consistência de âncoras/ARIA.
- `src/components/navigation/HeaderBrand.tsx` - Identidade visual; unificação da marca para “PromptMetrics”.
- `src/components/Footer.tsx` - Remover link de Changelog, otimizar link/imagem NVIDIA (`<a target="_blank" rel="noopener noreferrer">`, `loading="lazy"`).
- `src/pages/Index.tsx` - Landing; remover `console.log` e duplicação de providers.
- `src/App.tsx` - Centralizar providers (`LanguageProvider`, `AccessibilityProvider`).
- `src/pages/Home.tsx` - Área logada; unificar marca para “PromptMetrics”.
- `src/components/Problem.tsx` - Aplicar `SectionHeader`/`DecorativeBlobs` (PR2) sem alterar visual.
- `src/components/Transformation.tsx` - Idem.
- `src/components/Pricing.tsx` - Idem.
- `src/components/FAQ.tsx` - Idem.
- `src/components/ContactForm.tsx` - Idem.
- `src/index.css` - Utilitários para `prefers-reduced-motion` e ajustes leves em mobile.
- `src/components/SectionHeader.tsx` - Novo componente (PR2) para padronizar cabeçalhos de seção.
- `src/components/DecorativeBlobs.tsx` - Novo componente (PR2) para elementos decorativos reutilizáveis.
- `src/components/FeatureCard.tsx` - Novo componente (PR2) para cartões com ícone/título/descrição.
- `src/components/SectionHeader.test.tsx` - Testes unitários do `SectionHeader`.
- `src/components/FeatureCard.test.tsx` - Testes unitários do `FeatureCard`.
- `e2e/landing-navigation.spec.ts` - Testes E2E de navegação mobile/âncoras e CTA.
- `e2e/landing-visual.spec.ts` - Regressão visual por breakpoint (sm/md/lg) e acessibilidade básica.

### Notes

- Colocar testes unitários próximos aos componentes quando possível (ex.: `SectionHeader.tsx` e `SectionHeader.test.tsx`).
- Usar `npx jest [caminho/opcional]` para executar testes unitários e `npx playwright test` para E2E (ajustar se o projeto ainda não estiver configurado).
- Links externos devem usar HTTPS/TLS e `rel="noopener noreferrer"`.

## Tasks

- [x] 1.0 PR1: Navegação e acessibilidade da landing (mobile e desktop)
  - [x] 1.1 Passar `onSectionScroll={scrollTo}` em `src/components/Header.tsx` também para `<MobileNav />`.
  - [x] 1.2 Garantir smooth scroll para `#pricing` e `#faq` a partir do menu mobile (ver `handleSectionClick` em `src/components/MobileNav.tsx`).
  - [x] 1.3 Revisar `DesktopNav` para consistência de foco/`aria-current` nos itens de navegação.
  - [x] 1.4 Verificação manual: clicar em Pricing/FAQ em mobile rola corretamente até a seção (ajuste aplicado; falta confirmar em ambiente executando).

- [x] 2.0 PR1: Unificação de marca global para “PromptMetrics” (landing e área logada)
  - [x] 2.1 Substituir label em `src/pages/Home.tsx` de “RankMeLLM” para “PromptMetrics”.
  - [x] 2.2 Substituir label em `src/pages/Admin.tsx` de “RankMeLLM Admin” para “PromptMetrics Admin”.
  - [x] 2.3 Rodar busca por “RankMeLLM” no projeto e confirmar 0 ocorrências restantes (no `src/` não há ocorrências).
  - [x] 2.4 Validar visualmente header/footer para manter “PromptMetrics” consistente.

- [x] 3.0 PR1: Remoções/correções essenciais (providers duplicados, logs, Changelog, footer seguro/lazy)
  - [x] 3.1 Remover `console.log` de `src/pages/Index.tsx`.
  - [x] 3.2 Remover `LanguageProvider`/`AccessibilityProvider` duplicados em `Index.tsx`, mantendo-os centralizados em `src/App.tsx`.
  - [x] 3.3 Remover link para Changelog do `src/components/Footer.tsx` (ocultar/retirar o bloco que usa `t('footer.changelog')`).
  - [x] 3.4 Confirmar ausência de rota `/changelog` no `App.tsx` e remover menções em documentação (`docs/DOCS.md`).
  - [x] 3.5 Otimizar link/imagem NVIDIA no footer: envolver em `<a target="_blank" rel="noopener noreferrer">`, adicionar `loading="lazy"` e `decoding="async"`.

- [x] 4.0 PR2: Componentização visual sem alterar UI (SectionHeader, DecorativeBlobs, FeatureCard) e aplicação nas seções
  - [x] 4.1 Criar `src/components/SectionHeader.tsx` (props: `icon`, `tag`, `title`, `subtitle`, `align?`, `dangerouslySetInnerHTML?`).
  - [x] 4.2 Aplicar `SectionHeader` em `Problem`, `Transformation`, `Pricing`, `FAQ`, `ContactForm` mantendo a mesma hierarquia visual.
  - [x] 4.3 Criar `src/components/DecorativeBlobs.tsx` com presets (posição, tamanho, cor/gradiente, blur) e substituir blobs estáticos nas seções.
  - [x] 4.4 Criar `src/components/FeatureCard.tsx` e refatorar os cards de `Problem`/`Transformation` para usar o componente.
  - [x] 4.5 Garantir paridade visual (screenshots comparativos antes/depois).

- [x] 5.0 PR2: Performance e motion (prefers-reduced-motion, reduzir blur/sombras em mobile, lazy) + execução do Plano de Testes (axe/Playwright/snapshots)
  - [x] 5.1 Adicionar utilitário/condição para `prefers-reduced-motion` (CSS/utilities) e ajustar `framer-motion` onde aplicável (aplicado em `Hero`/`.pm-reduce-motion`).
  - [ ] 5.2 Reduzir intensidade de `backdrop-blur`/sombras em mobile usando modificadores responsivos.
  - [ ] 5.3 Revisar imagens não críticas e garantir `loading="lazy"`/`decoding="async"` (além do footer).
  - [ ] 5.4 Testes unitários: criar `SectionHeader.test.tsx` e `FeatureCard.test.tsx` (Jest/RTL). Se necessário, configurar Jest/RTL.
  - [ ] 5.5 Testes de acessibilidade: rodar axe na landing (Hero, Pricing, FAQ, Form) e header/footer; corrigir violações.
  - [x] 5.6 Testes E2E (Playwright): menu mobile rola para `#pricing`/`#faq`; CTA do Hero rola para `#form`; link externo do footer abre com segurança.
  - [x] 5.7 Regressão visual: capturas por breakpoint (sm/md/lg) para Hero, Pricing, FAQ, Form.
  - [ ] 5.8 Checklist de Lighthouse (mobile): Performance ≥ 90, sem regressão de CLS, LCP ≤ 2.5s.