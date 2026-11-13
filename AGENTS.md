# Instruções para agentes

Leia estes documentos antes de alterar interface:

1. [governance/UI-NPA-GOVERNANCE.md](governance/UI-NPA-GOVERNANCE.md)
2. [docs/components.md](docs/components.md) e [docs/tokens.md](docs/tokens.md)
3. [docs/agents/ui-npa-migration.md](docs/agents/ui-npa-migration.md), quando a tarefa for modernizar uma interface

Mapa mínimo de decisão:

- [docs/architecture.md](docs/architecture.md) — artefatos, camadas e fluxo de build.
- [docs/integration.md](docs/integration.md) — pacote local, entradas públicas, CSS legado e limites.
- [docs/testing.md](docs/testing.md) — comandos, fixture isolada e o que não é automático.
- [docs/audit/ui-npa-008.md](docs/audit/ui-npa-008.md) — auditoria e achados P0–P3 da maturação.
- [docs/pilots/legacy-integration.md](docs/pilots/legacy-integration.md) — piloto A/B/C de convivência com legado.
- [docs/versioning.md](docs/versioning.md) — SemVer e política de mudança.
- [docs/decisions/](docs/decisions/) — decisões arquiteturais, incluindo a paleta e a distribuição.
- [docs/limitations.md](docs/limitations.md) — limites conhecidos.
- [docs/agents/onboarding.md](docs/agents/onboarding.md) — simulação de entrada para novo agente.

Regras de execução desta fundação:

- Trabalhe apenas neste repositório.
- Não invente cor, espaçamento ou componente paralelo. Use os tokens `--iui-*` e os contratos já implementados.
- Não edite `packages/styles/tokens.css` nem `dist`. Altere `packages/tokens` ou `packages/styles` e rode `npm run build`.
- Não publique pacote, não faça push e não migre sistema real sem autorização explícita.
- Consumo externo usa apenas `ui-npa/styles.css`, `ui-npa/tokens.css`, `ui-npa/sidebar.js` e `ui-npa/identity.js`; não importe `examples/` nem caminhos internos de `packages/`.
- A paleta clara oficial é Azul Institucional Equilibrado (alternativa A), homologada em 12/11/2026. O tema escuro é experimental.
- Identidade de Prefeitura, Secretaria e Setor segue [docs/identity.md](docs/identity.md). Não embuta marca municipal no núcleo.
- Não declare conformidade WCAG integral com base apenas nos testes automáticos.

As mesmas instruções valem para Cursor, Kilo CLI, Copilot e outros agentes. Não há regra duplicada por fornecedor: os documentos acima são a referência.
