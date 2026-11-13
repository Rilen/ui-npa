# ADR 007 — Hardening de zoom apenas de texto

Data: 2026-11-13. Estado: aceita para a linha `0.3.4`.

## Contexto

A UI-NPA 0.3.3 passava em 100% e 200%, mas em zoom apenas de texto a 400% a sidebar, o cabeçalho e a faixa institucional cresciam em `rem`, o conteúdo era comprimido a zero e palavras longas criavam overflow horizontal. O consumidor e a demonstração reproduziram o problema em 1440px e 390px.

## Decisão

- Conteúdo textual usa `overflow-wrap: anywhere`; itens flex/grid/card podem encolher com `min-width: 0`.
- O chrome não cresce sem limite: sidebar, logomarcas, ícones, padding de cabeçalho/página e link de salto têm limites; o badge do cabeçalho é ocultado pela container query quando não há largura útil.
- A área de conteúdo recebe um piso derivado de header + instituição + espaço, permanecendo rolável quando o chrome ocupa a altura.
- Tabelas continuam com rolagem horizontal interna, que é uma rolagem legítima e distinta de overflow do documento.
- A correção não altera a paleta, tokens semânticos, contratos públicos ou dependências de runtime.

## Consequências

Em texto 400%, documento, conteúdo e página não têm overflow horizontal nos cenários cobertos; o conteúdo mantém altura e rolagem vertical. Em 100% e 200%, a aparência canônica e os testes existentes permanecem. Em zoom extremo, títulos e identificações podem usar elipse; o texto completo permanece no DOM e em Sobre o sistema. A versão sobe para `0.3.4`, sem `1.0.0` e sem publicação remota.
