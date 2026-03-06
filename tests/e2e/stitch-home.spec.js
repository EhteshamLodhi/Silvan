import { test, expect } from '@playwright/test';

test('Stitch dev preview renders tokens and strict UI', async ({ page }) => {
  await page.goto('http://localhost:3000/dev/stitch-home');

  // Verify Design Tokens section exists
  await expect(page.locator('text=Stitch Design Tokens (Silvan)')).toBeVisible();
  await expect(page.locator('text=Color Swatches')).toBeVisible();

  // Verify hero component
  await expect(page.locator('[data-test="hero"]')).toBeVisible();
  await expect(page.locator('[data-test="hero-cta"]')).toBeVisible();
  await expect(page.locator('[data-test="hero-title"]')).toContainText('Timeless Wooden Furniture');

  // Verify ShopByBrand sidebar
  await expect(page.locator('[data-test="shop-by-brand"]')).toBeVisible();
  
  // Verify product card and native binding map exists
  await expect(page.locator('[data-test="product-card"]').first()).toBeVisible();

  // Verify footer
  await expect(page.locator('[data-test="footer"]')).toBeVisible();
});
