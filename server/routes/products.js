/**
 * Products API Routes
 * Handles all product-related CRUD operations
 */

const express = require('express');
const router = express.Router();
const { readExcel, writeExcel, findRow, appendRow, updateRow, deleteRow } = require('../utils/excel');
const { v4: uuidv4 } = require('uuid');

const PRODUCTS_FILE = 'products.xlsx';

// GET /api/products - Get all products with optional filtering
router.get('/', (req, res) => {
    try {
        let products = readExcel(PRODUCTS_FILE);
        const { category, search, sort, minPrice, maxPrice, featured, bestSeller, newArrival, page, limit } = req.query;

        // Filter by category
        if (category && category !== 'all') {
            products = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
        }

        // Search by name or description
        if (search) {
            const searchLower = search.toLowerCase();
            products = products.filter(p =>
                p.name.toLowerCase().includes(searchLower) ||
                p.description.toLowerCase().includes(searchLower) ||
                (p.tags && p.tags.toLowerCase().includes(searchLower)) ||
                (p.brand && p.brand.toLowerCase().includes(searchLower))
            );
        }

        // Filter by price range
        if (minPrice) products = products.filter(p => p.price >= parseFloat(minPrice));
        if (maxPrice) products = products.filter(p => p.price <= parseFloat(maxPrice));

        // Filter by flags
        if (featured === 'true') products = products.filter(p => p.featured === true || p.featured === 'TRUE');
        if (bestSeller === 'true') products = products.filter(p => p.bestSeller === true || p.bestSeller === 'TRUE');
        if (newArrival === 'true') products = products.filter(p => p.newArrival === true || p.newArrival === 'TRUE');

        // Sort
        if (sort) {
            switch (sort) {
                case 'price_asc': products.sort((a, b) => a.price - b.price); break;
                case 'price_desc': products.sort((a, b) => b.price - a.price); break;
                case 'name_asc': products.sort((a, b) => a.name.localeCompare(b.name)); break;
                case 'name_desc': products.sort((a, b) => b.name.localeCompare(a.name)); break;
                case 'rating': products.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break;
                case 'newest': products.sort((a, b) => (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0)); break;
            }
        }

        const total = products.length;

        // Pagination
        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 12;
        const startIndex = (pageNum - 1) * limitNum;
        const paginatedProducts = products.slice(startIndex, startIndex + limitNum);

        // Get unique categories
        const allProducts = readExcel(PRODUCTS_FILE);
        const categories = [...new Set(allProducts.map(p => p.category))];

        res.json({
            success: true,
            data: paginatedProducts,
            total,
            page: pageNum,
            totalPages: Math.ceil(total / limitNum),
            categories
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch products', error: error.message });
    }
});

// GET /api/products/categories - Get all categories
router.get('/categories', (req, res) => {
    try {
        const products = readExcel(PRODUCTS_FILE);
        const categories = [...new Set(products.map(p => p.category))];
        const categoryCounts = categories.map(cat => ({
            name: cat,
            count: products.filter(p => p.category === cat).length
        }));
        res.json({ success: true, data: categoryCounts });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch categories' });
    }
});

// GET /api/products/:id - Get single product
router.get('/:id', (req, res) => {
    try {
        const product = findRow(PRODUCTS_FILE, 'id', req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.json({ success: true, data: product });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch product' });
    }
});

// POST /api/products - Create new product (Admin)
router.post('/', (req, res) => {
    try {
        const newProduct = {
            id: `prod_${uuidv4().slice(0, 8)}`,
            ...req.body,
            rating: 0,
            reviewCount: 0,
            createdAt: new Date().toISOString()
        };

        appendRow(PRODUCTS_FILE, newProduct);

        // Also add to inventory
        const inventoryItem = {
            productId: newProduct.id,
            productName: newProduct.name,
            currentStock: newProduct.stock || 0,
            reservedStock: 0,
            availableStock: newProduct.stock || 0,
            reorderLevel: 10,
            reorderQuantity: 50,
            lastRestocked: new Date().toISOString(),
            supplier: newProduct.brand || '',
            status: (newProduct.stock || 0) > 20 ? 'in_stock' : 'low_stock'
        };
        appendRow('inventory.xlsx', inventoryItem);

        res.status(201).json({ success: true, data: newProduct, message: 'Product created successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to create product', error: error.message });
    }
});

// PUT /api/products/:id - Update product (Admin)
router.put('/:id', (req, res) => {
    try {
        const updated = updateRow(PRODUCTS_FILE, 'id', req.params.id, req.body);
        if (!updated) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        // Sync inventory when product is updated
        const inventoryUpdates = {};
        if (req.body.stock !== undefined) {
            inventoryUpdates.currentStock = req.body.stock;
            inventoryUpdates.availableStock = req.body.stock;
            inventoryUpdates.status = req.body.stock > 20 ? 'in_stock' : req.body.stock > 0 ? 'low_stock' : 'out_of_stock';
        }
        if (req.body.name) inventoryUpdates.productName = req.body.name;
        if (req.body.brand) inventoryUpdates.supplier = req.body.brand;
        if (Object.keys(inventoryUpdates).length > 0) {
            updateRow('inventory.xlsx', 'productId', req.params.id, inventoryUpdates);
        }

        const product = findRow(PRODUCTS_FILE, 'id', req.params.id);
        res.json({ success: true, data: product, message: 'Product updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update product' });
    }
});

// DELETE /api/products/:id - Delete product (Admin)
router.delete('/:id', (req, res) => {
    try {
        const deleted = deleteRow(PRODUCTS_FILE, 'id', req.params.id);
        if (!deleted) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        deleteRow('inventory.xlsx', 'productId', req.params.id);
        res.json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete product' });
    }
});

module.exports = router;
