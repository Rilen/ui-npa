# UI-NPA

Design System institucional do Núcleo de Pesquisas Avançadas.

Uma identidade. Um padrão. Múltiplos sistemas.

Esta é a versão `0.2.0`. A paleta é **provisória** e não está homologada. O projeto é privado, não publicado e não depende de outro sistema para funcionar.

## Começar

Requisitos: Node.js 20 ou superior.

```bash
npm install
npm run build
npm test
npm run test:e2e
npm run dev
```

A demonstração fica em `http://127.0.0.1:4173/examples/requerimentos/`.

`npm run build` regrava `packages/styles/tokens.css` a partir de `packages/tokens`. O teste falha se o CSS commitado divergir da fonte. Não edite o CSS gerado.

## Estado desta versão

| Área | Estado |
| --- | --- |
| Tokens DTCG, tema claro e CSS universal | Implementado |
| Button, Card, Text, Badge, Field, Alert, Table, Sidebar, Shell | Implementado |
| Demonstração fictícia de requerimentos | Implementado |
| Identidade institucional e rodapé técnico | Implementado |
| Governança IUI-001 a IUI-014 | Implementado |
| Protocolo `ui-npa-migration` | Especificado, não executado |
| Tema escuro | Experimental |
| React, Angular, PHP e Web Components | Planejado |
| Paleta oficial e publicação 1.0.0 | Não suportado nesta fase |

## Mapa

- Arquitetura: [docs/architecture.md](docs/architecture.md)
- Decisão: [docs/decisions/001-foundation.md](docs/decisions/001-foundation.md)
- Tokens: [docs/tokens.md](docs/tokens.md)
- Temas: [docs/themes.md](docs/themes.md)
- Identidade: [docs/identity.md](docs/identity.md)
- Componentes: [docs/components.md](docs/components.md)
- Governança: [governance/UI-NPA-GOVERNANCE.md](governance/UI-NPA-GOVERNANCE.md)
- Acessibilidade: [docs/accessibility.md](docs/accessibility.md)
- Integração: [docs/integration.md](docs/integration.md)
- Migração: [docs/agents/ui-npa-migration.md](docs/agents/ui-npa-migration.md)
- Testes: [docs/testing.md](docs/testing.md)
- Versionamento: [docs/versioning.md](docs/versioning.md)
- Limitações: [docs/limitations.md](docs/limitations.md)
- Agentes: [AGENTS.md](AGENTS.md)

Fluent 2 é referência de linguagem visual. Não há dependência, componente, logomarca nem ativo da Microsoft.
