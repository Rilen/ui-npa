# Tokens

A fonte canônica está em `packages/tokens`. O formato usa os campos estáveis do Design Tokens Community Group: `$value`, `$type` e `$description`. O gerador não baixa schema externo.

Há três arquivos:

| Arquivo | Função | Estado |
| --- | --- | --- |
| `primitive.tokens.json` | Cor, tipo, espaço, raio, borda, sombra, duração, easing, tamanho e empilhamento | Implementado |
| `semantic.light.tokens.json` | Cor de superfície, texto, borda, ação, foco, feedback e navegação | Implementado, tema canônico |
| `semantic.dark.tokens.json` | Os mesmos caminhos do tema claro | Experimental |

Não há arquivo de token de componente. Medidas que não mudam com o tema permanecem primitivas. Um token de componente só deve surgir quando um semântico ou um primitivo estrutural não representar o valor com clareza.

## Nomes

O caminho `color.action.primary.bg-hover` vira `--iui-color-action-primary-bg-hover`.

O nome é estável dentro de `0.1.0`. Renomear é mudança incompatível e entra no changelog.

## Regras do gerador

- Alias semântico aponta para primitivo, no formato `{color.blue.700}`.
- Alias parcial não é suportado.
- Tema claro e tema escuro precisam ter os mesmos caminhos.
- Caminho semântico não pode colidir com primitivo.
- Cor, dimensão, duração, número, peso, família, curva e sombra são validados antes da emissão.
- A saída é ordenada. Duas execuções produzem o mesmo texto.

## Paleta provisória

A descrição do grupo `color` registra que a paleta é provisória e não homologada. O azul institucional de trabalho é `#244668` (`color.blue.700`), distinto da amostra usual do Fluent. Neutros frios, verde, âmbar e vermelho existem para texto e feedback, não como decoração.

Os pares mínimos de contraste vivem em `tests/contrast-pairs.json` e são recalculados a cada `npm test`. Texto informativo usa 4.5:1. Borda e anel de foco usam 3:1. Texto desabilitado fica de fora dessa meta porque o critério de contraste da WCAG não se aplica a componente inativo.

## Uso

Componente e exemplo leem apenas variáveis. Depois de alterar um JSON:

```bash
npm run build
npm test
```
