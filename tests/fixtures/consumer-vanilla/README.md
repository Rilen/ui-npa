# Consumidor vanilla isolado

Fixture mínima que usa HTML, CSS e JavaScript nativos para consumir o pacote UI-NPA instalado a partir de um tarball local.

- `index.html` — aplicação consumidora com faixa institucional, sidebar, cabeçalho, cards, botão, campo, badges, alerta, tabela, rodapé, changelog e Sobre.
- `conflito.html` — cenário controlado em que CSS legado sem camada sobrepõe o pacote; documenta o limite de isolamento.
- `fixture.css` — apenas a ordem das camadas: `legacy`, `consumer`, `iui.tokens`, `iui.base`, `iui.components`, `iui.utilities`.
- `legacy.css` — regras globais antigas colocadas em `@layer legacy`.
- `legacy-unlayered.css` — as mesmas regras sem camada, usadas apenas no cenário de conflito.
- `app.js` — importa `identity.js` e `sidebar.js` do artefato público.
- `.vendor/` — gerado por `npm run prepare:consumer`; contém apenas o `dist` do pacote instalado. Não é versionado.

A fixture não importa `examples/`, `packages/` nem arquivos internos do repositório. O `prepare:consumer` executa `npm pack`, instala o tarball em um diretório temporário e copia o `dist` público para `.vendor`.

Para preparar e abrir:

```bash
npm run prepare:consumer
npm run dev
```

Acesse `/tests/fixtures/consumer-vanilla/`.
