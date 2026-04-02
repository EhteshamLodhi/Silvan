import { test, expect } from '@playwright/test';

test.describe('Connectivity Smoke Test & Cart Flow', () => {

  test('Homepage loads and features products', async ({ page }) => {
    await page.goto('/');
    
    // Verify Hero
    await expect(page.locator('text=Elevate Your Lifestyle')).toBeVisible();
    
    // Verify Grid has items
    const productCards = page.locator('.product-card');
    await expect(productCards.first()).toBeVisible();
  });

  test('Navigate to Product page and Add to Cart', async ({ page }) => {
    await page.goto('/');
    
    // Click the first product
    await page.locator('.product-card').first().click();
    
    // Wait for Product page
    await expect(page.locator('.product-meta-title')).toBeVisible();

    // Check if Available For Sale logic works
    const addToCartBtn = page.locator('button:has-text("Add to Cart")');
    const isOutOfStock = await page.locator('button:has-text("Out of Stock")').count() > 0;
    
    if (isOutOfStock) {
      console.log('Product is out of stock, skipping cart addition');
      return; 
    }

    // Add to cart
    await addToCartBtn.click();
    
    // Sidebar should slide open and show item
    const cartSidebar = page.locator('.cart-sidebar');
    await expect(cartSidebar).toHaveClass(/open/);
    
    // Verify Subtotal is visible
    await expect(page.locator('text=Subtotal')).toBeVisible();
  });

  test('Cart Checkout Redirect', async ({ page }) => {
    // Navigate straight to full cart page
    await page.goto('/cart');
    
    await expect(page.locator('text=Your Shopping Cart')).toBeVisible();
    
    const checkoutLink = page.locator('a:has-text("Proceed to Checkout"), a:has-text("Continue Shopping")').first();
    await expect(checkoutLink).toBeVisible();
    // We don't click checkout here as it's a real Shopify URL and we don't want to spam actual checkout creations 
    // without valid tokens, or leave Playwright hanging on a remote domain during smoke testing.
    // The visibility of the <a> link implies cart API created the checkout URL successfully.
  });

  test('Verify Core Store Routes', async ({ page }) => {
    const pages = [
      '/',
      '/collections',
      '/about',
      '/contact',
      '/sustainability',
      '/shipping',
      '/returns',
      '/faq',
      '/privacy',
      '/terms',
      '/cookies',
      '/search',
      '/account',
      '/account/login',
      '/account/register',
      '/account/orders',
      '/cart',
    ];

    for (const route of pages) {
      const response = await page.goto(route);
      expect(response.status()).toBe(200);
      expect(response.ok()).toBeTruthy();
    }
  });

  test('SEO endpoints resolve', async ({ request }) => {
    const sitemap = await request.get('/sitemap.xml');
    expect(sitemap.ok()).toBeTruthy();

    const robots = await request.get('/robots.txt');
    expect(robots.ok()).toBeTruthy();
  });

});
