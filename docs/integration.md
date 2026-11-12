# Integração

## HTML — implementado

A página ou a região modernizada inclui a folha e a classe raiz:

```html
<link rel="stylesheet" href="packages/styles/index.css">
<body class="iui-root">
```

`body.iui-root` zera a margem do corpo e ocupa a altura da janela. Uma região interna com `iui-root` recebe cor, fonte e caixa sem alterar o restante da página legada.

Não há reset global de títulos, listas ou links fora das classes `iui-*`.

A demonstração executável é `examples/requerimentos`. Ela não abre como `file://` de forma confiável: módulos e a folha pedem o servidor local `npm run dev`.

## Sidebar

O CSS entra com a folha principal. O comportamento entra como módulo:

```js
import { mountSidebar } from "packages/styles/sidebar.js";
```

O caminho é o do artefato. Não há pacote npm publicado.

## React, Angular e PHP — planejado

Não há biblioteca nesta versão. O wrapper futuro deve ser fino:

- React renderiza as classes e os atributos deste contrato, sem outro sistema de estilo.
- Angular faz o mesmo em template, sem encapsular cor fora dos tokens.
- PHP ou qualquer HTML de servidor imprime o mesmo contrato.

Exemplo ilustrativo, não implementado:

```jsx
export function Button({ variant = "primary", type = "button", ...props }) {
  return <button className={`iui-button iui-button--${variant}`} type={type} {...props} />;
}
```

Variante fora de `primary`, `secondary`, `subtle` e `danger` não deve ser aceita pelo wrapper.

## O que não acoplar

A aplicação consumidora não registra serviço no UI-NPA, não envia telemetria e não precisa de autenticação para usar a folha. Dois sistemas aderentes não se chamam por causa do design system.
