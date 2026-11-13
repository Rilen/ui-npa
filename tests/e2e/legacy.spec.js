import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(fileURLToPath(new URL("../..", import.meta.url)));
const base = "/tests/fixtures/consumer-legacy/";
const stateUrl = (state) => `${base}estado-${state}.html`;

test.setTimeout(120000);

test.beforeAll(() => {
  execFileSync(process.execPath, [path.join(root, "scripts/prepare-consumer-fixture.mjs")], {
    cwd: root,
    stdio: "pipe",
  });
});

async function hasOverflow(page) {
  return page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
}

async function fillForm(page, name = "Servidor Fictício") {
  await page.getByLabel("Nome").fill(name);
  await page.getByLabel("E-mail").fill("servidor@example.invalid");
  await page.getByLabel("Protocolo", { exact: true }).fill("PROT-2026-0099");
}

test("estado A permanece legado e não carrega o pacote UI-NPA", async ({ page }) => {
  const requests = [];
  page.on("request", (request) => requests.push(request.url()));
  await page.goto(stateUrl("a"));

  await expect(page.locator("body")).toHaveAttribute("data-state", "a");
  await expect(page.locator(".iui-root")).toHaveCount(0);
  await expect(page.locator(".legacy-header")).toHaveCSS("background-color", "rgb(31, 63, 95)");
  await expect(page.locator(".legacy-button--primary")).toHaveCSS("background-color", "rgb(35, 66, 95)");
  expect(await page.locator("h1").evaluate((element) => getComputedStyle(element).fontFamily)).toContain("Georgia");
  await expect(page.locator("[data-pilot-rows] tr")).toHaveCount(3);

  expect(requests.some((url) => url.includes(".vendor"))).toBe(false);
  expect(requests.some((url) => /\/examples\/|\/packages\//.test(new URL(url).pathname))).toBe(false);
  expect(await hasOverflow(page)).toBe(false);
});

test("estado B mantém legado e UI-NPA em convivência", async ({ page }) => {
  await page.goto(stateUrl("b"));
  await expect(page.locator(".iui-root")).toHaveCount(1);
  await expect(page.locator("[data-iui-slot='municipality'] [data-iui-label]")).toHaveText("Prefeitura Piloto");
  await expect(page.locator("[data-iui-slot='department'] [data-iui-label]")).toHaveText("Secretaria de Administração");
  await expect(page.locator("[data-iui-slot='sector'] [data-iui-label]")).toHaveText("Setor de Protocolo");
  await expect(page.locator(".iui-root .iui-button--primary")).toHaveCSS("background-color", "rgb(42, 75, 109)");
  await expect(page.locator(".legacy-button--primary")).toHaveCSS("background-color", "rgb(35, 66, 95)");
  await expect(page.locator(".legacy-header")).toHaveCSS("background-color", "rgb(31, 63, 95)");
  await expect(page.locator("[data-pilot-rows] tr")).toHaveCount(3);
  expect(await hasOverflow(page)).toBe(false);

  await page.getByRole("button", { name: "Atualizar mensagem" }).click();
  await expect(page.locator("[data-pilot-ui-feedback] p").last()).toHaveText("Mensagem atualizada no contexto legado.");
});

test("estado C migra o conteúdo principal e preserva a moldura legada", async ({ page }) => {
  await page.goto(stateUrl("c"));

  await expect(page.locator(".iui-root")).toHaveCount(1);
  await expect(page.locator(".legacy-header")).toHaveCSS("background-color", "rgb(31, 63, 95)");
  await expect(page.locator(".legacy-footer")).toHaveCSS("background-color", "rgb(31, 63, 95)");
  await expect(page.locator(".iui-root .iui-button--primary")).toHaveCSS("background-color", "rgb(42, 75, 109)");
  await expect(page.locator("[data-iui-slot='sector'] [data-iui-label]")).toHaveText("Setor de Protocolo");
  await expect(page.locator(".iui-table")).toHaveCSS("border-top-width", "0px");
  await expect(page.locator("[data-pilot-rows] tr")).toHaveCount(3);
  expect(await page.locator("h1").evaluate((element) => getComputedStyle(element).fontFamily)).toContain("Georgia");
  expect(await hasOverflow(page)).toBe(false);
});

test("os estados com UI-NPA usam apenas o artefato instalado", async ({ page }) => {
  for (const state of ["b", "c"]) {
    const requests = [];
    const handler = (request) => requests.push(request.url());
    page.on("request", handler);
    await page.goto(stateUrl(state));
    expect(requests.some((url) => url.includes(".vendor/"))).toBe(true);
    expect(requests.some((url) => /\/examples\/|\/packages\//.test(new URL(url).pathname))).toBe(false);
    page.off("request", handler);
  }
});

test("os três estados preservam os fluxos essenciais", async ({ page }) => {
  for (const state of ["a", "b", "c"]) {
    await page.goto(stateUrl(state));
    await page.getByRole("button", { name: "Limpar" }).click();
    await expect(page.locator("[data-pilot-feedback]")).toBeHidden();

    await page.getByRole("link", { name: "Protocolos", exact: true }).click();
    await expect(page).toHaveURL(/#table$/);
    await expect(page.locator("#table")).toBeVisible();
    await page.getByRole("link", { name: "Atendimento", exact: true }).click();
    await expect(page).toHaveURL(/#form$/);

    await page.getByRole("button", { name: "Registrar" }).click();
    await expect(page.locator("[data-pilot-error]")).toBeVisible();
    await expect(page.locator("[data-pilot-error]")).toContainText("Informe nome e e-mail");

    await fillForm(page, `Servidor ${state.toUpperCase()}`);
    await page.getByRole("button", { name: "Registrar" }).click();
    await expect(page.locator("[data-pilot-feedback]")).toBeVisible();
    await expect(page.locator("[data-pilot-feedback]")).toContainText(`Servidor ${state.toUpperCase()}`);

    await page.getByLabel("Filtrar protocolos").fill("Poda");
    await expect(page.locator("[data-pilot-rows] tr")).toHaveCount(1);
    await page.getByLabel("Filtrar protocolos").fill("");
    await expect(page.locator("[data-pilot-rows] tr")).toHaveCount(3);
  }
});

test("os três estados são operáveis por teclado", async ({ page }) => {
  for (const state of ["a", "b", "c"]) {
    await page.goto(stateUrl(state));
    await page.getByRole("button", { name: "Limpar" }).click();
    await page.getByLabel("Nome").focus();
    await page.keyboard.type(`Teclado ${state.toUpperCase()}`);
    await page.keyboard.press("Tab");
    await page.keyboard.type(`teclado-${state}@example.invalid`);
    await page.keyboard.press("Tab");
    await page.keyboard.type("PROT-2026-0098");
    await page.keyboard.press("Enter");
    await expect(page.locator("[data-pilot-feedback]")).toBeVisible();
    await expect(page.locator("[data-pilot-feedback]")).toContainText(`Teclado ${state.toUpperCase()}`);
  }
});

test("a migração é reversível sem perda de dados", async ({ page }) => {
  await page.goto(stateUrl("c"));
  await fillForm(page, "Servidor Reversível");
  await page.getByLabel("Filtrar protocolos").fill("Poda");
  await page.locator("[data-state-link='a']").click();
  await expect(page.locator("body")).toHaveAttribute("data-state", "a");
  await expect(page.getByLabel("Nome")).toHaveValue("Servidor Reversível");
  await expect(page.getByLabel("Filtrar protocolos")).toHaveValue("Poda");
  await expect(page.locator("[data-pilot-rows] tr")).toHaveCount(1);

  await page.locator("[data-state-link='b']").click();
  await expect(page.getByLabel("Nome")).toHaveValue("Servidor Reversível");
  await page.locator("[data-state-link='c']").click();
  await expect(page.getByLabel("Nome")).toHaveValue("Servidor Reversível");
  await expect(page.locator("[data-pilot-rows] tr")).toHaveCount(1);
});

test("CSS legado sem camada quebra o contrato; a camada anterior mitiga", async ({ page }) => {
  await page.goto(`${base}conflito.html`);
  await expect(page.locator(".iui-button--primary")).toHaveCSS("background-color", "rgb(176, 0, 32)");
  await expect(page.locator("h1.iui-title")).toHaveCSS("color", "rgb(176, 0, 32)");
  await expect(page.locator("#conflito-campo")).toHaveCSS("border-color", "rgb(176, 0, 32)");
  await expect(page.locator(".iui-table")).toHaveCSS("border-top-color", "rgb(176, 0, 32)");

  await page.goto(`${base}conflito-mitigado.html`);
  await expect(page.locator(".iui-button--primary")).toHaveCSS("background-color", "rgb(42, 75, 109)");
  await expect(page.locator("h1.iui-title")).toHaveCSS("color", "rgb(23, 27, 38)");
  await expect(page.locator("#conflito-campo")).toHaveCSS("border-color", "rgb(106, 115, 136)");
  await expect(page.locator(".iui-table")).toHaveCSS("border-top-width", "0px");
});

test("os três estados respondem nas larguras do piloto", async ({ page }) => {
  for (const state of ["a", "b", "c"]) {
    await page.goto(stateUrl(state));
    for (const width of [1440, 1024, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 900 });
      expect(await hasOverflow(page), `${state} em ${width}px`).toBe(false);
      await expect(page.locator(".legacy-title")).toBeVisible();
    }
  }
});

test("os três estados não têm violações graves no axe", async ({ page }) => {
  for (const state of ["a", "b", "c"]) {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(stateUrl(state));
    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter((violation) => violation.impact === "serious" || violation.impact === "critical");
    expect(serious, `${state}: ${JSON.stringify(serious, null, 2)}`).toEqual([]);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(stateUrl("c"));
  const mobile = await new AxeBuilder({ page }).analyze();
  const serious = mobile.violations.filter((violation) => violation.impact === "serious" || violation.impact === "critical");
  expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
});
