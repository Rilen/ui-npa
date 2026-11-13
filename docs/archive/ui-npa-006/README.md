# Arquivo — candidatos de paleta UI-NPA-006

Estado: histórico. Estes arquivos **não** são lidos pelo gerador, não entram no CSS canônico e não devem ser usados por aplicações consumidoras.

A avaliação da UI-NPA-006 comparou três alternativas derivadas da mesma estrutura DTCG. Em 12/11/2026, a alternativa **A — Azul Institucional Equilibrado** foi homologada como paleta do tema claro. As alternativas B e C foram rejeitadas para adoção canônica.

- `semantic.candidate-a.tokens.json` — definição completa da alternativa promovida.
- `semantic.candidate-b.tokens.json` — alternativa rejeitada.
- `semantic.candidate-c.tokens.json` — alternativa rejeitada.
- `primitive.tokens.json` — cópia das primitivas de cor do momento da avaliação, incluindo as rampas `atlantic`, `azure`, `steel`, `cool` e `stone`.

A definição canônica atual está em `packages/tokens/semantic.light.tokens.json`. A decisão está em [docs/decisions/004-palette-homologation.md](../../decisions/004-palette-homologation.md), e as medições históricas estão em [docs/palette.md](../../palette.md). As capturas permanecem em `docs/evidence/ui-npa-006`.

Este arquivo não é uma segunda fonte de verdade. Ele preserva a rastreabilidade da decisão sem reintroduzir variantes no bundle oficial.
