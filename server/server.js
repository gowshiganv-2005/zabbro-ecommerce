/**
 * E-Commerce Store - Main Server
 * Express.js server with Excel-based backend
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// ═══════════════════════════════════════
// MIDDLEWARE
// ═══════════════════════════════════════
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, '..', 'public')));

// Ensure upload directories exist
const dirs = [
    path.join(__dirname, '..', 'public', 'uploads', 'products'),
    path.join(__dirname, 'data')
];
dirs.forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Auto-setup: create Excel data files if they don't exist
const productsFile = path.join(__dirname, 'data', 'products.xlsx');
if (!fs.existsSync(productsFile)) {
    console.log('📦 First run detected — setting up database...');
    try { require('./setup-data'); } catch (e) { console.error('Setup error:', e.message); }
}

// Request logging
app.use((req, res, next) => {
    if (req.url.startsWith('/api')) {
        console.log(`${new Date().toISOString().slice(11, 19)} ${req.method} ${req.url}`);
    }
    next();
});

// ═══════════════════════════════════════
// API ROUTES
// ═══════════════════════════════════════
app.use('/api/products', require('./routes/products'));
app.use('/api/users', require('./routes/users'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/admin', require('./routes/admin'));

// ═══════════════════════════════════════
// SPA FALLBACK - Serve index.html for all non-API routes
// ═══════════════════════════════════════
app.get('*', (req, res) => {
    if (!req.url.startsWith('/api')) {
        res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
    }
});

// ═══════════════════════════════════════
// ERROR HANDLING
// ═══════════════════════════════════════
app.use((err, req, res, next) => {
    console.error('Server Error:', err.message);
    res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
});

// ═══════════════════════════════════════
// START SERVER
// ═══════════════════════════════════════
app.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════════╗
║                                              ║
║   🛒  E-Commerce Store Server                ║
║                                              ║
║   → Local:   http://localhost:${PORT}           ║
║   → API:     http://localhost:${PORT}/api       ║
║                                              ║
║   📊 Excel Database: server/data/            ║
║                                              ║
╚══════════════════════════════════════════════╝
  `);
});
