/**
 * API Client Module
 * Centralized HTTP client for communicating with the Express backend
 */

const API = {
    BASE: '/api',

    /** Generic fetch wrapper with error handling */
    async request(endpoint, options = {}) {
        const url = `${this.BASE}${endpoint}`;
        const token = localStorage.getItem('auth_token');
        const headers = { 'Content-Type': 'application/json', ...options.headers };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        try {
            const res = await fetch(url, { ...options, headers });
            const contentType = res.headers.get('content-type') || '';
            let data;
            if (contentType.includes('application/json')) {
                data = await res.json();
            } else {
                const text = await res.text();
                throw new Error(res.ok ? text : `Server error (${res.status}): ${text.slice(0, 100)}`);
            }
            if (!res.ok) throw new Error(data.details || data.message || 'Request failed');
            return data;
        } catch (err) {
            console.error(`API Error [${endpoint}]:`, err);
            // Provide a more helpful message for network failures
            if (err.name === 'TypeError' && err.message === 'Failed to fetch') {
                throw new Error('Connection failed. Please ensure the local server is running on port 3000.');
            }
            throw err;
        }
    },

    get(endpoint) { return this.request(endpoint); },
    post(endpoint, body) { return this.request(endpoint, { method: 'POST', body: JSON.stringify(body) }); },
    put(endpoint, body) { return this.request(endpoint, { method: 'PUT', body: JSON.stringify(body) }); },
    delete(endpoint) { return this.request(endpoint, { method: 'DELETE' }); },

    /** Upload file via FormData */
    async upload(endpoint, formData) {
        const token = localStorage.getItem('auth_token');
        const headers = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;
        const res = await fetch(`${this.BASE}${endpoint}`, { method: 'POST', headers, body: formData });
        return res.json();
    },

    // ── Products ──
    products: {
        list(params = {}) { const q = new URLSearchParams(params).toString(); return API.get(`/products${q ? '?' + q : ''}`); },
        get(id) { return API.get(`/products/${id}`); },
        create(data) { return API.post('/products', data); },
        update(id, data) { return API.put(`/products/${id}`, data); },
        delete(id) { return API.delete(`/products/${id}`); },
        categories() { return API.get('/products/categories'); }
    },

    // ── Users ──
    users: {
        register(data) { return API.post('/users/register', data); },
        login(data) { return API.post('/users/login', data); },
        profile() { return API.get('/users/profile'); },
        updateProfile(data) { return API.put('/users/profile', data); },
        list() { return API.get('/users'); },
        delete(id) { return API.delete(`/users/${id}`); }
    },

    // ── Orders ──
    orders: {
        create(data) { return API.post('/orders', data); },
        list() { return API.get('/orders'); },
        get(id) { return API.get(`/orders/${id}`); },
        updateStatus(id, status) { return API.put(`/orders/${id}/status`, { status }); },
        delete(id) { return API.delete(`/orders/${id}`); }
    },

    // ── Reviews ──
    reviews: {
        list(productId) { return API.get(`/reviews/${productId}`); },
        create(data) { return API.post('/reviews', data); },
        delete(id) { return API.delete(`/reviews/${id}`); }
    },

    // ── Admin ──
    admin: {
        dashboard() { return API.get('/admin/dashboard'); },
        inventory() { return API.get('/admin/inventory'); },
        updateInventory(productId, data) { return API.put(`/admin/inventory/${productId}`, data); },
        uploadImage(formData) { return API.upload('/admin/upload', formData); }
    }
};
