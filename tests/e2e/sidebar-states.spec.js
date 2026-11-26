import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(fileURLToPath(new URL("../..", import.meta.url)));
const demo = "/examples/requerimentos/";
const consumer = "/tests/fixtures/consumer-vanilla/";
const storageKey = "ui-npa-demo-sidebar";

test.setTimeout(120000);

test.beforeAll(() => {
  execFileSync(process.execPath, [path.join(root, "scripts/prepare-consumer-fixture.mjs")], {
    cwd: root,
    stdio: "pipe",
  });
});

async function hasHorizontalOverflow(page) {
  return page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
}

async function sidebarWidth(page) {
  const box = await page.locator("#sidebar").boundingBox();
  return box === null ? 0 : box.width;
}

test("1. transição expandido → compacto reduz a largura e mantém o item atual", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(demo);
  expect(await sidebarWidth(page)).toBeGreaterThan(200);
  await expect(page.locator("#sidebar")).toHaveAttribute("data-state", "expanded");

  await page.getByRole("button", { name: "Compactar menu" }).click();
  await expect(page.locator("#sidebar")).toHaveAttribute("data-state", "compact");
  expect(await sidebarWidth(page)).toBeLessThan(80);
  await expect(page.getByRole("link", { name: "Painel" })).toHaveAttribute("aria-current", "page");
  await expect(page.getByRole("link", { name: "Painel" })).toBeVisible();
});

test("2. transição compacto → oculto remove a coluna e o item da navegação", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(demo);
  await page.getByRole("button", { name: "Compactar menu" }).click();

  await page.getByRole("button", { name: "Ocultar menu" }).click();
  await expect(page.locator("#sidebar")).toHaveAttribute("data-state", "hidden");
  expect(await sidebarWidth(page)).toBeLessThan(1);
  await expect(page.getByRole("link", { name: "Painel" })).toHaveCount(0);
  expect(await hasHorizontalOverflow(page)).toBe(false);
});

test("3. transição oculto → expandido restaura largura e navegação", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(demo);
  await page.getByRole("button", { name: "Compactar menu" }).click();
  await page.getByRole("button", { name: "Ocultar menu" }).click();

  await page.getByRole("button", { name: "Expandir menu" }).click();
  await expect(page.locator("#sidebar")).toHaveAttribute("data-state", "expanded");
  expect(await sidebarWidth(page)).toBeGreaterThan(200);
  await expect(page.getByRole("link", { name: "Painel" })).toBeVisible();
});

test("4. persistência dos três estados no localStorage", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(demo);
  for (const [button, state] of [
    ["Compactar menu", "compact"],
    ["Ocultar menu", "hidden"],
    ["Expandir menu", "expanded"],
  ]) {
    await page.getByRole("button", { name: button }).click();
    await expect(page.locator("#sidebar")).toHaveAttribute("data-state", state);
    const stored = await page.evaluate((key) => localStorage.getItem(key), storageKey);
    expect(stored).toBe(state);
  }
});

test("5. restauração do estado após recarregamento", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(demo);
  await page.getByRole("button", { name: "Compactar menu" }).click();
  await page.reload();
  await expect(page.locator("#sidebar")).toHaveAttribute("data-state", "compact");
  await expect(page.getByRole("button", { name: "Ocultar menu" })).toBeVisible();

  await page.getByRole("button", { name: "Ocultar menu" }).click();
  await page.reload();
  await expect(page.locator("#sidebar")).toHaveAttribute("data-state", "hidden");
  await expect(page.getByRole("button", { name: "Expandir menu" })).toBeVisible();
});

test("6. compatibilidade com preferências anteriores e valores inválidos", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });

  // Preferência antiga "true" (recolhido) → compacto.
  await page.addInitScript((key) => localStorage.setItem(key, "true"), storageKey);
  await page.goto(demo);
  await expect(page.locator("#sidebar")).toHaveAttribute("data-state", "compact");

  // Preferência antiga "false" → expandido.
  await page.addInitScript((key) => localStorage.setItem(key, "false"), storageKey);
  await page.goto(demo);
  await expect(page.locator("#sidebar")).toHaveAttribute("data-state", "expanded");

  // Valor inválido → padrão seguro expandido.
  await page.addInitScript((key) => localStorage.setItem(key, "corrompido"), storageKey);
  await page.goto(demo);
  await expect(page.locator("#sidebar")).toHaveAttribute("data-state", "expanded");
});

test("7. navegação por teclado percorre os links e o controle", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(demo);
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

test("8. gerenciamento de foco ao ocultar e retorno pelo controle", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(demo);
  const toggle = page.getByRole("button", { name: "Compactar menu" });
  await toggle.focus();
  await page.keyboard.press("Enter");
  await page.keyboard.press("Enter");
  // Após ocultar, o foco permanece no controle de reabertura.
  await expect(page.getByRole("button", { name: "Expandir menu" })).toBeFocused();
  // A navegação oculta não recebe foco por Tab.
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Painel" })).toHaveCount(0);
});

test("9. responsividade desktop/mobile sem forçar os três estados no mobile", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(demo);
  await page.getByRole("button", { name: "Compactar menu" }).click();
  await expect(page.locator("#sidebar")).toHaveAttribute("data-state", "compact");

  // Em mobile a preferência desktop não força o ciclo; o drawer abre direto.
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(demo);
  await expect(page.getByRole("button", { name: "Abrir menu" })).toBeVisible();
  await page.getByRole("button", { name: "Abrir menu" }).click();
  await expect(page.getByRole("button", { name: "Fechar menu" })).toBeVisible();
  expect(await hasHorizontalOverflow(page)).toBe(false);
  await page.keyboard.press("Escape");

  // Ao voltar ao desktop, a preferência compacta é restaurada.
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(page.getByRole("button", { name: "Ocultar menu" })).toBeVisible();
});

test("10. ampliação de texto a 400% preserva os três estados sem overflow", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(demo);
  await page.evaluate(() => {
    document.documentElement.style.fontSize = "400%";
  });
  await page.waitForTimeout(100);

  for (const button of ["Compactar menu", "Ocultar menu", "Expandir menu"]) {
    expect(await hasHorizontalOverflow(page)).toBe(false);
    await page.getByRole("button", { name: button }).click();
  }
  await expect(page.getByRole("button", { name: "Compactar menu" })).toBeVisible();
  expect(await hasHorizontalOverflow(page)).toBe(false);
});

test("11. consumidor independente percorre os três estados com o pacote instalado", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(consumer);
  const sidebar = page.locator("#consumer-sidebar");
  await expect(page.locator("[data-iui-sidebar-toggle] .iui-toggle-icon")).toHaveCount(3);
  await page.getByRole("button", { name: "Compactar menu" }).click();
  await expect(sidebar).toHaveAttribute("data-state", "compact");
  await page.getByRole("button", { name: "Ocultar menu" }).click();
  await expect(sidebar).toHaveAttribute("data-state", "hidden");
  const box = await sidebar.boundingBox();
  expect(box === null || box.width < 1).toBe(true);
  await page.getByRole("button", { name: "Expandir menu" }).click();
  await expect(sidebar).toHaveAttribute("data-state", "expanded");
});

test("12. regressão visual dos três estados no desktop", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(demo);
  await expect(page.locator("#sidebar")).toHaveAttribute("data-state", "expanded");
  await expect(page).toHaveScreenshot("sidebar-expanded.png", { maxDiffPixelRatio: 0.01 });

  await page.getByRole("button", { name: "Compactar menu" }).click();
  await expect(page.locator("#sidebar")).toHaveAttribute("data-state", "compact");
  await expect(page).toHaveScreenshot("sidebar-compact.png", { maxDiffPixelRatio: 0.01 });

  await page.getByRole("button", { name: "Ocultar menu" }).click();
  await expect(page.locator("#sidebar")).toHaveAttribute("data-state", "hidden");
  await expect(page).toHaveScreenshot("sidebar-hidden.png", { maxDiffPixelRatio: 0.01 });
});

test("os três estados não introduzem violações axe graves no desktop", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(demo);
  for (const button of ["Compactar menu", "Ocultar menu", "Expandir menu"]) {
    const results = await new AxeBuilder({ page }).analyze();
    const problems = results.violations.filter(
      (violation) => violation.impact === "serious" || violation.impact === "critical" || violation.id === "region",
    );
    expect(problems, JSON.stringify(problems, null, 2)).toEqual([]);
    await page.getByRole("button", { name: button }).click();
  }
});