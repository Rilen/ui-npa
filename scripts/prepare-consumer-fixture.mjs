import { spawnSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const fixtureDir = path.join(root, "tests", "fixtures", "consumer-vanilla");
const vendorDir = path.join(fixtureDir, ".vendor");
const reportFile = path.join(root, "docs", "evidence", "ui-npa-008", "09-package-install.txt");

function quote(value) {
  return `"${String(value).replaceAll('"', '""')}"`;
}

function runNpm(args, cwd) {
  const command = ["npm", ...args.map((value) => (/[\s"]/.test(value) ? quote(value) : value))].join(" ");
  const result = spawnSync(command, {
    cwd,
    encoding: "utf8",
    shell: true,
  });
  if (result.status !== 0) {
    throw new Error(`npm ${args.join(" ")} falhou.\n${result.stdout || ""}\n${result.stderr || ""}`);
  }
  return result.stdout;
}

function parsePackJson(output) {
  const start = output.indexOf("[");
  const end = output.lastIndexOf("]");
  if (start === -1 || end === -1) throw new Error("Saída JSON do npm pack não encontrada.");
  return JSON.parse(output.slice(start, end + 1))[0];
}

export async function prepareConsumerFixture({ report = false } = {}) {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), "ui-npa-consumer-"));
  try {
    const packOutput = runNpm(["pack", "--json", "--pack-destination", temp], root);
    const pack = parsePackJson(packOutput);
    const tarball = path.join(temp, pack.filename);
    if (!fs.existsSync(tarball)) throw new Error("Tarball local não encontrado.");

    const consumer = path.join(temp, "consumer");
    fs.mkdirSync(consumer, { recursive: true });
    fs.writeFileSync(path.join(consumer, "package.json"), JSON.stringify({
      name: "ui-npa-consumer-fixture",
      private: true,
      type: "module",
    }, null, 2));

    runNpm([
      "install",
      "--no-save",
      "--no-package-lock",
      "--ignore-scripts",
      "--no-audit",
      "--no-fund",
      tarball,
    ], consumer);

    const installed = path.join(consumer, "node_modules", "ui-npa");
    const installedPackage = JSON.parse(fs.readFileSync(path.join(installed, "package.json"), "utf8"));
    const dist = path.join(installed, "dist");
    if (!fs.existsSync(dist)) throw new Error("O pacote instalado não contém dist.");

    if (fs.existsSync(vendorDir)) fs.rmSync(vendorDir, { recursive: true, force: true });
    fs.cpSync(dist, vendorDir, { recursive: true });

    const publicFiles = pack.files.map((entry) => entry.path).filter((file) => file.startsWith("dist/"));
    const tarballFiles = pack.files.map((entry) => entry.path);
    const manifest = {
      package: installedPackage.name,
      version: installedPackage.version,
      tarball: pack.filename,
      installedFrom: "local tarball",
      exports: installedPackage.exports,
      publicFiles,
      tarballFiles,
    };
    fs.writeFileSync(path.join(vendorDir, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);

    if (report) {
      const sha256 = crypto.createHash("sha256").update(fs.readFileSync(tarball)).digest("hex");
      const lines = [
        "UI-NPA — instalação local do pacote",
        `Gerado em: ${new Date().toISOString()}`,
        `Node: ${process.version}`,
        `Pacote: ${installedPackage.name}@${installedPackage.version}`,
        `Tarball: ${pack.filename}`,
        `Tarball SHA-256: ${sha256}`,
        "Comando de instalação: npm install --no-save --no-package-lock --ignore-scripts --no-audit --no-fund <tarball>",
        "Status: PASS",
        "",
        "Entradas do tarball:",
        ...tarballFiles.map((file) => `- ${file}`),
        "",
        "Exports públicos:",
        ...Object.entries(installedPackage.exports).map(([key, value]) => `- ${key} -> ${value}`),
        "",
        "A fixture copiou somente o diretório dist do pacote instalado para tests/fixtures/consumer-vanilla/.vendor.",
        "Nenhum push, publicação npm ou deploy foi executado.",
        "",
      ];
      fs.mkdirSync(path.dirname(reportFile), { recursive: true });
      fs.writeFileSync(reportFile, lines.join("\n"));
    }

    return manifest;
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
}

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isDirectRun) {
  const manifest = await prepareConsumerFixture({ report: process.argv.includes("--report") });
  console.log(`Pacote público instalado: ${manifest.package}@${manifest.version}`);
  console.log(`Fixture: ${path.relative(root, vendorDir)}`);
}
