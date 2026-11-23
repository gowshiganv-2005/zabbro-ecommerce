/**
 * ZABBRO Commerce Dedicated Landing Page Module
 * Displays:
 *  - Premium Hero Banner
 *  - Curated Collections (Shop by Category)
 *  - Handpicked by Editors (Featured Products & Innovations)
 *  - Top Rated & Loved (Best Sellers: Most Loved by Customers)
 *  - Brand Trust Standards
 */

function renderCommercePage() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <!-- Curated Collections Section -->
    <section class="section" id="categories-section" aria-label="ZABBRO Shop Categories" style="background:var(--bg);padding-top:40px">
      <div class="container">
        <div class="section-header">
          <div class="section-label">Curated Collections</div>
          <h2 class="section-title">Shop by Category</h2>
          <p class="section-subtitle">Explore premium projects, apparel, handcrafted wooden items, tech gear, and smart living essentials.</p>
        </div>
        <div class="categories-grid" id="commerce-categories-grid"></div>
      </div>
    </section>

    <!-- Handpicked by Editors Section -->
    <section class="section" style="background:var(--white)" aria-label="ZABBRO Featured Products">
      <div class="container">
        <div class="section-header">
          <div class="section-label">Handpicked by Editors</div>
          <h2 class="section-title">Featured Products &amp; Innovations</h2>
          <p class="section-subtitle">Our curated selection of premium products crafted for quality, durability, and aesthetics.</p>
        </div>
        <div class="product-grid" id="commerce-featured-products"></div>
        <div style="text-align:center;margin-top:40px">
          <a href="#/products" class="btn btn-secondary" aria-label="View all ZABBRO products">View All Products</a>
        </div>
      </div>
    </section>

    <!-- Top Rated & Loved Section -->
    <section class="section" style="background:var(--bg)" aria-label="ZABBRO Best Sellers">
      <div class="container">
        <div class="section-header">
          <div class="section-label">Top Rated &amp; Loved</div>
          <h2 class="section-title">Best Sellers: Most Loved by Customers</h2>
          <p class="section-subtitle">Explore the most popular items verified by our global community of buyers.</p>
        </div>
        <div class="product-grid" id="commerce-bestseller-products"></div>
      </div>
    </section>

    <!-- Brand Trust & Guarantee Strip -->
    <section class="section" style="background:var(--white);padding:55px 0" aria-label="Why Shop with ZABBRO Commerce">
      <div class="container">
        <div class="about-grid" style="margin-bottom:0">
          <div class="about-card fade-in" style="animation-delay:.1s">
            <div class="about-card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <h3>100% Quality Guaranteed</h3>
            <p>Every product undergoes multi-tier physical & functional inspections to ensure authentic, enduring quality.</p>
          </div>
          <div class="about-card fade-in" style="animation-delay:.2s">
            <div class="about-card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
            </div>
            <h3>Worldwide Express Shipping</h3>
            <p>Fast tracked logistics across 50+ countries. Direct doorstep delivery with realtime tracking.</p>
          </div>
          <div class="about-card fade-in" style="animation-delay:.3s">
            <div class="about-card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </div>
            <h3>7-Day Dedicated Support</h3>
            <p>Direct assistance for orders, exchanges, and customer care from our headquarters.</p>
          </div>
        </div>
      </div>
    </section>
  `;

  loadCommerceData();
  if (typeof lucide !== 'undefined' && lucide.createIcons) {
    lucide.createIcons();
  }
}

async function loadCommerceData() {
  const defaultIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>';
  const categoryIcons = {
    'projects': '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>',
    't-shirts': '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.47a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.47a2 2 0 00-1.34-2.23z"/></svg>',
    'websites': '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>',
    'wooden products': '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>',
    'trendy products': '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m13 2-2 2.5h3L12 13"/><path d="M16 18a4 4 0 0 0-8 0"/></svg>',
    'plants': '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 20s-1-4-4-5"/><path d="M14 20s1-4 4-5"/><path d="M12 20s-1-7-5-8"/><path d="M12 20s1-7 5-8"/><path d="M12 4v16"/></svg>',
    'stickers': '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 10h.01"/><path d="M15 10h.01"/><path d="M12 18c-4 0-5-4-5-4h10s-1 4-5 4Z"/><path d="M3.1 9a10 10 0 1 1 17.8 0"/><path d="M21 15a10 10 0 0 1-17.8 0"/></svg>',
    'tech accessories': '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>',
    'customized products': '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>',
    'home decor': '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>'
  };

  try {
    // 1. Load Categories
    const catRes = await API.products.categories();
    const catGrid = document.getElementById('commerce-categories-grid');
    if (catGrid && catRes.success) {
      catGrid.innerHTML = catRes.data.map((cat, i) => {
        const name = cat.name || 'Unknown';
        const icon = categoryIcons[name.toLowerCase()] || defaultIcon;
        return `
          <a href="#/products?category=${encodeURIComponent(name)}" class="category-card fade-in" style="animation-delay:${i * .08}s" aria-label="Browse ZABBRO ${name} collection">
            <div class="category-card-icon">${icon}</div>
            <div class="category-card-name">${name}</div>
            <div class="category-card-count">${cat.count || 0} products</div>
          </a>
        `;
      }).join('');
    }

    // 2. Load Featured Products (Handpicked by Editors)
    const featRes = await API.products.list({ featured: true, limit: 8 });
    const featGrid = document.getElementById('commerce-featured-products');
    if (featGrid && featRes.success) {
      featGrid.innerHTML = featRes.data.map((p, i) => renderProductCard(p, i)).join('');
    }

    // 3. Load Best Sellers (Top Rated & Loved)
    const bestRes = await API.products.list({ bestSeller: true, limit: 8 });
    const bestGrid = document.getElementById('commerce-bestseller-products');
    if (bestGrid && bestRes.success) {
      bestGrid.innerHTML = bestRes.data.map((p, i) => renderProductCard(p, i)).join('');
    }
  } catch (err) {
    console.error('Failed to load commerce data:', err);
  }
}
