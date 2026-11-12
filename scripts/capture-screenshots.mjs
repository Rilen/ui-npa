import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const port = Number(process.env.PORT || 4173);
const serverUrl = process.env.BASE_URL || `http://127.0.0.1:${port}`;
const demoUrl = `${serverUrl.replace(/\/$/, "")}/examples/requerimentos/`;

const sets = {
  "003": {
    output: "docs/evidence/ui-npa-003",
    captures: [
      { file: "01-desktop-expanded.png", viewport: { width: 1440, height: 900 } },
      {
        file: "02-desktop-collapsed.png",
        viewport: { width: 1440, height: 900 },
        prepare: async (page) => {
          await page.getByRole("button", { name: "Recolher menu" }).click();
          await page.waitForFunction(() => document.querySelector("#sidebar")?.dataset.collapsed === "true");
        },
      },
      { file: "03-tablet.png", viewport: { width: 1024, height: 768 } },
      { file: "04-mobile.png", viewport: { width: 390, height: 844 } },
      {
        file: "05-mobile-menu.png",
        viewport: { width: 390, height: 844 },
        prepare: async (page) => {
          await page.getByRole("button", { name: "Abrir menu" }).click();
          await page.waitForFunction(() => document.querySelector(".iui-shell")?.dataset.open === "true");
        },
      },
      { file: "06-institution.png", viewport: { width: 1440, height: 900 }, element: ".iui-institution" },
      { file: "07-footer.png", viewport: { width: 1440, height: 900 }, element: ".iui-footer" },
      { file: "08-changelog.png", viewport: { width: 1440, height: 900 }, hash: "#changelog" },
      { file: "09-about.png", viewport: { width: 1440, height: 900 }, hash: "#sobre" },
    ],
  },
  "005": {
    output: "docs/evidence/ui-npa-005",
    captures: [
      { file: "01-desktop-expanded.png", viewport: { width: 1440, height: 900 } },
      {
        file: "02-desktop-collapsed.png",
        viewport: { width: 1440, height: 900 },
        prepare: async (page) => {
          await page.getByRole("button", { name: "Recolher menu" }).click();
          await page.waitForFunction(() => document.querySelector("#sidebar")?.dataset.collapsed === "true");
        },
      },
      { file: "03-tablet-indicators.png", viewport: { width: 1024, height: 768 } },
      { file: "04-mobile-390.png", viewport: { width: 390, height: 844 } },
      { file: "05-mobile-320.png", viewport: { width: 320, height: 700 } },
      { file: "06-mobile-institution.png", viewport: { width: 390, height: 844 }, element: ".iui-institution" },
      { file: "07-about-desktop.png", viewport: { width: 1440, height: 900 }, hash: "#sobre" },
      { file: "08-about-mobile.png", viewport: { width: 390, height: 1250 }, hash: "#sobre" },
    ],
  },
  "006": {
    output: "docs/evidence/ui-npa-006",
    captures: [
      { file: "01-candidate-a-desktop.png", viewport: { width: 1440, height: 900 }, query: { paleta: "a" } },
      { file: "02-candidate-b-desktop.png", viewport: { width: 1440, height: 900 }, query: { paleta: "b" } },
      { file: "03-candidate-c-desktop.png", viewport: { width: 1440, height: 900 }, query: { paleta: "c" } },
      {
        file: "04-sidebar-comparison.png",
        viewport: { width: 1440, height: 900 },
        url: "/examples/paletas/",
        element: "#comparacao-sidebar",
      },
      {
        file: "05-components-comparison.png",
        viewport: { width: 1440, height: 900 },
        url: "/examples/paletas/",
        element: "#comparacao-componentes",
      },
      { file: "06-candidate-a-mobile.png", viewport: { width: 390, height: 844 }, query: { paleta: "a" } },
      {
        file: "07-candidate-a-institution.png",
        viewport: { width: 1440, height: 900 },
        query: { paleta: "a" },
        element: ".iui-institution",
      },
      {
        file: "08-candidate-a-footer.png",
        viewport: { width: 1440, height: 900 },
        query: { paleta: "a" },
        element: ".iui-footer",
      },
    ],
  },
};

const setId = process.argv[2] || process.env.EVIDENCE_SET || "003";
const set = sets[setId];
if (!set) {
  throw new Error(`Conjunto de evidências desconhecido: ${setId}. Use 003, 005 ou 006.`);
}
const output = path.join(root, set.output);

let server = null;

async function isServing(url) {
  try {
    const response = await fetch(url);
    return response.ok;
  } catch {
    return false;
  }
}

async function waitForServer(url) {
  const deadline = Date.now() + 10000;
  while (Date.now() < deadline) {
    if (await isServing(url)) return;
    await new Promise((resolve) => setTimeout(resolve, 150));
  }
  throw new Error(`O servidor não respondeu em ${url}.`);
}

async function startServer() {
  if (await isServing(demoUrl)) return;
  server = spawn(process.execPath, [path.join(root, "scripts/serve.mjs")], {
    cwd: root,
    env: { ...process.env, PORT: String(port) },
    stdio: ["ignore", "ignore", "inherit"],
  });
  await waitForServer(demoUrl);
}

async function capture(browser, item) {
  const context = await browser.newContext({
    viewport: item.viewport,
    colorScheme: "light",
    reducedMotion: "reduce",
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  const targetUrl = new URL(item.url || demoUrl, serverUrl);
  if (item.query) {
    for (const [name, value] of Object.entries(item.query)) targetUrl.searchParams.set(name, value);
  }
  if (item.hash) targetUrl.hash = item.hash;
  await page.goto(targetUrl.href, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  if (item.query?.paleta) {
    await page.waitForFunction(
      (value) => document.querySelector(".iui-root")?.dataset.iuiCandidate === value,
      item.query.paleta,
    );
  }
  if (item.hash) {
    await page.locator(item.hash).waitFor({ state: "visible" });
  }
  if (item.prepare) await item.prepare(page);

  const target = item.element ? page.locator(item.element) : page;
  await target.screenshot({ path: path.join(output, item.file), animations: "disabled" });
  await context.close();
  console.log(`Capturado: ${item.file}`);
}

await startServer();
await fs.mkdir(output, { recursive: true });

const browser = await chromium.launch();
try {
  for (const item of set.captures) await capture(browser, item);
} finally {
  await browser.close();
  server?.kill();
}

console.log(`Evidências em ${path.relative(root, output)}.`);
