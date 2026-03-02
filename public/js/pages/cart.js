/**
 * Cart Page Module
 */
function renderCartPage() {
    const app = document.getElementById('app');
    const cart = Store.getCart();

    if (cart.length === 0) {
        app.innerHTML = `
      <section class="cart-page container">
        <div class="cart-empty fade-in">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
          <h2>Your bag is empty</h2>
          <p>Looks like you haven't added anything to your bag yet.</p>
          <a href="#/products" class="btn btn-primary btn-lg">Start Shopping</a>
        </div>
      </section>`;
        return;
    }

    const subtotal = Store.getCartTotal();
    const shipping = subtotal >= 100 ? 0 : 9.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    app.innerHTML = `
    <section class="cart-page container fade-in">
      <h1>Shopping Bag</h1>
      <div class="cart-layout">
        <div class="cart-items" id="cart-items-list">
          ${cart.map(item => `
            <div class="cart-item" id="cart-item-${item.productId}">
              <div class="cart-item-img" style="background:var(--bg-alt);display:flex;align-items:center;justify-content:center;border-radius:var(--radius-md);overflow:hidden">
                ${item.image ? `<img src="${item.image}" alt="${item.name}" style="width:100%;height:100%;object-fit:cover" onerror="this.style.display='none';this.parentElement.textContent='IMG'">` : 'IMG'}
              </div>
              <div>
                <a href="#/product/${item.productId}" class="cart-item-name">${item.name}</a>
                <div class="cart-item-meta">${item.category || ''}</div>
              </div>
              <div class="cart-item-price">${formatPrice(item.price)}</div>
              <div class="mini-cart-item-qty">
                <button class="qty-btn" onclick="Store.updateQuantity('${item.productId}',${item.quantity - 1});renderCartPage()">−</button>
                <span class="qty-value">${item.quantity}</span>
                <button class="qty-btn" onclick="Store.updateQuantity('${item.productId}',${item.quantity + 1});renderCartPage()">+</button>
              </div>
              <div class="cart-item-total">${formatPrice(item.price * item.quantity)}</div>
              <button class="cart-item-remove" onclick="Store.removeFromCart('${item.productId}');renderCartPage()">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
              </button>
            </div>
          `).join('')}
        </div>
        <div class="cart-summary">
          <h3>Order Summary</h3>
          <div class="cart-summary-row"><span>Subtotal (${Store.getCartCount()} items)</span><span>${formatPrice(subtotal)}</span></div>
          <div class="cart-summary-row"><span>Shipping</span><span>${shipping === 0 ? 'Free' : formatPrice(shipping)}</span></div>
          <div class="cart-summary-row"><span>Tax (8%)</span><span>${formatPrice(tax)}</span></div>
          <div class="cart-summary-row total"><span>Total</span><span>${formatPrice(total)}</span></div>
          <a href="#/checkout" class="btn btn-primary btn-full btn-lg">Proceed to Checkout</a>
          ${shipping > 0 ? `<div class="cart-summary-note">Add ${formatPrice(100 - subtotal)} more for free shipping</div>` : '<div class="cart-summary-note">✓ You qualify for free shipping</div>'}
        </div>
      </div>
    </section>`;
}
