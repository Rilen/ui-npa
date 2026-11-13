# Evidências — UI-NPA-010

Maturação corretiva da UI-NPA `0.3.3`, executada em 2026-11-13. Não houve push, publicação npm, release ou deploy.

| Evidência | Resultado |
| --- | --- |
| `git-install.txt` | PASS — clone Git com `prepare`, `dist` presente e exports resolvidos |
| `tarball-install.txt` | PASS — tarball sanitizado, 21 entradas, instalação local e exports resolvidos |
| `package-hashes.txt` | PASS — build e tarball determinísticos no ambiente |
| `css-layers.txt` | Ordem correta preserva; sem camada e ordem invertida falham como esperado |
| `landmark-axe.txt` | PASS — nenhuma violação em demo, consumidor ou piloto A/B/C |
| `url-validation.txt` | PASS — esquemas seguros aceitos; `javascript:`/`data:` perigoso rejeitados |
| `browsers.txt` | Chrome e Edge PASS; Firefox/WebKit NOT_RUN |
| `tests.txt` | `npm test` 108/108; `npm run test:e2e` 40/40; `npm run check` PASS |

## Método

- Instalação por tarball: `npm pack`, instalação em diretório temporário e resolução dos exports públicos.
- Instalação por Git: clone temporário do commit de código `df01c5a` e `npm install` por referência Git, com `prepare`.
- Camadas: páginas de conflito do piloto e ordem invertida, lidas pelo Chromium.
- Acessibilidade: axe-core em demonstração, consumidor e estados A/B/C; viewport mobile em C.
- Navegadores: canais Chrome e Microsoft Edge; Firefox/WebKit não foram executados.
- URLs: casos válidos e inválidos passados por `assertInstitutionalIdentity`.

Ambiente: Windows, Node 24.13.0, npm 11.18.0, Playwright 1.65.0, Chromium 158.0.8127.18.

## Correções visuais e capturas

As correções desta missão são de distribuição, semântica, validação e contrato de CSS; não alteram a aparência canônica. Por isso não foram geradas novas capturas de tela. As evidências históricas 007, 008 e 009 permanecem preservadas.

## Limitações

- CSS legado sem camada continua prevalecendo; a ordem de camadas é obrigatória.
- Firefox/WebKit, leitor de tela real, dispositivo físico e zoom apenas de texto a 400% permanecem `NOT_RUN`.
- A publicação npm e o licenciamento público continuam pendentes.
- O `prepare` é bloqueado por `--ignore-scripts` ou política de allow-scripts; nesse caso, use o tarball.

Ver [ADR 006](../../decisions/006-hardening-0.3.3.md) e [runbook](../../operations/integration-runbook.md).
