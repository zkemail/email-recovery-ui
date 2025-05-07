import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('textbox', { name: 'guardian@prove.email' }).click();
  await page.getByRole('textbox', { name: 'guardian@prove.email' }).fill('shubham.agarwal8856@gmail.com');
  await page.getByRole('button', { name: 'Create burner wallet' }).click();
  await page.waitForTimeout(10000);
  await expect(page.getByText('Please check your email')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Wallet Actions' })).toBeVisible({ timeout: 600000 });
  await page.getByRole('button', { name: 'Trigger Recovery' }).click();
  await page.waitForTimeout(10000);
  await page.getByRole('textbox', { name: '0xAB12...' }).click();
  await page.getByRole('textbox', { name: '0xAB12...' }).fill('0xE0387E390808cDbA9f2f86c555E406fC84f38aFC');
  await page.getByRole('button', { name: 'Trigger Recovery' }).click();
  await expect(page.getByText('Please check your email and')).toBeVisible({ timeout: 600000 });
  await expect(page.getByRole('heading', { name: 'You can recover your account' })).toBeVisible({ timeout: 600000 });
  await expect(page.getByRole('button', { name: 'Complete Recovery' })).toBeVisible({ timeout: 600000 });
});