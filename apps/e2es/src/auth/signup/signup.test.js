import { test, expect } from '@playwright/test';
import path from 'path';

const PATH = path.join('src', 'auth', 'signup');
// test('Signup Successfully as a user', async ({ page }) => {
//   await page.goto('http://localhost:8080');
//   await page.locator('[data-test=sign-in-btn-app-bar]').click();
//   await page.waitForURL('http://localhost:8080/sign_in')
//   await page.locator('[data-test=sign-up-btn]').click();
//   await page.waitForURL('http://localhost:8080/sign_up')
//   await page.screenshot({ path: path.join(PATH, 'sign-up-1.png') });
//   await page.locator('[data-test=first-name-field]').fill('Test');
//   await page.locator('[data-test=email-field]').fill('mradul-tester@sahanico.com');
//   await page.locator('[data-test=email-field]').fill('mradul-tester@sahanico.com');
//   await page.locator('[data-test=email-field]').fill('mradul-tester@sahanico.com');
//   await page.locator('[data-test=email-field]').fill('mradul-tester@sahanico.com');
//   await page.locator('[data-test=email-field]').fill('mradul-tester@sahanico.com');
//   // await expect(page.getByText('Objects'),'should see Objects').toBeVisible();
//   // await expect(page.getByText('Users'),'should see Users').toBeVisible();
//   // await expect(page.getByText('Designs'),'should see Designs').toBeVisible();
// });
