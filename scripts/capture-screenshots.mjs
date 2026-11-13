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
  "007": {
    output: "docs/evidence/ui-npa-007",
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
      { file: "04-mobile-390.png", viewport: { width: 390, height: 844 } },
      { file: "05-mobile-320.png", viewport: { width: 320, height: 700 } },
      { file: "06-institution.png", viewport: { width: 1440, height: 900 }, element: ".iui-institution" },
      {
        file: "07-components.png",
        viewport: { width: 1440, height: 900 },
        prepare: async (page) => {
          await page.getByRole("link", { name: "Requerimentos", exact: true }).click();
          await page.locator("#requerimentos").waitFor({ state: "visible" });
        },
        element: "#conteudo",
      },
      { file: "08-footer.png", viewport: { width: 1440, height: 900 }, element: ".iui-footer" },
      { file: "09-about.png", viewport: { width: 1440, height: 900 }, hash: "#sobre" },
    ],
  },
  "008": {
    output: "docs/evidence/ui-npa-008",
    captures: [
      { file: "01-consumer-desktop.png", viewport: { width: 1440, height: 900 }, url: "/tests/fixtures/consumer-vanilla/" },
      { file: "02-consumer-mobile.png", viewport: { width: 390, height: 844 }, url: "/tests/fixtures/consumer-vanilla/" },
      {
        file: "03-sidebar-expanded.png",
        viewport: { width: 1440, height: 900 },
        url: "/tests/fixtures/consumer-vanilla/",
        element: ".iui-sidebar",
      },
      {
        file: "04-sidebar-collapsed.png",
        viewport: { width: 1440, height: 900 },
        url: "/tests/fixtures/consumer-vanilla/",
        prepare: async (page) => {
          await page.getByRole("button", { name: "Recolher menu" }).click();
          await page.waitForFunction(() => document.querySelector("#consumer-sidebar")?.dataset.collapsed === "true");
        },
        element: ".iui-sidebar",
      },
      {
        file: "05-institution.png",
        viewport: { width: 1440, height: 900 },
        url: "/tests/fixtures/consumer-vanilla/",
        element: ".iui-institution",
      },
      {
        file: "06-components.png",
        viewport: { width: 1440, height: 900 },
        url: "/tests/fixtures/consumer-vanilla/",
        element: ".fixture-components",
      },
      {
        file: "07-footer.png",
        viewport: { width: 1440, height: 900 },
        url: "/tests/fixtures/consumer-vanilla/",
        element: ".iui-footer",
      },
      {
        file: "08-legacy-css.png",
        viewport: { width: 1440, height: 900 },
        url: "/tests/fixtures/consumer-vanilla/conflito.html",
      },
    ],
  },
};

const setId = process.argv[2] || process.env.EVIDENCE_SET || "003";
const set = sets[setId];
if (!set) {
  throw new Error(`Conjunto de evidências desconhecido: ${setId}. Use 003, 005, 007 ou 008.`);
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
  if (item.hash) targetUrl.hash = item.hash;
  await page.goto(targetUrl.href, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
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
