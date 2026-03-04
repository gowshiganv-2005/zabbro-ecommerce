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
        name: 'Zabbro Tech Project X',
        price: 8900.00,
        originalPrice: 12000.00,
        category: 'Projects',
        subcategory: 'Robotics',
        description: 'Advanced robotics project with AI capabilities.',
        image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e',
        images: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e',
        stock: 45,
        rating: 4.8,
        reviewCount: 124,
        featured: true,
        bestSeller: true,
        newArrival: false,
        brand: 'ZABBRO',
        material: 'Metal & Glass',
        color: 'Silver',
        tags: 'robotics,ai,projects'
    },
    {
        id: 'prod_002',
        name: 'Classic Zabbro T-shirt',
        price: 999.00,
        originalPrice: 1299.00,
        category: 'T-shirts',
        subcategory: 'Apparel',
        description: 'Premium cotton t-shirt with official branding.',
        image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518',
        images: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518',
        stock: 30,
        rating: 4.9,
        reviewCount: 89,
        featured: true,
        bestSeller: true,
        newArrival: false,
        brand: 'ZABBRO',
        material: '100% Cotton',
        color: 'Black',
        tags: 't-shirt,apparel,premium'
    },
    {
        id: 'prod_003',
        name: 'Wireless Smart Controller',
        price: 3499.00,
        originalPrice: 3999.00,
        category: 'Tech Accessories',
        subcategory: 'Gadgets',
        description: 'High-precision smart controller for tech enthusiasts.',
        image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f',
        images: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f',
        stock: 85,
        rating: 4.7,
        reviewCount: 312,
        featured: true,
        bestSeller: false,
        newArrival: true,
        brand: 'ZABBRO',
        material: 'ABS Plastic',
        color: 'Matte Grey',
        tags: 'gadgets,wireless,tech'
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
        await writeExcel('orders.xlsx', [{ id: 'order_template', userId: '', userName: '', userEmail: '', userPhone: '', products: '[]', total: 0, status: 'pending', createdAt: '' }]);
        await writeExcel('reviews.xlsx', [{ id: 'review_template', productId: '', userId: '', rating: 5, comment: '', createdAt: '' }]);

        console.log('\n🎉 SUCCESS! Your Google Spreadsheet is now persistent and loaded with data.');
        console.log('You can now log in at your website with: admin@store.com / admin123');
    } catch (error) {
        console.error('❌ Seeding failed (Check if service account has "Editor" permission):', error.message);
    }
}

seed();
