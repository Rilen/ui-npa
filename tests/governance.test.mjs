import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { buildTokens } from "../scripts/build-tokens.mjs";

const root = path.resolve(import.meta.dirname, "..");
const stylesDir = path.join(root, "packages/styles");

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return full.endsWith(".css") ? [full] : [];
  });
}

function stripComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, "");
}

test("componentes não redefinem cor, não usam !important e só referenciam tokens existentes", () => {
  const defined = new Set([...buildTokens().css.matchAll(/(--iui-[a-z0-9-]+):/g)].map((match) => match[1]));
  const files = walk(stylesDir).filter((file) => path.basename(file) !== "tokens.css");
  assert.ok(files.length >= 8);

  for (const file of files) {
    const css = stripComments(fs.readFileSync(file, "utf8"));
    const relative = path.relative(root, file);
    assert.equal(css.includes("!important"), false, relative);
    assert.equal(/#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(/.test(css), false, relative);
    for (const match of css.matchAll(/var\(\s*(--[a-z0-9-]+)/g)) {
      assert.ok(match[1].startsWith("--iui-"), `${relative} usa ${match[1]}`);
      assert.ok(defined.has(match[1]), `${relative} referencia token ausente ${match[1]}`);
    }
  }
});

test("o breakpoint da sidebar é o mesmo no CSS e no comportamento", () => {
  const css = fs.readFileSync(path.join(stylesDir, "components/sidebar.css"), "utf8");
  const behavior = fs.readFileSync(path.join(stylesDir, "sidebar.js"), "utf8");
  assert.match(css, /min-width:\s*48rem/);
  assert.match(css, /max-width:\s*47\.99rem/);
  assert.match(behavior, /max-width:\s*47\.99rem/);
});

test("a governança e o protocolo exigidos estão presentes", () => {
  const governance = fs.readFileSync(path.join(root, "governance/UI-NPA-GOVERNANCE.md"), "utf8");
  for (let index = 1; index <= 12; index += 1) {
    assert.match(governance, new RegExp(`IUI-${String(index).padStart(3, "0")}`));
  }
  assert.match(governance, /não verifica automaticamente toda a política/i);

  const protocol = fs.readFileSync(path.join(root, "docs/agents/ui-npa-migration.md"), "utf8");
  const steps = [
    "## 1. Reconhecimento do projeto",
    "## 2. Inventário de telas e componentes",
    "## 3. Auditoria visual",
    "## 4. Identificação de duplicações",
    "## 5. Planejamento incremental",
    "## 6. Aplicação dos componentes canônicos",
    "## 7. Substituição de CSS legado",
    "## 8. Verificação de acessibilidade",
    "## 9. Regressão funcional",
    "## 10. Relatório final de conformidade",
  ];
  let cursor = -1;
  for (const step of steps) {
    const found = protocol.indexOf(step);
    assert.ok(found > cursor, step);
    cursor = found;
  }
  assert.match(protocol, /ui-npa-migration/);
  assert.match(protocol, /não depende de Cursor, Kilo, Copilot/i);
  assert.match(protocol, /Não declarar conformidade WCAG integral/i);
});

test("a fundação não antecipa pacotes vazios", () => {
  for (const name of ["react", "angular", "php", "web-components"]) {
    assert.equal(fs.existsSync(path.join(root, "packages", name)), false, name);
  }
  for (const required of [
    "packages/tokens/primitive.tokens.json",
    "packages/styles/index.css",
    "packages/styles/sidebar.js",
    "examples/requerimentos/index.html",
    "governance/UI-NPA-GOVERNANCE.md",
    "docs/agents/ui-npa-migration.md",
    "AGENTS.md",
  ]) {
    assert.equal(fs.existsSync(path.join(root, required)), true, required);
  }
});

test("a demonstração não embute cor nem estilo inline", () => {
  const html = fs.readFileSync(path.join(root, "examples/requerimentos/index.html"), "utf8");
  const script = fs.readFileSync(path.join(root, "examples/requerimentos/app.js"), "utf8");
  assert.equal(/style\s*=/.test(html), false);
  assert.equal(/#[0-9a-fA-F]{6}\b/.test(html), false);
  assert.match(script, /ui-npa-demo-sidebar/);
  assert.match(html, /provisória/i);
});
