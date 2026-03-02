/**
 * Checkout Page Module
 */
function renderCheckoutPage() {
  const cart = Store.getCart();
  const app = document.getElementById('app');

  if (cart.length === 0) { window.location.hash = '#/cart'; return; }

  if (!Store.isLoggedIn()) {
    Toast.show('Please sign in to checkout', 'info');
    window.location.hash = '#/auth';
    return;
  }

  const user = Store.getUser();
  const subtotal = Store.getCartTotal();
  const shipping = subtotal >= 100 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  app.innerHTML = `
    <section class="checkout-page container fade-in">
      <h1 style="font-family:var(--font-serif);font-size:2rem;margin-bottom:32px">Checkout</h1>
      <div class="checkout-layout">
        <div>
          <div class="checkout-section">
            <h2>Shipping Information</h2>
            <div class="checkout-form-row">
              <div class="form-group"><label class="form-label">First Name</label><input class="form-input" id="chk-fname" value="${(user.name || '').split(' ')[0]}" required></div>
              <div class="form-group"><label class="form-label">Last Name</label><input class="form-input" id="chk-lname" value="${(user.name || '').split(' ').slice(1).join(' ')}" required></div>
            </div>
            <div class="form-group"><label class="form-label">Email</label><input class="form-input" id="chk-email" type="email" value="${user.email || ''}" required></div>
            <div class="form-group"><label class="form-label">Phone</label><input class="form-input" id="chk-phone" type="tel" value="${user.phone || ''}" placeholder="+1 (555) 000-0000"></div>
            <div class="form-group"><label class="form-label">Address</label><input class="form-input" id="chk-address" value="${user.address || ''}" placeholder="Street address" required></div>
            <div class="checkout-form-row">
              <div class="form-group"><label class="form-label">City</label><input class="form-input" id="chk-city" placeholder="City" required></div>
              <div class="form-group"><label class="form-label">ZIP Code</label><input class="form-input" id="chk-zip" placeholder="10001" required></div>
            </div>
          </div>
          <div class="checkout-section">
            <h2>Payment Method</h2>
            <div class="payment-methods">
              <div class="payment-method selected" data-method="credit_card" onclick="selectPayment(this)">
                <div class="payment-radio"></div>
                <div class="payment-icon"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg></div>
                <div><div style="font-weight:600;font-size:.9375rem">Credit / Debit Card</div><div style="font-size:.8125rem;color:var(--text-muted)">Visa, Mastercard, RuPay</div></div>
              </div>
              <div class="payment-method" data-method="upi" onclick="selectPayment(this)">
                <div class="payment-radio"></div>
                <div class="payment-icon"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg></div>
                <div><div style="font-weight:600;font-size:.9375rem">UPI</div><div style="font-size:.8125rem;color:var(--text-muted)">Google Pay, PhonePe, Paytm</div></div>
              </div>
              <div class="payment-method" data-method="cod" onclick="selectPayment(this)">
                <div class="payment-radio"></div>
                <div class="payment-icon"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M6 12h.01M18 12h.01"/></svg></div>
                <div><div style="font-weight:600;font-size:.9375rem">Cash on Delivery</div><div style="font-size:.8125rem;color:var(--text-muted)">Pay when you receive your order</div></div>
              </div>
              <div class="payment-method" data-method="paypal" onclick="selectPayment(this)">
                <div class="payment-radio"></div>
                <div class="payment-icon"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 00-2 2v4h6a2 2 0 002-2V8z"/></svg></div>
                <div><div style="font-weight:600;font-size:.9375rem">PayPal</div><div style="font-size:.8125rem;color:var(--text-muted)">Pay with your PayPal account</div></div>
              </div>
            </div>
            <div id="upi-details" style="display:none;margin-top:16px">
              <div class="form-group"><label class="form-label">UPI ID</label><input class="form-input" id="chk-upi-id" placeholder="yourname@upi"></div>
            </div>
          </div>
          <button class="btn btn-primary btn-lg btn-full" id="place-order-btn">
            Place Order — ${formatPrice(total)}
          </button>
        </div>
        <div>
          <div class="cart-summary">
            <h3>Order Review</h3>
            ${cart.map(item => `
              <div class="order-review-item">
                <div class="order-review-img" style="display:flex;align-items:center;justify-content:center;font-size:.6rem;color:var(--text-muted)">
                  ${item.image ? `<img src="${item.image}" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:var(--radius-sm)" onerror="this.style.display='none'">` : 'IMG'}
                </div>
                <div style="flex:1">
                  <div style="font-weight:600;font-size:.875rem">${item.name}</div>
                  <div style="font-size:.8125rem;color:var(--text-muted)">Qty: ${item.quantity}</div>
                </div>
                <div style="font-weight:600;font-size:.875rem">${formatPrice(item.price * item.quantity)}</div>
              </div>
            `).join('')}
            <div class="cart-summary-row" style="margin-top:16px"><span>Subtotal</span><span>${formatPrice(subtotal)}</span></div>
            <div class="cart-summary-row"><span>Shipping</span><span>${shipping === 0 ? 'Free' : formatPrice(shipping)}</span></div>
            <div class="cart-summary-row"><span>Tax</span><span>${formatPrice(tax)}</span></div>
            <div class="cart-summary-row total"><span>Total</span><span>${formatPrice(total)}</span></div>
          </div>
        </div>
      </div>
    </section>
  `;

  document.getElementById('place-order-btn')?.addEventListener('click', placeOrder);
}

function selectPayment(el) {
  document.querySelectorAll('.payment-method').forEach(m => m.classList.remove('selected'));
  el.classList.add('selected');
  // Show/hide UPI ID field
  const upiDetails = document.getElementById('upi-details');
  if (upiDetails) {
    upiDetails.style.display = el.dataset.method === 'upi' ? 'block' : 'none';
  }
}

async function placeOrder() {
  const btn = document.getElementById('place-order-btn');
  const cart = Store.getCart();

  const address = [
    document.getElementById('chk-address')?.value,
    document.getElementById('chk-city')?.value,
    document.getElementById('chk-zip')?.value
  ].filter(Boolean).join(', ');

  const paymentMethod = document.querySelector('.payment-method.selected')?.dataset.method || 'credit_card';

  if (!address) { Toast.show('Please fill in your shipping address', 'error'); return; }

  btn.disabled = true;
  btn.innerHTML = '<span class="spinner-ring" style="width:20px;height:20px;border-width:2px"></span> Processing...';

  try {
    const products = cart.map(item => ({
      productId: item.productId,
      name: item.name,
      price: item.price,
      quantity: item.quantity
    }));

    const res = await API.orders.create({ products, shippingAddress: address, paymentMethod });
    if (res.success) {
      Store.clearCart();
      window.location.hash = `#/order-confirmation/${res.data.id}`;
    }
  } catch (err) {
    Toast.show(err.message || 'Order failed. Please try again.', 'error');
    btn.disabled = false;
    btn.textContent = 'Place Order';
  }
}
