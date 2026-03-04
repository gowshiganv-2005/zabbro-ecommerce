/**
 * Users API Routes
 * Handles authentication and user management
 */

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { readExcel, findRow, appendRow, updateRow, deleteRow } = require('../utils/excel');
const { v4: uuidv4 } = require('uuid');

const USERS_FILE = 'users.xlsx';
const JWT_SECRET = process.env.JWT_SECRET || 'ecommerce_secret_key_2026';

// POST /api/users/register - Register new user
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, phone, address } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
        }

        // Check if user already exists
        const existing = await findRow(USERS_FILE, 'email', email.toLowerCase());
        if (existing) {
            return res.status(409).json({ success: false, message: 'An account with this email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
            id: `user_${uuidv4().slice(0, 8)}`,
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            role: 'customer',
            phone: phone || '',
            address: address || '',
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
        };

        await appendRow(USERS_FILE, newUser);

        const token = jwt.sign(
            { id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name, phone: newUser.phone },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            success: true,
            message: 'Account created successfully',
            data: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                token
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Registration failed', error: error.message });
    }
});

// POST /api/users/login - Login user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }

        const user = await findRow(USERS_FILE, 'email', email.toLowerCase());
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        // Update last login
        await updateRow(USERS_FILE, 'id', user.id, { lastLogin: new Date().toISOString() });

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role, name: user.name, phone: user.phone },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                address: user.address,
                token
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Login failed', error: error.message });
    }
});

// GET /api/users/profile - Get user profile (requires auth)
router.get('/profile', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ success: false, message: 'Authentication required' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await findRow(USERS_FILE, 'id', decoded.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const { password, ...safeUser } = user;
        res.json({ success: true, data: safeUser });
    } catch (error) {
        res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
});

// PUT /api/users/profile - Update user profile
router.put('/profile', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ success: false, message: 'Authentication required' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const { name, phone, address } = req.body;

        const updates = {};
        if (name) updates.name = name;
        if (phone) updates.phone = phone;
        if (address) updates.address = address;

        await updateRow(USERS_FILE, 'id', decoded.id, updates);

        const user = await findRow(USERS_FILE, 'id', decoded.id);
        const { password, ...safeUser } = user;

        res.json({ success: true, data: safeUser, message: 'Profile updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update profile' });
    }
});

// GET /api/users - Get all users (Admin only)
router.get('/', async (req, res) => {
    try {
        const users = await readExcel(USERS_FILE);
        const safeUsers = users.map(({ password, ...user }) => user);
        res.json({ success: true, data: safeUsers });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch users' });
    }
});

// DELETE /api/users/:id - Delete user (Self or Admin)
router.delete('/:id', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ success: false, message: 'Authentication required' });

        const decoded = jwt.verify(token, JWT_SECRET);

        // Authorization: Admin can delete anyone, User can delete self
        if (decoded.role !== 'admin' && decoded.id !== req.params.id) {
            return res.status(403).json({ success: false, message: 'You are not authorized to delete this account' });
        }

        console.log(`👤 Account deletion request for ${req.params.id} by ${decoded.id} (${decoded.role})`);

        const deleted = await deleteRow(USERS_FILE, 'id', req.params.id);
        if (!deleted) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({ success: true, message: 'Account deleted successfully' });
    } catch (error) {
        console.error('🔥 User Delete Error:', error.message);
        res.status(500).json({ success: false, message: 'Failed to delete user' });
    }
});

module.exports = router;
