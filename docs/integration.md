# Integração

## Pacote local — suportado

A distribuição pública do UI-NPA é o conteúdo de `dist/`, gerado por `npm run build`. O pacote é privado e não é publicado no npm; a integração comprovada usa um tarball local:

```bash
npm pack
npm install ./ui-npa-0.3.2.tgz
```

O tarball contém somente `dist`, `README.md`, `CHANGELOG.md` e `package.json`. `examples`, `tests`, `docs`, `scripts` e o ZIP de evidências não entram no pacote.

Entradas públicas declaradas em `package.json`:

| Entrada | Arquivo |
| --- | --- |
| `ui-npa/styles.css` | `dist/index.css` |
| `ui-npa/tokens.css` | `dist/tokens.css` |
| `ui-npa/sidebar.js` | `dist/sidebar.js` |
| `ui-npa/identity.js` | `dist/identity.js` |

O CSS usa `@import` relativos; mantenha a pasta `dist` inteira, ou sirva-a como um diretório público. A fixture `tests/fixtures/consumer-vanilla` é a referência executável.

## HTML

```html
<link rel="stylesheet" href="/vendor/ui-npa/index.css">

<body class="iui-root">
  <!-- contratos de Shell, Sidebar, Institution e Footer -->
</body>
```

`body.iui-root` zera a margem do corpo e ocupa a altura da janela. Uma região interna com `iui-root` recebe cor, fonte e caixa sem alterar o restante da página legada. Não há reset global de títulos, listas ou links fora das classes `iui-*`.

## JavaScript

```js
import { mountSidebar } from "ui-npa/sidebar.js";
import { applyInstitutionalIdentity } from "ui-npa/identity.js";

applyInstitutionalIdentity(document.querySelector(".iui-root"), identidade);
mountSidebar(document.querySelector("#sidebar"), {
  toggle: document.querySelector("[data-iui-sidebar-toggle]"),
  backdrop: document.querySelector(".iui-shell__backdrop"),
  content: document.querySelector(".iui-shell__content"),
});
```

Os módulos não acessam rede, sessão, roteador ou backend. A aplicação fornece os links, a identidade e, se quiser, a persistência da sidebar.

## CSS legado e camadas

O CSS canônico entra nas camadas `iui.tokens`, `iui.base`, `iui.components` e `iui.utilities`. Para preservar os componentes convivendo com CSS antigo, declare a ordem antes de carregar o pacote e coloque o CSS legado em uma camada anterior:

```css
@layer legacy, consumer, iui.tokens, iui.base, iui.components, iui.utilities;

@layer legacy {
  button { font-family: Georgia, serif; }
}
```

Sem camada, o CSS legado tem precedência sobre qualquer camada, inclusive sobre os componentes do UI-NPA. O cenário `tests/fixtures/consumer-vanilla/conflito.html` comprova esse limite. Não há isolamento absoluto por Shadow DOM; a integração correta usa a camada anterior ou remove regras globais conflitantes.

A fixture `tests/fixtures/consumer-vanilla/index.html` demonstra o cenário recomendado e é validada com CSS legado em `@layer legacy`. O piloto `tests/fixtures/consumer-legacy` leva o mesmo padrão a uma aplicação administrativa sintética em três estados: legado, convivência e migração incremental. Os resultados estão em [pilots/legacy-integration.md](pilots/legacy-integration.md).

## Estados de suporte

**Suportado:** tarball local, HTML nativo, ESM, CSS canônico, sidebar, identidade, rodapé, tema claro oficial, fixture isolada, instalação local e piloto legado A/B/C.
**Experimental:** tema escuro, convivência com CSS legado sem camada (não suportada), navegadores sem CSS Layers/Container Queries.
**Planejado:** publicação em registro npm, wrappers React/Angular/PHP/Web Components, diálogo, select avançado e tabela complexa.

## O que não acoplar

A aplicação consumidora não registra serviço no UI-NPA, não envia telemetria e não precisa de autenticação para usar a folha. Dois sistemas aderentes não se chamam por causa do design system. Não sobrescreva tokens semânticos globais para criar uma identidade paralela; configure apenas as marcas institucionais pelo contrato de identidade.

A demonstração local exige servidor HTTP: `npm run dev`. Não abra a fixture como `file://`.
