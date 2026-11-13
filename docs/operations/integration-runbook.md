# Runbook de integração controlada

Documento operacional para adoção do UI-NPA em um sistema existente. É genérico: não pressupõe autoridade, acesso administrativo, backend, repositório de destino ou janela de mudança já concedidos.

## 1. Pré-integração

Registrar antes de alterar o sistema-alvo:

- sistema, ambiente e responsável técnico;
- versão atual da aplicação e versão do UI-NPA a adotar;
- inventário de folhas CSS, ordem real de carregamento e regras globais de `button`, `input`, `h1`, `a`, `table` e contêiner;
- navegadores e versões usados pelo órgão;
- estratégia de distribuição: tarball local ou clone Git;
- dependências de runtime existentes;
- backup ou preservação do estado anterior;
- critérios objetivos de aprovação e janela de retorno.

Não iniciar sem um caminho de retorno para CSS, versão e dados.

## 2. Instalação

### Tarball — canal recomendado

```bash
npm pack
npm install ./ui-npa-0.3.3.tgz
```

Verificar o SHA-256 do tarball recebido e confirmar que ele contém `dist/index.css`, `dist/tokens.css`, `dist/sidebar.js` e `dist/identity.js`. Não instalar por `file://` no navegador; use servidor HTTP.

### Clone Git — suportado com scripts habilitados

O pacote declara `prepare`, que gera `dist` durante a instalação:

```bash
npm install git+https://github.com/Rilen/ui-npa.git
```

Não use `--ignore-scripts` nesse canal. Confirmar que `node_modules/ui-npa/dist/index.css` existe antes de importar. A publicação npm não é um canal desta fase.

### Importação

Com bundler:

```js
import "ui-npa/styles.css";
import { mountSidebar } from "ui-npa/sidebar.js";
import { applyInstitutionalIdentity } from "ui-npa/identity.js";
```

Em HTML nativo, sirva o conteúdo de `dist` e carregue `index.css` e os módulos `sidebar.js`/`identity.js`. Não importe `packages/` nem `examples/`.

## 3. CSS e camadas

Declarar a ordem antes de carregar o UI-NPA e colocar todo CSS legado em camada anterior:

```css
@layer legacy, consumer, iui.tokens, iui.base, iui.components, iui.utilities;

@layer legacy {
  /* regras antigas */
}
```

- A ordem é um contrato, não apenas documentação. Se o UI-NPA for declarado antes da camada legada, a camada posterior vence.
- CSS legado sem camada vence qualquer camada e pode quebrar o contrato visual. Não há isolamento absoluto por Shadow DOM.
- Se a folha legada não puder ser reorganizada, avaliar um adaptador mínimo no consumidor antes de prometer isolamento. Não duplicar tokens nem redefinir a identidade.
- Componentes legados fora de `.iui-root` podem continuar no CSS antigo; a região moderna precisa dos wrappers canônicos.

## 4. Identidade institucional

A aplicação fornece Prefeitura, Secretaria, Setor e aplicação. `logo` aceita caminho relativo, HTTP(S) ou `data:image/*`; `changelogUrl` aceita caminho relativo ou HTTP(S). Esquemas `javascript:`, `file:`, `data:` em links e URLs malformadas são rejeitados.

A faixa institucional deve estar em um landmark nomeado, por exemplo:

```html
<div class="iui-institution" role="region" aria-label="Identificação institucional">
```

A configuração é confiável da aplicação. Não passe dado de usuário diretamente para logomarca ou URL sem validação de negócio.

## 5. Validação

Executar no ambiente de piloto com dados fictícios:

- navegação, formulário, validação, mensagem, tabela e rodapé;
- teclado, foco visível, Escape e ordem de foco;
- 1440, 1024, 768, 390 e 320px;
- ausência de rolagem horizontal indevida;
- contraste e axe-core;
- console sem erros e rede sem dependência de `examples/`, `packages/` ou serviço inesperado;
- tema claro oficial; tema escuro apenas como experimental;
- versão exibida no rodapé e detalhes técnicos.

Registrar `NOT_RUN` para leitor de tela real, dispositivo físico, zoom de texto extremo e navegador não disponível.

## 6. Rollback

1. Reverter o ponteiro para a versão anterior do pacote ou restaurar o tarball anterior.
2. Remover a folha e os módulos do UI-NPA da região migrada.
3. Restaurar a folha legada original e sua ordem de carregamento.
4. Preservar dados do usuário; a persistência do protótipo em `localStorage` não é um mecanismo de produção.
5. Repetir os fluxos essenciais e registrar evidência da reversão.
6. Interromper a integração se houver perda de dados, erro de console, violação de contraste grave, quebra de navegação ou falha de rollback.

## 7. Operação

- Registrar a versão do UI-NPA e a versão da aplicação no changelog do consumidor.
- Nomear responsável pela atualização, janela e critérios de aceitação.
- Manter as evidências de testes e capturas no repositório do consumidor.
- Atualizar uma versão por vez, repetindo a validação.
- Não atualizar automaticamente em produção.
- Reportar falhas ao repositório UI-NPA sem alterar outros sistemas.

## 8. Limites e referências

Limites conhecidos: CSS legado sem camada, tema escuro experimental, ausência de wrappers de framework, publicação npm não realizada, validação manual de acessibilidade pendente.

Referências: [integração](../integration.md), [identidade](../identity.md), [testes](../testing.md), [limitações](../limitations.md), [piloto legado](../pilots/legacy-integration.md) e [governança](../../governance/UI-NPA-GOVERNANCE.md).
