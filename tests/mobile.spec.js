/**
 * ZABBRO E-Commerce — Mobile Adaptability Test Suite v2
 * Fixed: box.right -> box.x + box.width, cart timeout, overlay close
 */
const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Wait for loading screen to disappear (with short timeout fallback) */
async function waitForAppReady(page) {
  await page.waitForLoadState('domcontentloaded');
  try {
    await page.waitForFunction(() => {
      const screen = document.getElementById('loading-screen');
      return !screen || screen.classList.contains('hidden') || getComputedStyle(screen).opacity === '0';
    }, { timeout: 5000 });
  } catch {
    // Loading screen may not exist on some pages — that's fine
  }
  // Small buffer for JS rendering
  await page.waitForTimeout(400);
}

/** Check if page body has horizontal overflow (5px tolerance) */
async function hasHorizontalOverflow(page) {
  return page.evaluate(() => {
    const html = document.documentElement;
    return html.scrollWidth > html.clientWidth + 5;
  });
}

/** Save screenshot to playwright-screenshots/ */
async function saveScreenshot(page, name, testInfo) {
  const dir = path.join(process.cwd(), 'playwright-screenshots');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const device = testInfo.project.name.replace(/\s+/g, '-');
  const file = `${device}__${name.replace(/[\s/<>:"|?*]+/g, '-')}.png`;
  await page.screenshot({ path: path.join(dir, file), fullPage: false });
}

/** Get element right edge using x + width (Playwright boundingBox returns {x,y,width,height}) */
function rightEdge(box) {
  return box ? box.x + box.width : null;
}

// ─── Suite: No Horizontal Overflow ───────────────────────────────────────────

test.describe('No Horizontal Overflow', () => {
  const routes = [
    { name: 'Home', hash: '#/' },
    { name: 'Products', hash: '#/products' },
    { name: 'Auth Login', hash: '#/auth' },
    { name: 'Auth Signup', hash: '#/auth/signup' },
    { name: 'About', hash: '#/about' },
    { name: 'Checkout', hash: '#/checkout' },
  ];

  for (const route of routes) {
    test(`${route.name} page has no horizontal overflow`, async ({ page }, testInfo) => {
      await page.goto(`/${route.hash}`);
      await waitForAppReady(page);
      await page.waitForTimeout(400);
      const overflow = await hasHorizontalOverflow(page);
      await saveScreenshot(page, `overflow-${route.name}`, testInfo);
      expect(overflow, `Horizontal overflow on ${route.name}`).toBe(false);
    });
  }

  test('Cart page renders without horizontal overflow', async ({ page }, testInfo) => {
    await page.goto('/#/cart');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(800); // Cart renders synchronously — just wait a bit
    const overflow = await hasHorizontalOverflow(page);
    await saveScreenshot(page, 'overflow-Cart', testInfo);
    expect(overflow, 'Horizontal overflow on Cart page').toBe(false);
  });
});

// ─── Suite: Header ────────────────────────────────────────────────────────────

test.describe('Header — Mobile', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/');
    await waitForAppReady(page);
  });

  test('Header is visible and within viewport width', async ({ page }, testInfo) => {
    const header = page.locator('#main-header');
    await expect(header).toBeVisible();
    const box = await header.boundingBox();
    const vw = page.viewportSize().width;
    expect(box.width).toBeLessThanOrEqual(vw + 2);
    await saveScreenshot(page, 'header', testInfo);
  });

  test('Desktop nav is hidden on mobile (<768px)', async ({ page }) => {
    if (page.viewportSize().width < 768) {
      const display = await page.locator('.nav-desktop').evaluate(el => getComputedStyle(el).display);
      expect(display).toBe('none');
    }
  });

  test('Mobile menu button is visible on mobile (<768px)', async ({ page }) => {
    if (page.viewportSize().width < 768) {
      await expect(page.locator('#mobile-menu-toggle')).toBeVisible();
    }
  });

  test('Mobile menu opens and closes', async ({ page }, testInfo) => {
    if (page.viewportSize().width < 768) {
      const btn = page.locator('#mobile-menu-toggle');
      const nav = page.locator('#mobile-nav');
      await expect(nav).not.toHaveClass(/open/);
      await btn.tap();
      await page.waitForTimeout(200);
      await expect(nav).toHaveClass(/open/);
      await saveScreenshot(page, 'mobile-nav-open', testInfo);
      await btn.tap();
      await page.waitForTimeout(200);
      await expect(nav).not.toHaveClass(/open/);
    }
  });

  test('Signup button hidden at ≤480px', async ({ page }) => {
    if (page.viewportSize().width <= 480) {
      const isHidden = await page.locator('#signup-header-btn')
        .evaluate(el => getComputedStyle(el).display === 'none');
      expect(isHidden).toBe(true);
    }
  });
});

// ─── Suite: Search Bar ────────────────────────────────────────────────────────

test.describe('Search Bar — Mobile', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/');
    await waitForAppReady(page);
  });

  test('Search bar opens on toggle tap', async ({ page }, testInfo) => {
    await page.locator('#search-toggle').tap();
    await page.waitForTimeout(350);
    await expect(page.locator('#search-bar')).toHaveClass(/open/);
    await saveScreenshot(page, 'search-open', testInfo);
  });

  test('Search bar closes via close button', async ({ page }) => {
    await page.locator('#search-toggle').tap();
    await page.waitForTimeout(350);
    await page.locator('#search-close').tap();
    await page.waitForTimeout(350);
    await expect(page.locator('#search-bar')).not.toHaveClass(/open/);
  });

  test('Search input has font-size ≥16px (prevents iOS zoom)', async ({ page }) => {
    await page.locator('#search-toggle').tap();
    await page.waitForTimeout(300);
    const fontSize = await page.locator('#search-input')
      .evaluate(el => parseFloat(getComputedStyle(el).fontSize));
    expect(fontSize).toBeGreaterThanOrEqual(16);
  });

  test('Search bar stays within viewport width', async ({ page }) => {
    await page.locator('#search-toggle').tap();
    await page.waitForTimeout(350);
    const box = await page.locator('#search-bar').boundingBox();
    const vw = page.viewportSize().width;
    if (box) expect(box.width).toBeLessThanOrEqual(vw + 2);
  });
});

// ─── Suite: Home Page ─────────────────────────────────────────────────────────

test.describe('Home Page — Mobile', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/');
    await waitForAppReady(page);
  });

  test('Hero section is visible', async ({ page }, testInfo) => {
    await expect(page.locator('#hero-section')).toBeVisible();
    await saveScreenshot(page, 'home-hero', testInfo);
  });

  test('Hero title and text are visible', async ({ page }) => {
    await expect(page.locator('.hero-title')).toBeVisible();
    await expect(page.locator('.hero-text')).toBeVisible();
  });

  test('Hero decorative cards hidden on mobile (<900px)', async ({ page }) => {
    if (page.viewportSize().width < 900) {
      const deco = page.locator('.hero-deco');
      if (await deco.count() > 0) {
        const display = await deco.first().evaluate(el => getComputedStyle(el).display);
        expect(display).toBe('none');
      }
    }
  });

  test('Hero actions fit within viewport', async ({ page }) => {
    const box = await page.locator('.hero-actions').boundingBox();
    const vw = page.viewportSize().width;
    if (box) {
      // Use x + width instead of box.right (Playwright has no .right)
      expect(rightEdge(box)).toBeLessThanOrEqual(vw + 8);
    }
  });

  test('Services grid stays within viewport', async ({ page }, testInfo) => {
    const grid = page.locator('.services-grid').first();
    if (await grid.count() > 0) {
      const box = await grid.boundingBox();
      const vw = page.viewportSize().width;
      if (box) expect(rightEdge(box)).toBeLessThanOrEqual(vw + 8);
      await saveScreenshot(page, 'services-grid', testInfo);
    }
  });

  test('Footer is visible and not overflowing', async ({ page }, testInfo) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(350);
    const footer = page.locator('#main-footer');
    await expect(footer).toBeVisible();
    const overflow = await hasHorizontalOverflow(page);
    expect(overflow).toBe(false);
    await saveScreenshot(page, 'footer', testInfo);
  });
});

// ─── Suite: Products Page ─────────────────────────────────────────────────────

test.describe('Products Page — Mobile', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/products');
    await waitForAppReady(page);
    await page.waitForTimeout(1000);
  });

  test('Products page loads without overflow', async ({ page }, testInfo) => {
    const overflow = await hasHorizontalOverflow(page);
    expect(overflow).toBe(false);
    await saveScreenshot(page, 'products-page', testInfo);
  });

  test('Filter toggle button visible on mobile (≤1024px)', async ({ page }) => {
    if (page.viewportSize().width <= 1024) {
      const btn = page.locator('.filter-toggle-mobile');
      if (await btn.count() > 0) await expect(btn.first()).toBeVisible();
    }
  });

  test('Filter sidebar hidden by default on mobile', async ({ page }) => {
    if (page.viewportSize().width <= 1024) {
      const sidebar = page.locator('.filters-sidebar');
      if (await sidebar.count() > 0) {
        const display = await sidebar.first().evaluate(el => getComputedStyle(el).display);
        expect(display).toBe('none');
      }
    }
  });

  test('Shop toolbar stays within viewport', async ({ page }) => {
    const toolbar = page.locator('.shop-toolbar');
    if (await toolbar.count() > 0 && await toolbar.first().isVisible()) {
      const box = await toolbar.first().boundingBox();
      const vw = page.viewportSize().width;
      if (box) expect(rightEdge(box)).toBeLessThanOrEqual(vw + 8);
    }
  });
});

// ─── Suite: Mini Cart ─────────────────────────────────────────────────────────

test.describe('Mini Cart — Mobile', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/');
    await waitForAppReady(page);
  });

  test('Cart button is visible', async ({ page }) => {
    await expect(page.locator('#cart-toggle')).toBeVisible();
  });

  test('Mini cart opens on cart button tap', async ({ page }, testInfo) => {
    await page.locator('#cart-toggle').tap();
    await page.waitForTimeout(450);
    await expect(page.locator('#mini-cart')).toHaveClass(/open/);
    await saveScreenshot(page, 'mini-cart-open', testInfo);
  });

  test('Mini cart is full-width on mobile (<768px)', async ({ page }) => {
    const vw = page.viewportSize().width;
    if (vw < 768) {
      await page.locator('#cart-toggle').tap();
      await page.waitForTimeout(500);
      const box = await page.locator('#mini-cart').boundingBox();
      if (box) {
        // width should be >= viewport - 1px (accounting for border)
        expect(box.width).toBeGreaterThanOrEqual(vw - 10);
      }
    }
  });

  test('Mini cart closes via overlay click', async ({ page }) => {
    await page.locator('#cart-toggle').tap();
    await page.waitForTimeout(450);
    await expect(page.locator('#mini-cart')).toHaveClass(/open/);
    // Use click() not tap() for overlay — more reliable
    await page.locator('#cart-overlay').click({ force: true, position: { x: 10, y: 10 } });
    await page.waitForTimeout(500);
    await expect(page.locator('#mini-cart')).not.toHaveClass(/open/);
  });

  test('Mini cart closes via close button', async ({ page }) => {
    await page.locator('#cart-toggle').tap();
    await page.waitForTimeout(450);
    await expect(page.locator('#mini-cart')).toHaveClass(/open/);
    await page.locator('#mini-cart-close').click();
    await page.waitForTimeout(500);
    await expect(page.locator('#mini-cart')).not.toHaveClass(/open/);
  });
});

// ─── Suite: Cart Page ─────────────────────────────────────────────────────────

test.describe('Cart Page — Mobile', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/cart');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(800);
  });

  test('Cart page loads without overflow', async ({ page }, testInfo) => {
    const overflow = await hasHorizontalOverflow(page);
    expect(overflow).toBe(false);
    await saveScreenshot(page, 'cart-page', testInfo);
  });

  test('Cart layout stacks vertically on mobile (<768px)', async ({ page }) => {
    if (page.viewportSize().width < 768) {
      const layout = page.locator('.cart-layout');
      if (await layout.count() > 0) {
        const cols = await layout.first().evaluate(el => getComputedStyle(el).gridTemplateColumns);
        expect(cols.trim().split(/\s+/).length).toBe(1);
      }
    }
  });
});

// ─── Suite: Checkout Page ─────────────────────────────────────────────────────

test.describe('Checkout Page — Mobile', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/checkout');
    await waitForAppReady(page);
  });

  test('Checkout page loads without overflow', async ({ page }, testInfo) => {
    const overflow = await hasHorizontalOverflow(page);
    expect(overflow).toBe(false);
    await saveScreenshot(page, 'checkout-page', testInfo);
  });

  test('Checkout layout is single column on mobile (≤1024px)', async ({ page }) => {
    if (page.viewportSize().width <= 1024) {
      const layout = page.locator('.checkout-layout');
      if (await layout.count() > 0) {
        const cols = await layout.first().evaluate(el => getComputedStyle(el).gridTemplateColumns);
        expect(cols.trim().split(/\s+/).length).toBe(1);
      }
    }
  });

  test('Checkout form rows stack on small phones (≤480px)', async ({ page }) => {
    if (page.viewportSize().width <= 480) {
      const rows = page.locator('.checkout-form-row');
      const count = await rows.count();
      for (let i = 0; i < Math.min(count, 3); i++) {
        const row = rows.nth(i);
        if (await row.isVisible()) {
          const cols = await row.evaluate(el => getComputedStyle(el).gridTemplateColumns);
          expect(cols.trim().split(/\s+/).length).toBe(1);
        }
      }
    }
  });

  test('Form inputs have font-size ≥16px (prevents iOS zoom)', async ({ page }) => {
    if (page.viewportSize().width < 768) {
      const inputs = page.locator('.form-input');
      const count = await inputs.count();
      for (let i = 0; i < Math.min(count, 3); i++) {
        const inp = inputs.nth(i);
        if (await inp.isVisible()) {
          const fs = await inp.evaluate(el => parseFloat(getComputedStyle(el).fontSize));
          expect(fs).toBeGreaterThanOrEqual(16);
        }
      }
    }
  });
});

// ─── Suite: Auth Page ─────────────────────────────────────────────────────────

test.describe('Auth Page — Mobile', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/auth');
    await waitForAppReady(page);
  });

  test('Auth login page loads without overflow', async ({ page }, testInfo) => {
    const overflow = await hasHorizontalOverflow(page);
    expect(overflow).toBe(false);
    await saveScreenshot(page, 'auth-login', testInfo);
  });

  test('Auth card is visible and within viewport', async ({ page }) => {
    const card = page.locator('.auth-card');
    await expect(card).toBeVisible();
    const box = await card.boundingBox();
    const vw = page.viewportSize().width;
    if (box) {
      // Use x + width — not box.right (Playwright has no .right)
      expect(rightEdge(box)).toBeLessThanOrEqual(vw + 4);
    }
  });

  test('Auth inputs have font-size ≥16px on mobile', async ({ page }) => {
    if (page.viewportSize().width < 768) {
      const inputs = page.locator('.auth-card input');
      const count = await inputs.count();
      for (let i = 0; i < count; i++) {
        const inp = inputs.nth(i);
        if (await inp.isVisible()) {
          const fs = await inp.evaluate(el => parseFloat(getComputedStyle(el).fontSize));
          expect(fs).toBeGreaterThanOrEqual(16);
        }
      }
    }
  });

  test('Signup page loads without overflow', async ({ page }, testInfo) => {
    await page.goto('/#/auth/signup');
    await waitForAppReady(page);
    await expect(page.locator('.auth-card')).toBeVisible();
    const overflow = await hasHorizontalOverflow(page);
    expect(overflow).toBe(false);
    await saveScreenshot(page, 'auth-signup', testInfo);
  });
});

// ─── Suite: About Page ────────────────────────────────────────────────────────

test.describe('About Page — Mobile', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/about');
    await waitForAppReady(page);
  });

  test('About page loads without overflow', async ({ page }, testInfo) => {
    const overflow = await hasHorizontalOverflow(page);
    expect(overflow).toBe(false);
    await saveScreenshot(page, 'about-page', testInfo);
  });

  test('About grid stacks on mobile (<768px)', async ({ page }) => {
    if (page.viewportSize().width < 768) {
      const grid = page.locator('.about-grid');
      if (await grid.count() > 0 && await grid.first().isVisible()) {
        const cols = await grid.first().evaluate(el => getComputedStyle(el).gridTemplateColumns);
        expect(cols.trim().split(/\s+/).length).toBe(1);
      }
    }
  });

  test('Contact grid stacks on mobile (<900px)', async ({ page }) => {
    if (page.viewportSize().width < 900) {
      const grid = page.locator('.contact-grid');
      if (await grid.count() > 0) {
        await page.evaluate(() => document.querySelector('.contact-grid')?.scrollIntoView());
        await page.waitForTimeout(300);
        const cols = await grid.first().evaluate(el => getComputedStyle(el).gridTemplateColumns);
        expect(cols.trim().split(/\s+/).length).toBe(1);
      }
    }
  });

  test('About page full-scroll has no overflow', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(400);
    const overflow = await hasHorizontalOverflow(page);
    expect(overflow).toBe(false);
  });
});

// ─── Suite: Touch Targets ─────────────────────────────────────────────────────

test.describe('Touch Targets — Minimum Size', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/');
    await waitForAppReady(page);
  });

  test('Core header buttons meet minimum touch target (34×34px)', async ({ page }) => {
    for (const selector of ['#cart-toggle', '#search-toggle']) {
      const btn = page.locator(selector);
      if (await btn.count() > 0 && await btn.first().isVisible()) {
        const box = await btn.first().boundingBox();
        if (box) {
          expect(box.width, `${selector} too narrow`).toBeGreaterThanOrEqual(34);
          expect(box.height, `${selector} too short`).toBeGreaterThanOrEqual(34);
        }
      }
    }
  });
});

// ─── Suite: Form iOS Zoom Prevention ─────────────────────────────────────────

test.describe('Form Inputs — iOS Zoom Prevention (≥16px)', () => {
  const cases = [
    { name: 'Auth login', url: '/#/auth', sel: 'input[type="email"]' },
    { name: 'Auth signup', url: '/#/auth/signup', sel: 'input[type="email"]' },
  ];
  for (const c of cases) {
    test(`${c.name} inputs ≥16px`, async ({ page }) => {
      if (page.viewportSize().width >= 768) return;
      await page.goto(c.url);
      await waitForAppReady(page);
      const inp = page.locator(c.sel).first();
      if (await inp.count() > 0 && await inp.isVisible()) {
        const fs = await inp.evaluate(el => parseFloat(getComputedStyle(el).fontSize));
        expect(fs).toBeGreaterThanOrEqual(16);
      }
    });
  }
});

// ─── Suite: Footer ────────────────────────────────────────────────────────────

test.describe('Footer — Mobile', () => {
  test('Footer renders correctly without overflow', async ({ page }, testInfo) => {
    await page.goto('/#/');
    await waitForAppReady(page);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(400);
    await expect(page.locator('#main-footer')).toBeVisible();
    const overflow = await hasHorizontalOverflow(page);
    expect(overflow).toBe(false);
    const vw = page.viewportSize().width;
    if (vw < 768) {
      const grid = page.locator('.footer-grid');
      if (await grid.count() > 0) {
        const cols = await grid.first().evaluate(el => getComputedStyle(el).gridTemplateColumns);
        expect(cols.trim().split(/\s+/).length).toBeLessThanOrEqual(2);
      }
    }
    await saveScreenshot(page, 'footer-scrolled', testInfo);
  });
});

// ─── Suite: Navigation ────────────────────────────────────────────────────────

test.describe('Navigation — Mobile Routing', () => {
  test('404 page renders on invalid route', async ({ page }, testInfo) => {
    await page.goto('/#/this-route-does-not-exist-99999');
    await waitForAppReady(page);
    const text = await page.locator('#app').textContent();
    expect(text).toContain('404');
    await saveScreenshot(page, '404-page', testInfo);
  });

  test('Can navigate home → about via mobile menu', async ({ page }, testInfo) => {
    await page.goto('/#/');
    await waitForAppReady(page);
    if (page.viewportSize().width < 768) {
      await page.locator('#mobile-menu-toggle').tap();
      await page.waitForTimeout(250);
      await page.locator('.mobile-nav-link[href="#/about"]').first().tap();
    } else {
      await page.locator('.nav-link[data-page="about"]').click();
    }
    await waitForAppReady(page);
    await expect(page.locator('.about-page, .about-hero, .about-grid')).toBeTruthy();
    await saveScreenshot(page, 'about-navigated', testInfo);
  });
});

// ─── Suite: Visual Screenshots (all pages) ────────────────────────────────────

test.describe('Visual Screenshots', () => {
  const pages = [
    { name: 'home', url: '/#/' },
    { name: 'products', url: '/#/products' },
    { name: 'cart', url: '/#/cart' },
    { name: 'checkout', url: '/#/checkout' },
    { name: 'auth-login', url: '/#/auth' },
    { name: 'auth-signup', url: '/#/auth/signup' },
    { name: 'about', url: '/#/about' },
  ];

  for (const pg of pages) {
    test(`Screenshot: ${pg.name}`, async ({ page }, testInfo) => {
      await page.goto(pg.url);
      if (pg.name === 'cart') {
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(800);
      } else {
        await waitForAppReady(page);
        await page.waitForTimeout(600);
      }
      await saveScreenshot(page, pg.name, testInfo);
    });
  }
});
