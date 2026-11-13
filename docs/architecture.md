# Arquitetura

O UI-NPA `0.3.3` é um único projeto Node, privado, com os seguintes artefatos e fixtures:

- `packages/tokens` — fonte DTCG com tema claro oficial e tema escuro experimental;
- `packages/styles` — CSS universal e o comportamento da sidebar;
- `examples/requerimentos` — demonstração estática, sem backend;
- `dist` — cópia pública gerada de `packages/styles` para o tarball local;
- `tests/fixtures/consumer-vanilla` — consumidor independente validado por teste;
- `tests/fixtures/consumer-legacy` — piloto A/B/C de convivência com aplicação legada.

`scripts/build-tokens.mjs` gera `packages/styles/tokens.css`; `scripts/build-package.mjs` gera `dist`; `npm run build` executa os dois. Componentes não repetem o valor do token: usam `var(--iui-...)`.

```text
ui-npa/
├── packages/
│   ├── tokens/
│   └── styles/
├── dist/                 # gerado, fora do Git
├── examples/requerimentos/
├── tests/fixtures/consumer-vanilla/
├── tests/fixtures/consumer-legacy/
├── docs/
├── governance/
├── scripts/
└── tests/
```

O `package.json` publica `dist`, `README.md` e `CHANGELOG.md`; os exports `./styles.css`, `./tokens.css`, `./sidebar.js` e `./identity.js` apontam para o artefato instalado. O pacote é privado e a distribuição validada é local, por tarball. O script `prepare` também gera `dist` em instalação Git com scripts habilitados; o tarball continua sendo o canal recomendado. Ver [integration.md](integration.md), [runbook](operations/integration-runbook.md) e [decisions/006-hardening-0.3.3.md](decisions/006-hardening-0.3.3.md).

Não há `packages/react`, `packages/angular` nem `packages/php`. A interface futura desses consumidores está em [integration.md](integration.md).

## Cascata

A fonte `packages/styles/index.css` declara as camadas, nesta ordem:

1. `iui.tokens`
2. `iui.base`
3. `iui.components`
4. `iui.utilities`

O `dist/index.css` mantém os mesmos imports e a mesma ordem de camadas. CSS legado do consumidor deve ficar em camada anterior; CSS sem camada vence as camadas `iui.*` e é um limite documentado em [integration.md](integration.md).

A base só altera a região `.iui-root` e, para margem e altura, `body.iui-root`. Não zera margem, lista ou tipografia de uma página legada fora dessa região.

O prefixo `iui-` vale para classes, atributos de comportamento e custom properties.

## Comportamento

O núcleo tem dois módulos: `packages/styles/sidebar.js` e `packages/styles/identity.js`. Nenhum acessa rede, sessão ou roteador. A demonstração fornece a identidade, a persistência, o filtro e o formulário em `examples/requerimentos/app.js`.

## Temas

Primitivos estruturais ficam em `:root`. Cores semânticas do tema claro oficial ficam em `:root` e `[data-iui-theme="light"]`. O tema escuro, experimental, fica em `[data-iui-theme="dark"]`. Não há folha de candidatos no artefato canônico; as definições históricas da avaliação ficam em `docs/archive/ui-npa-006` e não são geradas.

## O que esta arquitetura não faz

Não distribui pacote, não observa aplicação consumidora e não impõe serviço de runtime. A independência operacional é o arquivo CSS e o contrato HTML.
