# Evidências — UI-NPA-009

Capturas reais do piloto de integração legada, geradas por `npm run capture:screenshots:009` após instalar o tarball local `ui-npa-0.3.2.tgz`.

| Arquivo | Estado | Viewport |
| --- | --- | --- |
| `01-state-a-desktop.png` | Estado A — legado | 1440×900 |
| `02-state-b-desktop.png` | Estado B — convivência | 1440×900 |
| `03-state-c-desktop.png` | Estado C — migração incremental | 1440×900 |
| `04-state-a-mobile.png` | Estado A — legado | 390×844 |
| `05-state-b-mobile.png` | Estado B — convivência | 390×844 |
| `06-state-c-mobile.png` | Estado C — migração incremental | 390×844 |
| `07-components-comparison.png` | Comparação de componentes | 1440×900 |
| `08-css-conflict.png` | Conflito CSS reproduzido | 1440×900 |
| `09-css-conflict-mitigated.png` | Conflito mitigado por camada | 1440×900 |
| `10-reversibility.png` | Estado A após dados preenchidos em C | 1440×900 |

## Método

`npm run prepare:consumer` executado a partir do tarball local; a captura usa o `dist` instalado em `tests/fixtures/consumer-legacy/.vendor`. O estado A não carrega o pacote; os estados B e C carregam `dist/index.css` e o módulo público `dist/identity.js`. O CSS legado fica em `@layer legacy`.

Ambiente: Windows, tema claro, `prefers-reduced-motion: reduce`, escala 1, Chromium 158.0.8127.18 via Playwright 1.65.0, Node 24.13.0 e npm 11.18.0. Nenhuma imagem foi gerada por IA.

## Leitura das capturas

- A mostra a aplicação apenas legada.
- B mostra a região delimitada em UI-NPA dentro do restante legado.
- C mostra o conteúdo principal migrado, preservando cabeçalho, navegação e rodapé legados.
- 07 compara os componentes legado, região delimitada e migração.
- 08 mostra o conflito de CSS sem camada: botão, título, campo, link e tabela perdem o contrato.
- 09 aplica a mesma intenção legada em `@layer legacy`; o contrato do UI-NPA é preservado.
- 10 mostra o formulário e o filtro preenchidos em C e mantidos ao voltar para A.

A captura 07 é um recorte da seção de comparação; as demais usam o viewport indicado. A matriz completa e as limitações estão em [docs/pilots/legacy-integration.md](../../pilots/legacy-integration.md).
