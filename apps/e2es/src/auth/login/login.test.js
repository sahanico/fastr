import { test, expect } from '@playwright/test';
import path from 'path';

const PATH = path.join('src', 'auth', 'login');
test('Login Successfully as a designer', async ({ page }) => {
  await page.goto('http://localhost:8080');
  await page.locator('[data-test=sign-in-btn-app-bar]').click();
  await page.waitForURL('http://localhost:8080/sign_in')
  await page.screenshot({ path: path.join(PATH, 'designer-login-1.png') });
  await page.locator('[data-test=email-field]').fill('mradul-tester@sahanico.com');
  await page.locator('[data-test=password-field]').fill('password');
  await page.locator('[data-test=sign-in-btn]').click();
  await page.screenshot({ path: path.join(PATH, 'designer-login-2.png') });
  await page.waitForTimeout(2000);
  await page.goto('http://localhost:8080/objects/list');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(PATH, 'designer-login-3.png')});
  await expect(page.getByText('Objects'),'should see Objects').toBeVisible();
  await expect(page.getByText('Users'),'should see Users').toBeVisible();
  await expect(page.getByText('Designs'),'should see Designs').toBeVisible();
});
test('Login Successfully as an admin', async ({ page }) => {
  await page.goto('http://localhost:8080');
  await page.locator('[data-test=sign-in-btn-app-bar]').click();
  await page.waitForURL('http://localhost:8080/sign_in')
  await page.screenshot({ path:  path.join(PATH, 'admin-login-1.png') });
  await page.locator('[data-test=email-field]').fill('mradul-tester2@sahanico.com');
  await page.locator('[data-test=password-field]').fill('password');
  await page.locator('[data-test=sign-in-btn]').click();
  await page.screenshot({ path: path.join(PATH, 'admin-login-2.png') });
  await page.waitForTimeout(2000);
  await page.goto('http://localhost:8080/dashboards/read/admin_accounts_screen');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(PATH, 'admin-login-3.png') });
  await expect(page.getByText('Invoices'),'should see Invoices').toBeVisible();
  await expect(page.getByText('Users'),'should see Users').toBeVisible();
  await expect(page.getByText('Payments'),'should see Payments').toBeVisible();
  await expect(page.getByText('Metrics'),'should see Metrics').toBeVisible();
});
test('Login as a user', async ({ page }) => {
  await page.goto('http://localhost:8080');
  await page.locator('[data-test=sign-in-btn-app-bar]').click();
  await page.waitForURL('http://localhost:8080/sign_in')
  await page.screenshot({ path: path.join(PATH, 'user-login-1.png' ) });
  await page.locator('[data-test=email-field]').fill('mradul-tester3@sahanico.com');
  await page.locator('[data-test=password-field]').fill('password');
  await page.locator('[data-test=sign-in-btn]').click();
  await page.screenshot({ path: path.join(PATH, 'user-login-2.png' ) });
  await page.waitForTimeout(2000);
  await page.goto('http://localhost:8080/dashboards/read/admin_accounts_screen');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(PATH, 'user-login-3.png' ) });
  await expect(page.getByText('Account Members'),'should see Account Members').toBeVisible();
  await expect(page.getByText('Invoices'),'should see Invoices').toBeVisible();
});
