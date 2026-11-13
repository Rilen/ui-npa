# Changelog

O formato segue Keep a Changelog. As versões seguem SemVer, com a ressalva documentada em [docs/versioning.md](https://github.com/Rilen/ui-npa/blob/main/docs/versioning.md).

## [0.3.4] - 2026-11-13

Hardening de acessibilidade para zoom apenas de texto a 400%. Correção local, sem alteração da paleta ou de contratos públicos.

### Adicionado

- Testes E2E de texto a 400% em 1440/390px, conteúdo visível, sem overflow horizontal de documento, conteúdo ou página.
- Testes de navegação móvel e axe em texto a 400%.
- Evidências antes/depois em `docs/evidence/accessibility-text-zoom`.

### Corrigido

- Textos, títulos, botões, badges, campos, alertas e metadados passam a quebrar palavras longas quando necessário.
- Itens de stack, cluster, grid e cards podem encolher (`min-width: 0`).
- Cabeçalho, títulos e badge preservam a faixa em zoom extremo; o badge é ocultado quando não há largura útil.
- Sidebar, logomarcas e ícones têm limites de tamanho em zoom elevado.
- Página, cabeçalho e link de salto limitam padding/largura para não criar overflow.
- Rodapé e metadados quebram conteúdo longo.
- Área de conteúdo mantém um piso visível e rolável quando o chrome cresce.

### Limitações

- Em zoom de texto a 400%, títulos e identificações institucionais podem ser truncados com elipse; o texto completo permanece no DOM e em Sobre.
- Tabelas continuam com rolagem horizontal interna; isso é intencional.
- Leitor de tela real, dispositivo físico, Firefox/WebKit e auditoria manual completa permanecem `NOT_RUN`.
- Nenhum push, npm publish, release ou deploy nesta missão.

## [0.3.3] - 2026-11-13

Maturação corretiva da prontidão institucional. Correções compatíveis e verificações adversariais, sem publicação npm, release, push ou deploy.

### Adicionado

- `prepare` para gerar `dist` em instalação Git, mantendo o tarball como canal recomendado.
- Validação de `logo` (relativo, HTTP(S), `data:image/*`) e `changelogUrl` (relativo ou HTTP(S)); esquemas perigosos são rejeitados.
- Landmark nomeado na faixa institucional, com responsabilidade documentada para o consumidor.
- Cenário de ordem de camadas invertida e teste adversarial correspondente.
- Runbook operacional em `docs/operations/integration-runbook.md`.
- Testes unitários de URLs e E2E de região, camadas e ordem invertida.
- Links do README e CHANGELOG para a documentação no repositório.

### Corrigido

- Instalação por clone Git deixa de produzir pacote sem `dist` quando scripts estão habilitados.
- Achado axe moderado `region` na faixa institucional da demonstração e do consumidor.
- URLs configuráveis perigosas em `identity.js`.
- Declarações históricas desatualizadas sobre push e estado remoto.

### Limitações

- CSS legado sem camada continua prevalecendo; a ordem correta é obrigatória.
- A publicação npm, o licenciamento público e a validação manual de acessibilidade permanecem pendentes.
- Firefox/WebKit e dispositivo físico não foram executados nesta missão; Chrome e Edge foram verificados.

## [0.3.2] - 2026-11-13

Piloto de integração legada e correções compatíveis de CSS encontradas na validação.

### Adicionado

- Fixture `tests/fixtures/consumer-legacy` com estados A (legado), B (convivência) e C (migração incremental).
- Cenários de conflito CSS reproduzido e mitigado por ordem de camadas.
- Comparação de componentes, persistência de formulário e filtro para demonstrar reversibilidade.
- Testes E2E dos três estados, fluxos, teclado, responsividade, axe e isolamento.
- Evidências da UI-NPA-009 e documentação do piloto.

### Corrigido

- `[hidden]` dentro de `.iui-root` permanece oculto mesmo quando o componente define `display`.
- A tabela do UI-NPA neutraliza a borda externa herdada de regras legadas; a borda continua no wrapper.
- Versão `0.3.2` alinhada entre manifesto, lock e fixtures.

### Limitações

- CSS legado sem camada continua tendo precedência.
- A reversibilidade do piloto usa `localStorage`, não um mecanismo de produção.
- Nenhuma publicação npm, push ou deploy foi executado nesta missão.

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
