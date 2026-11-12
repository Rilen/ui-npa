import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/examples/requerimentos/");
});

test("exibe prefeitura, secretaria, setor, versão e crédito", async ({ page }) => {
  await expect(page.getByText("Prefeitura Municipal de Exemplo").first()).toBeVisible();
  await expect(page.getByText("Secretaria Municipal de Exemplo").first()).toBeVisible();
  await expect(page.getByText("Setor de Atendimento").first()).toBeVisible();
  const municipality = await page.locator("[data-iui-slot='municipality']").boundingBox();
  const department = await page.locator("[data-iui-slot='department']").boundingBox();
  expect(municipality.x + municipality.width).toBeLessThanOrEqual(department.x + 1);
  await expect(page.locator(".iui-footer [data-iui-app-version]")).toHaveText("1.4.0");
  await expect(page.getByText("Desenvolvido por NPA")).toBeVisible();
  await expect(page.locator("[data-iui-slot='municipality'] img")).toHaveAttribute("alt", "");
});

test("abre o changelog sintético e as informações do sistema", async ({ page }) => {
  await page.getByRole("link", { name: "Novidades" }).click();
  await expect(page.getByRole("heading", { name: "Novidades" })).toBeVisible();
  await expect(page.getByText("Não descreve uma publicação real.")).toBeVisible();
  await page.getByRole("link", { name: "Sobre o sistema" }).click();
  await expect(page.getByText("UI-NPA 0.2.0")).toBeVisible();
  await expect(page.getByText("1.4.0").last()).toBeVisible();
  await expect(page.getByText("Secretaria Municipal de Exemplo").last()).toBeVisible();
});

test("no tablet as marcas não se sobrepõem", async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 768 });
  const municipality = await page.locator("[data-iui-slot='municipality']").boundingBox();
  const department = await page.locator("[data-iui-slot='department']").boundingBox();
  expect(municipality.x + municipality.width).toBeLessThanOrEqual(department.x + 1);
  await expect(page.locator("[data-iui-slot='municipality'] [data-iui-label]")).toBeVisible();
});

test("no mobile a secretaria permanece consultável em Sobre o sistema", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const department = await page.locator("[data-iui-slot='department']").boundingBox();
  expect(department.width).toBeLessThan(80);
  await expect(page.locator("[data-iui-slot='department'] img")).toBeVisible();
  await page.getByRole("link", { name: "Sobre o sistema" }).click();
  await expect(page.locator("#sobre")).toContainText("Secretaria Municipal de Exemplo");
});

test("a sidebar recolhida mantém a faixa institucional", async ({ page }) => {
  await page.getByRole("button", { name: "Recolher menu" }).click();
  await expect(page.locator("[data-iui-slot='municipality'] [data-iui-label]")).toBeVisible();
  const sector = await page.locator("[data-iui-slot='sector']").boundingBox();
  expect(sector.width).toBeLessThan(80);
  await expect(page.locator(".iui-sidebar [data-iui-label]")).toHaveText("Setor de Atendimento");
  await expect(page.locator(".iui-header [data-iui-app-name]")).toHaveText("Gestão de Requerimentos");
});
