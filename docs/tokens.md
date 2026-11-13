# Tokens

A fonte canônica está em `packages/tokens`. O formato usa os campos estáveis do Design Tokens Community Group: `$value`, `$type` e `$description`. O gerador não baixa schema externo.

Há três fontes e um artefato CSS gerado:

| Arquivo | Função | Estado |
| --- | --- | --- |
| `primitive.tokens.json` | Cor, tipo, espaço, raio, borda, sombra, duração, easing, tamanho e empilhamento | Implementado |
| `semantic.light.tokens.json` | Cor de superfície, texto, borda, ação, foco, feedback e navegação | Implementado, tema claro oficial |
| `semantic.dark.tokens.json` | Os mesmos caminhos do tema claro | Experimental |
| `packages/styles/tokens.css` | CSS Custom Properties gerado | Canônico |

O tema claro oficial é **Azul Institucional Equilibrado (alternativa A)**, homologado em 12/11/2026. Ele carrega sem atributo, seletor ou parâmetro especial. O tema escuro continua experimental.

Os candidatos da UI-NPA-006 foram avaliados, a alternativa A foi promovida e B/C foram rejeitadas. As definições históricas ficam em `docs/archive/ui-npa-006` e não são lidas pelo gerador. Não existe `candidates.css` no fluxo de produção.

Não há arquivo de token de componente. Medidas que não mudam com o tema permanecem primitivas. Um token de componente só deve surgir quando um semântico ou um primitivo estrutural não representar o valor com clareza.

## Nomes

O caminho `color.action.primary.bg-hover` vira `--iui-color-action-primary-bg-hover`.

O nome é estável dentro da linha `0.3`. Renomear é mudança incompatível e entra no changelog.

## Regras do gerador

- Alias semântico aponta para primitivo, no formato `{color.atlantic.700}`.
- Alias parcial não é suportado.
- Tema claro e tema escuro precisam ter os mesmos caminhos.
- Caminho semântico não pode colidir com primitivo.
- Cor, dimensão, duração, número, peso, família, curva e sombra são validados antes da emissão.
- A saída é ordenada. Duas execuções produzem o mesmo texto.
- O gerador emite apenas `packages/styles/tokens.css`; não há folha de candidatos.

## Paleta oficial

O tema claro oficial usa o azul institucional `atlantic`, com ação primária e foco em `#2a4b6d`, navegação ativa em `#e5edf5` e canvas `#f7f8fa`. O azul `blue` permanece apenas no tema escuro experimental. Neutros frios, verde, âmbar e vermelho existem para texto e feedback, não como decoração.

A decisão está em [decisions/004-palette-homologation.md](decisions/004-palette-homologation.md). O histórico da avaliação, com as alternativas rejeitadas e as medições, está em [palette.md](palette.md).

Os pares mínimos de contraste vivem em `tests/contrast-pairs.json` e são recalculados a cada `npm test`. O teste cobre o tema claro oficial e o tema escuro experimental. Texto informativo usa 4.5:1. Borda e anel de foco usam 3:1. Texto desabilitado fica de fora dessa meta porque o critério de contraste da WCAG não se aplica a componente inativo.

## Uso

Componente e exemplo leem apenas variáveis. Depois de alterar um JSON:

```bash
npm run build
npm test
```
