# ui-npa-migration

Especificação da skill futura `ui-npa-migration`.

Objetivo: permitir que um agente receba um projeto legado e execute uma modernização integral orientada pelo UI-NPA.

Esta especificação é independente de fornecedor e não depende de Cursor, Kilo, Copilot ou de outro produto. Qualquer agente capaz de ler o repositório, editar arquivos e executar os testes locais pode segui-la.

Não executar este protocolo contra sistemas reais sem autorização explícita da governança institucional. A fundação UI-NPA-001 apenas documenta e valida a presença do protocolo.

Não declarar conformidade WCAG integral apenas com testes automáticos.

## Entrada

O agente recebe o caminho do projeto alvo, o subconjunto de telas autorizado e a versão do UI-NPA a aplicar. Sem esses três dados, a execução para.

## 1. Reconhecimento do projeto

Identificar stack, forma de inclusão de CSS, rotas ou páginas, padrões de layout e restrições de deploy. Não alterar código nesta etapa. Registrar o que não foi possível inspecionar.

## 2. Inventário de telas e componentes

Listar telas, controles, estados e conteúdos que o usuário realmente encontra. Marcar o que fica fora do escopo autorizado.

## 3. Auditoria visual

Comparar a interface atual com os tokens, temas e contratos do UI-NPA. Separar o que já está aderente do que é divergente.

## 4. Identificação de duplicações

Apontar CSS, componentes e variações visuais que repetem a mesma função. Não apagar uma duplicata antes de saber quem a consome.

## 5. Planejamento incremental

Ordenar a modernização em incrementos que preservem o comportamento. Cada incremento tem telas, contratos UI-NPA usados, risco e forma de verificação.

## 6. Aplicação dos componentes canônicos

Substituir controles pelo contrato existente. Não criar componente concorrente. Onde o contrato ainda for planejado, manter o controle legado e registrar a lacuna.

## 7. Substituição de CSS legado

Remover estilo que o contrato já cobre. Valores visuais novos vêm de tokens `--iui-*`. Exceção visual segue IUI-011.

## 8. Verificação de acessibilidade

Verificar teclado, foco, nome acessível, contraste e comportamento responsivo das telas alteradas. Usar ferramenta automática quando existir e completar com verificação manual. Não declarar conformidade WCAG integral apenas com testes automáticos.

## 9. Regressão funcional

Confirmar que as tarefas do usuário continuam possíveis. A modernização visual não altera regra de negócio, autenticação, autorização nem contrato de API.

## 10. Relatório final de conformidade

Entregar telas alteradas, contratos aplicados, CSS removido, exceções, testes executados, falhas, itens não verificados e lacunas do UI-NPA. O relatório distingue implementado, pendente e bloqueado.

## Critério de parada

Interromper se a mudança exigir outro repositório não autorizado, credencial, dado real, serviço externo novo ou decisão de identidade ainda não homologada.

## Validação desta especificação

`tests/governance.test.mjs` confere a ordem dos dez passos, o nome da skill, a independência de fornecedor e a ressalva de acessibilidade. Essa validação não executa migração.
