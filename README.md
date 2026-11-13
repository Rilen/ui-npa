# UI-NPA

Design System institucional do Núcleo de Pesquisas Avançadas.

Uma identidade. Um padrão. Múltiplos sistemas.

Esta é a versão `0.3.2`. A paleta clara oficial é **Azul Institucional Equilibrado (alternativa A)**, homologada em 12/11/2026. O tema escuro é experimental. O projeto é privado, não publicado e não depende de outro sistema para funcionar.

## Começar

Requisitos: Node.js 20 ou superior.

```bash
npm install
npm run build
npm test
npm run test:e2e
npm run prepare:consumer
npm run capture:screenshots
npm run capture:screenshots:005
npm run capture:screenshots:007
npm run capture:screenshots:008
npm run capture:screenshots:009
npm run dev
```

A demonstração fica em `http://127.0.0.1:4173/examples/requerimentos/`. A fixture independente fica em `http://127.0.0.1:4173/tests/fixtures/consumer-vanilla/` depois de `npm run prepare:consumer`. O piloto legado começa em `http://127.0.0.1:4173/tests/fixtures/consumer-legacy/estado-a.html`.

`npm run capture:screenshots:009` instala o pacote local e captura os três estados do piloto legado. As evidências ficam em `docs/evidence/ui-npa-009`. As capturas das UI-NPA-003, 005, 006, 007 e 008 permanecem como histórico.

`npm run build` gera `packages/styles/tokens.css` e `dist`. O teste falha se o CSS canônico divergir da fonte. Não edite `dist` nem o CSS gerado.

## Consumo local

A distribuição pública é o `dist` do tarball local, com as entradas `ui-npa/styles.css`, `ui-npa/tokens.css`, `ui-npa/sidebar.js` e `ui-npa/identity.js`. A fixture `tests/fixtures/consumer-vanilla` usa somente essas entradas. O pacote é privado; não há publicação npm nesta fase. Detalhes, ordem de camadas e limites de CSS legado estão em [docs/integration.md](docs/integration.md).

## Estado desta versão

| Área | Estado |
| --- | --- |
| Tokens DTCG, tema claro oficial e CSS universal | Implementado |
| Button, Card, Text, Badge, Field, Alert, Table, Sidebar, Shell | Implementado |
| Demonstração fictícia de requerimentos | Implementado |
| Identidade institucional e rodapé técnico | Implementado |
| Paleta clara oficial — Azul Institucional Equilibrado (A) | Homologada em 12/11/2026 |
| Pacote local, `dist` e fixture de consumidor | Implementado em 0.3.1 |
| Piloto de integração legada A/B/C | Implementado em 0.3.2 |
| Governança IUI-001 a IUI-014 | Implementado |
| Protocolo `ui-npa-migration` | Especificado, não executado |
| Tema escuro | Experimental |
| Publicação npm e React, Angular, PHP, Web Components | Planejado |
| Publicação 1.0.0 | Não suportada nesta fase |

## Mapa

- Arquitetura: [docs/architecture.md](docs/architecture.md)
- Decisão: [docs/decisions/001-foundation.md](docs/decisions/001-foundation.md)
- Homologação da paleta: [docs/decisions/004-palette-homologation.md](docs/decisions/004-palette-homologation.md)
- Distribuição pública: [docs/decisions/005-public-distribution.md](docs/decisions/005-public-distribution.md)
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
- Auditoria UI-NPA-008: [docs/audit/ui-npa-008.md](docs/audit/ui-npa-008.md)
- Piloto legado: [docs/pilots/legacy-integration.md](docs/pilots/legacy-integration.md)
- Evidências visuais: [docs/evidence/ui-npa-009](docs/evidence/ui-npa-009), com histórico em [UI-NPA-003](docs/evidence/ui-npa-003), [UI-NPA-005](docs/evidence/ui-npa-005), [UI-NPA-006](docs/evidence/ui-npa-006), [UI-NPA-007](docs/evidence/ui-npa-007) e [UI-NPA-008](docs/evidence/ui-npa-008)
- Versionamento: [docs/versioning.md](docs/versioning.md)
- Limitações: [docs/limitations.md](docs/limitations.md)
- Onboarding de agentes: [docs/agents/onboarding.md](docs/agents/onboarding.md)
- Agentes: [AGENTS.md](AGENTS.md)

Fluent 2 é referência de linguagem visual. Não há dependência, componente, logomarca nem ativo da Microsoft.
