# 002 — Identidade hierárquica e rodapé técnico

## Contexto

A fundação 0.1.0 identificava o exemplo dentro da sidebar e do cabeçalho, sem contrato para Prefeitura, Secretaria e Setor, e sem separar a versão da aplicação da versão do UI-NPA.

## Decisão

A versão 0.2.0 adiciona `applyInstitutionalIdentity` e a faixa `iui-institution` acima do corpo do shell. A sidebar passa a identificar só o Setor. O nome da aplicação fica no cabeçalho operacional e no rodapé. O rodapé mostra a versão da aplicação, Novidades, Sobre o sistema e o crédito “Desenvolvido por NPA”. A versão do UI-NPA entra apenas em `designSystem`, na área Sobre.

As marcas de demonstração ficam em `examples/requerimentos/assets`. O núcleo não recebe logomarca municipal.

A largura máxima do conteúdo passa de `70rem` para `96rem`. O título usa `font.size.display`.

## Consequência

Aplicações aderentes precisam fornecer o objeto de identidade documentado em [docs/identity.md](../identity.md). A paleta continua provisória.
