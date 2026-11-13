# Auditoria técnica — UI-NPA-008

Data: 2026-11-13. Escopo: UI-NPA `0.3.0` até a maturação `0.3.1`. Sem push, publicação ou deploy.

## Inventário P0–P3

| Nível | Achado | Evidência | Tratamento |
| --- | --- | --- | --- |
| P0 | Nenhum achado P0 | Baseline e testes de contrato | — |
| P1 | Não havia superfície pública instalável; a documentação usava caminhos internos de `packages/styles` | `docs/integration.md`, `package.json` antigo | `dist`, `files`, `style` e exports públicos; fixture instalada |
| P1 | `npm pack` incluía arquivos operacionais, inclusive o ZIP não rastreado | `npm pack --dry-run` antes da correção | Whitelist `files: ["dist", "README.md", "CHANGELOG.md"]` |
| P2 | CSS legado sem camada vence as camadas `iui.*` | Teste `conflito.html` | Limite documentado; fixture recomendada usa `@layer legacy` |
| P2 | Componentes de tipografia não fixavam família contra regra global `h1` | Teste com `@layer legacy` | `base.css` fixa família nos componentes; teste de isolamento |
| P2 | Não havia aplicação consumidora nem prova de instalação | Ausência de fixture | `tests/fixtures/consumer-vanilla`, `npm pack`, `npm install` local e testes E2E |
| P2 | AGENTS não listava integração, testes, arquitetura e decisões | `AGENTS.md` | Mapa mínimo e onboarding documental |
| P3 | Quatro tokens semânticos sem uso direto nos componentes | `text.success`, `text.warning`, `border.strong`, `border.brand` | Mantidos como API pública; registrado em `docs/tokens.md` |
| P3 | Comandos de captura históricos 003/005 permanecem | `scripts/capture-screenshots.mjs` | Preservados como histórico; não são mecanismos de produção |
| P3 | `dist` é uma cópia gerada de `packages/styles` | `scripts/build-package.mjs` | Ignorado pelo Git; fonte única permanece `packages/styles` |

## Sanitização

- Sem credenciais, chaves, dados pessoais reais ou caminhos absolutos do ambiente SEMEDE em arquivos distribuíveis.
- `npm ls --depth=0` mostra apenas dependências de desenvolvimento; não há dependência de runtime.
- `npm audit --omit=dev` não encontrou vulnerabilidades.
- `dist`, `.vendor`, `.runtime`, `test-results` e `*.tgz` estão ignorados.
- Manifesto e `package-lock.json` estão em `0.3.1`; a divergência histórica `0.1.0` foi corrigida na UI-NPA-007.
- O ZIP `UI-NPA-003-EVIDENCIAS-VISUAIS.zip` permaneceu intacto e fora do Git.
- Não houve `git clean`, reset destrutivo ou reescrita de histórico.

## Limites que permanecem

- CSS legado sem camada não é isolado pelo pacote.
- O tema escuro é experimental.
- Não há publicação npm nem wrappers de framework.
- Não houve teste com leitor de tela real, dispositivo físico ou zoom apenas de texto a 400%.
- A auditoria é técnica e não declara conformidade WCAG integral.
