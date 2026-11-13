# Piloto de integração legada — UI-NPA-009

Data: 2026-11-13. Versão: `0.3.2`. Escopo: aplicação administrativa sintética, sem backend, autenticação, dados reais ou alteração de sistemas municipais.

## Arquitetura

```text
Aplicação legada sintética
├── cabeçalho, navegação lateral e rodapé legados
├── conteúdo principal em três estados
└── dados e fluxos compartilhados em data.js/pilot.js
```

A fixture `tests/fixtures/consumer-legacy` instala o tarball local pelo mesmo fluxo da UI-NPA-008:

```text
packages/tokens + packages/styles → npm run build → dist → npm pack
→ instalação temporária → .vendor → piloto
```

Estados:

- **A** (`estado-a.html`): somente CSS legado. Não carrega o pacote.
- **B** (`estado-b.html`): região delimitada em UI-NPA, com formulário e tabela legados.
- **C** (`estado-c.html`): conteúdo principal em UI-NPA, preservando cabeçalho, navegação e rodapé legados.
- `conflito.html` e `conflito-mitigado.html`: conflito de CSS sem camada e a mitigação por camada.
- `comparacao.html`: comparação visual dos componentes.

## Estratégia CSS

`layers.css` declara `legacy, pilot, iui.tokens, iui.base, iui.components, iui.utilities`. O CSS legado do piloto fica em `@layer legacy`; o UI-NPA entra nas camadas `iui.*`.

- **Causa do conflito:** CSS sem camada tem precedência sobre qualquer camada; regras globais de `button`, `input`, `h1`, `a` e `table` vencem classes do UI-NPA em camadas.
- **Mitigação:** declarar a ordem antes de carregar o pacote e manter o CSS legado em camada anterior. As classes de componente do UI-NPA passam a vencer as regras globais legadas.
- **Correções de compatibilidade:** `[hidden]` dentro de `.iui-root` permanece oculto, e `.iui-table` neutraliza borda externa herdada; a borda continua no wrapper.
- **Limite remanescente:** sem camada, não há isolamento absoluto. Propriedades que o componente não define podem continuar vindas do CSS legado. Shadow DOM não é usado.

## Matriz de compatibilidade

| Critério | Estado A | Estado B | Estado C |
| --- | --- | --- | --- |
| Navegação | PASS — links legados | PASS — moldura legada | PASS — moldura legada preservada |
| Formulário | PASS — legado | PASS — legado | PASS — UI-NPA |
| Tabela | PASS — legado | PASS — legado | PASS — UI-NPA |
| Teclado | PASS — controles nativos | PASS — controles nativos | PASS — foco e Enter cobertos |
| Mobile | PASS — 390/320 sem overflow | PASS — 390/320 sem overflow | PASS — 390/320 sem overflow |
| CSS legado | Legado integral | PASS — camadas preservam a região UI-NPA | PASS — camadas preservam o conteúdo migrado |
| Identidade | Legada | Mista | Parcialmente migrada |
| Reversibilidade | Referência | PASS — dados preservados | PASS — dados preservados |
| axe-core | Sem `serious`/`critical` | Sem `serious`/`critical` | Sem `serious`/`critical` |

## Fluxos e reversibilidade

Os três estados compartilham:

- navegação por âncoras;
- formulário com nome, e-mail e protocolo;
- validação de nome/e-mail com erro textual;
- ação de registro com mensagem de status;
- filtro da tabela;
- foco e submissão por teclado;
- persistência de valores e filtro em `localStorage`.

O teste preenche nome, e-mail e filtro em C, navega para A e depois B, e confirma que os valores permanecem. A reversibilidade é uma demonstração de fluxo, não uma plataforma de migração.

## Testes

- 10 testes E2E do piloto: estados A/B/C, fluxos, teclado, dependências públicas, reversibilidade, conflito, responsividade e axe.
- Testes existentes preservados.
- `npm run build`, `npm test`, `npm run test:e2e`, `npm run check`.
- Axe sem violações `serious` ou `critical` nos três estados e no estado C mobile.
- Larguras verificadas: 1440, 1024, 768, 390 e 320px, sem rolagem horizontal.

## Acessibilidade

Os três estados usam HTML semântico, rótulos associados, tabela com cabeçalhos e legenda, mensagens por texto, foco visível e controles nativos. O estado A tem CSS legado, mas mantém a estrutura acessível do piloto.

Não houve leitor de tela real, validação em dispositivo físico, zoom apenas de texto a 400% nem auditoria manual completa. A tipografia legada usa `px`, portanto zoom apenas de texto do navegador afeta o UI-NPA migrado e não escala todo o legado. Reflow por largura de viewport foi coberto.

## Limitações

- A aplicação é sintética e não representa um sistema municipal real.
- O piloto não implementa autenticação, backend, banco ou regra de negócio.
- A reversibilidade usa `localStorage`, não um mecanismo de produção.
- CSS legado sem camada não é isolado.
- Não há isolamento por Shadow DOM.
- Não há publicação npm, push ou deploy nesta missão.

## Recomendações para consumidores

1. Declarar a ordem de camadas antes de carregar o UI-NPA.
2. Colocar CSS legado em camada anterior ou remover regras globais conflitantes.
3. Migrar por regiões funcionais delimitadas, mantendo a moldura legada.
4. Comparar e validar os mesmos fluxos antes e depois da migração.
5. Manter um caminho de retorno e persistência de dados durante a convivência.
6. Não sobrescrever tokens semânticos para criar uma identidade paralela.
