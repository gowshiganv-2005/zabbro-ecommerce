/**
 * Reviews API Routes
 * Handles product review operations
 */

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { readExcel, findRow, findRows, appendRow, updateRow, deleteRow } = require('../utils/excel');
const { v4: uuidv4 } = require('uuid');

const REVIEWS_FILE = 'reviews.xlsx';
const JWT_SECRET = process.env.JWT_SECRET || 'ecommerce_secret_key_2026';

// GET /api/reviews/:productId - Get reviews for a product
router.get('/:productId', (req, res) => {
    try {
        const reviews = findRows(REVIEWS_FILE, 'productId', req.params.productId);
        reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        const avgRating = reviews.length > 0
            ? reviews.reduce((sum, r) => sum + (parseFloat(r.rating) || 0), 0) / reviews.length
            : 0;

        const ratingDistribution = [5, 4, 3, 2, 1].map(star => ({
            stars: star,
            count: reviews.filter(r => Math.round(r.rating) === star).length,
            percentage: reviews.length > 0
                ? Math.round((reviews.filter(r => Math.round(r.rating) === star).length / reviews.length) * 100)
                : 0
        }));

        res.json({
            success: true,
            data: reviews,
            summary: {
                total: reviews.length,
                averageRating: Math.round(avgRating * 10) / 10,
                distribution: ratingDistribution
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch reviews' });
    }
});

// POST /api/reviews - Create a new review
router.post('/', (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ success: false, message: 'Login required to write a review' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const { productId, rating, title, comment } = req.body;

        if (!productId || !rating) {
            return res.status(400).json({ success: false, message: 'Product ID and rating are required' });
        }

        // Check if user already reviewed this product
        const existingReviews = findRows(REVIEWS_FILE, 'productId', productId);
        const alreadyReviewed = existingReviews.find(r => r.userId === decoded.id);
        if (alreadyReviewed) {
            return res.status(409).json({ success: false, message: 'You have already reviewed this product' });
        }

        const review = {
            id: `rev_${uuidv4().slice(0, 8)}`,
            productId,
            userId: decoded.id,
            userName: decoded.name,
            rating: parseFloat(rating),
            title: title || '',
            comment: comment || '',
            createdAt: new Date().toISOString(),
            helpful: 0
        };

        appendRow(REVIEWS_FILE, review);

        // Update product rating
        const allReviews = findRows(REVIEWS_FILE, 'productId', productId);
        const newAvg = allReviews.reduce((sum, r) => sum + parseFloat(r.rating), 0) / allReviews.length;
        updateRow('products.xlsx', 'id', productId, {
            rating: Math.round(newAvg * 10) / 10,
            reviewCount: allReviews.length
        });

        res.status(201).json({ success: true, data: review, message: 'Review submitted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to submit review', error: error.message });
    }
});

// DELETE /api/reviews/:id - Delete a review
router.delete('/:id', (req, res) => {
    try {
        const review = findRow(REVIEWS_FILE, 'id', req.params.id);
        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }

        deleteRow(REVIEWS_FILE, 'id', req.params.id);

        // Update product rating
        const remainingReviews = findRows(REVIEWS_FILE, 'productId', review.productId);
        const newAvg = remainingReviews.length > 0
            ? remainingReviews.reduce((sum, r) => sum + parseFloat(r.rating), 0) / remainingReviews.length
            : 0;
        updateRow('products.xlsx', 'id', review.productId, {
            rating: Math.round(newAvg * 10) / 10,
            reviewCount: remainingReviews.length
        });

        res.json({ success: true, message: 'Review deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete review' });
    }
});

module.exports = router;
