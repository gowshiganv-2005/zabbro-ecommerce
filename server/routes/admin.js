/**
 * Admin API Routes
 * Handles admin-specific operations: dashboard stats, inventory management, file uploads
 */

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { readExcel, writeExcel, updateRow } = require('../utils/excel');
const { uploadToCloudinary } = require('../utils/cloudinary');

const JWT_SECRET = process.env.JWT_SECRET || 'ecommerce_secret_key_2026';

// Configure multer for memory storage (Always use Cloudinary)
const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit for high-quality images
    fileFilter: (req, file, cb) => {
        const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
        const ext = path.extname(file.originalname).toLowerCase();
        if (allowed.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});

// Admin auth middleware
function adminAuth(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Admin access required' });
        }
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
}

// GET /api/admin/dashboard - Get dashboard statistics
router.get('/dashboard', adminAuth, async (req, res) => {
    try {
        const products = await readExcel('products.xlsx');
        const users = await readExcel('users.xlsx');
        const orders = await readExcel('orders.xlsx');
        const inventory = await readExcel('inventory.xlsx');

        const totalRevenue = orders.reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0);
        const thisMonth = orders.filter(o => {
            const orderDate = new Date(o.createdAt);
            const now = new Date();
            return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
        });
        const monthlyRevenue = thisMonth.reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0);

        const lowStockItems = inventory.filter(i => {
            const stock = parseInt(i.currentStock) || 0;
            return stock <= (parseInt(i.reorderLevel) || 10) && stock > 0;
        });

        const outOfStockItems = inventory.filter(i => (parseInt(i.currentStock) || 0) === 0);

        // Recent orders
        const recentOrders = orders
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5)
            .map(order => ({
                ...order,
                products: typeof order.products === 'string' ? JSON.parse(order.products) : order.products
            }));

        // Top selling products (by order frequency)
        const productSales = {};
        orders.forEach(order => {
            const prods = typeof order.products === 'string' ? JSON.parse(order.products) : order.products;
            if (Array.isArray(prods)) {
                prods.forEach(p => {
                    if (!productSales[p.productId]) {
                        productSales[p.productId] = { name: p.name, totalSold: 0, revenue: 0 };
                    }
                    productSales[p.productId].totalSold += p.quantity || 1;
                    productSales[p.productId].revenue += (p.price || 0) * (p.quantity || 1);
                });
            }
        });

        const topProducts = Object.entries(productSales)
            .map(([id, data]) => ({ id, ...data }))
            .sort((a, b) => b.totalSold - a.totalSold)
            .slice(0, 5);

        res.json({
            success: true,
            data: {
                overview: {
                    totalProducts: products.length,
                    totalUsers: users.length,
                    totalOrders: orders.length,
                    totalRevenue: Math.round(totalRevenue * 100) / 100,
                    monthlyRevenue: Math.round(monthlyRevenue * 100) / 100,
                    monthlyOrders: thisMonth.length,
                    averageOrderValue: orders.length > 0 ? Math.round((totalRevenue / orders.length) * 100) / 100 : 0
                },
                ordersByStatus: {
                    pending: orders.filter(o => o.status === 'pending').length,
                    processing: orders.filter(o => o.status === 'processing').length,
                    shipped: orders.filter(o => o.status === 'shipped').length,
                    delivered: orders.filter(o => o.status === 'delivered').length,
                    cancelled: orders.filter(o => o.status === 'cancelled').length
                },
                lowStockItems: lowStockItems.length,
                outOfStockItems: outOfStockItems.length,
                recentOrders,
                topProducts,
                lowStockProducts: lowStockItems.slice(0, 5)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to load dashboard', error: error.message });
    }
});

// GET /api/admin/inventory - Get full inventory
router.get('/inventory', adminAuth, async (req, res) => {
    try {
        const inventory = await readExcel('inventory.xlsx');
        res.json({ success: true, data: inventory });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch inventory' });
    }
});

// PUT /api/admin/inventory/:productId - Update inventory
router.put('/inventory/:productId', adminAuth, async (req, res) => {
    try {
        const { currentStock, reorderLevel, reorderQuantity } = req.body;
        const updates = {};

        if (currentStock !== undefined) {
            updates.currentStock = parseInt(currentStock);
            updates.availableStock = parseInt(currentStock);
            updates.status = currentStock > 20 ? 'in_stock' : currentStock > 0 ? 'low_stock' : 'out_of_stock';
            updates.lastRestocked = new Date().toISOString();

            // Also update product stock
            await updateRow('products.xlsx', 'id', req.params.productId, { stock: parseInt(currentStock) });
        }
        if (reorderLevel !== undefined) updates.reorderLevel = parseInt(reorderLevel);
        if (reorderQuantity !== undefined) updates.reorderQuantity = parseInt(reorderQuantity);

        await updateRow('inventory.xlsx', 'productId', req.params.productId, updates);
        res.json({ success: true, message: 'Inventory updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update inventory' });
    }
});

// POST /api/admin/upload - Upload product image to Cloudinary
router.post('/upload', adminAuth, (req, res) => {
    upload.single('image')(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            console.error('Multer Error:', err);
            return res.status(400).json({ success: false, message: `Upload error: ${err.message}` });
        } else if (err) {
            console.error('Upload Error:', err);
            return res.status(500).json({ success: false, message: err.message });
        }

        try {
            if (!req.file || !req.file.buffer) {
                return res.status(400).json({ success: false, message: 'No file uploaded or buffer missing' });
            }

            const { uploadToCloudinary } = require('../utils/cloudinary');
            console.log(`☁️ Processing image upload for ${req.file.originalname}...`);

            const imageUrl = await uploadToCloudinary(req.file.buffer, req.file.originalname);

            console.log('✅ Image uploaded successfully to Cloudinary:', imageUrl);
            res.json({ success: true, data: { url: imageUrl }, message: 'Image uploaded successfully' });
        } catch (error) {
            console.error('🔥 Cloudinary Processing Error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to process image via Cloudinary',
                error: error.message,
                details: 'Check CLOUDINARY credentials in .env'
            });
        }
    });
});

module.exports = router;
