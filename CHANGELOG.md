# Changelog

O formato segue Keep a Changelog. As versões seguem SemVer, com a ressalva documentada em [docs/versioning.md](docs/versioning.md).

## [0.3.1] - 2026-11-13

Maturação da distribuição pública e validação independente de integração. Nenhuma publicação remota.

### Adicionado

- `dist` gerado por `scripts/build-package.mjs`, com `npm run build` e `prepack`.
- Exportações públicas `ui-npa/styles.css`, `ui-npa/tokens.css`, `ui-npa/sidebar.js` e `ui-npa/identity.js`.
- Metadados de pacote: `files`, `style`, licença `UNLICENSED`, repositório, homepage e bugs.
- Fixture independente `tests/fixtures/consumer-vanilla`, instalada a partir de tarball local e sem dependência de `examples/`.
- Cenários de CSS legado em camada e sem camada, com teste de integração.
- Testes de pacote, instalação, consumidor, sidebar, identidade, rodapé, tema escuro, responsividade e axe.
- Evidências da UI-NPA-008 em `docs/evidence/ui-npa-008`.
- ADR 005 e simulação de onboarding de agentes.

### Alterado

- Versão para `0.3.1`; `package-lock.json` alinhado ao manifesto.
- `npm run build` agora gera tokens e `dist`.
- Componentes receberam proteção explícita de família tipográfica contra CSS legado.
- Documentação de integração, arquitetura, testes, limitações e governança atualizada.

### Corrigido

- `npm pack` deixa de incluir `examples`, `tests`, `docs`, `scripts` e o ZIP de evidências.
- O consumidor não precisa de caminhos internos de `packages/` nem da demonstração.

### Limitações

- A distribuição validada é local; não há publicação npm.
- CSS legado sem camada ainda tem precedência sobre o pacote.
- Tema escuro continua experimental.
- Zoom apenas de texto a 400% não é suportado; reflow a 400% é coberto como viewport de 320px.
- Não há declaração de conformidade WCAG 2.2 AA integral.

## [0.3.0] - 2026-11-12

Homologação da paleta clara oficial e encerramento da comparação A/B/C. Nenhuma publicação remota.

### Adicionado

- Paleta clara oficial **Azul Institucional Equilibrado (alternativa A)**, homologada em 12/11/2026.
- Valores oficiais promovidos para `semantic.light.tokens.json`, incluindo superfícies, texto, bordas, ação, foco, feedback e navegação.
- Primitiva `atlantic` como azul institucional oficial do tema claro.
- Evidências visuais do tema oficial em `docs/evidence/ui-npa-007`.
- Arquivo histórico das definições A/B/C em `docs/archive/ui-npa-006`.
- Testes de paleta oficial, ausência de mecanismos de candidatos e contraste do tema claro e escuro.

### Alterado

- Versão do UI-NPA para `0.3.0`, com manifesto, changelog e documentação alinhados.
- `npm run build` emite somente `packages/styles/tokens.css`.
- A demonstração usa exclusivamente a identidade canônica, sem seletor de paleta.
- `docs/tokens.md`, `docs/themes.md`, `docs/architecture.md`, `docs/accessibility.md`, `docs/testing.md`, `docs/limitations.md`, `README.md` e governança registram a homologação.

### Removido

- `packages/styles/candidates.css`.
- `semantic.candidate-a|b|c.tokens.json` do fluxo de produção.
- Atributo `data-iui-candidate`, seletor “Paleta candidata”, parâmetro `?paleta`, barra de comparação e `examples/paletas/`.
- Primitivas `azure`, `steel`, `cool` e `stone` do bundle canônico.

### Limitações

- A paleta clara é oficial; o tema escuro continua experimental.
- As alternativas B e C foram rejeitadas e permanecem apenas como registro histórico.
- Não há token separado de seleção de conteúdo.
- A homologação não declara conformidade WCAG 2.2 AA integral.
- Não houve publicação, push ou deploy.

## [0.2.0] - 2026-11-12

Refinamento visual e contrato de identidade institucional. Nenhuma publicação remota.

### Adicionado

- IUI-013 e IUI-014: faixa Prefeitura e Secretaria, Setor na sidebar, rodapé com versão da aplicação, changelog, crédito NPA e Sobre o sistema.
- Contrato `applyInstitutionalIdentity`, independente de framework.
- Tokens de largura de conteúdo, faixa institucional, faixa móvel, logomarca e título.
- Utilitário `iui-grid--metrics`, com consulta de contêiner para a largura efetiva da área principal.
- Captura local de evidências visuais em `docs/evidence/ui-npa-003` e cobertura de identidade configurável no navegador.
- Evidências UI-NPA-005 para os estados responsivos e a página Sobre o sistema.
- Três paletas candidatas derivadas de DTCG: A — Azul Institucional Equilibrado, B — Azul Contemporâneo e C — Neutro Institucional.
- Primitivas `atlantic`, `azure`, `steel`, `cool` e `stone`, com `candidates.css` gerado separadamente e restrito à demonstração.
- Seletor `?paleta=a|b|c`, comparador em `examples/paletas/` e evidências UI-NPA-006.
- Teste de reflow com texto a 200% e contraste das três candidatas.

### Alterado

- A demonstração deixa de concentrar o conteúdo em coluna estreita e separa as seções na navegação existente.
- A versão exibida na demonstração é a da aplicação fictícia (`1.4.0`). A versão do UI-NPA aparece em Sobre o sistema.
- A barra de comparação de paletas fica dentro da área rolável da demonstração.

### Corrigido

- Indicadores em tablet passam a duas colunas, sem o quarto card isolado.
- A Secretaria é identificada na faixa móvel em duas linhas, com nome visível e acessível.
- Sobre o sistema passa a agrupar Identidade institucional, Aplicação e Informações técnicas.
- Rodapé, botões e marca da sidebar refluem com texto a 200% sem rolagem horizontal.

### Limitações

- A paleta continua provisória e não está homologada.
- As paletas A, B e C são candidatas; nenhuma foi escolhida.
- As marcas e o changelog da demonstração são sintéticos.

## [0.1.0] - 2026-11-12

Fundação do UI-NPA para revisão. Nenhuma publicação remota.

### Adicionado

- Fonte canônica de tokens em formato DTCG e geração determinística de CSS Custom Properties com prefixo `iui-`.
- Tema claro canônico e tema escuro experimental.
- Folha universal, sem reset destrutivo, com Button, Card, Text, Badge, Field, Alert, Table, Sidebar e Shell.
- Demonstração fictícia de gestão municipal de requerimentos.
- Política `UI-NPA-GOVERNANCE` e especificação da skill `ui-npa-migration`.
- Testes de integridade, contraste, governança e navegador.

### Limitações

- A paleta é provisória e não está homologada.
- Não há pacote React, Angular, PHP ou Web Component.
- Os testes automáticos não comprovam conformidade integral com a WCAG 2.2 AA.
