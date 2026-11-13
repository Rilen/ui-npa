import { expect, test } from "@playwright/test";

const demo = "/examples/requerimentos/";

function primaryAction(page) {
  return page.getByRole("link", { name: "Ver requerimentos" });
}

async function hasHorizontalOverflow(page) {
  return page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
}

test("a paleta clara oficial carrega sem mecanismo de candidata", async ({ page }) => {
  const requests = [];
  page.on("request", (request) => requests.push(request.url()));
  await page.goto(demo);

  const root = page.locator(".iui-root");
  expect(await root.getAttribute("data-iui-candidate")).toBeNull();
  await expect(primaryAction(page)).toHaveCSS("background-color", "rgb(42, 75, 109)");
  await expect(root).toHaveCSS("background-color", "rgb(247, 248, 250)");
  await expect(page.locator(".iui-sidebar__link[aria-current='page']")).toHaveCSS(
    "background-color",
    "rgb(229, 237, 245)",
  );
  await expect(page.getByLabel("Paleta candidata")).toHaveCount(0);
  expect(requests.some((url) => url.includes("candidates.css"))).toBe(false);

  const stylesheets = await page.evaluate(() =>
    [...document.styleSheets].map((sheet) => sheet.href).filter(Boolean),
  );
  expect(stylesheets.some((href) => href.includes("candidates.css"))).toBe(false);
});

test("parâmetro de paleta não altera o tema oficial", async ({ page }) => {
  await page.goto(`${demo}?paleta=b`);
  await expect(primaryAction(page)).toHaveCSS("background-color", "rgb(42, 75, 109)");
  expect(await page.locator(".iui-root").getAttribute("data-iui-candidate")).toBeNull();
  await expect(page.getByLabel("Paleta candidata")).toHaveCount(0);
});

test("a demonstração reflui com texto a 200%", async ({ page }) => {
  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(demo);
    await page.evaluate(() => {
      document.documentElement.style.fontSize = "200%";
    });
    await page.waitForTimeout(100);

    expect(await hasHorizontalOverflow(page)).toBe(false);
    await expect(primaryAction(page)).toBeAttached();
    const scrollable = await page.locator(".iui-shell__content").evaluate((element) => element.scrollHeight > element.clientHeight);
    expect(scrollable).toBe(true);
  }
});
