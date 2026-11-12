# Acessibilidade

Meta do UI-NPA: WCAG 2.2 nível AA nos componentes implementados. A meta não está declarada como conformidade integral.

## O que a fundação faz

- Contraste de texto 4.5:1 e de borda ou foco 3:1 nos pares de `tests/contrast-pairs.json`, nos temas claro e escuro.
- Nome visível ou nome acessível em botão, link, campo e situação.
- Foco `:focus-visible` com anel de 2px. O anel some no foco de ponteiro dentro de `.iui-root`.
- Sidebar operável por teclado nos dois estados de largura e no painel móvel.
- Região da tabela rolável recebe foco.
- `prefers-reduced-motion: reduce` remove as transições do núcleo.
- Texto em `rem`.
- Cor de situação acompanha texto no badge e no alerta.
- Campo inválido usa texto de erro, `aria-invalid` e borda.

## O que foi executado

O cálculo de contraste roda em `npm test`. A demonstração é analisada com axe-core no desktop e no menu móvel aberto. O teste falha diante de violação `serious` ou `critical`.

Isso não cobre, entre outros, todos os critérios de WCAG 2.2: reflow a 400%, conteúdo em movimento além da demonstração, linguagem de partes, erros de formulário em outros idiomas, alternativas para conteúdo não textual complexo e uso real com tecnologias assistivas fora do axe.

Texto desabilitado não entra na meta de 4.5:1. O critério de contraste não se aplica a componente inativo.

## O que uma aplicação aderente ainda precisa fazer

O UI-NPA não torna uma tela inteira conforme. Cabe ao consumidor preservar ordem de cabeçalhos, nomes, mensagens de erro e tarefas de teclado do próprio fluxo.
