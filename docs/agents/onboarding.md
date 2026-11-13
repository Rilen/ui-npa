# Onboarding de agente — simulação documental

Esta página registra o percurso de um agente que entra sem contexto. A entrada principal continua sendo [AGENTS.md](../../AGENTS.md); esta simulação não substitui a governança nem os contratos.

## Percurso mínimo

| Necessidade | Onde encontrar |
| --- | --- |
| Regras obrigatórias | [AGENTS.md](../../AGENTS.md) e [governance/UI-NPA-GOVERNANCE.md](../../governance/UI-NPA-GOVERNANCE.md) |
| Arquitetura e artefatos | [docs/architecture.md](../architecture.md) |
| Design system canônico | [docs/components.md](../components.md) |
| Tokens | [docs/tokens.md](../tokens.md) |
| Componentes públicos | [docs/components.md](../components.md) |
| Restrições de implementação | [AGENTS.md](../../AGENTS.md), IUI-004 e IUI-006 |
| Procedimento de alteração | [docs/agents/ui-npa-migration.md](ui-npa-migration.md) |
| Testes obrigatórios | [docs/testing.md](../testing.md) |
| Versionamento | [docs/versioning.md](../versioning.md) |
| Migração de legado | [docs/agents/ui-npa-migration.md](ui-npa-migration.md) |
| Consumo externo | [docs/integration.md](../integration.md) |
| Piloto legado A/B/C | [docs/pilots/legacy-integration.md](../pilots/legacy-integration.md) |
| Limites conhecidos | [docs/limitations.md](../limitations.md) |

## Lacunas encontradas e tratadas na UI-NPA-008

- A documentação de integração apontava para `packages/styles/index.css` e dizia que não havia pacote instalável. Agora descreve o tarball local, `dist` e os exports públicos.
- O caminho de importação da sidebar era interno. Agora é `ui-npa/sidebar.js`.
- O `AGENTS.md` não listava arquitetura, testes, integração, versionamento e decisões. O mapa mínimo foi acrescentado.
- Não havia fixture independente nem prova de instalação local. A fixture `tests/fixtures/consumer-vanilla` e os testes de consumidor cobrem o fluxo.
- CSS legado sem camada podia sobrepor o pacote sem estar documentado. A regra de camadas, a fixture de conflito e a limitação foram registradas.
- A versão `0.3.2` alinha manifesto e lock e adiciona distribuição local, exports e fixture. A divergência histórica `0.1.0` já havia sido corrigida na UI-NPA-007.

## Estado de suporte

**Suportado por teste:** tarball local, `dist`, entradas `styles.css`, `sidebar.js` e `identity.js`, HTML nativo, ESM, sidebar, identidade, rodapé, tema claro, fixture, camada legada anterior e piloto A/B/C.

**Experimental:** tema escuro; navegadores sem CSS Layers/Container Queries; CSS legado sem camada.

**Planejado:** publicação npm, wrappers de framework, dialog, select avançado e tabela complexa.

## Comandos de entrada

```bash
npm install
npm run build
npm test
npm run test:e2e
npm run prepare:consumer
npm run dev
```

O agente deve registrar testes não executados e não declarar conformidade WCAG integral sem evidência. A simulação foi documental; não houve execução por um agente externo independente.
