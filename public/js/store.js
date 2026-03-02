/**
 * Store Module
 * Client-side state management for cart, auth, and UI
 */

const Store = {
    // ── Cart State ──
    cart: JSON.parse(localStorage.getItem('cart') || '[]'),

    getCart() { return this.cart; },

    addToCart(product, qty = 1) {
        const existing = this.cart.find(item => item.productId === product.id);
        if (existing) {
            existing.quantity += qty;
        } else {
            this.cart.push({
                productId: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                category: product.category,
                quantity: qty
            });
        }
        this.saveCart();
        this.updateCartUI();
        Toast.show(`${product.name} added to bag`, 'success');
    },

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.productId !== productId);
        this.saveCart();
        this.updateCartUI();
    },

    updateQuantity(productId, qty) {
        const item = this.cart.find(i => i.productId === productId);
        if (item) {
            item.quantity = Math.max(1, qty);
            this.saveCart();
            this.updateCartUI();
        }
    },

    clearCart() {
        this.cart = [];
        this.saveCart();
        this.updateCartUI();
    },

    getCartTotal() {
        return this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },

    getCartCount() {
        return this.cart.reduce((sum, item) => sum + item.quantity, 0);
    },

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    },

    updateCartUI() {
        // Update badge
        const badge = document.getElementById('cart-badge');
        if (badge) {
            const count = this.getCartCount();
            badge.textContent = count;
            badge.setAttribute('data-count', count);
            badge.classList.add('bounce');
            setTimeout(() => badge.classList.remove('bounce'), 400);
        }
        // Update mini cart
        this.renderMiniCart();
    },

    renderMiniCart() {
        const container = document.getElementById('mini-cart-items');
        const totalEl = document.getElementById('mini-cart-total');
        const footerEl = document.getElementById('mini-cart-footer');
        if (!container) return;

        if (this.cart.length === 0) {
            container.innerHTML = `
        <div class="mini-cart-empty">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
          <p>Your bag is empty</p>
        </div>`;
            if (footerEl) footerEl.style.display = 'none';
            return;
        }

        if (footerEl) footerEl.style.display = 'block';

        container.innerHTML = this.cart.map(item => `
      <div class="mini-cart-item">
        <div class="mini-cart-item-img" style="background:var(--bg-alt);display:flex;align-items:center;justify-content:center;font-size:.75rem;color:var(--text-muted);">
          ${item.image ? `<img src="${item.image}" alt="${item.name}" style="width:100%;height:100%;object-fit:cover;" onerror="this.style.display='none';this.parentElement.textContent='IMG'">` : 'IMG'}
        </div>
        <div class="mini-cart-item-info">
          <div class="mini-cart-item-name">${item.name}</div>
          <div class="mini-cart-item-price">₹${item.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div class="mini-cart-item-qty">
            <button class="qty-btn" onclick="Store.updateQuantity('${item.productId}', ${item.quantity - 1})">−</button>
            <span class="qty-value">${item.quantity}</span>
            <button class="qty-btn" onclick="Store.updateQuantity('${item.productId}', ${item.quantity + 1})">+</button>
          </div>
        </div>
        <button class="mini-cart-item-remove" onclick="Store.removeFromCart('${item.productId}')">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
    `).join('');

        if (totalEl) totalEl.textContent = `₹${this.getCartTotal().toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    },

    // ── Auth State ──
    getUser() {
        const userData = localStorage.getItem('user_data');
        return userData ? JSON.parse(userData) : null;
    },

    setUser(data) {
        localStorage.setItem('user_data', JSON.stringify(data));
        localStorage.setItem('auth_token', data.token);
        this.updateAuthUI();
    },

    logout() {
        localStorage.removeItem('user_data');
        localStorage.removeItem('auth_token');
        this.updateAuthUI();
        Toast.show('Logged out successfully', 'info');
        window.location.hash = '#/';
    },

    isLoggedIn() {
        return !!localStorage.getItem('auth_token');
    },

    isAdmin() {
        const user = this.getUser();
        return user && user.role === 'admin';
    },

    updateAuthUI() {
        const btn = document.getElementById('user-menu-btn');
        const mobileLink = document.getElementById('mobile-auth-link');
        const signupBtn = document.getElementById('signup-header-btn');
        const user = this.getUser();

        if (btn) {
            btn.onclick = () => {
                if (user) {
                    if (user.role === 'admin') {
                        window.location.hash = '#/admin';
                    } else {
                        window.location.hash = '#/account';
                    }
                } else {
                    window.location.hash = '#/auth';
                }
            };
        }
        if (mobileLink) {
            mobileLink.textContent = user ? (user.role === 'admin' ? 'Dashboard' : 'My Account') : 'Sign In';
            mobileLink.href = user ? (user.role === 'admin' ? '#/admin' : '#/account') : '#/auth';
        }
        if (signupBtn) {
            signupBtn.style.display = user ? 'none' : 'inline-flex';
        }
    }
};

// ── Toast Notification System ──
const Toast = {
    show(message, type = 'info', duration = 3000) {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const icons = {
            success: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
            error: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
            info: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
        };

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `<span class="toast-icon">${icons[type] || icons.info}</span><span class="toast-message">${message}</span>`;
        container.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('removing');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }
};

// ── Utility: Generate star icons ──
function renderStars(rating, size = 14) {
    let html = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= Math.floor(rating)) {
            html += `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
        } else if (i - 0.5 <= rating) {
            html += `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1" opacity=".5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
        } else {
            html += `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" opacity=".3"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
        }
    }
    return html;
}

function formatPrice(price) {
    return `₹${parseFloat(price).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
