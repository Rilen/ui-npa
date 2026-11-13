# ADR 006 — Hardening da distribuição e dos contratos públicos

Data: 2026-11-13. Estado: aceita para a linha `0.3.3`.

## Contexto

A avaliação de prontidão da UI-NPA 0.3.2 aprovou a distribuição por tarball, mas encontrou quatro riscos solucionáveis no repositório: clone Git sem `dist`, CSS legado sem camada, conteúdo da faixa institucional fora de landmark e URLs configuráveis sem validação de esquema.

## Decisão

- Adicionar `prepare` ao pacote para gerar `dist` em instalações Git com scripts habilitados. O tarball continua sendo o canal recomendado; `dist` não é versionado.
- Validar `logo` como caminho relativo, HTTP(S) ou `data:image/*`. Validar `changelogUrl` como caminho relativo ou HTTP(S). Rejeitar `javascript:`, `file:`, `data:` em links e valores malformados.
- Manter a responsabilidade do landmark na aplicação hospedeira: a faixa institucional deve ser `role="region"` com nome acessível, como na demonstração e na fixture.
- Manter a ordem de camadas como contrato. Adicionar testes para ordem correta, ordem invertida e CSS legado sem camada. Aceitar a limitação de isolamento: CSS sem camada vence; CSS imutável pode exigir adaptador do consumidor.

## Consequências

A instalação Git deixa de produzir um pacote silenciosamente incompleto. A configuração de identidade rejeita esquemas perigosos sem bloquear caminhos relativos legítimos. O achado axe `region` deixa de ocorrer nas fixtures. O contrato de CSS continua explícito, sem `!important`, Shadow DOM ou mudança global de especificidade.

A versão sobe para `0.3.3`, sem `1.0.0`. Permanecem pendentes a publicação npm, o licenciamento público, a validação manual de acessibilidade e os testes em Firefox/WebKit.
