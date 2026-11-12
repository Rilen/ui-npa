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
});

test("o CSS commitado corresponde à fonte canônica", () => {
  const generated = buildTokens().css.replaceAll("\r\n", "\n");
  const committed = fs.readFileSync(path.join(root, "packages/styles/tokens.css"), "utf8").replaceAll("\r\n", "\n");
  assert.equal(committed, generated);
});

test("tokens semânticos não carregam cor literal", () => {
  for (const file of ["semantic.light.tokens.json", "semantic.dark.tokens.json"]) {
    const source = fs.readFileSync(path.join(root, "packages/tokens", file), "utf8");
    assert.equal(source.includes("#"), false, file);
  }
});

test("a paleta é identificada como provisória", () => {
  const primitive = fs.readFileSync(path.join(root, "packages/tokens/primitive.tokens.json"), "utf8");
  const css = fs.readFileSync(path.join(root, "packages/styles/tokens.css"), "utf8");
  assert.match(primitive, /provisória/i);
  assert.match(css, /provisória/i);
  assert.match(css, /--iui-color-action-primary-bg:/);
  assert.match(css, /--iui-size-sidebar-collapsed:/);
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
