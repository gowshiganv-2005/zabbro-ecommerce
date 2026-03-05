/**
 * E-Commerce Store - Main Server
 * Express.js server with Google Sheets cloud database
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// ═══════════════════════════════════════
// MIDDLEWARE
// ═══════════════════════════════════════
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/api/debug-env', (req, res) => {
    res.json({
        cloudinary: {
            name: process.env.CLOUDINARY_CLOUD_NAME ? 'OK' : 'MISSING',
            key: process.env.CLOUDINARY_API_KEY ? 'OK' : 'MISSING',
            secret: process.env.CLOUDINARY_API_SECRET ? 'OK' : 'MISSING'
        },
        sheets: {
            id: process.env.GOOGLE_SPREADSHEET_ID ? 'OK' : 'MISSING',
            email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ? 'OK' : 'MISSING'
        },
        cwd: process.cwd(),
        uptime: process.uptime()
    });
});

// Serve static files
app.use(express.static(path.join(__dirname, '..', 'public')));

// Ensure upload directories exist
const uploadDir = path.join(__dirname, '..', 'public', 'uploads', 'products');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

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

// DB Test Route
app.get('/api/test-db', async (req, res) => {
    try {
        const { readExcel } = require('./utils/excel');
        const data = await readExcel('users.xlsx');
        res.json({
            success: true,
            message: 'Database connection successful',
            userCount: data.length,
            config: {
                hasEmail: !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
                hasID: !!process.env.GOOGLE_SPREADSHEET_ID,
                hasKey: !!process.env.GOOGLE_PRIVATE_KEY
            }
        });
    } catch (error) {
        console.error(`❌ GOOGLE SHEETS ERROR reading users.xlsx:`, error.message);
        if (error.code === 403) console.error('   -> Permission denied. Check service account access.');
        if (error.code === 404) console.error('   -> Spreadsheet not found. Check ID.');
        if (error.message && error.message.includes('key')) console.error('   -> Private key format is likely invalid.');
        res.status(500).json({ success: false, error: error.message, details: 'Check server logs for more info.' });
    }
});

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
║   📊  Database: Google Sheets (Cloud)         ║
║                                              ║
╚══════════════════════════════════════════════╝
    `);
});

// ═══════════════════════════════════════
// GLOBAL PROCESS ERROR HANDLING (Lifetime Stability)
// ═══════════════════════════════════════
process.on('unhandledRejection', (reason, promise) => {
    console.error('🔥 Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err, origin) => {
    console.error(`🔥 Uncaught Exception: ${err.message}`);
    console.error(`📍 Origin: ${origin}`);
});

module.exports = app;
