# ADR 004 — Homologação da paleta clara oficial

Data: 2026-11-12. Estado: aceita.

## Decisão

A alternativa **A — Azul Institucional Equilibrado** é a paleta oficial do tema claro do UI-NPA. A decisão encerra a comparação A/B/C da UI-NPA-006.

Critérios considerados: equilíbrio institucional, legibilidade, consistência com a fundação, baixo risco de migração e contraste medido. B e C foram rejeitadas para adoção canônica.

## Consequências

- `packages/tokens/semantic.light.tokens.json` passa a usar o azul `atlantic` e os valores homologados de superfície, texto, borda, ação, foco, feedback e navegação.
- A primitiva `atlantic` permanece como azul institucional oficial. As primitivas `azure`, `steel`, `cool` e `stone` saem do bundle de produção.
- As definições completas dos candidatos ficam arquivadas em `docs/archive/ui-npa-006`, sem participar do build.
- `packages/styles/candidates.css`, o seletor de paleta, o parâmetro `?paleta`, a barra de comparação e `examples/paletas/` são removidos do fluxo operacional.
- O tema escuro continua experimental e não herda os valores claros.
- A versão sobe para `0.3.0`; não é uma versão `1.0.0`.
- A identidade visual do NPA não é alterada: a decisão homologa a paleta do UI-NPA, não a marca do órgão.

## Evidências

- [docs/palette.md](../palette.md) — alternativas, tabelas e contrastes medidos.
- [docs/evidence/ui-npa-006](../evidence/ui-npa-006) — capturas da avaliação.
- [docs/evidence/ui-npa-007](../evidence/ui-npa-007) — capturas do tema oficial.
- [docs/accessibility.md](../accessibility.md) — limites da verificação automática.

## Limitações

A homologação não declara conformidade WCAG 2.2 AA integral. Não houve validação em dispositivo físico nem com leitor de tela real. Não existe token separado para seleção de conteúdo. O tema escuro permanece experimental.
