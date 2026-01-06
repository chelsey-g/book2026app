import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('Detailed UX & Feature Exploration', () => {
  test('empty states messaging', async ({ page }) => {
    await page.goto(`${BASE_URL}/my-books`);
    await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
    
    const emptyText = page.locator('text=/no books|empty|nothing to show/i');
    const visible = await emptyText.isVisible().catch(() => false);
    
    console.log(`Empty state message visible: ${visible}`);
    console.log(`Issue: If user has no books, empty state clarity is important`);
  });

  test('button hover states and feedback', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard`);
    
    const buttons = page.locator('button');
    const count = await buttons.count();
    
    console.log(`Found ${count} interactive buttons on dashboard`);
    
    if (count > 0) {
      const firstButton = buttons.first();
      const boundingBox = await firstButton.boundingBox();
      console.log(`Button found and interactive: ${!!boundingBox}`);
    }
  });

  test('form validation and error messages', async ({ page }) => {
    await page.goto(`${BASE_URL}/search`);
    
    // Try submitting empty search
    const searchForm = page.locator('form');
    if (await searchForm.isVisible()) {
      const submitBtn = searchForm.locator('button[type="submit"]');
      if (await submitBtn.isVisible()) {
        await submitBtn.click();
        
        const errorMsg = page.locator('text=/error|required|empty/i');
        const hasError = await errorMsg.isVisible().catch(() => false);
        console.log(`Form validation error shown: ${hasError}`);
      }
    }
  });

  test('loading states visibility', async ({ page }) => {
    const startTime = Date.now();
    await page.goto(`${BASE_URL}/dashboard`);
    
    // Check if loading skeleton/spinner is visible
    const spinner = page.locator('[class*="spinner"], [class*="skeleton"], [class*="loading"]');
    const hasLoader = await spinner.count().then(c => c > 0);
    
    await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
    const loadTime = Date.now() - startTime;
    
    console.log(`Has visual loading state: ${hasLoader}`);
    console.log(`Dashboard load time: ${loadTime}ms`);
  });

  test('chart responsiveness on small screens', async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 375, height: 667 },
    });
    
    const page = await context.newPage();
    await page.goto(`${BASE_URL}/dashboard`);
    await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
    
    // Check if charts are visible
    const charts = page.locator('svg');
    const chartCount = await charts.count();
    
    console.log(`Charts visible on mobile: ${chartCount}`);
    console.log(`Issue: Charts might overflow on small screens`);
    
    // Check for overflow
    const mainContent = page.locator('main');
    const scrollWidth = await mainContent.evaluate(el => el.scrollWidth);
    const clientWidth = await mainContent.evaluate(el => el.clientWidth);
    
    const hasHorizontalScroll = scrollWidth > clientWidth;
    console.log(`Horizontal scrolling on mobile: ${hasHorizontalScroll}`);
    
    await context.close();
  });

  test('image loading and broken images', async ({ page }) => {
    await page.goto(`${BASE_URL}/my-books`);
    
    page.on('response', (response) => {
      if (response.status() === 404) {
        console.log(`Issue: 404 response: ${response.url()}`);
      }
    });

    await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
    
    const images = page.locator('img');
    const imgCount = await images.count();
    
    console.log(`Found ${imgCount} images on page`);
    
    if (imgCount > 0) {
      // Check for alt text
      const missingAlt = await images.evaluateAll(imgs => 
        imgs.filter(img => !img.getAttribute('alt')).length
      );
      console.log(`Images missing alt text: ${missingAlt}`);
    }
  });

  test('color contrast and readability', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard`);
    
    // Check text color contrast issues
    const textElements = page.locator('p, span, a');
    
    const lowContrast = await textElements.evaluateAll((elements) => {
      return elements.filter(el => {
        if (!el.textContent || el.textContent.length === 0) return false;
        
        const style = window.getComputedStyle(el);
        const color = style.color;
        const bgColor = style.backgroundColor;
        
        // Very basic check - if text color is too light gray
        return color.includes('rgb(200') || color.includes('rgb(150');
      }).length;
    });
    
    console.log(`Potentially low-contrast text elements: ${lowContrast}`);
    console.log(`Issue: Light gray text on white/light backgrounds may be hard to read`);
  });

  test('link underlines and clarity', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard`);
    
    const links = page.locator('a');
    const linkCount = await links.count();
    
    console.log(`Found ${linkCount} links on page`);
    
    // Check if links have clear styling
    const linkStyles = await links.first().evaluate(el => {
      const style = window.getComputedStyle(el);
      return {
        textDecoration: style.textDecoration,
        color: style.color,
        fontWeight: style.fontWeight,
      };
    }).catch(() => null);
    
    console.log('Link styling:', linkStyles);
  });

  test('form input focus states', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard`);
    
    // Try to find and focus an input
    const inputs = page.locator('input');
    if (await inputs.count() > 0) {
      const firstInput = inputs.first();
      await firstInput.focus();
      
      const focusStyle = await firstInput.evaluate(el => {
        const style = window.getComputedStyle(el);
        return {
          outline: style.outline,
          boxShadow: style.boxShadow,
          borderColor: style.borderColor,
        };
      });
      
      console.log('Input focus styles:', focusStyle);
      console.log(`Issue: Ensure focus states are clearly visible for keyboard users`);
    }
  });

  test('real-time data updates', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard`);
    
    // Wait for initial load
    await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
    
    // Get initial stats value
    const statsCard = page.locator('[class*="stat"], [class*="card"]').first();
    const initialText = await statsCard.textContent().catch(() => '');
    
    console.log(`Initial stat value: ${initialText?.substring(0, 50) || ''}`);
    
    // Wait and check if data updates
    await page.waitForTimeout(2000);
    const updatedText = await statsCard.textContent().catch(() => '');
    
    const dataUpdated = initialText !== updatedText;
    console.log(`Data updated during viewing: ${dataUpdated}`);
    console.log(`Issue: Consider real-time updates or cache invalidation strategy`);
  });

  test('error recovery', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard`);
    
    // Simulate network error
    await page.context().setOffline(true);
    console.log('Offline mode enabled');
    
    // Wait a bit
    await page.waitForTimeout(1000);
    
    // Check error handling
    const errorMsg = page.locator('text=/error|offline|connection|try again/i');
    const hasErrorUI = await errorMsg.isVisible().catch(() => false);
    
    console.log(`Error UI visible when offline: ${hasErrorUI}`);
    console.log(`Issue: Ensure graceful offline handling`);
    
    // Go back online
    await page.context().setOffline(false);
  });

  test('pagination if exists', async ({ page }) => {
    await page.goto(`${BASE_URL}/my-books`);
    
    const pagination = page.locator('[class*="pagina"], [class*="page"], button:has-text("Next"), button:has-text("Previous")');
    const paginationCount = await pagination.count();
    
    console.log(`Pagination elements found: ${paginationCount}`);
    
    if (paginationCount > 0) {
      console.log('Pagination controls are present');
      console.log(`Issue: Ensure pagination is clear and all pages are accessible`);
    } else {
      console.log('Issue: If many books exist, pagination or infinite scroll needed');
    }
  });

  test('filter/sort functionality', async ({ page }) => {
    await page.goto(`${BASE_URL}/my-books`);
    
    const filterBtn = page.locator('button:has-text("Filter"), button:has-text("Sort"), [class*="filter"]');
    const filterExists = await filterBtn.count() > 0;
    
    console.log(`Filter/sort available: ${filterExists}`);
    
    if (!filterExists) {
      console.log(`Issue: Users cannot filter/sort books - should add filtering by status, rating, date`);
    } else {
      console.log('Filter/sort controls available');
    }
  });

  test('responsive grid layouts', async ({ browser }) => {
    // Test multiple breakpoints
    const breakpoints = [
      { width: 320, name: 'XS Phone' },
      { width: 375, name: 'iPhone' },
      { width: 768, name: 'Tablet' },
      { width: 1024, name: 'Laptop' },
      { width: 1440, name: 'Desktop' },
    ];

    for (const bp of breakpoints) {
      const context = await browser.newContext({
        viewport: { width: bp.width, height: 800 },
      });
      
      const page = await context.newPage();
      await page.goto(`${BASE_URL}/dashboard`);
      await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
      
      // Check for layout issues
      const mainContent = page.locator('main');
      const scrollWidth = await mainContent.evaluate(el => el.scrollWidth);
      const clientWidth = await mainContent.evaluate(el => el.clientWidth);
      
      const hasOverflow = scrollWidth > clientWidth;
      console.log(`${bp.name} (${bp.width}px): ${hasOverflow ? 'HAS OVERFLOW ⚠️' : 'OK'}`);
      
      await context.close();
    }
  });

  test('accessibility violations', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard`);
    
    const violations = await page.evaluate(() => {
      const issues: string[] = [];
      
      // Check for images without alt
      document.querySelectorAll('img').forEach(img => {
        if (!img.getAttribute('alt')) {
          issues.push('Image missing alt text: ' + img.src.substring(0, 50));
        }
      });
      
      // Check for buttons without text/aria
      document.querySelectorAll('button').forEach(btn => {
        const text = btn.textContent?.trim() || '';
        const aria = btn.getAttribute('aria-label');
        if (!text && !aria) {
          issues.push('Button missing text/aria-label');
        }
      });
      
      // Check for links without text
      document.querySelectorAll('a').forEach(link => {
        const text = link.textContent?.trim() || '';
        const aria = link.getAttribute('aria-label');
        if (!text && !aria) {
          issues.push('Link missing text/aria-label');
        }
      });
      
      return issues;
    });
    
    console.log(`Accessibility violations found: ${violations.length}`);
    if (violations.length > 0) {
      console.log('Violations:', violations.slice(0, 5));
    }
  });

  test('performance metrics', async ({ page }) => {
    const metrics = await page.evaluate(() => {
      const perf = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      return {
        fp: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
        fcp: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0,
        tti: (perf?.domInteractive - perf?.fetchStart) || 0,
      };
    }).catch(() => ({ fp: 0, fcp: 0, tti: 0 }));
    
    console.log('Performance Metrics:');
    console.log(`  First Paint: ${metrics.fp.toFixed(0)}ms`);
    console.log(`  First Contentful Paint: ${metrics.fcp.toFixed(0)}ms`);
    console.log(`  Time to Interactive: ${metrics.tti.toFixed(0)}ms`);
    
    if (metrics.fcp > 2000) {
      console.log(`Issue: FCP > 2s - consider code splitting or lazy loading`);
    }
  });

  test('user flow: search to details', async ({ page }) => {
    await page.goto(`${BASE_URL}/discover`);
    await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
    
    // Try to search
    const searchInput = page.locator('input[placeholder*="Search"]');
    if (await searchInput.isVisible()) {
      await searchInput.fill('the great gatsby');
      await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
      
      // Try clicking first result
      const firstResult = page.locator('[class*="BookCard"]').first();
      if (await firstResult.isVisible()) {
        await firstResult.click();
        console.log('Successfully navigated to book details');
      }
    }
  });

  test('stat cards missing context', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard`);
    await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
    
    const statCards = page.locator('[class*="stat"], [class*="card"]');
    const count = await statCards.count();
    
    console.log(`Found ${count} stat/info cards`);
    
    if (count > 0) {
      const firstCard = statCards.first();
      const hasDescription = await firstCard.locator('p, span[class*="text-sm"], span[class*="text-gray"]').count();
      
      console.log(`Issue: Ensure each stat card has explanatory text, not just numbers`);
    }
  });
});
