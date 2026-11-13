import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "..");
const packageJson = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));

test("o pacote declara a distribuição pública e exclui arquivos operacionais", () => {
  assert.equal(packageJson.version, "0.3.3");
  assert.equal(packageJson.license, "UNLICENSED");
  assert.deepEqual(packageJson.files, ["dist", "README.md", "CHANGELOG.md"]);
  assert.equal(packageJson.style, "./dist/index.css");
  assert.equal(packageJson.exports["./styles.css"], "./dist/index.css");
  assert.equal(packageJson.exports["./tokens.css"], "./dist/tokens.css");
  assert.equal(packageJson.exports["./sidebar.js"], "./dist/sidebar.js");
  assert.equal(packageJson.exports["./identity.js"], "./dist/identity.js");
  assert.match(packageJson.scripts.build, /build-package/);
  assert.match(packageJson.scripts.prepack, /npm run build/);
  assert.match(packageJson.scripts.prepare, /npm run build/);
});

test("a fixture isolada usa apenas os artefatos públicos e a camada legada", () => {
  const fixtureDir = path.join(root, "tests/fixtures/consumer-vanilla");
  const html = fs.readFileSync(path.join(fixtureDir, "index.html"), "utf8");
  const app = fs.readFileSync(path.join(fixtureDir, "app.js"), "utf8");
  const layers = fs.readFileSync(path.join(fixtureDir, "fixture.css"), "utf8");
  assert.match(html, /\.vendor\/index\.css/);
  assert.match(app, /\.vendor\/sidebar\.js/);
  assert.match(app, /\.vendor\/identity\.js/);
  assert.equal(/examples\/|packages\//.test(html + app), false);
  assert.match(layers, /@layer legacy, consumer, iui\.tokens/);
});

test("os artefatos gerados e o tarball local estão fora do Git", () => {
  const ignore = fs.readFileSync(path.join(root, ".gitignore"), "utf8");
  assert.match(ignore, /^dist\/$/m);
  assert.match(ignore, /consumer-vanilla\/\.vendor\//);
  assert.match(ignore, /^\*\.tgz$/m);
});
