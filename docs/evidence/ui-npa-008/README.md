# Evidências — UI-NPA-008

Capturas reais da fixture consumidora isolada, instalada a partir do tarball local `ui-npa-0.3.1.tgz`.

| Arquivo | Estado | Viewport |
| --- | --- | --- |
| `01-consumer-desktop.png` | Consumidor isolado em desktop | 1440×900 |
| `02-consumer-mobile.png` | Consumidor isolado em mobile | 390×844 |
| `03-sidebar-expanded.png` | Sidebar expandida | 1440×900 |
| `04-sidebar-collapsed.png` | Sidebar recolhida | 1440×900 |
| `05-institution.png` | Faixa institucional configurada | 1440×900 |
| `06-components.png` | Componentes públicos no consumidor | 1440×900 |
| `07-footer.png` | Rodapé do consumidor | 1440×900 |
| `08-legacy-css.png` | CSS legado sem camada | 1440×900 |
| `09-package-install.txt` | Resultado da instalação local | — |

## Método

`npm run capture:screenshots:008` executa `npm pack`, instala o tarball em um diretório temporário, copia somente o `dist` instalado para `tests/fixtures/consumer-vanilla/.vendor` e abre a fixture pelo servidor local. A fixture não usa `examples/`, `packages/` nem arquivos internos do núcleo.

A fixture carrega `dist/index.css` e importa `dist/sidebar.js` e `dist/identity.js`. Os nomes, protocolos e marcas são fictícios. O CSS legado recomendado fica em `@layer legacy`, antes das camadas `iui.*`; o cenário `08` demonstra o limite quando o CSS legado está sem camada. As capturas de sidebar, faixa, componentes e rodapé são recortes de elementos; por isso a largura pode ser menor que o viewport.

Ambiente: Windows, tema claro, `prefers-reduced-motion: reduce`, escala 1, Chromium 158.0.8127.18 via Playwright 1.65.0, Node 24.13.0, npm 11.18.0. O pacote foi instalado localmente; nenhum registro npm, push ou deploy foi usado. A auditoria P0–P3 está em [docs/audit/ui-npa-008.md](../../audit/ui-npa-008.md).

## Limites

- `09-package-install.txt` registra o tarball, o SHA-256, as entradas públicas e o status da instalação.
- CSS legado sem camada tem precedência sobre o pacote; não há isolamento absoluto.
- A fixture usa `localStorage` para a preferência da sidebar.
- As imagens variam com fonte e plataforma. Não são homologação de conformidade WCAG.
