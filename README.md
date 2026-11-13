# UI-NPA

Design System institucional do Núcleo de Pesquisas Avançadas.

Uma identidade. Um padrão. Múltiplos sistemas.

Esta é a versão `0.3.0`. A paleta clara oficial é **Azul Institucional Equilibrado (alternativa A)**, homologada em 12/11/2026. O tema escuro é experimental. O projeto é privado, não publicado e não depende de outro sistema para funcionar.

## Começar

Requisitos: Node.js 20 ou superior.

```bash
npm install
npm run build
npm test
npm run test:e2e
npm run capture:screenshots
npm run capture:screenshots:005
npm run capture:screenshots:007
npm run dev
```

A demonstração fica em `http://127.0.0.1:4173/examples/requerimentos/`.

`npm run capture:screenshots` grava as evidências visuais da UI-NPA-003 em `docs/evidence/ui-npa-003`. `npm run capture:screenshots:005` grava as evidências da UI-NPA-005 em `docs/evidence/ui-npa-005`. `npm run capture:screenshots:007` grava o tema oficial em `docs/evidence/ui-npa-007`. As evidências da UI-NPA-006 permanecem como registro histórico da avaliação. Todos requerem o Chromium do Playwright, instalado com `npx playwright install chromium`.

`npm run build` regrava `packages/styles/tokens.css` a partir de `packages/tokens`. O teste falha se o CSS commitado divergir da fonte. Não edite o CSS gerado.

## Estado desta versão

| Área | Estado |
| --- | --- |
| Tokens DTCG, tema claro oficial e CSS universal | Implementado |
| Button, Card, Text, Badge, Field, Alert, Table, Sidebar, Shell | Implementado |
| Demonstração fictícia de requerimentos | Implementado |
| Identidade institucional e rodapé técnico | Implementado |
| Paleta clara oficial — Azul Institucional Equilibrado (A) | Homologada em 12/11/2026 |
| Governança IUI-001 a IUI-014 | Implementado |
| Protocolo `ui-npa-migration` | Especificado, não executado |
| Tema escuro | Experimental |
| React, Angular, PHP e Web Components | Planejado |
| Publicação 1.0.0 | Não suportada nesta fase |

## Mapa

- Arquitetura: [docs/architecture.md](docs/architecture.md)
- Decisão: [docs/decisions/001-foundation.md](docs/decisions/001-foundation.md)
- Homologação da paleta: [docs/decisions/004-palette-homologation.md](docs/decisions/004-palette-homologation.md)
- Candidatos arquivados: [docs/decisions/003-palette-candidates.md](docs/decisions/003-palette-candidates.md) e [docs/archive/ui-npa-006](docs/archive/ui-npa-006)
- Tokens: [docs/tokens.md](docs/tokens.md)
- Histórico da paleta: [docs/palette.md](docs/palette.md)
- Temas: [docs/themes.md](docs/themes.md)
- Identidade: [docs/identity.md](docs/identity.md)
- Componentes: [docs/components.md](docs/components.md)
- Governança: [governance/UI-NPA-GOVERNANCE.md](governance/UI-NPA-GOVERNANCE.md)
- Acessibilidade: [docs/accessibility.md](docs/accessibility.md)
- Integração: [docs/integration.md](docs/integration.md)
- Migração: [docs/agents/ui-npa-migration.md](docs/agents/ui-npa-migration.md)
- Testes: [docs/testing.md](docs/testing.md)
- Evidências visuais: [docs/evidence/ui-npa-007](docs/evidence/ui-npa-007), com histórico em [UI-NPA-003](docs/evidence/ui-npa-003), [UI-NPA-005](docs/evidence/ui-npa-005) e [UI-NPA-006](docs/evidence/ui-npa-006)
- Versionamento: [docs/versioning.md](docs/versioning.md)
- Limitações: [docs/limitations.md](docs/limitations.md)
- Agentes: [AGENTS.md](AGENTS.md)

Fluent 2 é referência de linguagem visual. Não há dependência, componente, logomarca nem ativo da Microsoft.
