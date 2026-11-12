# Testes

## Executados na fundação

| Comando | Ferramenta | Cobre |
| --- | --- | --- |
| `npm test` | `node:test` | Geração determinística, CSS commitado, alias cíclico, contraste, prefixo, ausência de cor literal, governança documental, contrato da sidebar |
| `npm run test:e2e` | Playwright e axe-core | Demonstração, sidebar, teclado, foco, mobile, filtro, formulário, tema escuro, identidade, rodapé, violações graves, captura do painel |
| `npm run capture:screenshots` | Playwright | Evidências visuais em `docs/evidence/ui-npa-003`, sem comparação automática |

`npm run check` executa os testes unitários e os de navegador. O build não roda automaticamente antes do teste: se o JSON mudar e o CSS não for regenerado, `npm test` falha.

## Não instalados

- Vitest: o executor nativo do Node cobre os testes de unidade sem dependência extra.
- Stylelint: a checagem objetiva de CSS está em `tests/governance.test.mjs`.

## Como ler o resultado

Falha de contraste indica o par, a razão e as cores. Falha do axe imprime a violação. A captura `tests/e2e/demo.spec.js-snapshots` depende de fonte de sistema e do Chromium instalado pelo Playwright; diferença de ambiente pede revisão visual antes de atualizar a imagem.

Atualização intencional da captura:

```bash
npx playwright test --update-snapshots
```

## Capturas de evidência

`npm run capture:screenshots` inicia o servidor local quando necessário e grava, em `docs/evidence/ui-npa-003`:

- desktop com sidebar expandida;
- desktop com sidebar recolhida;
- tablet;
- mobile fechado e com o menu aberto;
- faixa institucional;
- rodapé;
- changelog;
- informações do sistema.

As imagens são evidência para revisão visual. Não são comparadas automaticamente, não declaram homologação e variam com a fonte e a plataforma. O Chromium do Playwright precisa estar instalado com `npx playwright install chromium`.

## Fora do automático

Revisão humana de IUI-002, IUI-003, IUI-005, IUI-007, IUI-008, IUI-010, IUI-011 e IUI-012. Percurso com leitor de tela. Homologação da paleta. Conformidade WCAG integral.
