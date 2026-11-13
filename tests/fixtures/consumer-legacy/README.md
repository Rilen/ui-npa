# Piloto de integração legada

Cenário sintético de adoção incremental do UI-NPA em uma aplicação administrativa legada. Todos os nomes, protocolos e marcas são fictícios.

## Estados

- `estado-a.html` — aplicação apenas com CSS legado.
- `estado-b.html` — região delimitada em UI-NPA; formulário e tabela legados.
- `estado-c.html` — conteúdo principal migrado para UI-NPA; cabeçalho, navegação e rodapé legados.
- `conflito.html` — CSS legado global sem camada, reproduzindo o conflito.
- `conflito-mitigado.html` — as mesmas regras em `@layer legacy`, comprovando a mitigação.
- `comparacao.html` — comparação lado a lado de componentes.
- `pilot.js` — fluxos compartilhados de formulário, validação, mensagem, filtro e persistência.
- `data.js` — dados fictícios compartilhados.

## Camadas

`layers.css` declara `legacy, pilot, iui.tokens, iui.base, iui.components, iui.utilities`. O CSS legado fica em `@layer legacy`; os estados B e C carregam o `dist` público do UI-NPA. O estado A não carrega o pacote.

## Reversibilidade

Os campos e o filtro são persistidos em `localStorage`. Navegar de C para A ou B mantém os valores, sem reescrever a aplicação legada. A barra do piloto é apenas uma bancada de teste, não um mecanismo de produção.

## Preparação

```bash
npm run prepare:consumer
npm run dev
```

Acesse `/tests/fixtures/consumer-legacy/estado-a.html`. A pasta `.vendor` é gerada a partir do tarball local e não é versionada.
