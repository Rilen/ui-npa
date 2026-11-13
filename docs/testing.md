# Testes

## Comandos e cobertura

| Comando | Ferramenta | Cobre |
| --- | --- | --- |
| `npm test` | `node:test` | Geração determinística, CSS canônico, valores da paleta oficial, ausência de mecanismos de candidatos, metadados de distribuição, `prepare`, fixture pública, alias cíclico, contraste no tema claro e no escuro, validação de URLs de identidade, prefixo, ausência de cor literal, governança documental, contrato da sidebar |
| `npm run test:e2e` | Playwright e axe-core | Demonstração, pacote instalado, fixtures isoladas, piloto legado A/B/C, CSS legado em camada, sem camada e em ordem invertida, landmarks, paleta oficial sem candidata, sidebar, teclado, foco, mobile, filtro, formulário, tema escuro, identidade, rodapé, grade de indicadores, faixa móvel, Sobre o sistema, reflow a 200%, violações graves, captura do painel |
| `npm run prepare:consumer` | Node e npm | Gera o tarball, instala localmente e copia `dist` para a fixture isolada |
| `npm run capture:screenshots` | Playwright | Evidências visuais da UI-NPA-003 em `docs/evidence/ui-npa-003`, sem comparação automática |
| `npm run capture:screenshots:005` | Playwright | Evidências visuais da UI-NPA-005 em `docs/evidence/ui-npa-005`, sem comparação automática |
| `npm run capture:screenshots:007` | Playwright | Evidências visuais do tema oficial em `docs/evidence/ui-npa-007`, sem comparação automática |
| `npm run capture:screenshots:008` | Playwright | Evidências da fixture instalada e do cenário de CSS legado em `docs/evidence/ui-npa-008`, sem comparação automática |
| `npm run capture:screenshots:009` | Playwright | Evidências dos estados A/B/C do piloto legado em `docs/evidence/ui-npa-009`, sem comparação automática |

`npm run check` executa os testes unitários e os de navegador. `npm run build` gera `packages/styles/tokens.css` e `dist`; o teste falha se o CSS canônico divergir da fonte. A fixture de consumidor é preparada com `npm pack` e instalação local antes dos testes de navegador.

A instalação por clone Git é suportada com `prepare` e scripts habilitados; a verificação é feita em clone temporário e registrada em `docs/evidence/ui-npa-010`. O rito de adoção e rollback está no [runbook](operations/integration-runbook.md).

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

`npm run capture:screenshots` grava a UI-NPA-003 em `docs/evidence/ui-npa-003`:

- desktop com sidebar expandida;
- desktop com sidebar recolhida;
- tablet;
- mobile fechado e com o menu aberto;
- faixa institucional;
- rodapé;
- changelog;
- informações do sistema.

`npm run capture:screenshots:005` grava a UI-NPA-005 em `docs/evidence/ui-npa-005`:

- desktop expandido e recolhido em 1440×900;
- tablet em 1024×768 com os indicadores em duas colunas;
- mobile em 390×844 e 320×700;
- faixa institucional móvel;
- Sobre o sistema em desktop e mobile.

`npm run capture:screenshots:007` grava a UI-NPA-007 em `docs/evidence/ui-npa-007`:

- desktop com sidebar expandida e recolhida em 1440×900;
- tablet em 1024×768;
- mobile em 390×844 e 320×700;
- faixa institucional, componentes, rodapé e Sobre o sistema.

`npm run capture:screenshots:008` prepara o tarball local e grava a UI-NPA-008 em `docs/evidence/ui-npa-008`:

- consumidor isolado em desktop e mobile;
- sidebar expandida e recolhida;
- faixa institucional, componentes e rodapé do consumidor;
- cenário de CSS legado sem camada;
- relatório da instalação local do pacote.

`npm run capture:screenshots:009` grava a UI-NPA-009 em `docs/evidence/ui-npa-009`:

- estados A, B e C em desktop e mobile;
- comparação de componentes;
- conflito CSS reproduzido e mitigado;
- demonstração de reversibilidade.

As imagens são evidência para revisão visual. Não são comparadas automaticamente, não declaram homologação e variam com a fonte e a plataforma. O Chromium do Playwright precisa estar instalado com `npx playwright install chromium`. Os testes de navegador cobrem 1440, 1024, 768, 390 e 320px, incluindo sidebar expandida e recolhida, faixa móvel, paleta oficial, fixture instalada, piloto legado e axe em Sobre o sistema, no consumidor e nos três estados.

## Fora do automático

Revisão humana de IUI-002, IUI-003, IUI-005, IUI-007, IUI-008, IUI-010, IUI-011 e IUI-012. Percurso com leitor de tela. Validação em dispositivo físico. Reflow a 400% medido como viewport CSS de 320px; zoom apenas de texto a 400% não é suportado. Conformidade WCAG integral.
