# Evidências — Sidebar com três estados (UI-NPA-008)

Capturas reais da demonstração `examples/requerimentos` nos três estados de apresentação da sidebar, em desktop e mobile.

| Arquivo | Estado | Viewport |
| --- | --- | --- |
| `01-desktop-expanded.png` | Expandido (ícones e textos, ícone X) | 1440×900 |
| `02-desktop-compact.png` | Compacto (somente ícones, ícone painel) | 1440×900 |
| `03-desktop-hidden.png` | Oculto (sem coluna residual, ícone hamburger) | 1440×900 |
| `04-mobile-closed.png` | Mobile com drawer fechado | 390×844 |
| `05-mobile-open.png` | Mobile com drawer aberto | 390×844 |

## Método

`node scripts/capture-screenshots.mjs sidebar-states` abre a demonstração pelo servidor local (`scripts/serve.mjs`), em tema claro, `prefers-reduced-motion: reduce`, escala 1, e grava cada estado após a transição correspondente. A preferência é limpa antes do estado expandido; os demais estados são alcançados pelo botão de controle.

## Limites

- As imagens variam com fonte e plataforma. Não são homologação de conformidade WCAG.
- A regressão visual automática dos três estados vive em `tests/e2e/sidebar-states.spec.js` (cenário 12), com as linhas de base em `tests/e2e/sidebar-states.spec.js-snapshots`.
- O comportamento é coberto por `npm run test:e2e`; a revisão com leitor de tela e em dispositivo físico permanece manual.