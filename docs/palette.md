# Paletas candidatas — UI-NPA-006

Estado: **candidatas para revisão**. Nenhuma alternativa está homologada. A paleta canônica atual continua sendo a provisória de `packages/tokens/semantic.light.tokens.json`.

## Diagnóstico atual

A fundação usa um único azul de trabalho (`color.blue.700`, `#244668`), neutros frios para superfície e texto e os mesmos pares de feedback nos temas claro e escuro. Os 43 pares de contraste de `tests/contrast-pairs.json` passam no tema claro e no escuro. A borda sutil usa `neutral.400` (`#7d848f`), com 3.55:1 contra o canvas, o que atende ao mínimo de 3:1 para componente visual essencial.

Pontos que a revisão de identidade precisava comparar:

- o azul provisório não deve ser tratado como definitivo;
- superfícies, navegação e ações podem ter ênfases diferentes sem mudar dimensões ou componentes;
- a seleção disponível hoje é o item ativo da navegação (`color.nav.item-active`); não existe token separado de seleção de conteúdo;
- estados informativos, sucesso, atenção e erro permanecem estáveis para não alterar o significado de situação;
- o tema escuro é experimental e fica fora desta decisão.

## Alternativas

As três usam a mesma estrutura de tokens semânticos, os mesmos componentes, dimensões, conteúdo e tipografia. Apenas cores semânticas e primitivas de cor mudam.

### A — Azul Institucional Equilibrado

Azul sóbrio `atlantic`, superfícies neutras iguais às atuais. Menor delta visual em relação à fundação.

- ação primária: `#2a4b6d` / hover `#203a55` / pressed `#172a3f`;
- canvas `#f7f8fa`, elevada `#ffffff`, rebaixada `#f1f3f6`;
- navegação branca, item ativo `#e5edf5` com texto `#203a55`;
- foco e marca `#2a4b6d`.

### B — Azul Contemporâneo

Azul `azure` mais expressivo e neutros frios `cool`, com navegação levemente azulada.

- ação primária: `#154f8b` / hover `#103e6e` / pressed `#0c2f54`;
- canvas `#f4f8fc`, elevada `#ffffff`, rebaixada `#edf2f8`;
- navegação `#f4f8fc`, item ativo `#d8eafe` com texto `#103e6e`;
- foco e marca `#154f8b`.

### C — Neutro Institucional

Neutros quentes `stone` e azul `steel` restrito a ações, foco e informação. A navegação ativa é neutra.

- ação primária: `#304a5e` / hover `#243a4a` / pressed `#192a36`;
- canvas `#f8f7f4`, elevada `#ffffff`, rebaixada `#f1f0ec`;
- navegação `#f8f7f4`, item ativo `#d2cfc7` com texto `#1b1a18`;
- foco, marca e informação `#304a5e`.

## Tabela comparativa de tokens

| Papel semântico | Atual | A | B | C |
| --- | --- | --- | --- | --- |
| `surface.canvas` | `#f7f8fa` | `#f7f8fa` | `#f4f8fc` | `#f8f7f4` |
| `surface.raised` | `#ffffff` | `#ffffff` | `#ffffff` | `#ffffff` |
| `surface.sunken` | `#f1f3f6` | `#f1f3f6` | `#edf2f8` | `#f1f0ec` |
| `text.primary` | `#171b26` | `#171b26` | `#19242e` | `#1b1a18` |
| `text.secondary` | `#525a6e` | `#525a6e` | `#4c5f72` | `#57544d` |
| `text.brand` | `#244668` | `#2a4b6d` | `#154f8b` | `#304a5e` |
| `action.primary.bg` | `#244668` | `#2a4b6d` | `#154f8b` | `#304a5e` |
| `action.primary.bg-hover` | `#1c3752` | `#203a55` | `#103e6e` | `#243a4a` |
| `action.primary.bg-pressed` | `#14283c` | `#172a3f` | `#0c2f54` | `#192a36` |
| `action.secondary.border` | `#6a7388` | `#6a7388` | `#637689` | `#6f6b62` |
| `border.subtle` | `#7d848f` | `#7d848f` | `#77889b` | `#89857b` |
| `focus.ring` | `#244668` | `#2a4b6d` | `#154f8b` | `#304a5e` |
| `nav.bg` | `#ffffff` | `#ffffff` | `#f4f8fc` | `#f8f7f4` |
| `nav.item-active` | `#e1ebf6` | `#e5edf5` | `#d8eafe` | `#d2cfc7` |
| `nav.item-active-fg` | `#1c3752` | `#203a55` | `#103e6e` | `#1b1a18` |
| `feedback.info.bg` | `#f1f6fb` | `#f3f6fa` | `#edf6ff` | `#f0f4f7` |
| `feedback.success.fg` | `#0e6b45` | `#0e6b45` | `#0e6b45` | `#0e6b45` |
| `feedback.warning.fg` | `#6d4500` | `#6d4500` | `#6d4500` | `#6d4500` |
| `feedback.danger.fg` | `#8e1b14` | `#8e1b14` | `#8e1b14` | `#8e1b14` |

## Contrastes medidos

Valores calculados por `tests/contrast.test.mjs`; texto exige 4.5:1 e borda/foco exige 3:1.

| Par | Atual | A | B | C |
| --- | --- | --- | --- | --- |
| texto primário / canvas | 16.18 | 16.18 | 14.76 | 16.23 |
| texto secundário / canvas | 6.49 | 6.49 | 6.17 | 7.05 |
| texto de marca / canvas | 9.19 | 8.50 | 7.80 | 8.65 |
| ação primária fg / bg | 9.76 | 9.03 | 8.32 | 9.26 |
| ação secundária fg / bg | 17.20 | 17.20 | 15.75 | 17.39 |
| nav ativa fg / bg | 10.14 | 9.88 | 8.84 | 11.17 |
| borda sutil / canvas | 3.55 | 3.55 | 3.41 | 3.44 |
| foco / canvas | 9.19 | 8.50 | 7.80 | 8.65 |
| feedback info fg / bg | 8.98 | 8.33 | 7.62 | 8.38 |
| feedback sucesso fg / bg | 5.88 | 5.88 | 5.88 | 5.88 |
| feedback atenção fg / bg | 7.95 | 7.95 | 7.95 | 7.95 |
| feedback erro fg / bg | 7.93 | 7.93 | 7.93 | 7.93 |

Todos os pares obrigatórios passam nas três candidatas. O menor valor medido é a borda sutil do candidato B, 3.41:1, acima do mínimo de 3:1. Texto desabilitado não entra na meta porque o critério não se aplica a componente inativo.

## Tipografia

A escala foi auditada e não foi alterada. A família é a pilha de sistema, sem fonte externa:

`system-ui, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`

| Token | Valor | Uso principal |
| --- | --- | --- |
| `font.size.xs` | 0.75rem | badge, rodapé, metadados |
| `font.size.sm` | 0.875rem | botão, campo, tabela, navegação |
| `font.size.md` | 1rem | texto corrente |
| `font.size.lg` | 1.25rem | título de cartão |
| `font.size.xl` | 1.5rem | reservado |
| `font.size.display` | 1.75rem | título de página |
| `font.size.2xl` | 2rem | indicador numérico |

Pesos 400 e 600; linha 1.25 para títulos e 1.5 para texto. O indicador ser maior que o título é intencional para leitura de dados. Nenhuma inconsistência comprovada justificou mudança de escala. O reflow com texto a 200% foi coberto por teste automatizado em 390px e 320px.

## Mecanismo de comparação

- `packages/tokens/semantic.candidate-a|b|c.tokens.json` têm os mesmos caminhos do tema claro.
- Novas primitivas de cor: `atlantic`, `azure`, `steel`, `cool` e `stone`.
- `npm run build` gera `packages/styles/tokens.css` e `packages/styles/candidates.css`.
- `candidates.css` não é importado por `index.css`; só a demonstração e a página de comparação o carregam.
- O seletor “Paleta candidata” e o parâmetro `?paleta=a|b|c` alternam a mesma tela; sem parâmetro, a paleta canônica permanece.
- `examples/paletas/` compara sidebar e componentes nas três alternativas.
- O seletor de candidata não vale no tema escuro: o seletor CSS exige `:not([data-iui-theme="dark"])`.

## Rastreabilidade

| Primitivo | Semântico | Uso no componente |
| --- | --- | --- |
| `color.atlantic.700` | `color.action.primary.bg` | `.iui-button--primary` |
| `color.atlantic.50` | `color.action.subtle.bg-hover` | `.iui-button--subtle:hover` |
| `color.atlantic.100` | `color.nav.item-active` | `.iui-sidebar__link[aria-current="page"]` |
| `color.neutral.25` | `color.surface.canvas` | `.iui-root` |
| `color.neutral.400` | `color.border.subtle` | `.iui-card`, `.iui-table-wrap` |
| `color.neutral.400` | `color.nav.border` | `.iui-sidebar` |
| `color.atlantic.700` | `color.focus.ring` | `.iui-root :focus-visible` |
| `color.green.700` | `color.feedback.success.fg` | `.iui-alert--success`, `.iui-badge--success` |
| `color.azure.700` | `color.action.primary.bg` | candidato B |
| `color.steel.700` | `color.action.primary.bg` | candidato C |
| `color.stone.25` | `color.surface.canvas` | candidato C |

## Recomendação técnica

Recomenda-se **A — Azul Institucional Equilibrado** como candidata principal para a revisão visual. Ela preserva as superfícies neutras e a leitura institucional da fundação, mantém o maior contraste de ação entre as três (9.03:1), reduz o risco de migração e diferencia o azul provisório sem mudar a estrutura. B é a opção se a decisão buscar mais expressão e diferenciação de navegação. C é a opção se a prioridade for neutralidade máxima e uso restrito do azul.

A recomendação é técnica e não homologa a paleta. A escolha definitiva permanece pendente.

## Evidências e testes

- Evidências: [docs/evidence/ui-npa-006](evidence/ui-npa-006).
- Capturas: `npm run capture:screenshots:006`.
- Contraste, determinismo e integridade das variantes: `npm test`.
- Comportamento do seletor, comparação, axe e reflow a 200%: `npm run test:e2e`.

## Pendências

- Escolher a alternativa e homologar a paleta.
- Definir se a seleção de conteúdo terá token próprio; hoje a seleção disponível é a navegação ativa.
- Validar com leitor de tela real e zoom de 200% em dispositivos físicos.
- Revisar o tema escuro em uma missão própria, se ele for promovido.
