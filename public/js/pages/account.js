/**
 * User Account Dashboard Page
 */
function renderAccountPage(tab = 'profile') {
  if (!Store.isLoggedIn()) {
    Toast.show('Please sign in to view your account', 'info');
    window.location.hash = '#/auth';
    return;
  }
  const user = Store.getUser();
  if (user.role === 'admin') { window.location.hash = '#/admin'; return; }

  const app = document.getElementById('app');
  app.innerHTML = `
    <section class="account-page container fade-in">
      <div class="account-header">
        <div class="account-avatar">${user.name ? user.name.split(' ').map(n => n[0]).join('') : '?'}</div>
        <div>
          <h1 style="font-family:var(--font-serif);font-size:1.5rem;margin-bottom:4px">${user.name || 'User'}</h1>
          <p style="color:var(--text-secondary);font-size:.875rem">${user.email}</p>
        </div>
        <button class="btn btn-sm btn-secondary" style="margin-left:auto" onclick="Store.logout()">Logout</button>
      </div>
      <div class="account-tabs">
        <button class="account-tab ${tab === 'profile' ? 'active' : ''}" data-tab="profile">Profile</button>
        <button class="account-tab ${tab === 'orders' ? 'active' : ''}" data-tab="orders">Orders</button>
      </div>
      <div id="account-content"></div>
    </section>
  `;

  document.querySelectorAll('.account-tab').forEach(t => {
    t.addEventListener('click', () => {
      document.querySelectorAll('.account-tab').forEach(x => x.classList.remove('active'));
      t.classList.add('active');
      loadAccountTab(t.dataset.tab);
    });
  });
  loadAccountTab(tab);
}

async function loadAccountTab(tab) {
  const content = document.getElementById('account-content');
  if (!content) return;
  const user = Store.getUser();

  if (tab === 'profile') {
    content.innerHTML = `
      <div style="background:var(--glass-strong);backdrop-filter:var(--blur);border:1px solid var(--glass-border);border-radius:var(--radius-lg);padding:32px;max-width:600px">
        <h2 style="font-size:1.125rem;font-weight:700;margin-bottom:24px">Profile Details</h2>
        <div class="form-group"><label class="form-label">Full Name</label><input class="form-input" id="acc-name" value="${user.name || ''}"></div>
        <div class="form-group"><label class="form-label">Email</label><input class="form-input" value="${user.email || ''}" disabled style="opacity:.6"></div>
        <div class="form-group"><label class="form-label">Phone</label><input class="form-input" id="acc-phone" value="${user.phone || ''}" placeholder="+1 (555) 000-0000"></div>
        <div class="form-group"><label class="form-label">Address</label><input class="form-input" id="acc-address" value="${user.address || ''}" placeholder="Your shipping address"></div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:16px">
          <button class="btn btn-primary" id="save-profile-btn">Save Changes</button>
          <button class="btn btn-sm btn-ghost" style="color:var(--danger)" onclick="deleteMyAccount()">Delete Account</button>
        </div>
      </div>
    `;
    document.getElementById('save-profile-btn')?.addEventListener('click', async () => {
      try {
        const res = await API.users.updateProfile({
          name: document.getElementById('acc-name').value,
          phone: document.getElementById('acc-phone').value,
          address: document.getElementById('acc-address').value
        });
        if (res.success) {
          const updated = { ...user, ...res.data };
          updated.token = user.token;
          Store.setUser(updated);
          Toast.show('Profile updated!', 'success');
        }
      } catch (e) { Toast.show(e.message, 'error'); }
    });
  } else if (tab === 'orders') {
    content.innerHTML = '<div class="skeleton" style="height:200px;border-radius:16px"></div>';
    try {
      const res = await API.orders.list();
      if (!res.success || res.data.length === 0) {
        content.innerHTML = `
          <div style="text-align:center;padding:60px 20px;background:var(--glass-strong);backdrop-filter:var(--blur);border:1px solid var(--glass-border);border-radius:var(--radius-lg)">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin:0 auto 16px;color:var(--text-muted);opacity:.3"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
            <h3 style="margin-bottom:8px">No orders yet</h3>
            <p style="color:var(--text-secondary);margin-bottom:20px">Start shopping to see your orders here.</p>
            <a href="#/products" class="btn btn-primary">Shop Now</a>
          </div>`;
        return;
      }
      content.innerHTML = `
        <div class="admin-card">
          <div class="admin-card-header"><h3>Your Orders (${res.data.length})</h3></div>
          <div class="admin-card-body">
            <table class="admin-table"><thead><tr><th>Order</th><th>Date</th><th>Items</th><th>Total</th><th>Status</th><th>Action</th></tr></thead><tbody>
            ${res.data.map(o => {
        const prods = Array.isArray(o.products) ? o.products : [];
        const prodSummary = prods.map(p => `${p.name || 'Product'} (x${p.quantity || 1})`).join(', ');
        return `<tr>
                <td style="font-weight:600;cursor:pointer" onclick="window.location.hash='#/order-confirmation/${o.id}'">${o.id}</td>
                <td style="font-size:.8125rem">${new Date(o.createdAt).toLocaleDateString()}</td>
                <td style="font-size:.75rem;max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${prodSummary}">${prodSummary}</td>
                <td style="font-weight:600">${formatPrice(o.total)}</td>
                <td><span class="status-badge status-${o.status}">${o.status}</span></td>
                <td>
                  <button class="btn btn-sm btn-ghost" style="color:var(--danger);padding:4px" onclick="deleteOrderHistory('${o.id}')" title="Remove from history">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                  </button>
                </td>
              </tr>`;
      }).join('')}
            </tbody></table>
          </div>
        </div>
      `;
    } catch (e) { content.innerHTML = `<p style="color:var(--danger)">Failed to load orders.</p>`; }
  }
}

async function deleteOrderHistory(id) {
  if (!confirm('Are you sure you want to remove this order from your history?')) return;
  try {
    await API.orders.delete(id);
    Toast.show('Order removed from history', 'success');
    loadAccountTab('orders');
  } catch (e) { Toast.show(e.message, 'error'); }
}

async function deleteMyAccount() {
  const user = Store.getUser();
  if (!confirm('Are you sure you want to delete your account? This will permanently remove your profile and data.')) return;
  try {
    await API.users.delete(user.id);
    Toast.show('Account deleted successfully', 'success');
    Store.logout();
  } catch (e) { Toast.show(e.message || 'Failed to delete account', 'error'); }
}
