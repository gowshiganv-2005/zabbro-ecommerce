/**
 * Admin Dashboard Page Module
 */
function renderAdminPage(tab = 'overview') {
  if (!Store.isAdmin()) {
    Toast.show('Admin access required', 'error');
    window.location.hash = '#/auth';
    return;
  }
  const app = document.getElementById('app');
  app.innerHTML = `
    <section class="admin-page container fade-in">
      <div class="admin-header">
        <h1>Dashboard</h1>
        <div style="display:flex;gap:8px">
          <button class="btn btn-sm btn-secondary" onclick="Store.logout()">Logout</button>
        </div>
      </div>
      <div class="admin-tabs" id="admin-tabs">
        <button class="admin-tab ${tab === 'overview' ? 'active' : ''}" data-tab="overview">Overview</button>
        <button class="admin-tab ${tab === 'products' ? 'active' : ''}" data-tab="products">Products</button>
        <button class="admin-tab ${tab === 'orders' ? 'active' : ''}" data-tab="orders">Orders</button>
        <button class="admin-tab ${tab === 'inventory' ? 'active' : ''}" data-tab="inventory">Inventory</button>
        <button class="admin-tab ${tab === 'users' ? 'active' : ''}" data-tab="users">Users</button>
      </div>
      <div id="admin-content"></div>
    </section>
    <div class="modal-overlay" id="modal-overlay"><div class="modal" id="modal-content"></div></div>
  `;
  document.querySelectorAll('.admin-tab').forEach(t => {
    t.addEventListener('click', () => {
      document.querySelectorAll('.admin-tab').forEach(x => x.classList.remove('active'));
      t.classList.add('active');
      loadAdminTab(t.dataset.tab);
    });
  });
  loadAdminTab(tab);
}

async function loadAdminTab(tab) {
  const content = document.getElementById('admin-content');
  content.innerHTML = '<div class="skeleton" style="height:300px;border-radius:16px;margin-top:16px"></div>';
  try {
    switch (tab) {
      case 'overview': await loadOverviewTab(content); break;
      case 'products': await loadProductsTab(content); break;
      case 'orders': await loadOrdersTab(content); break;
      case 'inventory': await loadInventoryTab(content); break;
      case 'users': await loadUsersTab(content); break;
    }
  } catch (e) { content.innerHTML = `<p style="color:var(--danger);padding:40px">Error loading data: ${e.message}</p>`; }
}

async function loadOverviewTab(el) {
  const res = await API.admin.dashboard();
  if (!res.success) throw new Error('Failed to load');
  const d = res.data;
  el.innerHTML = `
    <div class="stats-grid">
      <div class="stat-card"><div class="stat-label">Total Revenue</div><div class="stat-value">${formatPrice(d.overview.totalRevenue)}</div><div class="stat-change up">This month: ${formatPrice(d.overview.monthlyRevenue)}</div></div>
      <div class="stat-card"><div class="stat-label">Total Orders</div><div class="stat-value">${d.overview.totalOrders}</div><div class="stat-change">Avg: ${formatPrice(d.overview.averageOrderValue)}</div></div>
      <div class="stat-card"><div class="stat-label">Products</div><div class="stat-value">${d.overview.totalProducts}</div><div class="stat-change ${d.lowStockItems > 0 ? 'down' : 'up'}">${d.lowStockItems} low stock</div></div>
      <div class="stat-card"><div class="stat-label">Customers</div><div class="stat-value">${d.overview.totalUsers}</div></div>
    </div>
    <div class="admin-grid-2">
      <div class="admin-card">
        <div class="admin-card-header"><h3>Recent Orders</h3></div>
        <div class="admin-card-body">
          <table class="admin-table"><thead><tr><th>Order</th><th>Customer</th><th>Total</th><th>Status</th></tr></thead><tbody>
          ${d.recentOrders.map(o => `<tr><td style="font-weight:600">${o.id}</td><td>${o.userName}</td><td>${formatPrice(o.total)}</td><td><span class="status-badge status-${o.status}">${o.status}</span></td></tr>`).join('')}
          </tbody></table>
        </div>
      </div>
      <div class="admin-card">
        <div class="admin-card-header"><h3>Order Status</h3></div>
        <div class="admin-card-body" style="padding:24px">
          ${Object.entries(d.ordersByStatus).map(([s, c]) => `
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
              <span class="status-badge status-${s}" style="min-width:90px;text-align:center">${s}</span>
              <div style="flex:1;height:8px;background:var(--bg-alt);border-radius:4px;overflow:hidden">
                <div style="height:100%;width:${d.overview.totalOrders ? Math.round(c / d.overview.totalOrders * 100) : 0}%;background:var(--text-primary);border-radius:4px"></div>
              </div>
              <span style="font-weight:600;font-size:.875rem;min-width:30px">${c}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

async function loadProductsTab(el) {
  const res = await API.products.list({ limit: 100 });
  if (!res.success) throw new Error();
  el.innerHTML = `
    <div class="admin-card">
      <div class="admin-card-header">
        <h3>All Products (${res.total})</h3>
        <button class="btn btn-sm btn-primary" id="add-product-btn">+ Add Product</button>
      </div>
      <div class="admin-card-body">
        <table class="admin-table"><thead><tr><th style="width:60px">Image</th><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Rating</th><th>Actions</th></tr></thead><tbody>
        ${res.data.map(p => `<tr>
          <td><div style="width:48px;height:48px;border-radius:8px;overflow:hidden;background:var(--bg-alt)">${p.image ? `<img src="${p.image}" alt="" style="width:100%;height:100%;object-fit:cover" onerror="this.style.display='none'">` : ''}</div></td>
          <td><div style="font-weight:600">${p.name}</div><div style="font-size:.75rem;color:var(--text-muted)">${p.id}</div></td>
          <td>${p.category}</td>
          <td>${formatPrice(p.price)}</td>
          <td><span class="status-badge status-${p.stock > 20 ? 'in_stock' : p.stock > 0 ? 'low_stock' : 'out_of_stock'}">${p.stock}</span></td>
          <td>${p.rating || 0} ★</td>
          <td><button class="btn btn-sm btn-ghost" onclick="openEditProductModal('${p.id}')">Edit</button> <button class="btn btn-sm btn-ghost" style="color:var(--danger)" onclick="deleteProduct('${p.id}')">Delete</button></td>
        </tr>`).join('')}
        </tbody></table>
      </div>
    </div>
  `;
  document.getElementById('add-product-btn')?.addEventListener('click', () => openAddProductModal());
}

async function loadOrdersTab(el) {
  const res = await API.orders.list();
  if (!res.success) throw new Error();
  el.innerHTML = `
    <div class="admin-card">
      <div class="admin-card-header"><h3>All Orders (${res.data.length})</h3></div>
      <div class="admin-card-body">
        <table class="admin-table"><thead><tr><th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Action</th></tr></thead><tbody>
        ${res.data.map(o => {
    const prods = Array.isArray(o.products) ? o.products : [];
    const prodSummary = prods.map(p => `${p.name || 'Product'} (x${p.quantity || 1})`).join(', ');
    return `<tr>
            <td style="font-weight:600">${o.id}</td>
            <td>
              <div style="font-weight:600">${o.userName || 'Guest'}</div>
              <div style="font-size:.75rem;color:var(--text-muted)">${o.userEmail || ''}</div>
              <div style="font-size:.75rem;color:var(--text-muted)">${o.userPhone || ''}</div>
            </td>
            <td>
              <div style="font-size:.75rem;max-width:200px" title="${prodSummary}">
                ${prods.length} item${prods.length !== 1 ? 's' : ''}:<br>
                <div style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${prodSummary}</div>
              </div>
            </td>
            <td style="font-weight:600">${formatPrice(o.total)}</td>
            <td><span class="status-badge status-${o.status}">${o.status}</span></td>
            <td>
              <div style="display:flex;gap:8px;align-items:center">
                <select class="form-select" style="padding:6px 8px;font-size:.75rem;min-width:110px" onchange="updateOrderStatus('${o.id}',this.value)">
                  ${['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => `<option value="${s}" ${o.status === s ? 'selected' : ''}>${s}</option>`).join('')}
                </select>
                <button class="btn btn-sm btn-ghost" style="color:var(--danger);padding:4px" onclick="deleteOrder('${o.id}')" title="Delete History">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                </button>
              </div>
            </td>
          </tr>`;
  }).join('')}
        </tbody></table>
      </div>
    </div>
  `;
}

async function deleteOrder(id) {
  if (!confirm('Are you sure you want to delete this order history? This action cannot be undone.')) return;
  try {
    await API.orders.delete(id);
    Toast.show('Order history deleted', 'success');
    loadAdminTab('orders');
  } catch (e) { Toast.show(e.message, 'error'); }
}

async function loadInventoryTab(el) {
  const res = await API.admin.inventory();
  if (!res.success) throw new Error();
  el.innerHTML = `
    <div class="admin-card">
      <div class="admin-card-header"><h3>Inventory Management</h3></div>
      <div class="admin-card-body">
        <table class="admin-table"><thead><tr><th>Product</th><th>Current Stock</th><th>Available</th><th>Reorder Level</th><th>Status</th><th>Action</th></tr></thead><tbody>
        ${res.data.map(i => `<tr>
          <td style="font-weight:600">${i.productName}</td>
          <td>${i.currentStock}</td>
          <td>${i.availableStock}</td>
          <td>${i.reorderLevel}</td>
          <td><span class="status-badge status-${i.status}">${(i.status || '').replace('_', ' ')}</span></td>
          <td><button class="btn btn-sm btn-ghost" onclick="openInventoryModal('${i.productId}',${i.currentStock},${i.reorderLevel})">Update</button></td>
        </tr>`).join('')}
        </tbody></table>
      </div>
    </div>
  `;
}

async function loadUsersTab(el) {
  const res = await API.users.list();
  if (!res.success) throw new Error();
  el.innerHTML = `
    <div class="admin-card">
      <div class="admin-card-header"><h3>Registered Users (${res.data.length})</h3></div>
      <div class="admin-card-body">
        <table class="admin-table"><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Action</th></tr></thead><tbody>
        ${res.data.map(u => `<tr>
          <td style="font-weight:600">${u.name}</td>
          <td>${u.email}</td>
          <td><span class="status-badge ${u.role === 'admin' ? 'status-shipped' : 'status-processing'}">${u.role}</span></td>
          <td style="font-size:.8125rem">${new Date(u.createdAt).toLocaleDateString()}</td>
          <td>
            <button class="btn btn-sm btn-ghost" style="color:var(--danger);padding:4px" onclick="deleteUser('${u.id}')" title="Delete User">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
            </button>
          </td>
        </tr>`).join('')}
        </tbody></table>
      </div>
    </div>
  `;
}

// ── Modal Helpers ──
function openModal(html) {
  const overlay = document.getElementById('modal-overlay');
  const content = document.getElementById('modal-content');
  content.innerHTML = html;
  overlay.classList.add('open');
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
}
function closeModal() { document.getElementById('modal-overlay')?.classList.remove('open'); }

function openAddProductModal() {
  let uploadedImageUrl = '';
  openModal(`
    <div class="modal-header"><h3>Add New Product</h3><button class="modal-close" onclick="closeModal()"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
    <div class="modal-body">
      <div class="form-group">
        <label class="form-label">Product Image</label>
        <div id="img-upload-zone" style="border:2px dashed var(--border);border-radius:var(--radius-md);padding:24px;text-align:center;cursor:pointer;transition:var(--transition);position:relative;min-height:180px;display:flex;flex-direction:column;align-items:center;justify-content:center;background:var(--bg-alt)">
          <div id="img-preview-wrap" style="display:none;width:100%;max-width:260px;aspect-ratio:4/5;border-radius:12px;overflow:hidden;margin:0 auto 12px">
            <img id="img-preview" style="width:100%;height:100%;object-fit:cover" />
          </div>
          <div id="img-placeholder">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom:8px;color:var(--text-muted)"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
            <p style="font-size:.875rem;font-weight:500;color:var(--text-secondary);margin-bottom:4px">Click to upload or drag & drop</p>
            <p style="font-size:.75rem;color:var(--text-muted)">JPG, PNG, WebP up to 5MB</p>
          </div>
          <input type="file" id="img-file-input" accept="image/*" style="position:absolute;inset:0;opacity:0;cursor:pointer" />
        </div>
        <div id="img-upload-status" style="font-size:.75rem;margin-top:8px;color:var(--text-muted)"></div>
      </div>
      <div class="form-group"><label class="form-label">Name</label><input class="form-input" id="mp-name" required></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div class="form-group"><label class="form-label">Price (₹)</label><input class="form-input" id="mp-price" type="number" step="0.01" required></div>
        <div class="form-group"><label class="form-label">Original Price (₹)</label><input class="form-input" id="mp-original" type="number" step="0.01"></div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px">
        <div class="form-group"><label class="form-label">Category</label><input class="form-input" id="mp-category" placeholder="e.g. Website"></div>
        <div class="form-group"><label class="form-label">Sub-category</label><input class="form-input" id="mp-subcategory" placeholder="e.g. Landing Page"></div>
        <div class="form-group"><label class="form-label">Stock</label><input class="form-input" id="mp-stock" type="number" value="50"></div>
      </div>
      <div class="form-group"><label class="form-label">Description</label><textarea class="form-textarea" id="mp-desc"></textarea></div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px">
        <div class="form-group"><label class="form-label">Brand</label><input class="form-input" id="mp-brand" placeholder="e.g. ZABBRO"></div>
        <div class="form-group"><label class="form-label">Material</label><input class="form-input" id="mp-material" placeholder="e.g. Cotton"></div>
        <div class="form-group"><label class="form-label">Color</label><input class="form-input" id="mp-color" placeholder="e.g. Black"></div>
      <div class="form-group">
        <label class="form-label">Gallery Image URLs (Comma separated)</label>
        <textarea class="form-input" id="mp-gallery" placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg" style="min-height:60px"></textarea>
        <p style="font-size:.7rem;color:var(--text-muted);margin-top:4px">Add additional views for the carousel. The main image is already included.</p>
      </div>
    </div>
    <div class="modal-footer"><button class="btn btn-secondary" onclick="closeModal()">Cancel</button><button class="btn btn-primary" id="save-product-btn">Save Product</button></div>
  `);

  // Image upload handler
  setupImageUpload('img-file-input', 'img-preview', 'img-preview-wrap', 'img-placeholder', 'img-upload-zone', 'img-upload-status', (url) => { uploadedImageUrl = url; });

  document.getElementById('save-product-btn')?.addEventListener('click', async () => {
    const name = document.getElementById('mp-name').value.trim();
    if (!name) { Toast.show('Product name is required', 'error'); return; }
    try {
      await API.products.create({
        name,
        price: parseFloat(document.getElementById('mp-price').value) || 0,
        originalPrice: parseFloat(document.getElementById('mp-original').value) || 0,
        category: document.getElementById('mp-category').value,
        subcategory: document.getElementById('mp-subcategory').value,
        stock: parseInt(document.getElementById('mp-stock').value) || 0,
        description: document.getElementById('mp-desc').value,
        brand: document.getElementById('mp-brand').value,
        material: document.getElementById('mp-material').value,
        color: document.getElementById('mp-color').value,
        image: uploadedImageUrl,
        images: (uploadedImageUrl + ',' + document.getElementById('mp-gallery').value).split(',').map(s => s.trim()).filter(s => s).join(','),
        featured: false, bestSeller: false, newArrival: true
      });
      Toast.show('Product created!', 'success');
      closeModal();
      loadAdminTab('products');
    } catch (e) { Toast.show(e.message, 'error'); }
  });
}

async function openEditProductModal(id) {
  const res = await API.products.get(id);
  if (!res.success) return;
  const p = res.data;
  let uploadedImageUrl = p.image || '';
  openModal(`
    <div class="modal-header"><h3>Edit Product</h3><button class="modal-close" onclick="closeModal()"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
    <div class="modal-body">
      <div class="form-group">
        <label class="form-label">Product Image</label>
        <div id="img-upload-zone" style="border:2px dashed var(--border);border-radius:var(--radius-md);padding:24px;text-align:center;cursor:pointer;transition:var(--transition);position:relative;min-height:180px;display:flex;flex-direction:column;align-items:center;justify-content:center;background:var(--bg-alt)">
          <div id="img-preview-wrap" style="${p.image ? '' : 'display:none;'}width:100%;max-width:260px;aspect-ratio:4/5;border-radius:12px;overflow:hidden;margin:0 auto 12px">
            <img id="img-preview" src="${p.image || ''}" style="width:100%;height:100%;object-fit:cover" />
          </div>
          <div id="img-placeholder" style="${p.image ? 'display:none' : ''}">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom:8px;color:var(--text-muted)"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
            <p style="font-size:.875rem;font-weight:500;color:var(--text-secondary);margin-bottom:4px">Click to upload or drag & drop</p>
            <p style="font-size:.75rem;color:var(--text-muted)">JPG, PNG, WebP up to 5MB</p>
          </div>
          <input type="file" id="img-file-input" accept="image/*" style="position:absolute;inset:0;opacity:0;cursor:pointer" />
        </div>
        <div id="img-upload-status" style="font-size:.75rem;margin-top:8px;color:var(--text-muted)">${p.image ? '✓ Current image loaded' : ''}</div>
      </div>
      <div class="form-group"><label class="form-label">Name</label><input class="form-input" id="mp-name" value="${p.name}"></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div class="form-group"><label class="form-label">Price (₹)</label><input class="form-input" id="mp-price" type="number" step="0.01" value="${p.price}"></div>
        <div class="form-group"><label class="form-label">Original Price (₹)</label><input class="form-input" id="mp-original" type="number" step="0.01" value="${p.originalPrice || ''}"></div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px">
        <div class="form-group"><label class="form-label">Category</label><input class="form-input" id="mp-category" value="${p.category}"></div>
        <div class="form-group"><label class="form-label">Sub-category</label><input class="form-input" id="mp-subcategory" value="${p.subcategory || ''}" placeholder="e.g. Landing Page"></div>
        <div class="form-group"><label class="form-label">Stock</label><input class="form-input" id="mp-stock" type="number" value="${p.stock}"></div>
      </div>
      <div class="form-group"><label class="form-label">Description</label><textarea class="form-textarea" id="mp-desc">${p.description || ''}</textarea></div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px">
        <div class="form-group"><label class="form-label">Brand</label><input class="form-input" id="mp-brand" value="${p.brand || ''}"></div>
        <div class="form-group"><label class="form-label">Material</label><input class="form-input" id="mp-material" value="${p.material || ''}"></div>
        <div class="form-group"><label class="form-label">Color</label><input class="form-input" id="mp-color" value="${p.color || ''}"></div>
      <div class="form-group">
        <label class="form-label">Gallery Image URLs (Comma separated)</label>
        <textarea class="form-input" id="mp-gallery" placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg" style="min-height:60px">${p.images || ''}</textarea>
        <p style="font-size:.7rem;color:var(--text-muted);margin-top:4px">The main image above is automatically included if not present here.</p>
      </div>
    </div>
    <div class="modal-footer"><button class="btn btn-secondary" onclick="closeModal()">Cancel</button><button class="btn btn-primary" id="update-product-btn">Update</button></div>
  `);

  // Image upload handler
  setupImageUpload('img-file-input', 'img-preview', 'img-preview-wrap', 'img-placeholder', 'img-upload-zone', 'img-upload-status', (url) => { uploadedImageUrl = url; });

  document.getElementById('update-product-btn')?.addEventListener('click', async () => {
    try {
      await API.products.update(id, {
        name: document.getElementById('mp-name').value,
        price: parseFloat(document.getElementById('mp-price').value),
        originalPrice: parseFloat(document.getElementById('mp-original').value) || 0,
        category: document.getElementById('mp-category').value,
        subcategory: document.getElementById('mp-subcategory').value,
        stock: parseInt(document.getElementById('mp-stock').value),
        description: document.getElementById('mp-desc').value,
        brand: document.getElementById('mp-brand').value,
        material: document.getElementById('mp-material').value,
        color: document.getElementById('mp-color').value,
        image: uploadedImageUrl,
        images: document.getElementById('mp-gallery').value.trim() || uploadedImageUrl
      });
      Toast.show('Product updated!', 'success');
      closeModal();
      loadAdminTab('products');
    } catch (e) { Toast.show(e.message, 'error'); }
  });
}

/** Shared image upload setup for modals */
function setupImageUpload(inputId, previewId, wrapId, placeholderId, zoneId, statusId, onUploaded) {
  const fileInput = document.getElementById(inputId);
  const preview = document.getElementById(previewId);
  const wrap = document.getElementById(wrapId);
  const placeholder = document.getElementById(placeholderId);
  const zone = document.getElementById(zoneId);
  const status = document.getElementById(statusId);

  if (!fileInput) return;

  // Drag-and-drop visual feedback
  zone.addEventListener('dragover', (e) => { e.preventDefault(); zone.style.borderColor = '#111'; zone.style.background = 'rgba(0,0,0,.04)'; });
  zone.addEventListener('dragleave', () => { zone.style.borderColor = ''; zone.style.background = ''; });
  zone.addEventListener('drop', (e) => {
    e.preventDefault();
    zone.style.borderColor = ''; zone.style.background = '';
    if (e.dataTransfer.files.length) {
      fileInput.files = e.dataTransfer.files;
      handleFile(e.dataTransfer.files[0]);
    }
  });

  fileInput.addEventListener('change', () => {
    if (fileInput.files.length) handleFile(fileInput.files[0]);
  });

  async function handleFile(file) {
    if (!file.type.startsWith('image/')) { Toast.show('Please select an image file', 'error'); return; }
    if (file.size > 5 * 1024 * 1024) { Toast.show('Image must be under 5MB', 'error'); return; }

    // Show local preview immediately
    const reader = new FileReader();
    reader.onload = (e) => {
      preview.src = e.target.result;
      wrap.style.display = 'block';
      if (placeholder) placeholder.style.display = 'none';
    };
    reader.readAsDataURL(file);

    // Upload to server
    status.textContent = 'Uploading...';
    status.style.color = 'var(--text-muted)';
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await API.admin.uploadImage(formData);
      if (res.success) {
        status.textContent = '✓ Image uploaded successfully';
        status.style.color = 'var(--success)';
        onUploaded(res.data.url);
      } else {
        throw new Error(res.message || 'Upload failed');
      }
    } catch (err) {
      status.textContent = '✗ Upload failed: ' + err.message;
      status.style.color = 'var(--danger)';
    }
  }
}

async function deleteProduct(id) {
  if (!confirm('Are you sure you want to delete this product?')) return;
  try { await API.products.delete(id); Toast.show('Product deleted', 'success'); loadAdminTab('products'); }
  catch (e) { Toast.show(e.message, 'error'); }
}

async function updateOrderStatus(id, status) {
  try { await API.orders.updateStatus(id, status); Toast.show(`Order ${status}`, 'success'); }
  catch (e) { Toast.show(e.message, 'error'); }
}

function openInventoryModal(productId, currentStock, reorderLevel) {
  openModal(`
    <div class="modal-header"><h3>Update Inventory</h3><button class="modal-close" onclick="closeModal()"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
    <div class="modal-body">
      <div class="form-group"><label class="form-label">Current Stock</label><input class="form-input" id="inv-stock" type="number" value="${currentStock}"></div>
      <div class="form-group"><label class="form-label">Reorder Level</label><input class="form-input" id="inv-reorder" type="number" value="${reorderLevel}"></div>
    </div>
    <div class="modal-footer"><button class="btn btn-secondary" onclick="closeModal()">Cancel</button><button class="btn btn-primary" id="save-inv-btn">Update</button></div>
  `);
  document.getElementById('save-inv-btn')?.addEventListener('click', async () => {
    try {
      await API.admin.updateInventory(productId, {
        currentStock: parseInt(document.getElementById('inv-stock').value),
        reorderLevel: parseInt(document.getElementById('inv-reorder').value)
      });
      Toast.show('Inventory updated!', 'success');
      closeModal();
      loadAdminTab('inventory');
    } catch (e) { Toast.show(e.message, 'error'); }
  });
}
async function deleteUser(id) {
  if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
  try {
    await API.users.delete(id);
    Toast.show('User deleted successfully', 'success');
    loadAdminTab('users');
  } catch (e) { Toast.show(e.message || 'Failed to delete user', 'error'); }
}
