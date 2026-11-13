import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const source = path.join(root, "packages", "styles");
const destination = path.join(root, "dist");

if (fs.existsSync(destination)) fs.rmSync(destination, { recursive: true, force: true });
fs.mkdirSync(destination, { recursive: true });

for (const entry of fs.readdirSync(source)) {
  fs.cpSync(path.join(source, entry), path.join(destination, entry), { recursive: true });
}

for (const required of ["index.css", "tokens.css", "sidebar.js", "identity.js"]) {
  if (!fs.existsSync(path.join(destination, required))) {
    throw new Error(`Artefato público ausente: ${required}`);
  }
}

console.log(`Gerado ${path.relative(root, destination)}.`);
