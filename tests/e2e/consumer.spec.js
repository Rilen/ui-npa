import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(fileURLToPath(new URL("../..", import.meta.url)));
const fixture = "/tests/fixtures/consumer-vanilla/";
const vendorManifest = path.join(root, "tests/fixtures/consumer-vanilla/.vendor/manifest.json");

test.setTimeout(120000);

test.beforeAll(() => {
  execFileSync(process.execPath, [path.join(root, "scripts/prepare-consumer-fixture.mjs")], {
    cwd: root,
    stdio: "pipe",
  });
});

function primary(page) {
  return page.locator(".iui-button--primary").first();
}

test("o consumidor isolado usa o pacote público e a paleta oficial", async ({ page }) => {
  const requests = [];
  page.on("request", (request) => requests.push(request.url()));
  await page.goto(fixture);

  await expect(page.getByRole("heading", { name: "Painel do consumidor" })).toBeVisible();
  await expect(primary(page)).toHaveCSS("background-color", "rgb(42, 75, 109)");
  await expect(page.locator("h1.iui-title")).toHaveCSS("color", "rgb(23, 27, 38)");
  await expect(page.locator("#consumer-protocolo")).toHaveCSS("background-color", "rgb(255, 255, 255)");
  await expect(page.locator("#consumer-protocolo")).toHaveCSS("border-color", "rgb(106, 115, 136)");

  await expect(page.getByText("Prefeitura de Exemplo").first()).toBeVisible();
  await expect(page.getByText("Secretaria de Serviços").first()).toBeVisible();
  await expect(page.getByText("Setor de Protocolo").first()).toBeVisible();
  await expect(page.locator(".iui-footer__identity")).toContainText("Sistema Consumidor");
  await expect(page.locator(".iui-footer [data-iui-app-version]")).toHaveText("2.1.0");
  await expect(page.locator("[data-iui-developer]")).toHaveText("Desenvolvido por NPA");
  await expect(page.locator(".iui-footer__links")).toContainText("Novidades");
  await expect(page.locator(".iui-footer__links")).toContainText("Sobre o sistema");
  await expect(page.locator("[data-iui-about]")).toContainText("Sistema Consumidor");
  await expect(page.locator("[data-iui-changelog]")).toContainText("Integração local validada");

  await expect(page.locator(".iui-card")).toHaveCount(8);
  await expect(page.locator(".iui-badge--success").first()).toBeVisible();
  await expect(page.locator(".iui-alert")).toBeVisible();
  await expect(page.locator("table.iui-table")).toBeVisible();

  expect(requests.some((url) => /\/examples\/|\/packages\//.test(new URL(url).pathname))).toBe(false);
  expect(requests.some((url) => url.includes("candidates.css"))).toBe(false);
  const origin = new URL(page.url()).origin;
  expect(requests.every((url) => new URL(url).origin === origin)).toBe(true);

  const manifest = JSON.parse(fs.readFileSync(vendorManifest, "utf8"));
  const packageJson = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
  expect(manifest.package).toBe("ui-npa");
  expect(manifest.version).toBe(packageJson.version);
  expect(manifest.installedFrom).toBe("local tarball");
  expect(manifest.publicFiles).toContain("dist/index.css");
  expect(manifest.publicFiles).toContain("dist/sidebar.js");
  expect(manifest.publicFiles).toContain("dist/identity.js");
  expect(manifest.publicFiles.every((file) => file.startsWith("dist/"))).toBe(true);
  expect(manifest.publicFiles.some((file) => /UI-NPA-003|examples\/|tests\/|docs\/|scripts\//.test(file))).toBe(false);
  expect(manifest.tarballFiles).toContain("package.json");
  expect(manifest.tarballFiles).toContain("README.md");
  expect(manifest.tarballFiles).toContain("CHANGELOG.md");
  expect(manifest.tarballFiles.some((file) => /UI-NPA-003|examples\/|tests\/|docs\/|scripts\//.test(file))).toBe(false);
  expect(manifest.exports).toEqual(packageJson.exports);

  const accessibility = await new AxeBuilder({ page }).analyze();
  const serious = accessibility.violations.filter((violation) => violation.impact === "serious" || violation.impact === "critical");
  expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
});

test("a sidebar do consumidor expande, recolhe e persiste", async ({ page }) => {
  await page.goto(fixture);
  const sidebar = page.locator("#consumer-sidebar");
  const toggle = page.getByRole("button", { name: "Recolher menu" });
  const expanded = await sidebar.boundingBox();
  expect(expanded.width).toBeGreaterThan(200);

  await toggle.click();
  await expect(page.getByRole("button", { name: "Expandir menu" })).toBeVisible();
  expect((await sidebar.boundingBox()).width).toBeLessThan(100);

  await page.reload();
  expect((await sidebar.boundingBox()).width).toBeLessThan(100);
  await page.getByRole("button", { name: "Expandir menu" }).click();
  await expect(page.getByRole("button", { name: "Recolher menu" })).toBeVisible();
  expect((await sidebar.boundingBox()).width).toBeGreaterThan(200);
});

test("a sidebar móvel fecha com Escape e não cria rolagem horizontal", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto(fixture);
  await expect(page.getByRole("heading", { name: "Painel do consumidor" })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)).toBe(false);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(fixture);
  const toggle = page.getByRole("button", { name: "Abrir menu" });
  await expect(toggle).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)).toBe(false);

  await toggle.click();
  await expect(page.getByRole("button", { name: "Fechar menu" })).toBeVisible();
  await expect(page.locator("#consumer-sidebar .iui-sidebar__link").first()).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(toggle).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)).toBe(false);

  const accessibility = await new AxeBuilder({ page }).analyze();
  const serious = accessibility.violations.filter((violation) => violation.impact === "serious" || violation.impact === "critical");
  expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
});

test("o tema escuro experimental não altera o tema claro", async ({ page }) => {
  await page.goto(fixture);
  await expect(primary(page)).toHaveCSS("background-color", "rgb(42, 75, 109)");
  await page.locator(".iui-root").evaluate((element) => element.setAttribute("data-iui-theme", "dark"));
  await expect(primary(page)).toHaveCSS("background-color", "rgb(47, 88, 132)");
  await page.locator(".iui-root").evaluate((element) => element.removeAttribute("data-iui-theme"));
  await expect(primary(page)).toHaveCSS("background-color", "rgb(42, 75, 109)");
});

test("CSS legado em camada não sobrepõe os componentes", async ({ page }) => {
  await page.goto(fixture);
  await expect(page.locator("h1.iui-title")).toHaveCSS("color", "rgb(23, 27, 38)");
  await expect(page.locator("h1.iui-title")).toHaveCSS("font-family", /system-ui/);
  await expect(primary(page)).toHaveCSS("background-color", "rgb(42, 75, 109)");
  await expect(page.locator("#consumer-protocolo")).toHaveCSS("border-color", "rgb(106, 115, 136)");
});

test("CSS legado sem camada tem precedência sobre o pacote (limite documentado)", async ({ page }) => {
  await page.goto(`${fixture}conflito.html`);
  await expect(page.locator("h1.iui-title")).toHaveCSS("color", "rgb(176, 0, 32)");
  await expect(page.locator(".iui-button--primary")).toHaveCSS("background-color", "rgb(176, 0, 32)");
  await expect(page.locator("#conflito-campo")).toHaveCSS("border-color", "rgb(176, 0, 32)");
});
