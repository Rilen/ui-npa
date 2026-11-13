# Temas

## Claro — oficial

É o tema canônico e a paleta clara oficial do UI-NPA: **Azul Institucional Equilibrado (alternativa A)**, homologada em 12/11/2026. Entra em `:root` e pode ser reafirmado com `data-iui-theme="light"` para voltar ao claro dentro de uma região escura. Não depende de atributo de candidato, folha adicional ou parâmetro de URL.

Características: canvas `#f7f8fa`, superfície branca, ação primária e foco `#2a4b6d`, navegação ativa `#e5edf5` com texto `#203a55`, borda sutil de 1px em `#7d848f`, raio de 4px nos controles e 8px nos cartões, sombra curta, azul restrito a ação, foco, navegação ativa e informação.

## Escuro — experimental

`data-iui-theme="dark"` no elemento que deve herdar o tema, em geral `.iui-root`.

O escuro reaproveita os mesmos caminhos semânticos e mantém os valores anteriores à homologação. Os blocos de feedback mantêm o par claro de fundo e texto para a situação continuar reconhecível. Sombras não foram reajustadas para fundo escuro. A demonstração não oferece interruptor de tema: o escuro é coberto por teste de propriedade computada, não por uma identidade aprovada.

## Histórico de candidatos

As alternativas A, B e C da UI-NPA-006 foram comparadas. A foi homologada e B/C foram rejeitadas. As definições históricas estão em `docs/archive/ui-npa-006`, as medições em [palette.md](palette.md) e a decisão em [decisions/004-palette-homologation.md](decisions/004-palette-homologation.md). Nenhuma variante de candidato permanece no CSS canônico.

## Fora de tema

Espaço, tipo, raio, duração e tamanho não variam. A família é a pilha de sistema:

`system-ui, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`

Segoe UI entra apenas como fonte já presente no sistema operacional. O repositório não distribui o arquivo da fonte.

## Movimento

Durações canônicas: 120ms e 180ms. Com `prefers-reduced-motion: reduce`, os controles da fundação perdem a transição. O teste de navegador também pede movimento reduzido.
