import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const demo = "/examples/requerimentos/";

function metrics(page) {
  return page.locator(".iui-grid--metrics");
}

async function metricColumns(page) {
  return metrics(page).evaluate((grid) => getComputedStyle(grid).gridTemplateColumns.split(" ").length);
}

async function hasHorizontalOverflow(page) {
  return page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
}

test("a grade de indicadores usa quatro, duas e uma coluna conforme a área principal", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(demo);
  expect(await metricColumns(page)).toBe(4);
  expect(await hasHorizontalOverflow(page)).toBe(false);

  await page.getByRole("button", { name: "Recolher menu" }).click();
  expect(await metricColumns(page)).toBe(4);
  expect(await hasHorizontalOverflow(page)).toBe(false);

  await page.setViewportSize({ width: 1024, height: 768 });
  expect(await metricColumns(page)).toBe(2);
  expect(await hasHorizontalOverflow(page)).toBe(false);

  await page.getByRole("button", { name: "Expandir menu" }).click();
  expect(await metricColumns(page)).toBe(2);
  expect(await hasHorizontalOverflow(page)).toBe(false);

  await page.setViewportSize({ width: 768, height: 1024 });
  expect(await metricColumns(page)).toBe(2);
  expect(await hasHorizontalOverflow(page)).toBe(false);

  await page.setViewportSize({ width: 390, height: 844 });
  expect(await metricColumns(page)).toBe(1);
  expect(await hasHorizontalOverflow(page)).toBe(false);

  await page.setViewportSize({ width: 320, height: 700 });
  expect(await metricColumns(page)).toBe(1);
  expect(await hasHorizontalOverflow(page)).toBe(false);
});

test("a Secretaria é identificável na faixa móvel sem sobreposição", async ({ page }) => {
  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto(demo);

    const municipality = page.locator("[data-iui-slot='municipality']");
    const department = page.locator("[data-iui-slot='department']");
    const label = department.locator("[data-iui-label]");
    await expect(municipality.locator("[data-iui-label]")).toBeVisible();
    await expect(label).toBeVisible();
    await expect(label).toHaveText("Secretaria Municipal de Exemplo");
    await expect(department.locator("img")).toBeVisible();
    await expect(department.locator("img")).toHaveAttribute("alt", "");

    const municipalityBox = await municipality.boundingBox();
    const departmentBox = await department.boundingBox();
    expect(municipalityBox.y + municipalityBox.height).toBeLessThanOrEqual(departmentBox.y + 1);
    expect(departmentBox.width).toBeGreaterThan(100);
    expect(await hasHorizontalOverflow(page)).toBe(false);

    await page.getByRole("button", { name: "Abrir menu" }).click();
    const header = await page.locator(".iui-header").boundingBox();
    const sidebar = await page.locator("#sidebar").boundingBox();
    expect(sidebar.y).toBeGreaterThanOrEqual(header.y + header.height - 1);
    await page.keyboard.press("Escape");
    await expect(page.getByRole("button", { name: "Abrir menu" })).toBeFocused();

    await page.getByRole("link", { name: "Sobre o sistema" }).click();
    await expect(page.locator("#sobre")).toContainText("Secretaria Municipal de Exemplo");
  }
});

test("Sobre o sistema organiza identidade, aplicação e informações técnicas", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${demo}#sobre`);

  const about = page.locator("[data-iui-about]");
  const identity = about.getByRole("heading", { name: "Identidade institucional" }).locator("..");
  const application = about.getByRole("heading", { name: "Aplicação", exact: true }).locator("..");
  const technical = about.getByRole("heading", { name: "Informações técnicas" }).locator("..");

  await expect(identity).toContainText("Prefeitura Municipal de Exemplo");
  await expect(identity).toContainText("Secretaria Municipal de Exemplo");
  await expect(identity).toContainText("Setor de Atendimento");
  await expect(application).toContainText("Gestão de Requerimentos");
  await expect(application).toContainText("1.4.0");
  await expect(application.getByRole("link", { name: "Ver novidades" })).toHaveAttribute("href", "#changelog");
  await expect(technical.getByText("Desenvolvido por", { exact: true })).toBeVisible();
  await expect(technical.getByText("NPA", { exact: true })).toBeVisible();
  await expect(technical.getByText("UI-NPA 0.3.1", { exact: true })).toBeVisible();
  await expect(about.locator("img")).toHaveCount(0);

  const desktopTops = await about.locator("section").evaluateAll((sections) =>
    sections.map((section) => Math.round(section.getBoundingClientRect().top)),
  );
  expect(new Set(desktopTops).size).toBe(1);

  await page.setViewportSize({ width: 768, height: 1024 });
  await expect(identity).toBeVisible();
  await expect(application).toBeVisible();
  await expect(technical).toBeVisible();
  expect(await hasHorizontalOverflow(page)).toBe(false);

  await page.setViewportSize({ width: 390, height: 844 });
  await expect
    .poll(async () =>
      about.locator("section").evaluateAll((sections) => {
        const tops = sections.map((section) => Math.round(section.getBoundingClientRect().top));
        return new Set(tops).size;
      }),
    )
    .toBe(3);
  expect(await hasHorizontalOverflow(page)).toBe(false);

  await application.getByRole("link", { name: "Ver novidades" }).click();
  await expect(page.getByRole("heading", { name: "Novidades" })).toBeVisible();
});

test("Sobre o sistema e a faixa móvel não têm violações graves no axe", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${demo}#sobre`);
  const mobile = await new AxeBuilder({ page }).analyze();
  const mobileSerious = mobile.violations.filter((violation) => violation.impact === "serious" || violation.impact === "critical");
  expect(mobileSerious, JSON.stringify(mobileSerious, null, 2)).toEqual([]);

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${demo}#sobre`);
  const desktop = await new AxeBuilder({ page }).analyze();
  const desktopSerious = desktop.violations.filter((violation) => violation.impact === "serious" || violation.impact === "critical");
  expect(desktopSerious, JSON.stringify(desktopSerious, null, 2)).toEqual([]);
});
