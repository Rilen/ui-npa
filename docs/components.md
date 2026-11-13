# Componentes

Estado geral: os contratos abaixo estão implementados em CSS, com comportamento JavaScript apenas na sidebar. Dialog, select avançado e tabela de dados complexa permanecem planejados.

As classes usam o prefixo `iui-`. Os valores visuais vêm de tokens semânticos de cor e de primitivos estruturais.

Consumo externo: a folha pública é `dist/index.css` e os módulos são `ui-npa/sidebar.js` e `ui-npa/identity.js`. A instalação local, a ordem de camadas e a fixture independente estão em [integration.md](integration.md).

## Button

Implementado.

Finalidade: disparar uma ação ou navegar quando o elemento é um link com a mesma aparência.

Contrato:

```html
<button class="iui-button iui-button--primary" type="button">Salvar</button>
<a class="iui-button iui-button--secondary" href="#secao">Abrir</a>
```

Variantes: `primary`, `secondary`, `subtle`, `danger`. Modificadores: `iui-button--sm`, `iui-button--icon`.

Estados: repouso, hover, active, foco visível e `disabled` ou `aria-disabled="true"`. O estado desabilitado troca fundo e texto; o contraste de componente inativo não é meta do teste.

Tokens: `color.action.*`, `color.surface.sunken`, `color.text.disabled`, `color.border.subtle`, `size.control.*`, `radius.md`, `space.*`, `duration.fast`.

Acessibilidade: usar `button` para ação e `a` para navegação. Ícone sem texto visível precisa de nome no conteúdo, como faz o botão da sidebar. Não usar `div` clicável.

Responsivo: o controle não muda de hierarquia; a área mínima permanece a do token de controle.

## Card

Implementado.

Finalidade: agrupar um assunto sobre superfície elevada.

```html
<article class="iui-card iui-stack">
  <h2 class="iui-heading">Título</h2>
  <p class="iui-text">Conteúdo</p>
</article>
```

Variantes: uma. Composição livre com Text, Button e Metric.

Estados: estático. Foco pertence aos controles internos.

Tokens: `color.surface.raised`, `color.border.subtle`, `shadow.sm`, `radius.lg`, `space.4`.

Acessibilidade: o card não é genérico clicável. Se toda a área navega, o elemento é um link ou contém um link com nome próprio.

Responsivo: ocupa a coluna do grid e não impõe largura fixa.

## Text

Implementado.

Finalidade: título, seção, parágrafo, texto secundário e número de indicador.

| Classe | Uso |
| --- | --- |
| `iui-title` | Título da página, um por vista |
| `iui-heading` | Seção |
| `iui-text` | Parágrafo |
| `iui-text--sm` | Texto auxiliar |
| `iui-text--muted` | Texto secundário |
| `iui-text--brand` | Destaque textual, não substitui link |
| `iui-metric` | Número de indicador dentro de card |

Tokens: `font.*`, `color.text.primary`, `color.text.secondary`, `color.text.brand`.

Acessibilidade: a classe não substitui o elemento. Título de página é `h1`. Seção é `h2`. Indicador tem um texto visível que diz o que o número significa.

Responsivo: unidades `rem`, acompanhando a preferência de tamanho do navegador.

## Badge

Implementado.

Finalidade: nomear uma situação curta.

```html
<span class="iui-badge iui-badge--success">Deferido</span>
```

Variantes: neutra, `info`, `success`, `warning`, `danger`.

Estados: estático. A cor não é o único canal: o texto da situação é obrigatório.

Tokens: `color.feedback.*`, `font.size.xs`, `font.weight.semibold`, `radius.full`.

Acessibilidade: o nome é o texto. Não transmitir situação só pela cor.

Responsivo: o badge quebra junto com o agrupamento `iui-cluster`.

## Field

Implementado.

Finalidade: rótulo, controle nativo, dica e erro.

```html
<div class="iui-field">
  <label class="iui-field__label" for="cidade">Cidade (obrigatório)</label>
  <input class="iui-field__control" id="cidade" name="cidade" aria-describedby="cidade-erro" required>
  <p class="iui-field__error" id="cidade-erro" hidden>Informe a cidade.</p>
</div>
```

Controles previstos: `input`, `textarea` e `select` nativo. Select avançado, combobox e múltipla escolha customizada estão planejados.

Estados: habilitado, desabilitado, foco visível e inválido (`aria-invalid="true"`).

Tokens: `color.border.default`, `color.text.danger`, `color.surface.raised`, `size.control.md`, `size.field.max`, `font.size.sm`.

Acessibilidade: todo controle tem `label` associado. Erro usa texto, não só borda. Campo obrigatório diz isso no rótulo. Não construir select customizado só com CSS.

Responsivo: largura máxima do token `size.field.max`; abaixo disso, 100% da coluna.

## Alert

Implementado.

Finalidade: mensagem de status ou de erro que precisa permanecer visível.

```html
<div class="iui-alert iui-alert--warning" role="status">
  <p class="iui-alert__title">Pendência</p>
  <p>Falta um documento.</p>
</div>
```

Variantes: informação (padrão), `success`, `warning`, `danger`.

Estados: visível ou oculto pelo atributo `hidden`. Não há fechamento automático.

Tokens: `color.feedback.*`, `radius.md`, `space.3`, `space.4`.

Acessibilidade: `role="status"` para confirmação que não interrompe. `role="alert"` para erro que precisa ser anunciado. O título e o texto carregam o sentido; a cor reforça.

Responsivo: o alerta ocupa a largura da seção e o texto quebra.

## Table

Implementado como apresentação simples. Tabela com ordenação, paginação, seleção e edição está planejada e não deve ser imitada com este contrato.

```html
<div class="iui-table-wrap" role="region" tabindex="0" aria-label="Descrição da rolagem">
  <table class="iui-table">
    <caption class="iui-visually-hidden">Título da tabela</caption>
    <thead>
      <tr><th scope="col">Coluna</th></tr>
    </thead>
    <tbody>
      <tr><td>Valor</td></tr>
    </tbody>
  </table>
</div>
```

Estados: repouso e hover de linha. Linha oculta usa o atributo `hidden`.

Tokens: `color.surface.raised`, `color.surface.sunken`, `color.border.subtle`, `color.text.primary`, `color.text.secondary`, `size.table.min`.

Acessibilidade: `caption` ou nome equivalente, `scope` nos cabeçalhos e região rolável focável. A rolagem horizontal é o comportamento estreito; a tabela não é espremida até o texto quebrar em cada letra.

Responsivo: o wrapper rola quando a tabela atinge `size.table.min`.

## Sidebar e Shell

Implementado. Contrato obrigatório para navegação lateral aderente (IUI-009).

A identidade institucional e o rodapé seguem [docs/identity.md](identity.md). O shell empilha a faixa, depois o corpo com sidebar e coluna principal.

```html
<div class="iui-shell">
  <div class="iui-institution">
    <div data-iui-slot="municipality"><img data-iui-logo alt=""><span data-iui-label></span></div>
    <div data-iui-slot="department"><span data-iui-label></span><img data-iui-logo alt=""></div>
  </div>
  <div class="iui-shell__body">
    <nav class="iui-sidebar" id="sidebar" aria-label="Seções">
      <div data-iui-slot="sector"><img class="iui-sidebar__mark" data-iui-logo alt=""><span data-iui-label></span></div>
      <a class="iui-sidebar__link" href="#painel" aria-current="page">
        <svg class="iui-icon" aria-hidden="true"></svg>
        <span class="iui-sidebar__label">Painel</span>
      </a>
    </nav>
    <div class="iui-shell__backdrop" hidden></div>
    <div class="iui-shell__main">
      <header class="iui-header">
        <button class="iui-button iui-button--subtle iui-button--icon" type="button" data-iui-sidebar-toggle aria-controls="sidebar" aria-expanded="true">
          <span class="iui-visually-hidden" data-iui-toggle-label>Recolher menu</span>
        </button>
        <p class="iui-header__title" data-iui-app-name></p>
      </header>
      <div class="iui-shell__content"><main id="conteudo"></main></div>
      <footer class="iui-footer">
        <span data-iui-app-name></span>
        <span data-iui-app-version></span>
        <a href="#changelog" data-iui-changelog-link>Novidades</a>
        <a href="#sobre">Sobre o sistema</a>
        <span data-iui-developer></span>
      </footer>
    </div>
  </div>
</div>
```

```js
import { mountSidebar } from "ui-npa/sidebar.js";

mountSidebar(document.querySelector("#sidebar"), {
  toggle: document.querySelector("[data-iui-sidebar-toggle]"),
  backdrop: document.querySelector(".iui-shell__backdrop"),
  content: document.querySelector(".iui-shell__content"),
  storage: {
    get() { return localStorage.getItem("chave-da-aplicacao"); },
    set(value) { localStorage.setItem("chave-da-aplicacao", value); },
  },
});
```

A persistência é opcional e a chave pertence à aplicação. Sem `storage`, a preferência dura apenas a visita.

Comportamento:

- Desktop, a partir de `48rem`: expandida ou recolhida. No estado recolhido o rótulo sai da vista, permanece no nome acessível e reaparece no hover e no foco.
- Mobile, até `47.99rem`: a navegação fica fora da tela, `inert` e `aria-hidden` enquanto fechada, e abre como painel temporário abaixo da faixa institucional e do cabeçalho. O botão do cabeçalho passa a se chamar “Fechar menu”. Escape e o clique na cortina também fecham. Um botão interno opcional `[data-iui-sidebar-close]` pode existir, com nome que não repita o do cabeçalho. A preferência recolhida não substitui esse painel.
- Setas, Home e End movem o foco entre os links.
- Com o painel móvel aberto, Tab permanece dentro da sidebar.
- O conteúdo principal fica `inert` enquanto o painel móvel está aberto. O botão do cabeçalho continua disponível ao ponteiro.

Tokens: `size.sidebar.*`, `color.nav.*`, `color.surface.overlay`, `z.sidebar`, `z.header`, `z.overlay`.

Acessibilidade: o elemento de navegação tem nome. O item atual usa `aria-current="page"`. O botão de alternância tem nome que descreve a próxima ação. Ícones são `aria-hidden`.

Responsivo: no mobile a área útil não fica com uma coluna permanente estreita.

A sidebar não autentica, não autoriza e não conhece as rotas do consumidor. Ela recebe links já decididos pela aplicação.

## Utilitários de layout

Implementado: `iui-stack`, `iui-stack--sm`, `iui-cluster`, `iui-grid`, `iui-grid--metrics`, `iui-page`, `iui-section`, `iui-skip-link`, `iui-visually-hidden`, `iui-icon`.

São composição, não componentes de negócio.

`iui-grid--metrics` organiza indicadores em uma, duas ou quatro colunas conforme a largura efetiva de `.iui-shell__content`, inclusive quando a sidebar está recolhida. A consulta de contêiner chama-se `iui-content` e não altera as demais grades.

## Planejado

- Dialog, com foco preso e retorno ao controle que abriu.
- Select avançado e combobox.
- Tabela com ordenação, paginação, seleção e densidade.
- Wrappers React, Angular, PHP e Web Components.

## Não suportado

- Componente com regra de negócio, autenticação ou dado institucional.
- Tema visual paralelo dentro da aplicação aderente.
- Cópia de componente ou ícone proprietário da Microsoft.
