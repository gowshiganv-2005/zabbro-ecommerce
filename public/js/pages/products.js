/**
 * Products Listing Page Module
 */
function renderProductsPage(params = {}) {
  const app = document.getElementById('app');
  app.innerHTML = `
    <section class="section" style="padding-top:40px">
      <div class="container">
        <div class="section-header" style="text-align:left;margin-bottom:24px">
          <h1 class="section-title" style="font-size:1.75rem" id="shop-title">All Products</h1>
        </div>
        <div class="shop-toolbar">
          <div class="shop-results" id="shop-results">Loading...</div>
          <div style="display:flex;gap:12px;align-items:center">
            <button class="filter-toggle-mobile btn btn-sm btn-secondary" id="filter-toggle-mobile">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/></svg>
              Filters
            </button>
            <div class="shop-sort">
              <select id="sort-select">
                <option value="">Sort by: Default</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="name_asc">Name: A - Z</option>
                <option value="rating">Top Rated</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>
        </div>
        <div class="shop-layout">
          <aside class="filters-sidebar" id="filters-sidebar">
            <div class="filters-mobile-header">
              <button class="btn btn-sm btn-ghost" id="filters-close-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6"/></svg>
                Back
              </button>
              <h3>Filters</h3>
              <button class="btn btn-sm btn-ghost" id="filters-clear-btn" style="color:var(--danger)">Clear</button>
            </div>
            <div class="filter-group">
              <div class="filter-title">Category</div>
              <div id="filter-categories"></div>
            </div>
            <div class="filter-group">
              <div class="filter-title">Price Range</div>
              <div class="price-range-inputs">
                <input type="number" id="filter-min-price" placeholder="Min" min="0">
                <input type="number" id="filter-max-price" placeholder="Max" min="0">
              </div>
              <button class="btn btn-sm btn-ghost" style="margin-top:8px" id="apply-price-filter">Apply</button>
            </div>
            <div class="filter-group">
              <div class="filter-title">Collection</div>
              <div class="filter-option" data-filter="featured" id="filter-featured">
                <div class="filter-checkbox"></div> Featured
              </div>
              <div class="filter-option" data-filter="bestSeller" id="filter-bestseller">
                <div class="filter-checkbox"></div> Best Sellers
              </div>
              <div class="filter-option" data-filter="newArrival" id="filter-new">
                <div class="filter-checkbox"></div> New Arrivals
              </div>
            </div>
            <button class="btn btn-primary btn-full" id="filters-apply-close" style="margin-top:12px">Show Results</button>
          </aside>
          <div>
            <div class="product-grid" id="products-grid"></div>
            <div id="products-pagination" class="pagination"></div>
          </div>
        </div>
      </div>
    </section>
  `;

  initProductsPage(params);
}

async function initProductsPage(params) {
  const state = {
    category: params.category || '',
    search: params.search || '',
    sort: params.sort || '',
    minPrice: params.minPrice || '',
    maxPrice: params.maxPrice || '',
    featured: params.featured || '',
    bestSeller: params.bestSeller || '',
    newArrival: params.newArrival || '',
    page: parseInt(params.page) || 1
  };

  // Load categories for filter
  try {
    const catRes = await API.products.categories();
    const catContainer = document.getElementById('filter-categories');
    if (catContainer && catRes.success) {
      catContainer.innerHTML = `
        <div class="filter-option ${!state.category ? 'active' : ''}" data-category="">
          <div class="filter-checkbox"></div> All Categories
        </div>
        ${catRes.data.map(c => `
          <div class="filter-option ${state.category === c.name ? 'active' : ''}" data-category="${c.name}">
            <div class="filter-checkbox"></div> ${c.name}
            <span class="filter-count">${c.count}</span>
          </div>
        `).join('')}
      `;

      catContainer.querySelectorAll('.filter-option').forEach(el => {
        el.addEventListener('click', () => {
          state.category = el.dataset.category;
          state.page = 1;
          catContainer.querySelectorAll('.filter-option').forEach(e => e.classList.remove('active'));
          el.classList.add('active');
          loadProducts(state);
        });
      });
    }
  } catch (e) { /* ignore */ }

  // Sort handler
  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    sortSelect.value = state.sort;
    sortSelect.addEventListener('change', () => {
      state.sort = sortSelect.value;
      state.page = 1;
      loadProducts(state);
    });
  }

  // Price filter
  const applyPrice = document.getElementById('apply-price-filter');
  if (applyPrice) {
    applyPrice.addEventListener('click', () => {
      state.minPrice = document.getElementById('filter-min-price').value;
      state.maxPrice = document.getElementById('filter-max-price').value;
      state.page = 1;
      loadProducts(state);
    });
  }

  // Collection filters
  ['featured', 'bestseller', 'new'].forEach(f => {
    const el = document.getElementById(`filter-${f}`);
    if (el) {
      const key = f === 'bestseller' ? 'bestSeller' : f === 'new' ? 'newArrival' : f;
      if (state[key] === 'true') el.classList.add('active');
      el.addEventListener('click', () => {
        el.classList.toggle('active');
        state[key] = el.classList.contains('active') ? 'true' : '';
        state.page = 1;
        loadProducts(state);
      });
    }
  });

  // Clear filters
  document.getElementById('clear-filters')?.addEventListener('click', () => {
    Object.keys(state).forEach(k => { if (k !== 'page') state[k] = ''; });
    state.page = 1;
    document.querySelectorAll('.filter-option.active').forEach(e => e.classList.remove('active'));
    document.querySelector('[data-category=""]')?.classList.add('active');
    if (sortSelect) sortSelect.value = '';
    const minP = document.getElementById('filter-min-price'); if (minP) minP.value = '';
    const maxP = document.getElementById('filter-max-price'); if (maxP) maxP.value = '';
    loadProducts(state);
  });

  // Mobile filter toggle
  const filterSidebar = document.getElementById('filters-sidebar');
  const closeFilters = () => filterSidebar?.classList.remove('open');
  document.getElementById('filter-toggle-mobile')?.addEventListener('click', () => {
    filterSidebar?.classList.toggle('open');
  });
  document.getElementById('filters-close-btn')?.addEventListener('click', closeFilters);
  document.getElementById('filters-apply-close')?.addEventListener('click', closeFilters);
  document.getElementById('filters-clear-btn')?.addEventListener('click', () => {
    document.getElementById('clear-filters')?.click();
  });

  // Update title & SEO Category intro
  const title = document.getElementById('shop-title');
  const catIntros = {
    'websites': 'Explore custom high-performance website design, e-commerce stores, and web development services engineered by ZABBRO.',
    'projects': 'Discover scalable software projects, full-stack architectures, and digital solutions designed by Zabbro Digital Solutions.',
    't-shirts': 'Shop premium luxury lifestyle apparel and minimalist graphic tees crafted with sustainable, breathable fabrics.',
    'tech accessories': 'Smart modern technology accessories, cables, stands, and gadgets engineered for productivity and lifestyle.',
    'wooden products': 'Handcrafted artisanal wooden decor, organizers, and timeless natural items for modern living spaces.',
    'plants': 'Indoor flora and botanical accessories curated to bring refreshing natural aesthetics into your home or office.',
    'stickers': 'High-durability waterproof vinyl stickers and creative decals designed for laptops, gadgets, and accessories.',
    'customized products': 'Personalized and bespoke merchandise tailored to your exact style and branding requirements.'
  };

  const resultsHeader = document.querySelector('.section-header');
  let introEl = document.getElementById('shop-category-desc');
  if (!introEl && resultsHeader) {
    introEl = document.createElement('p');
    introEl.id = 'shop-category-desc';
    introEl.className = 'section-subtitle';
    introEl.style.marginTop = '6px';
    resultsHeader.appendChild(introEl);
  }

  if (title) {
    if (state.category) {
      title.textContent = `${state.category} Collection`;
      if (introEl) introEl.textContent = catIntros[state.category.toLowerCase()] || `Browse our curated collection of ${state.category} at ZABBRO.`;
    } else if (state.search) {
      title.textContent = `Search: "${state.search}"`;
      if (introEl) introEl.textContent = `Showing all matching ZABBRO products and services for "${state.search}".`;
    } else {
      title.textContent = 'All Products & Digital Solutions';
      if (introEl) introEl.textContent = 'Explore our complete catalog of curated lifestyle products, web services, and tech innovations.';
    }
  }

  loadProducts(state);
}

async function loadProducts(state) {
  const grid = document.getElementById('products-grid');
  if (!grid) return;

  // Show loading skeletons
  grid.innerHTML = Array(8).fill('<div class="skeleton skeleton-card"></div>').join('');

  try {
    const queryParams = {};
    if (state.category) queryParams.category = state.category;
    if (state.search) queryParams.search = state.search;
    if (state.sort) queryParams.sort = state.sort;
    if (state.minPrice) queryParams.minPrice = state.minPrice;
    if (state.maxPrice) queryParams.maxPrice = state.maxPrice;
    if (state.featured) queryParams.featured = state.featured;
    if (state.bestSeller) queryParams.bestSeller = state.bestSeller;
    if (state.newArrival) queryParams.newArrival = state.newArrival;
    queryParams.page = state.page;
    queryParams.limit = 12;

    const res = await API.products.list(queryParams);

    if (res.success && res.data.length > 0) {
      grid.innerHTML = res.data.map((p, i) => renderProductCard(p, i)).join('');
    } else {
      grid.innerHTML = `
        <div style="grid-column:1/-1;text-align:center;padding:80px 20px">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin:0 auto 16px;color:var(--text-muted);opacity:.3"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <h3 style="margin-bottom:8px">No products found</h3>
          <p style="color:var(--text-secondary)">Try adjusting your filters or search terms</p>
        </div>
      `;
    }

    // Update results count
    const resultsEl = document.getElementById('shop-results');
    if (resultsEl) resultsEl.textContent = `Showing ${res.data.length} of ${res.total} products`;

    // Render pagination
    renderPagination(res.page, res.totalPages, state);
  } catch (err) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:60px;color:var(--danger)">Failed to load products. Please try again.</div>`;
  }
}

function renderPagination(current, total, state) {
  const container = document.getElementById('products-pagination');
  if (!container || total <= 1) { if (container) container.innerHTML = ''; return; }

  let html = '';
  for (let i = 1; i <= total; i++) {
    html += `<button class="pagination-btn ${i === current ? 'active' : ''}" data-page="${i}">${i}</button>`;
  }
  container.innerHTML = html;

  container.querySelectorAll('.pagination-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.page = parseInt(btn.dataset.page);
      loadProducts(state);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}
