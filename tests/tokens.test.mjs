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
  assert.equal(first.candidatesCss, second.candidatesCss);
});

test("o CSS commitado corresponde à fonte canônica", () => {
  const generated = buildTokens().css.replaceAll("\r\n", "\n");
  const committed = fs.readFileSync(path.join(root, "packages/styles/tokens.css"), "utf8").replaceAll("\r\n", "\n");
  assert.equal(committed, generated);
});

test("o CSS de candidatos commitado corresponde à fonte canônica", () => {
  const generated = buildTokens().candidatesCss.replaceAll("\r\n", "\n");
  const committed = fs.readFileSync(path.join(root, "packages/styles/candidates.css"), "utf8").replaceAll("\r\n", "\n");
  assert.equal(committed, generated);
});

test("os três candidatos existem e têm a mesma estrutura do tema claro", () => {
  const model = buildTokens();
  assert.deepEqual(Object.keys(model.candidates).sort(), ["a", "b", "c"]);
  const lightKeys = Object.keys(model.light).sort();
  for (const candidate of Object.values(model.candidates)) {
    assert.deepEqual(Object.keys(candidate).sort(), lightKeys);
  }
  assert.match(model.candidatesCss, /data-iui-candidate="a"/);
  assert.match(model.candidatesCss, /data-iui-candidate="b"/);
  assert.match(model.candidatesCss, /data-iui-candidate="c"/);
  assert.match(model.candidatesCss, /não homologados/i);
});

test("tokens semânticos não carregam cor literal", () => {
  for (const file of [
    "semantic.light.tokens.json",
    "semantic.dark.tokens.json",
    "semantic.candidate-a.tokens.json",
    "semantic.candidate-b.tokens.json",
    "semantic.candidate-c.tokens.json",
  ]) {
    const source = fs.readFileSync(path.join(root, "packages/tokens", file), "utf8");
    assert.equal(source.includes("#"), false, file);
  }
});

test("a paleta é identificada como provisória", () => {
  const primitive = fs.readFileSync(path.join(root, "packages/tokens/primitive.tokens.json"), "utf8");
  const css = fs.readFileSync(path.join(root, "packages/styles/tokens.css"), "utf8");
  const candidates = fs.readFileSync(path.join(root, "packages/styles/candidates.css"), "utf8");
  assert.match(primitive, /provisória/i);
  assert.match(css, /provisória/i);
  assert.match(candidates, /não homologados/i);
  assert.match(css, /--iui-color-action-primary-bg:/);
  assert.match(css, /--iui-size-sidebar-collapsed:/);
});

test("os candidatos ficam restritos à demonstração", () => {
  const index = fs.readFileSync(path.join(root, "packages/styles/index.css"), "utf8");
  const demo = fs.readFileSync(path.join(root, "examples/requerimentos/index.html"), "utf8");
  assert.equal(index.includes("candidates.css"), false);
  assert.match(demo, /candidates\.css/);
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
