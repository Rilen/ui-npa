# UI-NPA-GOVERNANCE

Política canônica do Design System institucional UI-NPA. Em conflito com outro texto, prevalece este documento.

As regras abaixo são obrigatórias para aplicações aderentes e para agentes que alterem suas interfaces.

## IUI-001 — Fonte única de verdade

Tokens e contratos canônicos são a referência obrigatória. A fonte dos tokens é `packages/tokens`. O CSS gerado não é editado à mão.

## IUI-002 — Reutilização

Não criar componentes concorrentes aos existentes. Um controle novo só entra no UI-NPA quando o contrato atual não resolve a necessidade e a inclusão é documentada.

## IUI-003 — Identidade visual

Aplicações aderentes devem respeitar a identidade e os temas aprovados. A paleta clara oficial é **Azul Institucional Equilibrado (alternativa A)**, homologada em 12/11/2026, e vive nos tokens semânticos canônicos. O tema escuro permanece experimental. Aplicações não devem sobrescrever os tokens semânticos globais para criar identidades paralelas; a configuração de marcas institucionais é independente da paleta. As alternativas B e C foram rejeitadas para adoção canônica e ficam apenas no arquivo histórico.

## IUI-004 — Acessibilidade

Componentes devem atender aos critérios aplicáveis da WCAG 2.2 AA. Teste automático é evidência parcial, não declaração de conformidade integral.

## IUI-005 — Compatibilidade

Mudanças incompatíveis devem ser identificadas e versionadas no changelog. Durante `0.x`, quebra de contrato incrementa a versão menor.

## IUI-006 — CSS

Evitar duplicação, estilos arbitrários e sobrescritas não justificadas. Componentes consomem variáveis `--iui-*`. Não introduzir Bootstrap, Tailwind ou outra biblioteca de apresentação como dependência do núcleo. O consumo externo usa o artefato público `dist/index.css` e os módulos `dist/sidebar.js` e `dist/identity.js`; não copie arquivos internos de `packages/styles`. CSS legado do consumidor deve ser colocado em uma camada anterior às camadas `iui.*`. CSS sem camada tem precedência sobre o pacote e pode quebrar o contrato visual; a integração recomendada está em [docs/integration.md](../docs/integration.md).

## IUI-007 — Agentes de IA

Agentes devem consultar esta política, os contratos de componentes e o protocolo de migração antes de implementar ou modificar interfaces.

## IUI-008 — Independência

Nenhum consumidor depende operacionalmente de outro sistema ou de um serviço do UI-NPA. A folha e os contratos são artefatos locais.

## IUI-009 — Sidebar

Aplicações com navegação lateral devem utilizar o contrato canônico de sidebar recolhível, expansível, responsiva e acessível. A aplicação fornece os itens e a persistência. O componente não contém autenticação, autorização nem rotas de um sistema consumidor.

## IUI-010 — Migração

Modernizações devem preservar funcionalidades e produzir evidências de conformidade, seguindo [docs/agents/ui-npa-migration.md](../docs/agents/ui-npa-migration.md).

## IUI-011 — Exceções

Exceções visuais devem ser justificadas, registradas e aprovadas conforme a governança do projeto. Enquanto não houver rito institucional de aprovação, a exceção fica documentada em decisão arquitetural e no changelog, marcada como pendente de homologação.

## IUI-012 — Simplicidade

Não introduzir abstrações ou dependências sem benefício demonstrável. Pacotes e componentes não são criados apenas para antecipar uso futuro.

## IUI-013 — Identidade Institucional Hierárquica

Toda aplicação aderente configura Prefeitura, Secretaria e Setor sem gravar marcas específicas no núcleo. A faixa superior identifica Prefeitura, à esquerda, e Secretaria, à direita. A sidebar identifica o Setor. O contrato e as posições estão em [docs/identity.md](../docs/identity.md).

## IUI-014 — Identificação e Transparência Técnica

Toda aplicação aderente apresenta, no rodapé, o nome e a versão da aplicação, o acesso ao changelog, o crédito “Desenvolvido por NPA” e o acesso às informações do sistema. A versão exibida é a da aplicação. A versão do UI-NPA fica nos detalhes técnicos.

## Verificação automática

Há teste para parte objetiva de IUI-001, IUI-004, IUI-006, IUI-009, IUI-013 e IUI-014: integridade da geração, ausência de cor literal nos componentes, prefixo `iui-`, contraste dos pares declarados, estrutura do protocolo, comportamento da sidebar, contrato de identidade e rodapé da demonstração.

Este repositório não verifica automaticamente toda a política. IUI-002, IUI-003, IUI-005, IUI-007, IUI-008, IUI-010, IUI-011 e IUI-012 dependem de revisão humana. IUI-004, IUI-013 e IUI-014 também não ficam integralmente cobertos por automação.

## Aplicações aderentes

Uma aplicação aderente:

- consome o artefato público `dist/index.css` (ou a entrada instalada `ui-npa/styles.css`) e os módulos `ui-npa/sidebar.js` e `ui-npa/identity.js`;
- envolve a região modernizada com `iui-root`;
- usa os contratos de [docs/components.md](../docs/components.md) e [docs/identity.md](../docs/identity.md);
- não sobrescreve tokens semânticos globais para criar identidade paralela; configura somente as marcas do contrato de identidade;
- declara a ordem de camadas e mantém CSS legado em camada anterior;
- registra exceção quando precisar sair do contrato.
