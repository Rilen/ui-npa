# ADR 001 — Fundação enxuta

Data: 2026-11-12. Estado: aceita.

## Contexto

O UI-NPA precisa nascer como referência visual sem copiar a Microsoft, sem prender consumidores a um framework e sem criar estrutura que ainda não tem uso.

## Decisão

- Um repositório, dois artefatos reais (`tokens` e `styles`) e uma demonstração. Sem pacotes vazios.
- React, Angular, PHP e Web Components ficam documentados como consumidores futuros do mesmo CSS.
- Gerador próprio em Node, sem Style Dictionary. A transformação é pequena e o núcleo não ganha dependência de build.
- Testes de unidade com `node:test`. Vitest não foi instalado.
- Playwright e axe-core cobrem sidebar, teclado, foco, responsividade, tema e violações graves na demonstração.
- Stylelint não foi instalado. `tests/governance.test.mjs` verifica `!important`, cor literal e variáveis inexistentes.
- Fonte de sistema. Nenhuma fonte é baixada de CDN.
- Paleta própria, provisória, com contraste calculado. Fluent 2 orienta a linguagem: superfície clara, borda fina, raio moderado, sombra funcional e hierarquia discreta.
- Tokens de componente não foram criados. Medidas de sidebar, controle e conteúdo ficam no grupo primitivo `size`, porque não mudam entre temas.
- O tema escuro existe para provar a troca semântica e está marcado como experimental.
- O CSS gerado é commitado para o consumidor não precisar executar o gerador.

## Consequências

A primeira integração é HTML com a folha `index.css`. Um wrapper React posterior deve ser fino e não pode redefinir token. O tema escuro não deve ser oferecido como identidade oficial até ser homologado.
