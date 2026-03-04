/**
 * Orders API Routes
 * Handles order creation, retrieval, and management
 */

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { readExcel, findRow, findRows, appendRow, updateRow, deleteRow } = require('../utils/excel');
const { sendOrderEmails } = require('../utils/email');
const { v4: uuidv4 } = require('uuid');

const ORDERS_FILE = 'orders.xlsx';
const JWT_SECRET = process.env.JWT_SECRET || 'ecommerce_secret_key_2026';

// Middleware to verify JWT token
function authenticate(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    try {
        req.user = jwt.verify(token, JWT_SECRET);
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
}

// POST /api/orders - Create new order
router.post('/', authenticate, async (req, res) => {
    try {
        const { products, shippingAddress, paymentMethod } = req.body;

        if (!products || !products.length) {
            return res.status(400).json({ success: false, message: 'Order must contain at least one product' });
        }

        const subtotal = products.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = subtotal >= 100 ? 0 : 9.99;
        const tax = subtotal * 0.08;
        const total = subtotal + shipping + tax;

        const order = {
            id: `ord_${uuidv4().slice(0, 8)}`,
            userId: req.user.id,
            userName: req.body.userName || req.user.name || 'Guest',
            userEmail: req.body.userEmail || req.user.email || '',
            userPhone: req.body.userPhone || req.user.phone || '',
            products: JSON.stringify(products),
            subtotal: Math.round(subtotal * 100) / 100,
            shipping: Math.round(shipping * 100) / 100,
            tax: Math.round(tax * 100) / 100,
            total: Math.round(total * 100) / 100,
            status: 'pending',
            shippingAddress: shippingAddress || '',
            paymentMethod: paymentMethod || 'Credit Card',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        await appendRow(ORDERS_FILE, order);

        // Update inventory
        for (const item of products) {
            const product = await findRow('products.xlsx', 'id', item.productId);
            if (product) {
                const newStock = Math.max(0, (product.stock || 0) - item.quantity);
                await updateRow('products.xlsx', 'id', item.productId, { stock: newStock });
                await updateRow('inventory.xlsx', 'productId', item.productId, {
                    currentStock: newStock,
                    availableStock: newStock,
                    status: newStock > 20 ? 'in_stock' : newStock > 0 ? 'low_stock' : 'out_of_stock'
                });
            }
        }

        res.status(201).json({ success: true, data: order, message: 'Order placed successfully' });

        // Send confirmation emails (fire-and-forget, don't block response)
        sendOrderEmails(order, products).then(result => {
            console.log('📧 Email status:', JSON.stringify(result));
        }).catch(err => {
            console.error('📧 Email error:', err.message);
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to create order', error: error.message });
    }
});

// GET /api/orders - Get user's orders
router.get('/', authenticate, async (req, res) => {
    try {
        let orders;
        if (req.user.role === 'admin') {
            orders = await readExcel(ORDERS_FILE);
        } else {
            orders = await findRows(ORDERS_FILE, 'userId', req.user.id);
        }

        // Parse products JSON for each order
        orders = orders.map(order => ({
            ...order,
            products: typeof order.products === 'string' ? JSON.parse(order.products) : order.products
        }));

        // Sort by newest first
        orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        res.json({ success: true, data: orders });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch orders', error: error.message });
    }
});

// GET /api/orders/:id - Get single order
router.get('/:id', authenticate, async (req, res) => {
    try {
        const order = await findRow(ORDERS_FILE, 'id', req.params.id);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // Check authorization
        if (req.user.role !== 'admin' && order.userId !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }

        order.products = typeof order.products === 'string' ? JSON.parse(order.products) : order.products;
        res.json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch order' });
    }
});

// PUT /api/orders/:id/status - Update order status (Admin)
router.put('/:id/status', authenticate, async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }

        const updated = await updateRow(ORDERS_FILE, 'id', req.params.id, {
            status,
            updatedAt: new Date().toISOString()
        });

        if (!updated) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // If order cancelled, restore inventory
        if (status === 'cancelled') {
            const order = await findRow(ORDERS_FILE, 'id', req.params.id);
            if (order) {
                const products = typeof order.products === 'string' ? JSON.parse(order.products) : order.products;
                for (const item of products) {
                    const product = await findRow('products.xlsx', 'id', item.productId);
                    if (product) {
                        const newStock = (product.stock || 0) + item.quantity;
                        await updateRow('products.xlsx', 'id', item.productId, { stock: newStock });
                        await updateRow('inventory.xlsx', 'productId', item.productId, {
                            currentStock: newStock,
                            availableStock: newStock,
                            status: newStock > 20 ? 'in_stock' : 'low_stock'
                        });
                    }
                }
            }
        }

        res.json({ success: true, message: `Order status updated to ${status}` });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update order status' });
    }
});

// GET /api/orders/stats/summary - Get order statistics (Admin)
router.get('/stats/summary', authenticate, async (req, res) => {
    try {
        const orders = await readExcel(ORDERS_FILE);

        const stats = {
            totalOrders: orders.length,
            totalRevenue: orders.reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0),
            pendingOrders: orders.filter(o => o.status === 'pending').length,
            processingOrders: orders.filter(o => o.status === 'processing').length,
            shippedOrders: orders.filter(o => o.status === 'shipped').length,
            deliveredOrders: orders.filter(o => o.status === 'delivered').length,
            cancelledOrders: orders.filter(o => o.status === 'cancelled').length,
            averageOrderValue: orders.length > 0
                ? orders.reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0) / orders.length
                : 0
        };

        res.json({ success: true, data: stats });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch order stats' });
    }
});

// DELETE /api/orders/:id - Delete order history
router.delete('/:id', authenticate, async (req, res) => {
    try {
        console.log(`🗑️ Deletion request for order: ${req.params.id} by user: ${req.user.id} (${req.user.role})`);

        const order = await findRow(ORDERS_FILE, 'id', req.params.id);
        if (!order) {
            console.log(`❌ Order ${req.params.id} not found for deletion`);
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        console.log(`📋 Order Details - ID: ${order.id}, Owner: ${order.userId}, User: ${order.userName}`);

        // Only admin or the order owner can delete
        if (req.user.role !== 'admin' && order.userId !== req.user.id) {
            console.warn(`⚠️ Unauthorized deletion attempt for order ${order.id} by user ${req.user.id}`);
            return res.status(403).json({ success: false, message: 'Permission denied' });
        }

        const deleted = await deleteRow(ORDERS_FILE, 'id', req.params.id);

        if (deleted) {
            res.json({ success: true, message: 'Order history deleted successfully' });
        } else {
            res.status(404).json({ success: false, message: 'Order ID not found in database' });
        }
    } catch (error) {
        console.error('🔥 DELETE ERROR:', error);
        res.status(500).json({ success: false, message: `System Error: ${error.message}` });
    }
});

module.exports = router;
