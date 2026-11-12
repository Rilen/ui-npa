# Identidade institucional

Contrato de IUI-013 e IUI-014. A aplicação fornece os dados. O núcleo não contém marca municipal.

## Configuração

```js
import { applyInstitutionalIdentity } from "./packages/styles/identity.js";

applyInstitutionalIdentity(document.querySelector(".iui-shell"), {
  municipality: { name: "Prefeitura Municipal de Exemplo", logo: "/assets/prefeitura.svg", logoAlt: "Prefeitura Municipal de Exemplo" },
  department: { name: "Secretaria Municipal de Exemplo", logo: "/assets/secretaria.svg", logoAlt: "Secretaria Municipal de Exemplo" },
  sector: { name: "Setor de Atendimento", logo: "/assets/setor.svg", logoAlt: "Setor de Atendimento" },
  application: {
    name: "Gestão de Requerimentos",
    version: "1.4.0",
    developer: "NPA",
    changelog: [{ version: "1.4.0", date: "2026-11-12", notes: ["Texto da aplicação."] }],
  },
  designSystem: { name: "UI-NPA", version: "0.2.0" },
});
```

`assertInstitutionalIdentity` valida o mesmo objeto sem depender do DOM. Os três órgãos exigem `name`, `logo` e `logoAlt`. A aplicação exige `name`, `version` e `developer`, além de `changelog` ou `changelogUrl`. `designSystem` é opcional e serve para mostrar a versão do UI-NPA nos detalhes.

## Posições

| Nível | Lugar | Marca |
| --- | --- | --- |
| Prefeitura | Faixa superior, à esquerda | `[data-iui-slot="municipality"]` |
| Secretaria | Faixa superior, à direita | `[data-iui-slot="department"]` |
| Setor | Topo da sidebar | `[data-iui-slot="sector"]` |

Cada slot tem `img[data-iui-logo]` e, quando o nome aparece ao lado, `[data-iui-label]`. Com rótulo visível, o `alt` da imagem fica vazio para não repetir o nome. Sem rótulo, o `alt` recebe `logoAlt`.

A faixa usa `iui-institution`. O rodapé usa `iui-footer`, com `[data-iui-app-name]`, `[data-iui-app-version]`, `[data-iui-developer]`, `[data-iui-changelog-link]`, `[data-iui-changelog]` e `[data-iui-about]`.

No mobile, a faixa continua sendo uma só: Prefeitura e Secretaria ocupam duas linhas, com os dois nomes visíveis e acessíveis. A altura usa `size.institution-mobile`; o painel móvel começa abaixo da faixa e do cabeçalho. A consulta completa continua em Sobre o sistema. As logomarcas não são reduzidas abaixo de `size.logo.sm`.

## Sobre o sistema

`[data-iui-about]` apresenta três grupos sem repetir logomarcas: Identidade institucional (Prefeitura, Secretaria e Setor), Aplicação (nome, versão e acesso ao changelog) e Informações técnicas (desenvolvedor e design system, quando fornecido). Os grupos usam Card, Text e Meta existentes.

A demonstração usa SVGs fictícios em `examples/requerimentos/assets`. Eles não são brasões nem marcas oficiais. O histórico de Novidades dessa demonstração é sintético.
