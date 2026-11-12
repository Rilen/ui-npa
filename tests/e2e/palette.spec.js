import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const demo = "/examples/requerimentos/";
const comparison = "/examples/paletas/";

function primaryAction(page) {
  return page.getByRole("link", { name: "Ver requerimentos" });
}

async function primaryBackground(page) {
  return primaryAction(page).evaluate((element) => getComputedStyle(element).backgroundColor);
}

async function canvasBackground(page) {
  return page.locator(".iui-root").evaluate((element) => getComputedStyle(element).backgroundColor);
}

async function hasHorizontalOverflow(page) {
  return page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
}

test("o seletor alterna as três candidatas e preserva a paleta atual", async ({ page }) => {
  await page.goto(demo);
  const selector = page.getByLabel("Paleta candidata");
  const root = page.locator(".iui-root");

  await expect(selector).toHaveValue("");
  expect(await root.getAttribute("data-iui-candidate")).toBeNull();
  expect(await primaryBackground(page)).toBe("rgb(36, 70, 104)");
  expect(await canvasBackground(page)).toBe("rgb(247, 248, 250)");

  await selector.selectOption("a");
  expect(await root.getAttribute("data-iui-candidate")).toBe("a");
  expect(await primaryBackground(page)).toBe("rgb(42, 75, 109)");
  expect(await canvasBackground(page)).toBe("rgb(247, 248, 250)");
  expect(new URL(page.url()).searchParams.get("paleta")).toBe("a");

  await selector.selectOption("b");
  expect(await root.getAttribute("data-iui-candidate")).toBe("b");
  expect(await primaryBackground(page)).toBe("rgb(21, 79, 139)");
  expect(await canvasBackground(page)).toBe("rgb(244, 248, 252)");
  expect(new URL(page.url()).searchParams.get("paleta")).toBe("b");

  await selector.selectOption("c");
  expect(await root.getAttribute("data-iui-candidate")).toBe("c");
  expect(await primaryBackground(page)).toBe("rgb(48, 74, 94)");
  expect(await canvasBackground(page)).toBe("rgb(248, 247, 244)");
  expect(new URL(page.url()).searchParams.get("paleta")).toBe("c");

  await selector.selectOption("");
  expect(await root.getAttribute("data-iui-candidate")).toBeNull();
  expect(await primaryBackground(page)).toBe("rgb(36, 70, 104)");
  expect(new URL(page.url()).searchParams.has("paleta")).toBe(false);

  await page.goto(`${demo}?paleta=b`);
  await expect(selector).toHaveValue("b");
  expect(await root.getAttribute("data-iui-candidate")).toBe("b");
  expect(await primaryBackground(page)).toBe("rgb(21, 79, 139)");

  await page.goto(`${demo}?paleta=z`);
  await expect(selector).toHaveValue("");
  expect(await root.getAttribute("data-iui-candidate")).toBeNull();
  expect(await primaryBackground(page)).toBe("rgb(36, 70, 104)");
});

test("o tema escuro experimental prevalece sobre a candidata", async ({ page }) => {
  await page.goto(`${demo}?paleta=a`);
  await page.locator(".iui-root").evaluate((element) => element.setAttribute("data-iui-theme", "dark"));
  await expect(primaryAction(page)).toHaveCSS("background-color", "rgb(47, 88, 132)");
});

test("a página de comparação renderiza as três candidatas sem sobreposição", async ({ page }) => {
  await page.goto(comparison);
  await expect(page.getByRole("heading", { name: "Comparação de paletas candidatas" })).toBeVisible();
  await expect(page.locator("[data-iui-candidate]")).toHaveCount(6);
  for (const candidate of ["a", "b", "c"]) {
    await expect(page.locator(`[data-iui-candidate="${candidate}"]`)).toHaveCount(2);
  }

  const sidebarColors = await page.locator("#comparacao-sidebar .iui-sidebar").evaluateAll((nodes) =>
    nodes.map((node) => getComputedStyle(node).backgroundColor),
  );
  expect(new Set(sidebarColors).size).toBe(3);

  const actionColors = await page
    .locator("#comparacao-componentes .iui-button--primary")
    .evaluateAll((nodes) => nodes.map((node) => getComputedStyle(node).backgroundColor));
  expect(new Set(actionColors).size).toBe(3);

  expect(await hasHorizontalOverflow(page)).toBe(false);
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await hasHorizontalOverflow(page)).toBe(false);

  const results = await new AxeBuilder({ page }).analyze();
  const serious = results.violations.filter((violation) => violation.impact === "serious" || violation.impact === "critical");
  expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
});

test("a demonstração reflui com texto a 200%", async ({ page }) => {
  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(`${demo}?paleta=a`);
    await page.evaluate(() => {
      document.documentElement.style.fontSize = "200%";
    });
    await page.waitForTimeout(100);

    expect(await hasHorizontalOverflow(page)).toBe(false);
    await expect(page.getByLabel("Paleta candidata")).toBeVisible();
    const scrollable = await page.locator(".iui-shell__content").evaluate((element) => element.scrollHeight > element.clientHeight);
    expect(scrollable).toBe(true);
  }
});
