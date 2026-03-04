/**
 * Google Sheets Data Seeding Script
 * Populates your Google Spreadsheet with initial sample data and the Admin User.
 * Run with: npm run setup
 */

require('dotenv').config();
const { writeExcel } = require('./utils/excel');
const bcrypt = require('bcryptjs');

const products = [
    {
        id: 'prod_001',
        name: 'Minimalist Ceramic Vase',
        price: 89.00,
        originalPrice: 120.00,
        category: 'Home Decor',
        subcategory: 'Vases',
        description: 'Handcrafted ceramic vase with a clean, modern silhouette. Perfect for minimalist interiors.',
        image: '/uploads/products/vase.jpg',
        images: '/uploads/products/vase.jpg,/uploads/products/vase-2.jpg',
        stock: 45,
        rating: 4.8,
        reviewCount: 124,
        featured: true,
        bestSeller: true,
        newArrival: false,
        brand: 'Artisan Co.',
        material: 'Ceramic',
        color: 'White',
        tags: 'minimalist,vase,ceramic,home decor'
    },
    {
        id: 'prod_002',
        name: 'Premium Leather Tote Bag',
        price: 249.00,
        originalPrice: 299.00,
        category: 'Accessories',
        subcategory: 'Bags',
        description: 'Full-grain Italian leather tote with a spacious interior.',
        image: '/uploads/products/bag.jpg',
        images: '/uploads/products/bag.jpg,/uploads/products/bag-2.jpg',
        stock: 30,
        rating: 4.9,
        reviewCount: 89,
        featured: true,
        bestSeller: true,
        newArrival: false,
        brand: 'Luxe Leather',
        material: 'Italian Leather',
        color: 'Tan',
        tags: 'leather,bag,tote,premium'
    },
    {
        id: 'prod_003',
        name: 'Wireless Noise-Cancelling Headphones',
        price: 349.00,
        originalPrice: 399.00,
        category: 'Electronics',
        subcategory: 'Audio',
        description: 'Premium over-ear headphones with active noise cancellation.',
        image: '/uploads/products/headphones.jpg',
        images: '/uploads/products/headphones.jpg,/uploads/products/headphones-2.jpg',
        stock: 85,
        rating: 4.7,
        reviewCount: 312,
        featured: true,
        bestSeller: false,
        newArrival: true,
        brand: 'SoundElite',
        material: 'Aluminum & Leather',
        color: 'Midnight Black',
        tags: 'headphones,wireless,noise-cancelling'
    }
];

const users = [
    {
        id: 'user_admin',
        name: 'Admin User',
        email: 'admin@store.com',
        password: bcrypt.hashSync('admin123', 10),
        role: 'admin',
        phone: '+1-555-0100',
        address: '123 Admin Street, New York, NY 10001',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
    }
];

const inventory = products.map(p => ({
    productId: p.id,
    productName: p.name,
    currentStock: p.stock,
    reservedStock: 0,
    availableStock: p.stock,
    reorderLevel: 10,
    reorderQuantity: 50,
    lastRestocked: new Date().toISOString(),
    supplier: p.brand,
    status: 'in_stock'
}));

async function seed() {
    console.log('🚀 Seeding Google Sheets Database...');

    if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_SPREADSHEET_ID || !process.env.GOOGLE_PRIVATE_KEY) {
        console.error('❌ Missing credentials in .env file (check GOOGLE_PRIVATE_KEY)');
        return;
    }

    try {
        await writeExcel('products.xlsx', products);
        console.log('✅ Products seeded successfully');

        await writeExcel('users.xlsx', users);
        console.log('✅ Admin user created: admin@store.com / admin123');

        await writeExcel('inventory.xlsx', inventory);
        console.log('✅ Inventory records created');

        // Ensure empty sheets for orders and reviews exist with headers
        await writeExcel('orders.xlsx', [{ id: 'order_template', userId: '', products: '[]', total: 0, status: 'pending', createdAt: '' }]);
        await writeExcel('reviews.xlsx', [{ id: 'review_template', productId: '', userId: '', rating: 5, comment: '', createdAt: '' }]);

        console.log('\n🎉 SUCCESS! Your Google Spreadsheet is now persistent and loaded with data.');
        console.log('You can now log in at your website with: admin@store.com / admin123');
    } catch (error) {
        console.error('❌ Seeding failed (Check if service account has "Editor" permission):', error.message);
    }
}

seed();
