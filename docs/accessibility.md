# Acessibilidade

Meta do UI-NPA: WCAG 2.2 nível AA nos componentes implementados. A meta não está declarada como conformidade integral.

## O que a fundação faz

- Contraste de texto 4.5:1 e de borda ou foco 3:1 nos pares de `tests/contrast-pairs.json`, no tema claro oficial e no tema escuro experimental.
- Reflow com texto a 200% em 390px e 320px, sem rolagem horizontal, coberto por teste de navegador.
- Nome visível ou nome acessível em botão, link, campo e situação.
- Foco `:focus-visible` com anel de 2px. O anel some no foco de ponteiro dentro de `.iui-root`.
- Sidebar operável por teclado nos dois estados de largura e no painel móvel.
- Região da tabela rolável recebe foco.
- `prefers-reduced-motion: reduce` remove as transições do núcleo.
- Texto em `rem`.
- Cor de situação acompanha texto no badge e no alerta.
- Campo inválido usa texto de erro, `aria-invalid` e borda.

## O que foi executado

O cálculo de contraste roda em `npm test`. A demonstração e a fixture de consumidor são analisadas com axe-core no desktop e no mobile; o teste falha diante de violação `serious` ou `critical`. O reflow a 200% é automatizado em 390px e 320px. O reflow equivalente a 400% é coberto pela composição em viewport CSS de 320px.

Isso não cobre, entre outros, todos os critérios de WCAG 2.2: zoom apenas de texto a 400%, conteúdo em movimento além da demonstração, linguagem de partes, erros de formulário em outros idiomas, alternativas para conteúdo não textual complexo e uso real com tecnologias assistivas fora do axe. A paleta homologada não é uma certificação de contraste em dispositivo físico.

Alvos interativos principais usam `size.control.md` ou `size.control.sm`, com no mínimo 32px de altura; uma auditoria exaustiva de alvos de links inline não foi executada. Leitor de tela real: **NOT_RUN**.

Texto desabilitado não entra na meta de 4.5:1. O critério de contraste não se aplica a componente inativo.

## O que uma aplicação aderente ainda precisa fazer

O UI-NPA não torna uma tela inteira conforme. Cabe ao consumidor preservar ordem de cabeçalhos, nomes, mensagens de erro e tarefas de teclado do próprio fluxo.
