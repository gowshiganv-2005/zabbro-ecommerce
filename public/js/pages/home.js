/**
 * Home Page Module — Optimized for High-Converting On-Page SEO
 */
function renderHomePage() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <!-- Hero Section -->
    <section class="hero" id="hero-section" aria-label="ZABBRO Official Store Welcome">
      <div class="hero-bg" id="hero-bg"></div>
      <div class="hero-overlay"></div>
      <div class="container">
        <div class="hero-content fade-in-up">
          <div class="hero-badge">
            <span class="hero-badge-dot"></span>
            Official Collection 2026
          </div>
          <h1 class="hero-title">Elevate Your Everyday with <span>ZABBRO</span></h1>
          <p class="hero-text">Discover curated lifestyle products, intelligent AI tools, and custom digital software engineered by Zabbro Digital Solutions for quality, craft, and impact.</p>
          <div class="hero-actions">
            <a href="#/products" class="btn btn-primary btn-lg" aria-label="Explore ZABBRO Shop Collection">Shop Collection</a>
            <a href="#/products?featured=true" class="btn btn-secondary btn-lg" aria-label="View ZABBRO Featured Items">Featured Items</a>
          </div>
        </div>
      </div>
    </section>

    <!-- Section: Our Outcomes (Hudson Inspired Folio Layout) -->
    <section class="section hudson-outcomes-section" id="exclusive-outcomes-section" aria-label="ZABBRO Outcomes">
      <div class="container">
        <!-- Hudson Style Section Header with large data-num="01" -->
        <div class="hudson-section-header" data-num="01">
          <h2 class="hudson-display-title">Our Outcomes.</h2>
        </div>

        <!-- Hudson 2-Column Folio Entries Grid -->
        <div class="hudson-folio-entries">
          <!-- Entry 01: Zabbro Digital Solutions -->
          <div class="hudson-entry">
            <a href="#/digital-solutions" class="hudson-entry-link" aria-label="Zabbro Digital Solutions">
              <div class="hudson-entry-thumb">
                <img src="/images/outcomes/hudson-wb2.jpg" alt="Zabbro Digital Solutions" loading="lazy">
              </div>
              <div class="hudson-entry-info">
                <h4 class="hudson-entry-title">Zabbro Digital Solutions</h4>
                <div class="hudson-entry-cat">Elevating Digital Presence &amp; Web Design</div>
              </div>
            </a>
          </div>

          <!-- Entry 02: Zabbro Commerce -->
          <div class="hudson-entry">
            <a href="#/commerce" class="hudson-entry-link" aria-label="Zabbro Commerce">
              <div class="hudson-entry-thumb">
                <img src="/images/outcomes/zabbro-commerce-store.jpg" alt="Zabbro Commerce" loading="lazy">
              </div>
              <div class="hudson-entry-info">
                <h4 class="hudson-entry-title">Zabbro Commerce</h4>
                <div class="hudson-entry-cat">Empowering Online Brands &amp; Digital Store</div>
              </div>
            </a>
          </div>

          <!-- Entry 03: WhatsApp Automations -->
          <div class="hudson-entry">
            <div class="hudson-entry-link hudson-entry-locked" tabindex="0">
              <div class="hudson-entry-thumb">
                <img src="/images/outcomes/hudson-cs3.jpg" alt="WhatsApp Automations - Coming Soon" loading="lazy">
              </div>
              <div class="hudson-entry-info">
                <h4 class="hudson-entry-title">WhatsApp Automations</h4>
                <div class="hudson-entry-cat">Seamless Business Communication &amp; Digital Presence</div>
              </div>
            </div>
          </div>

          <!-- Entry 04: Zabbro RPT -->
          <div class="hudson-entry">
            <div class="hudson-entry-link hudson-entry-locked" tabindex="0">
              <div class="hudson-entry-thumb">
                <img src="/images/outcomes/hudson-cs3.jpg" alt="Zabbro RPT - Coming Soon" loading="lazy">
              </div>
              <div class="hudson-entry-info">
                <h4 class="hudson-entry-title">Zabbro RPT</h4>
                <div class="hudson-entry-cat">Our exclusive Research Pretrained Transformer LLM for research work</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Section 02: Our Achievements (Hudson Number Counters) -->
    <section class="section hudson-achievements-section" id="achievements-section" aria-label="ZABBRO Achievements">
      <div class="container">
        <!-- Hudson Style Section Header with large data-num="02" -->
        <div class="hudson-section-header" data-num="02">
          <h2 class="hudson-display-title">Our Achievements.</h2>
        </div>

        <!-- 2x2 Counter Grid from Hudson -->
        <div class="hudson-counter-grid">
          <!-- Counter Item 1: Happy Customers -->
          <div class="hudson-counter-item">
            <div class="hudson-counter-num">80<span>+</span></div>
            <h5 class="hudson-counter-title">Happy Customers</h5>
            <p class="hudson-counter-desc">
              Trusted by fast-growing enterprises, visionary entrepreneurs, and global consumers who rely on ZABBRO quality every single day.
            </p>
          </div>

          <!-- Counter Item 2: Projects Completed -->
          <div class="hudson-counter-item">
            <div class="hudson-counter-num">120<span>+</span></div>
            <h5 class="hudson-counter-title">Projects Completed</h5>
            <p class="hudson-counter-desc">
              High-impact websites, full-stack web applications, AI automation tools, and custom digital systems delivered on schedule.
            </p>
          </div>

          <!-- Counter Item 3: Lines of Code -->
          <div class="hudson-counter-item">
            <div class="hudson-counter-num">23k<span>+</span></div>
            <h5 class="hudson-counter-title">Lines of Code</h5>
            <p class="hudson-counter-desc">
              Clean, modular, and maintainable software architecture engineered with state-of-the-art frameworks and industry best practices.
            </p>
          </div>

          <!-- Counter Item 4: Positive Feedback -->
          <div class="hudson-counter-item">
            <div class="hudson-counter-num">85<span>+</span></div>
            <h5 class="hudson-counter-title">Positive Feedback</h5>
            <p class="hudson-counter-desc">
              Consistently rated with top satisfaction scores across product durability, web craft, communication, and post-launch support.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Brand Trust & Values Section (E-E-A-T On-Page Signals) -->
    <section class="section" style="background:var(--white);padding-top:50px;padding-bottom:50px" aria-label="Why Shop with ZABBRO">
      <div class="container">
        <div class="section-header">
          <div class="section-label">The ZABBRO Standard</div>
          <h2 class="section-title">Why Choose ZABBRO?</h2>
          <p class="section-subtitle">We merge thoughtful physical craftsmanship with innovative digital systems.</p>
        </div>
        <div class="about-grid" style="margin-bottom:0">
          <div class="about-card fade-in" style="animation-delay:.1s">
            <div class="about-card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <h3>100% Quality Guaranteed</h3>
            <p>Every product undergoes stringent multi-tier quality checks. From fabric density to code precision, excellence is our baseline.</p>
          </div>
          <div class="about-card fade-in" style="animation-delay:.2s">
            <div class="about-card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
            </div>
            <h3>Worldwide Express Shipping</h3>
            <p>Fast, tracked global delivery to over 50 countries. Domestic Indian orders reach your doorstep within 3-5 business days.</p>
          </div>
          <div class="about-card fade-in" style="animation-delay:.3s">
            <div class="about-card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </div>
            <h3>Dedicated 7-Day Support</h3>
            <p>Our direct support team in Madurai, India is available to assist with orders, technical inquiries, and custom projects.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Interactive FAQ Section (Schema.org FAQPage Rich Snippet) -->
    <section class="section" id="faq-section" aria-label="Frequently Asked Questions about ZABBRO">
      <div class="container" style="max-width:900px">
        <div class="section-header">
          <div class="section-label">Got Questions?</div>
          <h2 class="section-title">Frequently Asked Questions</h2>
          <p class="section-subtitle">Everything you need to know about ZABBRO products, digital services, and ordering.</p>
        </div>
        <div class="faq-accordion" style="display:flex;flex-direction:column;gap:16px">
          <details class="faq-item" style="background:var(--white);padding:20px 24px;border-radius:var(--radius-md);border:1px solid var(--border);cursor:pointer">
            <summary style="font-weight:600;font-size:1.05rem;color:var(--text-primary);list-style:none;display:flex;justify-content:space-between;align-items:center">
              <span>What is ZABBRO and what do you offer?</span>
              <span style="font-size:1.2rem;color:var(--text-muted)">+</span>
            </summary>
            <p style="margin-top:12px;color:var(--text-secondary);line-height:1.6;font-size:.95rem">
              ZABBRO (operated by Zabbro Digital Solutions &amp; Zabbro Group of Companies) is a technology and premium lifestyle platform offering custom website development, AI &amp; chatbot solutions, luxury apparel, tech accessories, and smart products with global shipping.
            </p>
          </details>

          <details class="faq-item" style="background:var(--white);padding:20px 24px;border-radius:var(--radius-md);border:1px solid var(--border);cursor:pointer">
            <summary style="font-weight:600;font-size:1.05rem;color:var(--text-primary);list-style:none;display:flex;justify-content:space-between;align-items:center">
              <span>How long does delivery take for ZABBRO orders?</span>
              <span style="font-size:1.2rem;color:var(--text-muted)">+</span>
            </summary>
            <p style="margin-top:12px;color:var(--text-secondary);line-height:1.6;font-size:.95rem">
              We deliver worldwide with express tracked shipping. Domestic deliveries within India typically take 3 to 5 business days, while international shipments arrive within 7 to 12 business days.
            </p>
          </details>

          <details class="faq-item" style="background:var(--white);padding:20px 24px;border-radius:var(--radius-md);border:1px solid var(--border);cursor:pointer">
            <summary style="font-weight:600;font-size:1.05rem;color:var(--text-primary);list-style:none;display:flex;justify-content:space-between;align-items:center">
              <span>How can I order custom software, web design, or AI workflows?</span>
              <span style="font-size:1.2rem;color:var(--text-muted)">+</span>
            </summary>
            <p style="margin-top:12px;color:var(--text-secondary);line-height:1.6;font-size:.95rem">
              You can explore our Website, AI, and Automation service collections directly through our store or reach out through our Contact page for customized enterprise requirements.
            </p>
          </details>

          <details class="faq-item" style="background:var(--white);padding:20px 24px;border-radius:var(--radius-md);border:1px solid var(--border);cursor:pointer">
            <summary style="font-weight:600;font-size:1.05rem;color:var(--text-primary);list-style:none;display:flex;justify-content:space-between;align-items:center">
              <span>What is your return and refund policy?</span>
              <span style="font-size:1.2rem;color:var(--text-muted)">+</span>
            </summary>
            <p style="margin-top:12px;color:var(--text-secondary);line-height:1.6;font-size:.95rem">
              We offer a 30-day hassle-free return window on physical lifestyle and accessory products. If you are not satisfied, our support team will guide you through an easy return process.
            </p>
          </details>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="section" style="background:var(--white);" aria-label="Customer Reviews for ZABBRO">
      <div class="container">
        <div class="section-header">
          <div class="section-label">Verified Customer Feedback</div>
          <h2 class="section-title">Customer Stories &amp; Testimonials</h2>
          <p class="section-subtitle">Real experiences from customers who trust ZABBRO for their lifestyle and digital needs.</p>
        </div>
        <div class="testimonials-grid">
          <div class="testimonial-card fade-in" style="animation-delay:.1s">
            <div class="testimonial-stars">${renderStars(5)}</div>
            <p class="testimonial-text">"The quality of products and digital services from ZABBRO is unmatched. Every item feels premium and thoughtfully designed. Highly recommended!"</p>
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
  if (typeof lucide !== 'undefined' && lucide.createIcons) {
    lucide.createIcons();
  }
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
  window._heroParallaxCleanup = () => window.removeEventListener('scroll', onScroll);
}

async function loadHomeData() {
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
    'home decor': '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
    'electronics': '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>',
    'accessories': '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>'
  };

  try {
    // Load categories
    const catRes = await API.products.categories();
    const catGrid = document.getElementById('categories-grid');
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

/** Render an SEO-optimized product card with accessible semantics and alt attributes */
function renderProductCard(product, index = 0) {
  const discount = product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
  const isNew = product.newArrival === true || product.newArrival === 'TRUE';
  const isBest = product.bestSeller === true || product.bestSeller === 'TRUE';

  return `
    <article class="product-card fade-in" style="animation-delay:${index * .08}s" itemscope itemtype="https://schema.org/Product">
      <a href="#/product/${product.id}" aria-label="View ZABBRO ${product.name}">
        <div class="product-card-img-wrap">
          <div class="product-card-img" style="background:var(--bg-alt);display:flex;align-items:center;justify-content:center;position:absolute;inset:0">
            ${product.image ? `<img src="${product.image}" alt="ZABBRO — ${product.name} — ${product.category}" loading="lazy" decoding="async" style="width:100%;height:100%;object-fit:cover" itemprop="image" onerror="this.style.display='none'">` : ''}
            <span style="color:var(--text-muted);font-size:.75rem;position:absolute">${product.category}</span>
          </div>
          <div class="product-card-badges">
            ${isNew ? '<span class="badge badge-new">New</span>' : ''}
            ${discount > 0 ? `<span class="badge badge-sale">${discount}% Off</span>` : ''}
            ${isBest ? '<span class="badge badge-best">Best Seller</span>' : ''}
          </div>
          <div class="product-card-quick-add">
            <button class="btn btn-primary btn-full btn-sm" aria-label="Add ${product.name} to shopping bag" onclick="event.preventDefault();event.stopPropagation();Store.addToCart({id:'${product.id}',name:'${String(product.name || '').replace(/'/g, "\\'")}',price:${product.price},image:'${product.image || ''}',category:'${product.category}'})">
              Add to Bag
            </button>
          </div>
        </div>
      </a>
      <div class="product-card-body">
        <div class="product-card-category" itemprop="category">${product.brand || product.category}</div>
        <h3 style="font-size:.95rem;margin:0 0 6px"><a href="#/product/${product.id}" class="product-card-name" itemprop="name">${product.name}</a></h3>
        <div class="product-card-price" itemprop="offers" itemscope itemtype="https://schema.org/Offer">
          <meta itemprop="priceCurrency" content="INR">
          <meta itemprop="price" content="${product.price}">
          <span class="price-current">${formatPrice(product.price)}</span>
          ${product.originalPrice > product.price ? `<span class="price-original">${formatPrice(product.originalPrice)}</span>` : ''}
        </div>
        <div class="product-card-rating">
          <div class="stars">${renderStars(product.rating || 0)}</div>
          <span class="rating-count">(${product.reviewCount || 0})</span>
        </div>
      </div>
    </article>
  `;
}
