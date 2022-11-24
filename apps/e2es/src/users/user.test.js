import { expect, test } from '@playwright/test';
import path from 'path';
const PATH = path.join('src', 'users');
test('Login as a user and see account members', async ({ page }) => {
  await page.goto('http://localhost:8080');
  await page.locator('[data-test=sign-in-btn-app-bar]').click();
  await page.waitForURL('http://localhost:8080/sign_in')
  await page.screenshot({ path: path.join(PATH, 'user-1.png' ) });
  await page.locator('[data-test=email-field]').fill('mradul-tester3@sahanico.com');
  await page.locator('[data-test=password-field]').fill('password');
  await page.locator('[data-test=sign-in-btn]').click();
  await page.screenshot({ path: path.join(PATH, 'user-2.png' ) });
  await page.waitForTimeout(2000);
  await page.goto('http://localhost:8080/dashboards/read/user_account_members_screen');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(PATH, 'user-3.png' ) });
  expect(await page.getByText('Account Members').count()).toEqual(2);
  await expect(page.getByText('Invoices'),'should see Invoices').toBeVisible();
  await page.getByText('Tester Tester').click()
  await page.waitForURL('http://localhost:8080/dashboards/read/account_member_details_screen')
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(PATH, 'user-4.png' ) });
});
