import { expect, test } from '@playwright/test';
import path from 'path';

const PATH = path.join('src', 'forms');
test('Create all fields form', async ({ page }) => {
  await page.goto('http://localhost:8080');
  await page.locator('[data-test=sign-in-btn-app-bar]').click();
  await page.waitForURL('http://localhost:8080/sign_in')
  await page.screenshot({ path:  path.join(PATH, 'create-form-1.png') });

  await page.locator('[data-test=email-field]').fill('mradul-tester2@sahanico.com');
  await page.locator('[data-test=password-field]').fill('password');
  await page.locator('[data-test=sign-in-btn]').click();
  await page.screenshot({ path: path.join(PATH, 'create-form-2.png') });

  await page.waitForTimeout(2000);
  await page.goto('http://localhost:8080/dashboards/read/admin_accounts_screen');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(PATH, 'create-form-3.png') });

  await page.getByText('All Fields Dashboard').click();
  await page.waitForURL('http://localhost:8080/dashboards/read/all_fields_dashboard');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(PATH, 'create-form-4.png') });

  await page.getByText('Create').click();
  await page.waitForURL('http://localhost:8080/dashboards/read/new_default_test_screen');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(PATH, 'create-form-5.png') });
});
