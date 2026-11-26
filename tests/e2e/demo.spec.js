import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.beforeEach(async ({ page }) => {
  await page.goto("/examples/requerimentos/");
});

test("a demonstração aplica o token primário", async ({ page }) => {
  const button = page.getByRole("link", { name: "Ver requerimentos" });
  await expect(button).toHaveCSS("background-color", "rgb(42, 75, 109)");
});

test("a sidebar percorre os três estados, persiste e continua nomeada", async ({ page }) => {
  const sidebar = page.locator("#sidebar");
  const painel = page.getByRole("link", { name: "Painel" });
  await expect(page.getByRole("button", { name: "Fechar menu" })).toHaveCount(0);
  await expect(painel).toHaveAttribute("aria-current", "page");

  const expanded = await sidebar.boundingBox();
  expect(expanded.width).toBeGreaterThan(200);
  await expect(page.getByRole("button", { name: "Compactar menu" })).toHaveAttribute("aria-expanded", "true");

  // Expandido → Compacto: somente ícones, largura reduzida, item atual mantido.
  await page.getByRole("button", { name: "Compactar menu" }).click();
  await expect(page.getByRole("button", { name: "Ocultar menu" })).toHaveAttribute("aria-expanded", "true");
  await expect(painel).toBeVisible();
  const compact = await sidebar.boundingBox();
  expect(compact.width).toBeLessThan(80);

  // Persistência do estado compacto após recarregar.
  await page.reload();
  await expect(page.getByRole("button", { name: "Ocultar menu" })).toBeVisible();
  expect((await page.locator("#sidebar").boundingBox()).width).toBeLessThan(80);

  // Compacto → Oculto: sai do fluxo, sem coluna residual, fora da árvore acessível.
  await page.getByRole("button", { name: "Ocultar menu" }).click();
  await expect(page.getByRole("button", { name: "Expandir menu" })).toHaveAttribute("aria-expanded", "false");
  await expect(painel).toHaveCount(0);
  const hidden = await sidebar.boundingBox();
  expect(hidden === null || hidden.width < 1).toBe(true);

  // Oculto → Expandido: restaura a largura e a navegação.
  await page.getByRole("button", { name: "Expandir menu" }).click();
  await page.reload();
  await expect(page.getByRole("button", { name: "Compactar menu" })).toBeVisible();
  expect((await page.locator("#sidebar").boundingBox()).width).toBeGreaterThan(200);
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

test("a demonstração não tem violações críticas, graves ou de região no axe", async ({ page }) => {
  const desktop = await new AxeBuilder({ page }).analyze();
  const desktopProblems = desktop.violations.filter((violation) => violation.impact === "serious" || violation.impact === "critical" || violation.id === "region");
  expect(desktopProblems, JSON.stringify(desktopProblems, null, 2)).toEqual([]);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Abrir menu" }).click();
  const mobile = await new AxeBuilder({ page }).analyze();
  const mobileProblems = mobile.violations.filter((violation) => violation.impact === "serious" || violation.impact === "critical" || violation.id === "region");
  expect(mobileProblems, JSON.stringify(mobileProblems, null, 2)).toEqual([]);
});

test("regressão visual básica do painel", async ({ page }) => {
  await expect(page).toHaveScreenshot("painel-desktop.png", {
    fullPage: false,
    maxDiffPixelRatio: 0.01,
  });
});
