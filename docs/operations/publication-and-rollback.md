# Publicação e rollback — UI-NPA (mandato 007-R1)

Este documento descreve o procedimento canônico de publicação da demonstração
estática do UI-NPA no gateway institucional e o rollback correspondente. Ele
conclui a pendência de rastreabilidade do mandato 007-R1.

## 1. Repositórios canônicos

| Papel | Repositório canônico | Remoto |
| --- | --- | --- |
| Código-fonte / release | `Rilen/ui-npa` (GitHub) | `https://github.com/Rilen/ui-npa` |
| Gateway (:3005) | `/opt/nginx-3005-gateway-config` (git local) | sem remoto (somente local) |
| NPA Hub (catálogo) | `/opt/npa-hub-reconciler` (git local) | sem remoto (somente local) |

A infraestrutura compartilhada (gateway e NPA Hub) é versionada **separadamente**
nos seus próprios repositórios git locais. Ela **não** é incorporada ao
repositório UI-NPA. O repositório UI-NPA contém apenas o código, os artefatos
`dist`, a documentação e este procedimento.

## 2. Pré-requisitos

- `main` homologada e tag de release (ex.: `v0.4.0`) criadas no GitHub.
- Build reproduzível: `npm ci && npm run build` gera `dist/` e `packages/styles/tokens.css`.
- Nenhuma credencial exposta é utilizada. O gateway e o NPA Hub são git locais,
  sem remoto, portanto não exigem autenticação de push. Bloqueios de
  autenticação, se houver, devem ser registrados à parte.

## 3. Publicação

1. **Gerar recursos a partir da `main` homologada**:
   ```bash
   git -C <ui-npa> checkout main && git -C <ui-npa> pull
   npm ci && npm run build
   ```
2. **Montar a árvore publicada** (a demonstração usa caminhos absolutos):
   - `index.html` = `examples/requerimentos/index.html` com o link
     `../../packages/styles/index.css` → `/ui-npa/dist/index.css`.
   - `app.js` = `examples/requerimentos/app.js` com os imports
     `../../packages/styles/{identity,sidebar}.js` → `/ui-npa/dist/{identity,sidebar}.js`.
   - `dist/` = saída do build; `assets/` = `examples/requerimentos/assets`.
3. **Backup da versão atual** (antes de sobrescrever):
   ```bash
   cd /opt/nginx-3005-gateway-config
   TS=$(date -u +%Y%m%dT%H%M%SZ); BK="backups/UI-NPA-DEPLOY-$TS"; mkdir -p "$BK"
   cp conf.d/default.conf "$BK/default.conf.pre"
   cp -a html/ui-npa "$BK/ui-npa-prev"
   ```
4. **Atualizar a árvore publicada** no repositório do gateway
   (`html/ui-npa`) e o header `X-UI-NPA-SHA` em `conf.d/default.conf` para o SHA
   implantado (commit da `main`).
5. **Aplicar** com o script idempotente do gateway (copia para o container
   `nginx-3005`, valida `nginx -t` e faz `reload` — não reinicia nem recria):
   ```bash
   bash /opt/nginx-3005-gateway-config/apply.sh
   ```
   O `apply.sh` remove o diretório de destino antes de copiar e normaliza
   permissões (`chmod -R a+rX`), evitando aninhamento e `403`.
6. **Publicar o catálogo do NPA Hub** (card da aplicação):
   ```bash
   # atualizar config/overrides.json (versão) e reconciliar
   python3 /opt/npa-hub-reconciler/reconciler.py
   cp /opt/npa-hub-reconciler/catalog.json /opt/nginx-3005-gateway-config/html/catalog.json
   docker cp /opt/npa-hub-reconciler/catalog.json nginx-3005:/usr/share/nginx/html/catalog.json
   docker exec nginx-3005 chmod 644 /usr/share/nginx/html/catalog.json
   ```
7. **Validar**:
   - `curl -D - http://10.0.0.88:3005/ui-npa/` → `200` e `X-UI-NPA-SHA` = SHA implantado.
   - Recursos `dist/index.css`, `dist/tokens.css`, `dist/sidebar.js`,
     `dist/identity.js`, `app.js` → `200`.
   - Navegador: três estados (expandido→compacto→oculto), desktop e mobile,
     sem overflow horizontal e sem erros de console.
   - `systemctl is-enabled ui-npa.service` → `disabled` (mantido).

## 4. Rollback

1. **Restaurar a árvore publicada e o header** a partir do backup:
   ```bash
   cd /opt/nginx-3005-gateway-config
   rm -rf html/ui-npa && cp -a backups/UI-NPA-DEPLOY-<TS>/ui-npa-prev html/ui-npa
   cp backups/UI-NPA-DEPLOY-<TS>/default.conf.pre conf.d/default.conf
   bash apply.sh
   ```
2. **Restaurar o catálogo do NPA Hub** para o commit anterior e republicar:
   ```bash
   git -C /opt/npa-hub-reconciler checkout <commit-anterior> -- catalog.json config/overrides.json
   cp /opt/npa-hub-reconciler/catalog.json /opt/nginx-3005-gateway-config/html/catalog.json
   docker cp /opt/npa-hub-reconciler/catalog.json nginx-3005:/usr/share/nginx/html/catalog.json
   ```
3. Revalidar HTTP `200`, header e três estados.

## 5. Restrições

- Não reiniciar nem recriar o gateway compartilhado sem autorização específica;
  usar apenas `reload`.
- Preservar `ui-npa.service` desabilitado.
- Não publicar em registro npm.
- Não alterar identidade visual, tokens semânticos ou contratos públicos.
- Versionar alterações de gateway e NPA Hub nos seus próprios repositórios.