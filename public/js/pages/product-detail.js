/**
 * Product Detail Page Module
 */
async function renderProductDetailPage(productId) {
    const app = document.getElementById('app');
    app.innerHTML = `<div class="container"><div class="pd-layout">${'<div class="skeleton" style="height:500px;border-radius:16px"></div>'.repeat(2)}</div></div>`;

    try {
        const res = await API.products.get(productId);
        if (!res.success) throw new Error('Product not found');
        const p = res.data;
        const discount = p.originalPrice > p.price ? Math.round((1 - p.price / p.originalPrice) * 100) : 0;
        const stockStatus = p.stock > 20 ? 'In Stock' : p.stock > 0 ? `Only ${p.stock} left` : 'Out of Stock';
        const stockClass = p.stock > 20 ? '' : p.stock > 0 ? 'low' : 'out';

        app.innerHTML = `
      <section class="container">
        <div class="pd-layout">
          <div class="pd-gallery fade-in">
            <div class="pd-main-image" id="pd-main-image">
              <div style="width:100%;height:100%;background:var(--bg-alt);display:flex;align-items:center;justify-content:center;font-size:.875rem;color:var(--text-muted)">
                ${p.image ? `<img src="${p.image}" alt="${p.name}" onerror="this.style.display='none'">` : p.category}
              </div>
            </div>
          </div>
          <div class="pd-info fade-in" style="animation-delay:.15s">
            <div class="pd-breadcrumb">
              <a href="#/">Home</a> / <a href="#/products">Shop</a> / <a href="#/products?category=${encodeURIComponent(p.category)}">${p.category}</a> / <span>${p.name}</span>
            </div>
            <h1 class="pd-title">${p.name}</h1>
            <div class="pd-rating">
              <div class="stars">${renderStars(p.rating || 0)}</div>
              <span style="font-size:.875rem;color:var(--text-secondary)">${p.rating || 0} (${p.reviewCount || 0} reviews)</span>
            </div>
            <div class="pd-price">
              <span class="pd-price-current">${formatPrice(p.price)}</span>
              ${p.originalPrice > p.price ? `<span class="pd-price-original">${formatPrice(p.originalPrice)}</span><span class="pd-price-save">Save ${discount}%</span>` : ''}
            </div>
            <p class="pd-description">${p.description}</p>
            <div class="pd-meta">
              ${p.brand ? `<div class="pd-meta-row"><span class="pd-meta-label">Brand</span><span class="pd-meta-value">${p.brand}</span></div>` : ''}
              ${p.material ? `<div class="pd-meta-row"><span class="pd-meta-label">Material</span><span class="pd-meta-value">${p.material}</span></div>` : ''}
              ${p.color ? `<div class="pd-meta-row"><span class="pd-meta-label">Color</span><span class="pd-meta-value">${p.color}</span></div>` : ''}
              <div class="pd-meta-row"><span class="pd-meta-label">Category</span><span class="pd-meta-value">${p.category}</span></div>
            </div>
            <div class="pd-quantity">
              <span style="font-weight:600;font-size:.875rem">Quantity</span>
              <div class="pd-qty-controls">
                <button class="pd-qty-btn" id="qty-minus">−</button>
                <input type="number" class="pd-qty-value" id="pd-qty" value="1" min="1" max="${p.stock || 99}" readonly>
                <button class="pd-qty-btn" id="qty-plus">+</button>
              </div>
              <span class="pd-stock ${stockClass}">${stockStatus}</span>
            </div>
            <div class="pd-actions">
              <button class="btn btn-primary btn-lg" id="add-to-cart-btn" ${p.stock <= 0 ? 'disabled' : ''}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
                ${p.stock <= 0 ? 'Out of Stock' : 'Add to Bag'}
              </button>
            </div>
            <div class="pd-features">
              <div class="pd-feature">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                <div class="pd-feature-text">Free Shipping over $100</div>
              </div>
              <div class="pd-feature">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
                <div class="pd-feature-text">30-Day Returns</div>
              </div>
              <div class="pd-feature">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                <div class="pd-feature-text">Secure Checkout</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <!-- Reviews Section -->
      <section class="reviews-section container" id="reviews-section">
        <div class="section-header" style="text-align:left;margin-bottom:32px">
          <h2 class="section-title" style="font-size:1.5rem">Customer Reviews</h2>
        </div>
        <div id="reviews-content"><div class="skeleton" style="height:200px"></div></div>
        ${Store.isLoggedIn() ? `
          <div style="margin-top:32px;padding-top:32px;border-top:1px solid var(--border-light)">
            <h3 style="font-size:1.125rem;font-weight:700;margin-bottom:16px">Write a Review</h3>
            <div class="form-group">
              <label class="form-label">Rating</label>
              <select class="form-select" id="review-rating" style="max-width:200px">
                <option value="5">★★★★★ (5)</option><option value="4">★★★★☆ (4)</option><option value="3">★★★☆☆ (3)</option><option value="2">★★☆☆☆ (2)</option><option value="1">★☆☆☆☆ (1)</option>
              </select>
            </div>
            <div class="form-group"><label class="form-label">Title</label><input class="form-input" id="review-title" placeholder="Summarize your experience"></div>
            <div class="form-group"><label class="form-label">Your Review</label><textarea class="form-textarea" id="review-comment" placeholder="Share your thoughts about this product..."></textarea></div>
            <button class="btn btn-primary" id="submit-review">Submit Review</button>
          </div>
        ` : '<p style="margin-top:24px;color:var(--text-secondary)"><a href="#/auth" style="color:var(--accent);font-weight:600">Sign in</a> to write a review.</p>'}
      </section>
    `;

        // Quantity controls
        const qtyInput = document.getElementById('pd-qty');
        document.getElementById('qty-minus')?.addEventListener('click', () => { if (parseInt(qtyInput.value) > 1) qtyInput.value = parseInt(qtyInput.value) - 1; });
        document.getElementById('qty-plus')?.addEventListener('click', () => { if (parseInt(qtyInput.value) < (p.stock || 99)) qtyInput.value = parseInt(qtyInput.value) + 1; });

        // Add to cart
        document.getElementById('add-to-cart-btn')?.addEventListener('click', () => {
            const qty = parseInt(qtyInput.value) || 1;
            Store.addToCart({ id: p.id, name: p.name, price: p.price, image: p.image, category: p.category }, qty);
        });

        // Load reviews
        loadProductReviews(productId);

        // Submit review
        document.getElementById('submit-review')?.addEventListener('click', async () => {
            const rating = document.getElementById('review-rating').value;
            const title = document.getElementById('review-title').value;
            const comment = document.getElementById('review-comment').value;
            try {
                await API.reviews.create({ productId, rating: parseInt(rating), title, comment });
                Toast.show('Review submitted!', 'success');
                loadProductReviews(productId);
                document.getElementById('review-title').value = '';
                document.getElementById('review-comment').value = '';
            } catch (err) { Toast.show(err.message, 'error'); }
        });
    } catch (err) {
        app.innerHTML = `<div style="text-align:center;padding:120px 20px"><h2>Product not found</h2><p style="color:var(--text-secondary);margin:12px 0 24px">The product you're looking for doesn't exist.</p><a href="#/products" class="btn btn-primary">Browse Products</a></div>`;
    }
}

async function loadProductReviews(productId) {
    const container = document.getElementById('reviews-content');
    if (!container) return;
    try {
        const res = await API.reviews.list(productId);
        if (!res.success) throw new Error();
        const { data: reviews, summary } = res;

        container.innerHTML = `
      ${reviews.length > 0 ? `
        <div class="reviews-summary">
          <div class="reviews-avg">
            <div class="reviews-avg-number">${summary.averageRating}</div>
            <div class="reviews-avg-stars">${renderStars(summary.averageRating, 18)}</div>
            <div class="reviews-avg-count">${summary.total} reviews</div>
          </div>
          <div class="reviews-bars">
            ${summary.distribution.map(d => `
              <div class="reviews-bar-row">
                <span class="reviews-bar-label">${d.stars} stars</span>
                <div class="reviews-bar-track"><div class="reviews-bar-fill" style="width:${d.percentage}%"></div></div>
                <span class="reviews-bar-count">${d.count}</span>
              </div>
            `).join('')}
          </div>
        </div>
        ${reviews.map(r => `
          <div class="review-card">
            <div class="review-header">
              <div class="review-avatar">${r.userName ? r.userName.split(' ').map(n => n[0]).join('') : '?'}</div>
              <div><div class="review-author">${r.userName}</div><div class="review-date">${new Date(r.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div></div>
            </div>
            <div class="review-stars">${renderStars(r.rating)}</div>
            ${r.title ? `<div class="review-title">${r.title}</div>` : ''}
            <p class="review-text">${r.comment}</p>
          </div>
        `).join('')}
      ` : '<p style="color:var(--text-secondary);padding:24px 0">No reviews yet. Be the first to review this product!</p>'}
    `;
    } catch (err) { container.innerHTML = '<p style="color:var(--text-muted)">Unable to load reviews.</p>'; }
}
