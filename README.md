# UI-NPA

Design System institucional do Núcleo de Pesquisas Avançadas.

Uma identidade. Um padrão. Múltiplos sistemas.

Esta é a versão `0.3.3`. A paleta clara oficial é **Azul Institucional Equilibrado (alternativa A)**, homologada em 12/11/2026. O tema escuro é experimental. O projeto é privado, não publicado e não depende de outro sistema para funcionar.

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

A distribuição pública é o `dist`, com as entradas `ui-npa/styles.css`, `ui-npa/tokens.css`, `ui-npa/sidebar.js` e `ui-npa/identity.js`. O canal recomendado é o tarball local; clone Git é suportado com scripts habilitados e `prepare`. A fixture `tests/fixtures/consumer-vanilla` usa somente essas entradas. O pacote é privado; não há publicação npm nesta fase. Detalhes, ordem de camadas, validação e rollback estão em [docs/integration.md](https://github.com/Rilen/ui-npa/blob/main/docs/integration.md) e no [runbook](https://github.com/Rilen/ui-npa/blob/main/docs/operations/integration-runbook.md).

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
| Correções de distribuição, landmark, URLs e runbook | Implementado em 0.3.3 |
| Governança IUI-001 a IUI-014 | Implementado |
| Protocolo `ui-npa-migration` | Especificado, não executado |
| Tema escuro | Experimental |
| Publicação npm e React, Angular, PHP, Web Components | Planejado |
| Publicação 1.0.0 | Não suportada nesta fase |

## Mapa

- Arquitetura: [docs/architecture.md](https://github.com/Rilen/ui-npa/blob/main/docs/architecture.md)
- Decisão: [docs/decisions/001-foundation.md](https://github.com/Rilen/ui-npa/blob/main/docs/decisions/001-foundation.md)
- Homologação da paleta: [docs/decisions/004-palette-homologation.md](https://github.com/Rilen/ui-npa/blob/main/docs/decisions/004-palette-homologation.md)
- Distribuição pública: [docs/decisions/005-public-distribution.md](https://github.com/Rilen/ui-npa/blob/main/docs/decisions/005-public-distribution.md)
- Hardening 0.3.3: [docs/decisions/006-hardening-0.3.3.md](https://github.com/Rilen/ui-npa/blob/main/docs/decisions/006-hardening-0.3.3.md)
- Candidatos arquivados: [docs/decisions/003-palette-candidates.md](https://github.com/Rilen/ui-npa/blob/main/docs/decisions/003-palette-candidates.md) e [docs/archive/ui-npa-006](https://github.com/Rilen/ui-npa/blob/main/docs/archive/ui-npa-006)
- Tokens: [docs/tokens.md](https://github.com/Rilen/ui-npa/blob/main/docs/tokens.md)
- Histórico da paleta: [docs/palette.md](https://github.com/Rilen/ui-npa/blob/main/docs/palette.md)
- Temas: [docs/themes.md](https://github.com/Rilen/ui-npa/blob/main/docs/themes.md)
- Identidade: [docs/identity.md](https://github.com/Rilen/ui-npa/blob/main/docs/identity.md)
- Componentes: [docs/components.md](https://github.com/Rilen/ui-npa/blob/main/docs/components.md)
- Governança: [governance/UI-NPA-GOVERNANCE.md](https://github.com/Rilen/ui-npa/blob/main/governance/UI-NPA-GOVERNANCE.md)
- Acessibilidade: [docs/accessibility.md](https://github.com/Rilen/ui-npa/blob/main/docs/accessibility.md)
- Integração: [docs/integration.md](https://github.com/Rilen/ui-npa/blob/main/docs/integration.md)
- Migração: [docs/agents/ui-npa-migration.md](https://github.com/Rilen/ui-npa/blob/main/docs/agents/ui-npa-migration.md)
- Testes: [docs/testing.md](https://github.com/Rilen/ui-npa/blob/main/docs/testing.md)
- Runbook de integração: [docs/operations/integration-runbook.md](https://github.com/Rilen/ui-npa/blob/main/docs/operations/integration-runbook.md)
- Auditoria UI-NPA-008: [docs/audit/ui-npa-008.md](https://github.com/Rilen/ui-npa/blob/main/docs/audit/ui-npa-008.md)
- Piloto legado: [docs/pilots/legacy-integration.md](https://github.com/Rilen/ui-npa/blob/main/docs/pilots/legacy-integration.md)
- Evidências visuais: [docs/evidence/ui-npa-009](https://github.com/Rilen/ui-npa/blob/main/docs/evidence/ui-npa-009), com histórico em [UI-NPA-003](https://github.com/Rilen/ui-npa/blob/main/docs/evidence/ui-npa-003), [UI-NPA-005](https://github.com/Rilen/ui-npa/blob/main/docs/evidence/ui-npa-005), [UI-NPA-006](https://github.com/Rilen/ui-npa/blob/main/docs/evidence/ui-npa-006), [UI-NPA-007](https://github.com/Rilen/ui-npa/blob/main/docs/evidence/ui-npa-007) e [UI-NPA-008](https://github.com/Rilen/ui-npa/blob/main/docs/evidence/ui-npa-008)
- Versionamento: [docs/versioning.md](https://github.com/Rilen/ui-npa/blob/main/docs/versioning.md)
- Limitações: [docs/limitations.md](https://github.com/Rilen/ui-npa/blob/main/docs/limitations.md)
- Onboarding de agentes: [docs/agents/onboarding.md](https://github.com/Rilen/ui-npa/blob/main/docs/agents/onboarding.md)
- Agentes: [AGENTS.md](https://github.com/Rilen/ui-npa/blob/main/AGENTS.md)

Fluent 2 é referência de linguagem visual. Não há dependência, componente, logomarca nem ativo da Microsoft.
