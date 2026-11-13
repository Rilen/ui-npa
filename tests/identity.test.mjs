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

test("aceita changelogUrl e designSystem opcional", () => {
  const { changelog, ...application } = demo.application;
  const value = assertInstitutionalIdentity({
    ...demo,
    application: { ...application, changelogUrl: "https://example.invalid/novidades" },
  });
  assert.equal(value.application.changelogUrl, "https://example.invalid/novidades");
  assert.equal(value.designSystem, undefined);
  assert.throws(
    () => assertInstitutionalIdentity({ ...demo, application: { ...application, changelog: [{ version: "1.4.0" }] } }),
    /changelog/i,
  );
});

test("o núcleo não embute marcas e a demonstração usa ativos locais", () => {
  const styles = fs.readFileSync(path.join(root, "packages/styles/identity.js"), "utf8");
  for (const asset of ["prefeitura.svg", "secretaria.svg", "setor.svg"]) {
    assert.equal(styles.includes(asset), false, asset);
  }
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

test("aceita URLs relativas, HTTP(S) e data:image para logomarcas", () => {
  for (const logo of ["./assets/marca.svg", "/assets/marca.svg", "https://example.invalid/marca.svg", "http://example.invalid/marca.svg", "data:image/svg+xml,%3Csvg%2F%3E"]) {
    const value = JSON.parse(JSON.stringify(demo));
    value.municipality.logo = logo;
    assert.equal(assertInstitutionalIdentity(value).municipality.logo, logo);
  }
});

test("rejeita esquemas perigosos ou inválidos em logomarcas", () => {
  for (const logo of ["javascript:alert(1)", "data:text/html,<script>", "file:///C:/marca.svg", "C:\\marca.svg", "ftp://example.invalid/marca.svg", "https://[invalido"]) {
    const value = JSON.parse(JSON.stringify(demo));
    value.municipality.logo = logo;
    assert.throws(() => assertInstitutionalIdentity(value), /logo/i, logo);
  }
});

test("valida o esquema do changelogUrl", () => {
  const { changelog, ...application } = demo.application;
  for (const url of ["#changelog", "./novidades", "/novidades", "https://example.invalid/novidades", "http://example.invalid/novidades"]) {
    const value = { ...demo, application: { ...application, changelogUrl: url } };
    assert.equal(assertInstitutionalIdentity(value).application.changelogUrl, url);
  }
  for (const url of ["javascript:alert(1)", "data:text/html,<script>", "file:///C:/novidades", "https://[invalido]"]) {
    assert.throws(
      () => assertInstitutionalIdentity({ ...demo, application: { ...application, changelogUrl: url } }),
      /changelogUrl/i,
      url,
    );
  }
});
