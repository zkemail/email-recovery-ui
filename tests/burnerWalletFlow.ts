import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.locator('body').click();
  await page.goto('http://localhost:5173/');
  await page.goto('http://localhost:5173/');
  await page1.goto('https://accounts.google.com/v3/signin/identifier?continue=https%3A%2F%2Fmail.google.com%2Fmail%2Fu%2F0%2F&emr=1&followup=https%3A%2F%2Fmail.google.com%2Fmail%2Fu%2F0%2F&ifkv=ASKV5MjsI2zkUmNRGmYYW4hRHXhpjFf2BEifRbe5EPwOTWs6OeCaDdkpd3_iX_8uOELaZmNICu_S&osid=1&passive=1209600&service=mail&flowName=GlifWebSignIn&flowEntry=ServiceLogin&dsh=S-1959247117%3A1746459873259515');
  await page.getByRole('button', { name: 'Burner Safe Flow (v1.4.1)' }).click();
  await page.getByRole('textbox', { name: 'guardian@prove.email' }).click();
  await page.getByRole('textbox', { name: 'guardian@prove.email' }).fill('shubham.agarwal8856@gmail.com');
  await page.getByRole('button', { name: 'Create burner wallet' }).click();
  await expect(page.locator('div').filter({ hasText: 'Please check your email' }).nth(3)).toBeVisible();
  await page1.getByRole('textbox', { name: 'Email or phone' }).fill('shubham.agarwal8856@gmail.com');
  await page1.getByRole('button', { name: 'Next' }).click();
  await page1.getByRole('link', { name: 'Try again' }).click();
  await page1.getByRole('link', { name: 'Sign into Gmail' }).click();
  await page1.getByRole('textbox', { name: 'Email or phone' }).fill('shubham.agarwal8856@gmail.com');
  await page1.getByRole('textbox', { name: 'Email or phone' }).press('Enter');
});