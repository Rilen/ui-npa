import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { buildTokens } from "../scripts/build-tokens.mjs";

const root = path.resolve(import.meta.dirname, "..");

test("a geração de CSS é determinística", () => {
  const first = buildTokens();
  const second = buildTokens();
  assert.equal(first.css, second.css);
  assert.deepEqual(first.light, second.light);
  assert.deepEqual(first.dark, second.dark);
});

test("o CSS commitado corresponde à fonte canônica", () => {
  const generated = buildTokens().css.replaceAll("\r\n", "\n");
  const committed = fs.readFileSync(path.join(root, "packages/styles/tokens.css"), "utf8").replaceAll("\r\n", "\n");
  assert.equal(committed, generated);
});

test("o tema claro carrega os valores homologados da alternativa A", () => {
  const { light } = buildTokens();
  assert.equal(light["color.action.primary.bg"].value, "#2a4b6d");
  assert.equal(light["color.action.primary.bg-hover"].value, "#203a55");
  assert.equal(light["color.action.primary.bg-pressed"].value, "#172a3f");
  assert.equal(light["color.nav.item-active"].value, "#e5edf5");
  assert.equal(light["color.nav.item-active-fg"].value, "#203a55");
  assert.equal(light["color.surface.canvas"].value, "#f7f8fa");
  assert.equal(light["color.text.primary"].value, "#171b26");
  assert.equal(light["color.text.brand"].value, "#2a4b6d");
  assert.equal(light["color.border.subtle"].value, "#7d848f");
  assert.equal(light["color.focus.ring"].value, "#2a4b6d");
  assert.equal(light["color.feedback.info.bg"].value, "#f3f6fa");
  assert.equal(light["color.feedback.info.fg"].value, "#2a4b6d");
});

test("o tema escuro experimental preserva o token de ação anterior", () => {
  const { dark } = buildTokens();
  assert.equal(dark["color.action.primary.bg"].value, "#2f5884");
});

test("tema claro e escuro mantêm os mesmos caminhos", () => {
  const model = buildTokens();
  assert.deepEqual(Object.keys(model.light).sort(), Object.keys(model.dark).sort());
});

test("tokens semânticos não carregam cor literal", () => {
  for (const file of ["semantic.light.tokens.json", "semantic.dark.tokens.json"]) {
    const source = fs.readFileSync(path.join(root, "packages/tokens", file), "utf8");
    assert.equal(source.includes("#"), false, file);
  }
});

test("a paleta clara oficial está identificada", () => {
  const primitive = fs.readFileSync(path.join(root, "packages/tokens/primitive.tokens.json"), "utf8");
  const css = fs.readFileSync(path.join(root, "packages/styles/tokens.css"), "utf8");
  assert.match(primitive, /Paleta oficial do tema claro/i);
  assert.match(primitive, /Azul Institucional Equilibrado/i);
  assert.match(primitive, /homologada em 2026-11-12/i);
  assert.match(css, /Paleta clara oficial/i);
  assert.match(css, /Azul Institucional Equilibrado/i);
  assert.match(css, /homologada em 2026-11-12/i);
  assert.match(css, /--iui-color-action-primary-bg:/);
  assert.match(css, /--iui-size-sidebar-collapsed:/);
});

test("não restam mecanismos de candidatos no fluxo de produção", () => {
  const index = fs.readFileSync(path.join(root, "packages/styles/index.css"), "utf8");
  const html = fs.readFileSync(path.join(root, "examples/requerimentos/index.html"), "utf8");
  const app = fs.readFileSync(path.join(root, "examples/requerimentos/app.js"), "utf8");
  const packageJson = fs.readFileSync(path.join(root, "package.json"), "utf8");
  const tokenFiles = fs.readdirSync(path.join(root, "packages/tokens"));

  assert.equal(fs.existsSync(path.join(root, "packages/styles/candidates.css")), false);
  assert.equal(fs.existsSync(path.join(root, "examples/paletas")), false);
  assert.equal(fs.existsSync(path.join(root, "examples/shared/demo.css")), false);
  assert.equal(index.includes("candidates.css"), false);
  assert.equal(/candidates\.css|data-iui-candidate|Paleta candidata|\?paleta=/.test(html), false);
  assert.equal(/candidateIds|iuiCandidate|paleta/.test(app), false);
  assert.equal(packageJson.includes("capture:screenshots:006"), false);
  assert.equal(tokenFiles.some((file) => file.startsWith("semantic.candidate-")), false);
});

test("todas as propriedades geradas usam o prefixo iui-", () => {
  const css = buildTokens().css;
  const blocks = css.split("}").filter((block) => block.includes("--iui-"));
  const unique = new Set();
  assert.ok(blocks.length >= 3);
  for (const block of blocks) {
    const names = [...block.matchAll(/(--[a-z0-9-]+):/g)].map((match) => match[1]);
    assert.ok(names.every((name) => name.startsWith("--iui-")));
    assert.equal(new Set(names).size, names.length);
    names.forEach((name) => unique.add(name));
  }
  assert.ok(unique.size > 40);
});

test("rejeita alias cíclico", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "iui-"));
  const tokenDir = path.join(dir, "packages", "tokens");
  fs.mkdirSync(tokenDir, { recursive: true });
  fs.writeFileSync(path.join(tokenDir, "primitive.tokens.json"), JSON.stringify({
    color: {
      a: { $type: "color", $value: "{color.b}" },
      b: { $type: "color", $value: "{color.a}" },
    },
  }));
  const semantic = JSON.stringify({
    color: { text: { primary: { $type: "color", $value: "{color.a}" } } },
  });
  fs.writeFileSync(path.join(tokenDir, "semantic.light.tokens.json"), semantic);
  fs.writeFileSync(path.join(tokenDir, "semantic.dark.tokens.json"), semantic);
  assert.throws(() => buildTokens(dir), /não resolvido/i);
});
