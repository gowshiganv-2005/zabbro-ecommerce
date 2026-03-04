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
    'Projects': '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>',
    'T-shirts': '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.47a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.47a2 2 0 00-1.34-2.23z"/></svg>',
    'Websites': '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>',
    'Wooden Products': '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>',
    'Trendy Products': '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m13 2-2 2.5h3L12 13"/><path d="M16 18a4 4 0 0 0-8 0"/></svg>',
    'Plants': '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 20s-1-4-4-5"/><path d="M14 20s1-4 4-5"/><path d="M12 20s-1-7-5-8"/><path d="M12 20s1-7 5-8"/><path d="M12 4v16"/></svg>',
    'Stickers': '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 10h.01"/><path d="M15 10h.01"/><path d="M12 18c-4 0-5-4-5-4h10s-1 4-5 4Z"/><path d="M3.1 9a10 10 0 1 1 17.8 0"/><path d="M21 15a10 10 0 0 1-17.8 0"/></svg>',
    'Tech Accessories': '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>',
    'Customized Products': '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>'
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
