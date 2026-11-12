# Temas

## Claro — implementado

É o tema canônico da direção Institucional Equilibrado. Entra em `:root` e pode ser reafirmado com `data-iui-theme="light"` para voltar ao claro dentro de uma região escura.

Características: fundo levemente cinza, superfície branca, borda de 1px, raio de 4px nos controles e 8px nos cartões, sombra curta, azul apenas em ação primária, foco e item ativo.

## Escuro — experimental

`data-iui-theme="dark"` no elemento que deve herdar o tema, em geral `.iui-root`.

O escuro reaproveita os mesmos caminhos semânticos. Os blocos de feedback mantêm o par claro de fundo e texto para a situação continuar reconhecível. Sombras não foram reajustadas para fundo escuro. A demonstração não oferece interruptor de tema: o escuro é coberto por teste de propriedade computada, não por uma identidade aprovada.

## Fora de tema

Espaço, tipo, raio, duração e tamanho não variam. A família é a pilha de sistema:

`system-ui, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`

Segoe UI entra apenas como fonte já presente no sistema operacional. O repositório não distribui o arquivo da fonte.

## Movimento

Durações canônicas: 120ms e 180ms. Com `prefers-reduced-motion: reduce`, os controles da fundação perdem a transição. O teste de navegador também pede movimento reduzido.
