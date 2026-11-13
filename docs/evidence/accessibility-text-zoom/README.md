# Evidências — hardening de zoom de texto

UI-NPA `0.3.4`, 2026-11-13. Correção local; sem push, npm publish, release ou deploy.

## Diagnóstico

O zoom apenas de texto altera `rem`; a sidebar expandida, o cabeçalho, a faixa institucional e o rodapé cresciam junto com o texto. A combinação tinha quatro efeitos:

1. sidebars e logomarcas consumiam a largura útil;
2. o cabeçalho não quebrava nem encolhia o badge, criando overflow horizontal;
3. palavras longas e itens flex/grid sem `min-width: 0` mantinham largura mínima;
4. o conteúdo flexível era comprimido a zero quando o chrome ocupava toda a altura.

Tabelas largas são uma rolagem interna legítima e foram separadas do overflow do documento.

## Antes

| Cenário | Documento | Conteúdo |
| --- | --- | --- |
| Demo 1440px, texto 400% | 1584px para viewport de 1440px | altura 0, conteúdo inacessível |
| Demo 390px, texto 400% | 608px para viewport de 390px | altura 0 |
| Consumidor 1440px, texto 400% | 1534px para viewport de 1440px | altura 0 |
| Consumidor 390px, texto 400% | 558px para viewport de 390px | altura 0 |

## Depois

| Cenário | Documento | Conteúdo |
| --- | --- | --- |
| Demo 1440px, texto 400% | 1440px = viewport | altura 576px, rolagem interna |
| Demo 390px, texto 400% | 390px = viewport | altura 576px, rolagem interna |
| Consumidor 1440px, texto 400% | 1440px = viewport | altura 576px, rolagem interna |
| Consumidor 390px, texto 400% | 390px = viewport | altura 576px, rolagem interna |

Em 100% e 200%, o conteúdo, a largura e a altura permanecem estáveis; as capturas de 100% são visualmente equivalentes às anteriores.

## Correções por seletor

- `.iui-title`, `.iui-heading`, `.iui-text`, `.iui-metric`, `.iui-button`, `.iui-badge`: `overflow-wrap: anywhere`.
- `.iui-field__label`, `.iui-field__hint`, `.iui-field__error`, `.iui-alert`: quebra de palavras longas.
- `.iui-stack > *`, `.iui-cluster > *`, `.iui-grid > *`, `.iui-card`, `.iui-page`, `.iui-table-wrap`: `min-width: 0`.
- `.iui-shell__content`: piso de altura derivado de header + instituição + espaço.
- `.iui-header`: container query; título com elipse e badge oculto quando não há largura útil.
- `.iui-header`, `.iui-button--icon`, `.iui-icon`, `.iui-page`: limites de padding e tamanho para o chrome não consumir toda a largura.
- `.iui-sidebar`, `.iui-institution__logo`, `.iui-sidebar__mark`: caps de largura/altura em zoom elevado.
- `.iui-skip-link`, `.iui-footer__identity`, `.iui-footer__credit`, `.iui-meta`: largura, wrap e quebra.

## Testes

- `tests/e2e/text-zoom.spec.js`: 6 cenários.
- Demo e consumidor em 1440/390, texto 100%, 200% e 400%.
- Sem overflow de documento, conteúdo ou página em 400%.
- Conteúdo com altura maior que zero e rolagem vertical disponível.
- Navegação móvel e Escape em texto 400%.
- axe sem `serious`, `critical` ou `region` em 400%.
- Suíte final: **108 unitários + 46 E2E**.

## Limitações

- Títulos do cabeçalho e identificações institucionais podem ser truncados com elipse em 400%; o texto completo permanece no DOM e em Sobre o sistema.
- Tabelas mantêm rolagem horizontal interna intencional.
- Leitor de tela real, dispositivo físico, Firefox/WebKit e auditoria manual de alvos continuam `NOT_RUN`.
- Zoom apenas de texto a 400% é diferente de reflow WCAG a 400% por viewport de 320px; ambos são cobertos, mas não equivalem a conformidade WCAG 2.2 AA integral.

As capturas estão em `before/` e `after/`, geradas em Chromium 158.0.8127.18, Playwright 1.65.0, tema claro, movimento reduzido e escala 1.

Ver [ADR 007](../../decisions/007-text-zoom-hardening.md).
