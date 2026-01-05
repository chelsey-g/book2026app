import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';
const TEST_EMAIL = 'test@example.com';
const TEST_PASSWORD = 'testpassword123';

test.describe('BookTracker App Exploration', () => {
  test.beforeEach(async ({ page }) => {
    // Start fresh - navigate to home
    await page.goto(BASE_URL);
  });

  test('homepage loads and has proper CTA', async ({ page }) => {
    // Check if homepage has visible CTA buttons
    const loginBtn = page.locator('a:has-text("Sign In")');
    const signupBtn = page.locator('a:has-text("Sign Up")');
    
    expect(loginBtn).toBeDefined();
    expect(signupBtn).toBeDefined();
    
    // Check page title
    await expect(page).toHaveTitle(/BookTracker/);
  });

  test('dashboard loads with user data', async ({ page }) => {
    // Navigate to dashboard (assuming authenticated user)
    // For now, just check if we can reach the page
    await page.goto(`${BASE_URL}/dashboard`);
    
    // Should show loading or content
    const content = page.locator('main');
    await expect(content).toBeVisible({ timeout: 5000 });
  });

  test('check all navigation links work', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard`);
    
    const navLinks = [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Discover', href: '/discover' },
      { label: 'My Books', href: '/my-books' },
      { label: 'Profile', href: '/profile' },
      { label: 'Friends', href: '/friends' },
    ];

    for (const link of navLinks) {
      const navLink = page.locator(`a:has-text("${link.label}")`);
      if (await navLink.isVisible()) {
        await navLink.click();
        // Give page time to load
        await page.waitForLoadState('networkidle', { timeout: 3000 }).catch(() => {});
        
        // Check if we're on the right page (basic check)
        const url = page.url();
        expect(url).toContain(link.href);
      }
    }
  });

  test('search functionality is accessible', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard`);
    
    // Look for search button or input
    const searchBtn = page.locator('button[aria-label="Toggle search"]');
    
    if (await searchBtn.isVisible()) {
      await searchBtn.click();
      
      // Wait for search input to appear
      const searchInput = page.locator('input[placeholder*="Search"]');
      await expect(searchInput).toBeVisible({ timeout: 2000 });
      
      // Try typing something
      await searchInput.fill('the great gatsby');
      await searchInput.press('Enter');
    }
  });

  test('book cards display properly', async ({ page }) => {
    await page.goto(`${BASE_URL}/my-books`);
    
    // Wait for content to load
    await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
    
    // Check if book cards are present
    const bookCards = page.locator('[class*="BookCard"]');
    const count = await bookCards.count();
    
    // Log findings
    console.log(`Found ${count} book cards on My Books page`);
  });

  test('responsive design on mobile', async ({ browser }) => {
    // Create context with mobile viewport
    const context = await browser.newContext({
      viewport: { width: 375, height: 667 }, // iPhone size
    });
    
    const page = await context.newPage();
    await page.goto(`${BASE_URL}/dashboard`);
    
    // Check if mobile menu is available
    await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
    
    // On mobile, navigation might be hidden
    const navItems = page.locator('nav a');
    const visibleCount = await navItems.count();
    
    console.log(`Mobile view shows ${visibleCount} navigation items`);
    
    await context.close();
  });

  test('page load performance', async ({ page }) => {
    const navigationTiming = await page.evaluate(() => {
      const timing = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        dns: timing.domainLookupEnd - timing.domainLookupStart,
        tcp: timing.connectEnd - timing.connectStart,
        ttfb: timing.responseStart - timing.requestStart,
        domInteractive: timing.domInteractive - timing.fetchStart,
        loadComplete: timing.loadEventEnd - timing.fetchStart,
      };
    }).catch(() => ({ error: 'Navigation timing not available' }));

    console.log('Page load timing:', navigationTiming);
  });

  test('error handling for invalid routes', async ({ page }) => {
    await page.goto(`${BASE_URL}/invalid-route-12345`);
    
    // Should show 404 page
    const content = page.locator('body');
    await expect(content).toContainText(/404|not found|page not found/i);
  });

  test('check for console errors', async ({ page }) => {
    const errors: string[] = [];
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
        console.log('Console Error:', msg.text());
      }
    });

    await page.goto(`${BASE_URL}/dashboard`);
    await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
    
    // Check for specific error patterns
    const criticalErrors = errors.filter(e => 
      !e.includes('sourcemap') && 
      !e.includes('favicon') &&
      !e.includes('undefined')
    );

    console.log(`Found ${criticalErrors.length} critical errors`);
    if (criticalErrors.length > 0) {
      console.log('Critical errors:', criticalErrors);
    }
  });

  test('check accessibility - heading hierarchy', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard`);
    await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
    
    // Get all headings
    const h1s = await page.locator('h1').count();
    const h2s = await page.locator('h2').count();
    const h3s = await page.locator('h3').count();
    
    console.log(`Heading hierarchy: H1=${h1s}, H2=${h2s}, H3=${h3s}`);
    
    // Best practice: should have at least one H1
    expect(h1s).toBeGreaterThanOrEqual(1);
  });

  test('check for keyboard navigation', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard`);
    
    // Try tabbing through focusable elements
    const focusableElements = await page.locator('button, a, input, [tabindex="0"]').count();
    console.log(`Found ${focusableElements} focusable elements`);
    
    // Tab through a few times
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
      const focused = await page.evaluate(() => {
        const el = document.activeElement;
        return {
          tag: el?.tagName,
          text: (el as any)?.textContent?.substring(0, 50),
          visible: (el as any)?.offsetHeight > 0
        };
      });
      console.log(`Tab ${i + 1}:`, focused);
    }
  });

  test('check API response times', async ({ page }) => {
    const responseTimes: Record<string, number[]> = {};
    
    page.on('response', (response) => {
      const url = response.url();
      const timing = response.request().timing();
      
      if (url.includes('/api/')) {
        const endpoint = url.split('/api/')[1];
        if (!responseTimes[endpoint]) responseTimes[endpoint] = [];
        responseTimes[endpoint].push(timing.responseEnd - timing.requestStart);
      }
    });

    await page.goto(`${BASE_URL}/dashboard`);
    await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
    
    console.log('API Response Times (ms):');
    for (const [endpoint, times] of Object.entries(responseTimes)) {
      const avg = times.reduce((a, b) => a + b, 0) / times.length;
      console.log(`  ${endpoint}: ${avg.toFixed(0)}ms`);
    }
  });
});
