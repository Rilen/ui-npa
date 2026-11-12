# Arquitetura

O UI-NPA `0.2.0` é um único projeto Node, privado, com três artefatos reais:

- `packages/tokens` — fonte DTCG, com tema canônico e três candidatas;
- `packages/styles` — CSS universal, CSS de candidatas e o comportamento da sidebar;
- `examples/requerimentos` — demonstração estática, sem backend;
- `examples/paletas` — comparação restrita das três candidatas.

`scripts/build-tokens.mjs` lê a fonte e grava `packages/styles/tokens.css` e `packages/styles/candidates.css`. Componentes não repetem o valor do token: usam `var(--iui-...)`.

```text
ui-npa/
├── packages/
│   ├── tokens/
│   └── styles/
├── examples/requerimentos/
├── examples/paletas/
├── docs/
├── governance/
├── scripts/
└── tests/
```

Não há `packages/react`, `packages/angular` nem `packages/php`. A interface futura desses consumidores está em [integration.md](integration.md).

## Cascata

A folha `packages/styles/index.css` declara as camadas, nesta ordem:

1. `iui.tokens`
2. `iui.base`
3. `iui.components`
4. `iui.utilities`

A base só altera a região `.iui-root` e, para margem e altura, `body.iui-root`. Não zera margem, lista ou tipografia de uma página legada fora dessa região.

O prefixo `iui-` vale para classes, atributos de comportamento e custom properties.

## Comportamento

O núcleo tem dois módulos: `packages/styles/sidebar.js` e `packages/styles/identity.js`. Nenhum acessa rede, sessão ou roteador. A demonstração fornece a identidade, a persistência, o filtro e o formulário em `examples/requerimentos/app.js`.

## Temas

Primitivos estruturais ficam em `:root`. Cores semânticas do tema claro ficam em `:root` e `[data-iui-theme="light"]`. O tema escuro, experimental, fica em `[data-iui-theme="dark"]`. As candidatas ficam em `candidates.css`, escopadas por `[data-iui-candidate]` e excluídas do escuro; não entram no artefato canônico.

## O que esta arquitetura não faz

Não distribui pacote, não observa aplicação consumidora e não impõe serviço de runtime. A independência operacional é o arquivo CSS e o contrato HTML.
