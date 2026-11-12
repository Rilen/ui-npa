# Tokens

A fonte canônica está em `packages/tokens`. O formato usa os campos estáveis do Design Tokens Community Group: `$value`, `$type` e `$description`. O gerador não baixa schema externo.

Há cinco fontes de tema e dois artefatos CSS gerados:

| Arquivo | Função | Estado |
| --- | --- | --- |
| `primitive.tokens.json` | Cor, tipo, espaço, raio, borda, sombra, duração, easing, tamanho e empilhamento | Implementado |
| `semantic.light.tokens.json` | Cor de superfície, texto, borda, ação, foco, feedback e navegação | Implementado, tema canônico |
| `semantic.dark.tokens.json` | Os mesmos caminhos do tema claro | Experimental |
| `semantic.candidate-a.tokens.json` | Candidato A, mesmos caminhos do tema claro | Candidato, não homologado |
| `semantic.candidate-b.tokens.json` | Candidato B, mesmos caminhos do tema claro | Candidato, não homologado |
| `semantic.candidate-c.tokens.json` | Candidato C, mesmos caminhos do tema claro | Candidato, não homologado |

`packages/styles/tokens.css` é o artefato canônico. `packages/styles/candidates.css` contém apenas as três candidatas, escopadas por `data-iui-candidate`, e não é importado por `index.css`. Consumidores não recebem as candidatas; a demonstração e `examples/paletas/` as carregam separadamente.

Não há arquivo de token de componente. Medidas que não mudam com o tema permanecem primitivas. Um token de componente só deve surgir quando um semântico ou um primitivo estrutural não representar o valor com clareza.

## Nomes

O caminho `color.action.primary.bg-hover` vira `--iui-color-action-primary-bg-hover`.

O nome é estável dentro da linha `0.2`. Renomear é mudança incompatível e entra no changelog.

## Regras do gerador

- Alias semântico aponta para primitivo, no formato `{color.blue.700}`.
- Alias parcial não é suportado.
- Tema claro e tema escuro precisam ter os mesmos caminhos.
- As três candidatas precisam ter exatamente os mesmos caminhos do tema claro.
- Caminho semântico não pode colidir com primitivo.
- Cor, dimensão, duração, número, peso, família, curva e sombra são validados antes da emissão.
- A saída é ordenada. Duas execuções produzem o mesmo texto.
- `candidates.css` é gerado no mesmo passo e não entra no `index.css` canônico.

## Paleta provisória

A descrição do grupo `color` registra que a paleta é provisória e não homologada. O azul institucional de trabalho é `#244668` (`color.blue.700`), distinto da amostra usual do Fluent. Neutros frios, verde, âmbar e vermelho existem para texto e feedback, não como decoração.

As três candidatas da UI-NPA-006 e a recomendação técnica estão em [palette.md](palette.md). Os candidatos usam as primitivas `atlantic`, `azure`, `steel`, `cool` e `stone`; nenhuma delas altera o tema canônico.

Os pares mínimos de contraste vivem em `tests/contrast-pairs.json` e são recalculados a cada `npm test`. O teste cobre claro, escuro e as três candidatas. Texto informativo usa 4.5:1. Borda e anel de foco usam 3:1. Texto desabilitado fica de fora dessa meta porque o critério de contraste da WCAG não se aplica a componente inativo.

## Uso

Componente e exemplo leem apenas variáveis. Depois de alterar um JSON:

```bash
npm run build
npm test
```
