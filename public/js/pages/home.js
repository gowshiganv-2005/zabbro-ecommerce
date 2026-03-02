/**
 * Home Page Module
 */
function renderHomePage() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <!-- Hero Section -->
    <section class="hero" id="hero-section">
      <div class="hero-bg" id="hero-bg"></div>
      <div class="hero-overlay"></div>
      <div class="container">
        <div class="hero-content fade-in-up">
          <div class="hero-badge">
            <span class="hero-badge-dot"></span>
            New Collection 2026
          </div>
          <h1 class="hero-title">Elevate Your <span>Everyday</span></h1>
          <p class="hero-text">Discover a curated selection of premium products designed for those who appreciate quality, craftsmanship, and timeless design.</p>
          <div class="hero-actions">
            <a href="#/products" class="btn btn-primary btn-lg">Shop Collection</a>
            <a href="#/products?featured=true" class="btn btn-secondary btn-lg">Featured Items</a>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories Section -->
    <section class="section" id="categories-section">
      <div class="container">
        <div class="section-header">
          <div class="section-label">Browse By</div>
          <h2 class="section-title">Shop Categories</h2>
        </div>
        <div class="categories-grid" id="categories-grid"></div>
      </div>
    </section>

    <!-- Featured Products -->
    <section class="section" style="background:var(--white);">
      <div class="container">
        <div class="section-header">
          <div class="section-label">Handpicked</div>
          <h2 class="section-title">Featured Products</h2>
          <p class="section-subtitle">Our editors' selection of the finest products this season</p>
        </div>
        <div class="product-grid" id="featured-products"></div>
        <div style="text-align:center;margin-top:40px;">
          <a href="#/products" class="btn btn-secondary">View All Products</a>
        </div>
      </div>
    </section>

    <!-- Best Sellers -->
    <section class="section">
      <div class="container">
        <div class="section-header">
          <div class="section-label">Most Loved</div>
          <h2 class="section-title">Best Sellers</h2>
          <p class="section-subtitle">Top-rated products loved by our customers</p>
        </div>
        <div class="product-grid" id="bestseller-products"></div>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="section" style="background:var(--white);">
      <div class="container">
        <div class="section-header">
          <div class="section-label">What People Say</div>
          <h2 class="section-title">Customer Stories</h2>
        </div>
        <div class="testimonials-grid">
          <div class="testimonial-card fade-in" style="animation-delay:.1s">
            <div class="testimonial-stars">${renderStars(5)}</div>
            <p class="testimonial-text">"The quality of products from ZABBRO is unmatched. Every item feels premium and thoughtfully designed. My home has never looked better."</p>
            <div class="testimonial-author">
              <div class="testimonial-avatar">SC</div>
              <div><div class="testimonial-name">Sarah Chen</div><div class="testimonial-role">Interior Designer</div></div>
            </div>
          </div>
          <div class="testimonial-card fade-in" style="animation-delay:.2s">
            <div class="testimonial-stars">${renderStars(5)}</div>
            <p class="testimonial-text">"I've been a loyal customer for over a year. The attention to detail in packaging and the quality of each product is truly exceptional."</p>
            <div class="testimonial-author">
              <div class="testimonial-avatar">MR</div>
              <div><div class="testimonial-name">Marcus Rivera</div><div class="testimonial-role">Architect</div></div>
            </div>
          </div>
          <div class="testimonial-card fade-in" style="animation-delay:.3s">
            <div class="testimonial-stars">${renderStars(5)}</div>
            <p class="testimonial-text">"Fast shipping, beautiful products, and outstanding customer service. ZABBRO has become my go-to for gifts and personal treats."</p>
            <div class="testimonial-author">
              <div class="testimonial-avatar">EJ</div>
              <div><div class="testimonial-name">Emily Johnson</div><div class="testimonial-role">Creative Director</div></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;

  loadHomeData();
  initHeroParallax();
}

/** Parallax scroll effect for hero background */
function initHeroParallax() {
  const heroBg = document.getElementById('hero-bg');
  const hero = document.getElementById('hero-section');
  if (!heroBg || !hero) return;

  let ticking = false;
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const heroH = hero.offsetHeight;
        // Only animate while hero is visible
        if (scrollY < heroH + 100) {
          const translateY = scrollY * 0.35;
          heroBg.style.transform = `translateY(${translateY}px) scale(1.1)`;
        }
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  // Cleanup when navigating away
  window._heroParallaxCleanup = () => window.removeEventListener('scroll', onScroll);
}

async function loadHomeData() {
  const categoryIcons = {
    'Home Decor': '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
    'Electronics': '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/></svg>',
    'Accessories': '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    'Kitchen': '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 8h1a4 4 0 110 8h-1"/><path d="M3 8h14v9a4 4 0 01-4 4H7a4 4 0 01-4-4Z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/></svg>',
    'Lighting': '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 006 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>'
  };

  try {
    // Load categories
    const catRes = await API.products.categories();
    const catGrid = document.getElementById('categories-grid');
    if (catGrid && catRes.success) {
      catGrid.innerHTML = catRes.data.map((cat, i) => `
        <a href="#/products?category=${encodeURIComponent(cat.name)}" class="category-card fade-in" style="animation-delay:${i * .1}s">
          <div class="category-card-icon">${categoryIcons[cat.name] || categoryIcons['Home Decor']}</div>
          <div class="category-card-name">${cat.name}</div>
          <div class="category-card-count">${cat.count} products</div>
        </a>
      `).join('');
    }

    // Load featured products
    const featRes = await API.products.list({ featured: true, limit: 4 });
    const featGrid = document.getElementById('featured-products');
    if (featGrid && featRes.success) {
      featGrid.innerHTML = featRes.data.map((p, i) => renderProductCard(p, i)).join('');
    }

    // Load best sellers
    const bestRes = await API.products.list({ bestSeller: true, limit: 4 });
    const bestGrid = document.getElementById('bestseller-products');
    if (bestGrid && bestRes.success) {
      bestGrid.innerHTML = bestRes.data.map((p, i) => renderProductCard(p, i)).join('');
    }
  } catch (err) {
    console.error('Failed to load home data:', err);
  }
}

/** Render a product card */
function renderProductCard(product, index = 0) {
  const discount = product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
  const isNew = product.newArrival === true || product.newArrival === 'TRUE';
  const isBest = product.bestSeller === true || product.bestSeller === 'TRUE';

  return `
    <div class="product-card fade-in" style="animation-delay:${index * .08}s">
      <a href="#/product/${product.id}">
        <div class="product-card-img-wrap">
          <div class="product-card-img" style="background:var(--bg-alt);display:flex;align-items:center;justify-content:center;position:absolute;inset:0">
            ${product.image ? `<img src="${product.image}" alt="${product.name}" style="width:100%;height:100%;object-fit:cover" onerror="this.style.display='none'">` : ''}
            <span style="color:var(--text-muted);font-size:.75rem;position:absolute">${product.category}</span>
          </div>
          <div class="product-card-badges">
            ${isNew ? '<span class="badge badge-new">New</span>' : ''}
            ${discount > 0 ? `<span class="badge badge-sale">${discount}% Off</span>` : ''}
            ${isBest ? '<span class="badge badge-best">Best Seller</span>' : ''}
          </div>
          <div class="product-card-quick-add">
            <button class="btn btn-primary btn-full btn-sm" onclick="event.preventDefault();event.stopPropagation();Store.addToCart({id:'${product.id}',name:'${product.name.replace(/'/g, "\\'")}',price:${product.price},image:'${product.image || ''}',category:'${product.category}'})">
              Add to Bag
            </button>
          </div>
        </div>
      </a>
      <div class="product-card-body">
        <div class="product-card-category">${product.brand || product.category}</div>
        <a href="#/product/${product.id}" class="product-card-name">${product.name}</a>
        <div class="product-card-price">
          <span class="price-current">${formatPrice(product.price)}</span>
          ${product.originalPrice > product.price ? `<span class="price-original">${formatPrice(product.originalPrice)}</span>` : ''}
        </div>
        <div class="product-card-rating">
          <div class="stars">${renderStars(product.rating || 0)}</div>
          <span class="rating-count">(${product.reviewCount || 0})</span>
        </div>
      </div>
    </div>
  `;
}
