# Changelog

O formato segue Keep a Changelog. As versões seguem SemVer, com a ressalva documentada em [docs/versioning.md](docs/versioning.md).

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
