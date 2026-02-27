import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

const DASHBOARD_ROUTES = [
  "/dashboard",
  "/dashboard/teachers",
  "/dashboard/classes",
  "/dashboard/finance",
  "/dashboard/grades",
  "/dashboard/events",
  "/dashboard/announcements",
  "/dashboard/students",
  "/dashboard/attendance",
  "/dashboard/timetable",
  "/dashboard/analytics",
];

async function login(page: Page) {
  await page.goto("/auth/login");
  await page.fill('input[name="email"]', "admin@school.edu");
  await page.fill('input[name="password"]', "admin123");
  await page.click('button[type="submit"]');
  await page.waitForURL("**/dashboard", { timeout: 30000 });
}

test.describe("Dashboard route smoke", () => {
  test.setTimeout(180000);

  test("all dashboard routes render without generic server error", async ({
    page,
  }) => {
    await login(page);

    for (const route of DASHBOARD_ROUTES) {
      await page.goto(route, { waitUntil: "domcontentloaded", timeout: 60000 });
      await expect(page).toHaveURL(new RegExp(`${route.replace(/\//g, "\\/")}$`));
      await expect(
        page.locator(
          "text=Application error: a server-side exception has occurred",
        ),
      ).toHaveCount(0);
      await expect(page.locator("h1").first()).toBeVisible({ timeout: 10000 });
    }
  });
});
