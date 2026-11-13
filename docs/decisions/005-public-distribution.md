# ADR 005 — Distribuição pública local e camadas

Data: 2026-11-13. Estado: aceita para a linha `0.3.1`.

## Contexto

O UI-NPA tinha CSS e módulos utilizáveis, mas sem uma superfície pública declarada. `npm pack` incluía arquivos operacionais não destinados ao consumidor, e a documentação apontava para caminhos internos de `packages/styles`. A missão UI-NPA-008 exigia uma aplicação independente consumindo o artefato instalado, não a demonstração.

## Decisão

- `packages/styles` continua sendo a fonte canônica.
- `scripts/build-package.mjs` gera `dist/` como cópia pública determinística de `packages/styles`.
- `npm run build` gera tokens e `dist`; `prepack` executa o build.
- `package.json` declara `files`, `style` e exports para `styles.css`, `tokens.css`, `sidebar.js` e `identity.js`.
- O pacote é privado, com licença `UNLICENSED`; a distribuição validada é um tarball local. Publicação npm é uma decisão futura.
- A fixture `tests/fixtures/consumer-vanilla` instala o tarball, copia somente `dist` e usa as APIs públicas.
- CSS legado do consumidor deve ficar em camada anterior. CSS sem camada tem precedência e é um limite documentado, não um isolamento absoluto.
- Os testes de consumidor cobrem instalação, caminhos públicos, paleta, sidebar, identidade, rodapé, tema escuro, responsividade, axe e conflito de CSS.

## Consequências

- O tarball não inclui `examples`, `tests`, `docs`, `scripts` nem o ZIP de evidências.
- `dist` é gerado e ignorado pelo Git; não é uma segunda fonte de verdade.
- A versão sobe para `0.3.1`, sem `1.0.0`.
- Uma futura publicação em registro, licença pública e wrappers de framework exigem decisão própria.
