# ADR 003 — Candidatos de paleta comparáveis

Data: 2026-11-12. Estado: proposta, não homologada.

## Contexto

O UI-NPA precisa comparar três identidades de cor sem alterar o tema canônico antes da homologação, sem criar uma segunda fonte de tokens e sem duplicar folhas de componente.

## Decisão

- Adicionar as primitivas de cor `atlantic`, `azure`, `steel`, `cool` e `stone` em `primitive.tokens.json`.
- Criar `semantic.candidate-a|b|c.tokens.json` com os mesmos caminhos e tipos do tema claro.
- Estender o gerador para validar caminhos, colisões e aliases e emitir `packages/styles/candidates.css` de forma determinística.
- Emitir as candidatas em seletores escopados `.iui-root[data-iui-candidate="a|b|c"]:not([data-iui-theme="dark"])`.
- Não importar `candidates.css` em `index.css`. A demonstração e a página `examples/paletas/` carregam o arquivo separadamente.
- Expor a comparação por `?paleta=a|b|c` e por um seletor restrito à demonstração.
- Manter o tema claro/escuro canônico e a API pública sem alteração.

## Consequências

O artefato canônico ganha apenas primitivas de cor e o gerador ganha uma saída adicional. Consumidores que carregam `index.css` não recebem as candidatas. Depois da escolha, a alternativa aprovada deve ser incorporada aos tokens semânticos canônicos e `candidates.css` deve ser retirado ou arquivado em uma missão própria. O tema escuro continua fora da decisão.
