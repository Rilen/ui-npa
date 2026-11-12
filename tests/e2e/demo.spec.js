import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.beforeEach(async ({ page }) => {
  await page.goto("/examples/requerimentos/");
});

test("a demonstração aplica o token primário", async ({ page }) => {
  const button = page.getByRole("link", { name: "Ver requerimentos" });
  await expect(button).toHaveCSS("background-color", "rgb(36, 70, 104)");
});

test("a sidebar recolhe, persiste e continua nomeada", async ({ page }) => {
  const sidebar = page.locator("#sidebar");
  const toggle = page.getByRole("button", { name: "Recolher menu" });
  await expect(page.getByRole("button", { name: "Fechar menu" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Painel" })).toHaveAttribute("aria-current", "page");

  const expanded = await sidebar.boundingBox();
  expect(expanded.width).toBeGreaterThan(200);

  await toggle.click();
  await expect(page.getByRole("button", { name: "Expandir menu" })).toHaveAttribute("aria-expanded", "false");
  await expect(page.getByRole("link", { name: "Painel" })).toBeVisible();
  const collapsed = await sidebar.boundingBox();
  expect(collapsed.width).toBeLessThan(80);

  await page.reload();
  await expect(page.getByRole("button", { name: "Expandir menu" })).toBeVisible();
  const persisted = await page.locator("#sidebar").boundingBox();
  expect(persisted.width).toBeLessThan(80);

  await page.getByRole("button", { name: "Expandir menu" }).click();
  await page.reload();
  await expect(page.getByRole("button", { name: "Recolher menu" })).toBeVisible();
});

test("o teclado percorre a navegação e mantém foco visível", async ({ page }) => {
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Ir para o conteúdo" })).toBeFocused();
  await page.keyboard.press("Tab");
  const painel = page.getByRole("link", { name: "Painel" });
  await expect(painel).toBeFocused();
  const outline = await painel.evaluate((element) => getComputedStyle(element).outlineStyle);
  expect(outline).not.toBe("none");
  const nav = page.getByRole("navigation", { name: "Seções da demonstração" });
  await page.keyboard.press("ArrowDown");
  await expect(nav.getByRole("link", { name: "Requerimentos", exact: true })).toBeFocused();
  await page.keyboard.press("End");
  await expect(nav.getByRole("link", { name: "Situações", exact: true })).toBeFocused();
  await page.keyboard.press("Home");
  await expect(painel).toBeFocused();
});

test("no mobile a navegação é temporária e fecha com Escape", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByRole("button", { name: "Abrir menu" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Painel" })).toHaveCount(0);

  await page.getByRole("button", { name: "Abrir menu" }).click();
  await expect(page.getByRole("link", { name: "Painel" })).toBeFocused();
  await expect(page.getByRole("button", { name: "Fechar menu" })).toHaveAttribute("aria-expanded", "true");

  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Abrir menu" })).toBeFocused();
  await expect(page.getByRole("link", { name: "Painel" })).toHaveCount(0);
});

test("a tabela rola na largura estreita e a pesquisa filtra", async ({ page }) => {
  await page.getByRole("link", { name: "Requerimentos", exact: true }).click();
  await page.getByLabel("Pesquisar requerimentos").fill("poda");
  await expect(page.getByText("2 requerimentos encontrados.")).toBeVisible();
  await expect(page.getByRole("cell", { name: "Ana Ribeiro" })).toBeVisible();
  await expect(page.getByRole("cell", { name: "Paulo Vieira" })).toBeHidden();

  await page.setViewportSize({ width: 390, height: 844 });
  const overflows = await page.locator(".iui-table-wrap").evaluate((element) => element.scrollWidth > element.clientWidth);
  expect(overflows).toBeTruthy();
});

test("o formulário valida e a ação destrutiva é apenas simulada", async ({ page }) => {
  await page.getByRole("link", { name: "Novo requerimento" }).click();
  await page.getByRole("button", { name: "Registrar requerimento" }).click();
  await expect(page.getByText("Informe o nome do requerente.")).toBeVisible();
  await expect(page.locator("#requerente")).toHaveAttribute("aria-invalid", "true");

  await page.getByLabel("Nome do requerente (obrigatório)").fill("Exemplo Silva");
  await page.getByLabel("Assunto (obrigatório)").selectOption("poda");
  await page.getByRole("button", { name: "Registrar requerimento" }).click();
  await expect(page.getByText("Registro simulado")).toBeVisible();

  await page.getByRole("link", { name: "Situações", exact: true }).click();
  await page.getByRole("button", { name: "Arquivar exemplo" }).click();
  await expect(page.getByText("Nenhum registro foi alterado.")).toBeVisible();
});

test("o tema escuro experimental troca o token de ação", async ({ page }) => {
  await page.locator(".iui-root").evaluate((element) => element.setAttribute("data-iui-theme", "dark"));
  await expect(page.getByRole("link", { name: "Ver requerimentos" })).toHaveCSS("background-color", "rgb(47, 88, 132)");
});

test("a demonstração não tem violações críticas ou graves do axe", async ({ page }) => {
  const desktop = await new AxeBuilder({ page }).analyze();
  const serious = desktop.violations.filter((violation) => violation.impact === "serious" || violation.impact === "critical");
  expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Abrir menu" }).click();
  const mobile = await new AxeBuilder({ page }).analyze();
  const mobileSerious = mobile.violations.filter((violation) => violation.impact === "serious" || violation.impact === "critical");
  expect(mobileSerious, JSON.stringify(mobileSerious, null, 2)).toEqual([]);
});

test("regressão visual básica do painel", async ({ page }) => {
  await expect(page).toHaveScreenshot("painel-desktop.png", {
    fullPage: false,
    maxDiffPixelRatio: 0.01,
  });
});
