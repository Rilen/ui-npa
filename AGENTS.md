# Instruções para agentes

Leia estes documentos antes de alterar interface:

1. [governance/UI-NPA-GOVERNANCE.md](governance/UI-NPA-GOVERNANCE.md)
2. [docs/components.md](docs/components.md) e [docs/tokens.md](docs/tokens.md)
3. [docs/agents/ui-npa-migration.md](docs/agents/ui-npa-migration.md), quando a tarefa for modernizar uma interface

Regras de execução desta fundação:

- Trabalhe apenas neste repositório.
- Não invente cor, espaçamento ou componente paralelo. Use os tokens `--iui-*` e os contratos já implementados.
- Não edite `packages/styles/tokens.css`. Altere `packages/tokens` e rode `npm run build`.
- Não publique pacote, não faça push e não migre sistema real sem autorização explícita.
- A paleta atual é provisória.
- Não declare conformidade WCAG integral com base apenas nos testes automáticos.

As mesmas instruções valem para Cursor, Kilo CLI, Copilot e outros agentes. Não há regra duplicada por fornecedor: os documentos acima são a referência.
