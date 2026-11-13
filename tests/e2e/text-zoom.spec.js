import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(fileURLToPath(new URL("../..", import.meta.url)));
const demo = "/examples/requerimentos/";
const consumer = "/tests/fixtures/consumer-vanilla/";

test.setTimeout(120000);

test.beforeAll(() => {
  execFileSync(process.execPath, [path.join(root, "scripts/prepare-consumer-fixture.mjs")], {
    cwd: root,
    stdio: "pipe",
  });
});

async function setTextZoom(page, percent) {
  await page.evaluate((value) => {
    document.documentElement.style.fontSize = `${value}%`;
  }, percent);
  await page.waitForTimeout(100);
}

async function geometry(page) {
  return page.evaluate(() => {
    const content = document.querySelector(".iui-shell__content");
    const pageElement = document.querySelector(".iui-page");
    return {
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: document.documentElement.clientWidth,
      contentWidth: content.scrollWidth,
      contentClientWidth: content.clientWidth,
      contentHeight: content.getBoundingClientRect().height,
      contentScrollHeight: content.scrollHeight,
      pageWidth: pageElement.scrollWidth,
      pageClientWidth: pageElement.clientWidth,
    };
  });
}

for (const [name, url, title] of [["demo", demo, "Gestão de Requerimentos"], ["consumer", consumer, "Sistema Consumidor"]]) {
  test(`${name}: texto a 400% reflui sem overflow horizontal e com conteúdo acessível`, async ({ page }) => {
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(url);
      await setTextZoom(page, 400);

      const values = await geometry(page);
      expect(values.documentWidth, `${name} ${width}px documento`).toBeLessThanOrEqual(values.viewportWidth);
      expect(values.contentWidth, `${name} ${width}px conteúdo`).toBeLessThanOrEqual(values.contentClientWidth);
      expect(values.pageWidth, `${name} ${width}px página`).toBeLessThanOrEqual(values.pageClientWidth);
      expect(values.contentHeight, `${name} ${width}px altura do conteúdo`).toBeGreaterThan(0);
      expect(values.contentScrollHeight).toBeGreaterThan(values.contentHeight);
      await expect(page.locator(".iui-title").first()).toBeAttached();
      await expect(page.locator(".iui-header__title")).toContainText(title);
    }
  });

  test(`${name}: texto a 100% e 200% preservam o layout e o conteúdo`, async ({ page }) => {
    for (const width of [1440, 390]) {
      for (const zoom of [100, 200]) {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(url);
        await setTextZoom(page, zoom);
        const values = await geometry(page);
        expect(values.documentWidth).toBeLessThanOrEqual(values.viewportWidth);
        expect(values.contentWidth).toBeLessThanOrEqual(values.contentClientWidth);
        expect(values.contentHeight).toBeGreaterThan(0);
      }
    }
  });
}

test("texto a 400% mantém a navegação móvel operável", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(demo);
  await setTextZoom(page, 400);

  const toggle = page.getByRole("button", { name: "Abrir menu" });
  await expect(toggle).toBeVisible();
  await toggle.click();
  const header = await page.locator(".iui-header").boundingBox();
  const sidebar = await page.locator("#sidebar").boundingBox();
  expect(sidebar.y).toBeGreaterThanOrEqual(header.y + header.height - 1);
  await expect(page.getByRole("button", { name: "Fechar menu" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(toggle).toBeFocused();
});

test("o zoom de texto a 400% não adiciona violações axe graves", async ({ page }) => {
  for (const url of [demo, consumer]) {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(url);
    await setTextZoom(page, 400);
    const results = await new AxeBuilder({ page }).analyze();
    const problems = results.violations.filter(
      (violation) => violation.impact === "serious" || violation.impact === "critical" || violation.id === "region",
    );
    expect(problems, JSON.stringify(problems, null, 2)).toEqual([]);
  }
});
