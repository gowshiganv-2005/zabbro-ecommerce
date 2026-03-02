/**
 * Order Confirmation Page Module
 */
async function renderOrderConfirmationPage(orderId) {
    const app = document.getElementById('app');

    if (!Store.isLoggedIn()) { window.location.hash = '#/auth'; return; }

    app.innerHTML = `<div class="confirmation-page"><div class="skeleton" style="width:400px;height:300px;border-radius:24px"></div></div>`;

    try {
        const res = await API.orders.get(orderId);
        if (!res.success) throw new Error();
        const order = res.data;
        const products = typeof order.products === 'string' ? JSON.parse(order.products) : order.products;

        app.innerHTML = `
      <section class="confirmation-page">
        <div class="confirmation-card fade-in">
          <div class="confirmation-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <h1>Order Confirmed!</h1>
          <p class="subtitle">Thank you for your purchase. Your order has been placed successfully.</p>
          <div class="confirmation-details">
            <div class="confirmation-row"><span>Order ID</span><span style="font-weight:600">${order.id}</span></div>
            <div class="confirmation-row"><span>Status</span><span><span class="status-badge status-${order.status}">${order.status}</span></span></div>
            <div class="confirmation-row"><span>Items</span><span>${products.length} product${products.length > 1 ? 's' : ''}</span></div>
            <div class="confirmation-row"><span>Subtotal</span><span>${formatPrice(order.subtotal)}</span></div>
            <div class="confirmation-row"><span>Shipping</span><span>${order.shipping == 0 ? 'Free' : formatPrice(order.shipping)}</span></div>
            <div class="confirmation-row"><span>Tax</span><span>${formatPrice(order.tax)}</span></div>
            <div class="confirmation-row"><span>Total</span><span>${formatPrice(order.total)}</span></div>
          </div>
          <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
            <a href="#/products" class="btn btn-primary">Continue Shopping</a>
            <a href="#/" class="btn btn-secondary">Back to Home</a>
          </div>
        </div>
      </section>
    `;
    } catch (err) {
        app.innerHTML = `
      <section class="confirmation-page">
        <div class="confirmation-card">
          <h1>Order Not Found</h1>
          <p class="subtitle">We couldn't find this order.</p>
          <a href="#/" class="btn btn-primary" style="margin-top:20px">Go Home</a>
        </div>
      </section>`;
    }
}
