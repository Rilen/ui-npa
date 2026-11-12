import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { assertInstitutionalIdentity } from "../packages/styles/identity.js";

const root = path.resolve(import.meta.dirname, "..");
const demo = {
  municipality: { name: "Prefeitura Municipal de Exemplo", logo: "./assets/prefeitura.svg", logoAlt: "Marca de demonstração" },
  department: { name: "Secretaria Municipal de Exemplo", logo: "./assets/secretaria.svg", logoAlt: "Marca de demonstração" },
  sector: { name: "Setor de Atendimento", logo: "./assets/setor.svg", logoAlt: "Marca de demonstração" },
  application: {
    name: "Gestão de Requerimentos",
    version: "1.4.0",
    developer: "NPA",
    changelog: [{ version: "1.4.0", date: "2026-11-12", notes: ["Registro sintético."] }],
  },
};

test("rejeita identidade incompleta", () => {
  assert.throws(() => assertInstitutionalIdentity({}), /municipality/i);
  assert.throws(() => assertInstitutionalIdentity({ ...demo, application: { name: "A", version: "1", developer: "NPA" } }), /changelog/i);
});

test("aceita o contrato mínimo da demonstração", () => {
  assert.equal(assertInstitutionalIdentity(demo).application.version, "1.4.0");
});

test("o núcleo não embute marcas e a demonstração usa ativos locais", () => {
  const styles = fs.readFileSync(path.join(root, "packages/styles/identity.js"), "utf8");
  assert.equal(styles.includes("http"), false);
  for (const file of ["prefeitura.svg", "secretaria.svg", "setor.svg"]) {
    assert.equal(fs.existsSync(path.join(root, "examples/requerimentos/assets", file)), true, file);
  }
  const app = fs.readFileSync(path.join(root, "examples/requerimentos/app.js"), "utf8");
  assert.match(app, /Prefeitura Municipal de Exemplo/);
  assert.doesNotMatch(app, /Prefeitura Municipal de (?!Exemplo)/);
  const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
  assert.match(app, new RegExp(pkg.version));
  assert.notEqual(pkg.version, "1.4.0");
});
