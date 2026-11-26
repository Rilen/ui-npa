import { defineConfig, devices } from "@playwright/test";

const testPort = Number(process.env.E2E_PORT || 4174);
const baseURL = `http://127.0.0.1:${testPort}`;

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: false,
  workers: 1,
  forbidOnly: true,
  retries: 0,
  reporter: "list",
  webServer: {
    command: "node scripts/serve.mjs",
    env: { PORT: String(testPort), PREFIX: "" },
    url: `${baseURL}/examples/requerimentos/`,
    reuseExistingServer: false,
    timeout: 15000,
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        baseURL,
        viewport: { width: 1280, height: 800 },
        colorScheme: "light",
        reducedMotion: "reduce",
      },
    },
  ],
});
