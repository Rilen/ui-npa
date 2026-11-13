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
  await expect(page.getByText("UI-NPA 0.3.3")).toBeVisible();
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

test("no mobile a secretaria permanece identificável e consultável em Sobre o sistema", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const municipality = await page.locator("[data-iui-slot='municipality']").boundingBox();
  const department = await page.locator("[data-iui-slot='department']").boundingBox();
  await expect(page.locator("[data-iui-slot='department'] [data-iui-label]")).toBeVisible();
  await expect(page.locator("[data-iui-slot='department'] [data-iui-label]")).toHaveText("Secretaria Municipal de Exemplo");
  await expect(page.locator("[data-iui-slot='department'] img")).toBeVisible();
  expect(municipality.y + municipality.height).toBeLessThanOrEqual(department.y + 1);
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

test("a identidade institucional é configurável pela aplicação", async ({ page }) => {
  await page.evaluate(async () => {
    const { applyInstitutionalIdentity } = await import("/packages/styles/identity.js");
    applyInstitutionalIdentity(document.querySelector(".iui-shell"), {
      municipality: {
        name: "Prefeitura de Outro Município",
        logo: "./assets/prefeitura.svg",
        logoAlt: "Marca da Prefeitura de Outro Município",
      },
      department: {
        name: "Secretaria de Outro Órgão",
        logo: "./assets/secretaria.svg",
        logoAlt: "Marca da Secretaria de Outro Órgão",
      },
      sector: {
        name: "Setor Configurado",
        logo: "./assets/setor.svg",
        logoAlt: "Marca do Setor Configurado",
      },
      application: {
        name: "Sistema Configurado",
        version: "9.9.9",
        developer: "NPA",
        changelog: [{ version: "9.9.9", date: "2026-11-12", notes: ["Configuração alternativa."] }],
        changelogUrl: "https://example.invalid/novidades",
      },
      designSystem: { name: "UI-NPA", version: "0.3.3" },
    });
  });

  await expect(page.locator("[data-iui-slot='municipality'] [data-iui-label]")).toHaveText("Prefeitura de Outro Município");
  await expect(page.locator("[data-iui-slot='department'] [data-iui-label]")).toHaveText("Secretaria de Outro Órgão");
  await expect(page.locator("[data-iui-slot='sector'] [data-iui-label]")).toHaveText("Setor Configurado");
  await expect(page.locator(".iui-footer [data-iui-app-name]")).toHaveText("Sistema Configurado");
  await expect(page.locator(".iui-footer [data-iui-app-version]")).toHaveText("9.9.9");
  await expect(page.locator("[data-iui-developer]")).toHaveText("Desenvolvido por NPA");
  await expect(page.locator("[data-iui-changelog-link]")).toHaveAttribute("href", "https://example.invalid/novidades");
  await expect(page.locator("[data-iui-about]")).toContainText("Sistema Configurado");
  await expect(page.locator("[data-iui-about]")).toContainText("UI-NPA 0.3.3");
});

test("o rodapé permanece completo no desktop, no tablet e no mobile", async ({ page }) => {
  for (const viewport of [
    { width: 1280, height: 800 },
    { width: 1024, height: 768 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/examples/requerimentos/");
    const footer = page.locator(".iui-footer");
    await expect(footer).toBeVisible();
    await expect(footer.locator("[data-iui-app-name]")).toHaveText("Gestão de Requerimentos");
    await expect(footer.locator("[data-iui-app-version]")).toHaveText("1.4.0");
    await expect(footer.getByRole("link", { name: "Novidades" })).toBeVisible();
    await expect(footer.getByRole("link", { name: "Sobre o sistema" })).toBeVisible();
    await expect(footer.getByText("Desenvolvido por NPA")).toBeVisible();
  }
});

test("a aplicação não cria rolagem horizontal em 320px", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto("/examples/requerimentos/");
  const overflows = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(overflows).toBe(false);
  await expect(page.getByRole("button", { name: "Abrir menu" })).toBeVisible();
  await expect(page.locator(".iui-footer")).toBeVisible();
});
