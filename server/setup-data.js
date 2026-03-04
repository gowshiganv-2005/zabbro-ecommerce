/**
 * Google Sheets Data Seeding Script
 * Populates your Google Spreadsheet with initial sample data and the Admin User.
 * Run with: npm run setup
 */

require('dotenv').config();
const { writeExcel } = require('./utils/excel');
const bcrypt = require('bcryptjs');

const products = [
    // PROJECTS (3)
    {
        id: 'prod_proj_1', name: 'AI Home Automation Hub', price: 15499.00, originalPrice: 18000.00,
        category: 'Projects', subcategory: 'Smart Home', description: 'A complete open-source AI hub for controlling your home devices.',
        image: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f', images: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f,https://images.unsplash.com/photo-1518770660439-4636190af475',
        stock: 25, rating: 4.9, reviewCount: 45, featured: true, bestSeller: true, brand: 'ZABBRO', tags: 'projects,ai'
    },
    {
        id: 'prod_proj_2', name: 'Gesture Control Robot Kit', price: 8999.00, originalPrice: 11000.00,
        category: 'Projects', subcategory: 'Robotics', description: 'Arduino-based robot kit that responds to hand gestures.',
        image: 'https://images.unsplash.com/photo-1535378917042-10a22c95931a', images: 'https://images.unsplash.com/photo-1535378917042-10a22c95931a',
        stock: 12, rating: 4.8, reviewCount: 18, featured: false, bestSeller: false, brand: 'ZABBRO', tags: 'projects,robot'
    },
    // T-SHIRTS (3)
    {
        id: 'prod_tsh_1', name: 'Zabbro Oversized Tech Tee', price: 1299.00, originalPrice: 1599.00,
        category: 'T-shirts', subcategory: 'Streetwear', description: 'Heavyweight 240 GSM cotton oversized t-shirt.',
        image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a', images: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a',
        stock: 120, rating: 4.8, reviewCount: 320, featured: true, bestSeller: true, brand: 'ZABBRO', tags: 'fashion,tshirt'
    },
    {
        id: 'prod_tsh_2', name: 'Gradient Developer Tee', price: 999.00, originalPrice: 1299.00,
        category: 'T-shirts', subcategory: 'Casual', description: 'Soft ringspun cotton with developer-themed gradient print.',
        image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518', images: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518',
        stock: 85, rating: 4.7, reviewCount: 95, featured: false, bestSeller: true, brand: 'ZABBRO', tags: 'fashion,dev'
    },
    // WEBSITES (2)
    {
        id: 'prod_web_1', name: 'E-Commerce React Template', price: 4500.00, originalPrice: 6000.00,
        category: 'Websites', subcategory: 'E-commerce', description: 'High-performance React template for online stores.',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f', images: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f',
        stock: 999, rating: 5.0, reviewCount: 67, featured: true, bestSeller: false, brand: 'ZABBRO DIGITAL', tags: 'web,react'
    },
    {
        id: 'prod_web_2', name: 'Portfolio Ghost Theme', price: 2500.00, originalPrice: 3500.00,
        category: 'Websites', subcategory: 'Portfolio', description: 'Minimalist Ghost theme for creative professionals.',
        image: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5', images: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5',
        stock: 999, rating: 4.9, reviewCount: 42, featured: false, bestSeller: true, brand: 'ZABBRO DIGITAL', tags: 'web,ghost'
    },
    // WOODEN PRODUCTS (2)
    {
        id: 'prod_wood_1', name: 'Oak Monitor Stand', price: 3200.00, originalPrice: 4500.00,
        category: 'Wooden Products', subcategory: 'Office', description: 'Solid oak monitor riser with cable management.',
        image: 'https://images.unsplash.com/photo-1593642532400-2682810df593', images: 'https://images.unsplash.com/photo-1593642532400-2682810df593',
        stock: 15, rating: 4.7, reviewCount: 28, featured: false, bestSeller: true, brand: 'ZABBRO WOODS', tags: 'wooden,office'
    },
    {
        id: 'prod_wood_2', name: 'Walnut Laptop Dock', price: 4800.00, originalPrice: 5500.00,
        category: 'Wooden Products', subcategory: 'Office', description: 'Vertical laptop dock carved from single block of walnut.',
        image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf', images: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf',
        stock: 10, rating: 4.9, reviewCount: 12, featured: true, bestSeller: false, brand: 'ZABBRO WOODS', tags: 'wooden,desk'
    },
    // TRENDY PRODUCTS (2)
    {
        id: 'prod_trend_1', name: 'Transparent Keyboard', price: 6499.00, originalPrice: 7999.00,
        category: 'Trendy Products', subcategory: 'Gaming', description: 'RGB aura transparent mechanical keyboard.',
        image: 'https://images.unsplash.com/photo-1618384881928-142835f8d975', images: 'https://images.unsplash.com/photo-1618384881928-142835f8d975',
        stock: 40, rating: 4.9, reviewCount: 156, featured: true, bestSeller: true, brand: 'ZABBRO TECH', tags: 'trendy,gaming'
    },
    {
        id: 'prod_trend_2', name: 'Neon LED Desk Strip', price: 1800.00, originalPrice: 2500.00,
        category: 'Trendy Products', subcategory: 'Lighting', description: 'Flexible neon LED strips with app control.',
        image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f', images: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f',
        stock: 75, rating: 4.6, reviewCount: 88, featured: false, bestSeller: true, brand: 'ZABBRO TECH', tags: 'trendy,led'
    },
    // PLANTS (2)
    {
        id: 'prod_plant_1', name: 'Monstera Deliciosa', price: 2499.00, originalPrice: 2999.00,
        category: 'Plants', subcategory: 'Indoor', description: 'Established Monstera in premium ceramic pot.',
        image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b', images: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b',
        stock: 20, rating: 4.6, reviewCount: 52, featured: false, bestSeller: false, brand: 'ZABBRO GREEN', tags: 'plants,decor'
    },
    {
        id: 'prod_plant_2', name: 'Snake Plant Sansevieria', price: 1200.00, originalPrice: 1500.00,
        category: 'Plants', subcategory: 'Indoor', description: 'Air-purifying snake plant, low maintenance.',
        image: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921', images: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921',
        stock: 45, rating: 4.8, reviewCount: 110, featured: true, bestSeller: true, brand: 'ZABBRO GREEN', tags: 'plants,indoor'
    },
    // STICKERS (2)
    {
        id: 'prod_stick_1', name: 'Holographic Dev Pack', price: 499.00, originalPrice: 699.00,
        category: 'Stickers', subcategory: 'Stationery', description: 'Set of 10 waterproof holographic stickers.',
        image: 'https://images.unsplash.com/photo-1572375995301-45564676ecdb', images: 'https://images.unsplash.com/photo-1572375995301-45564676ecdb',
        stock: 500, rating: 4.9, reviewCount: 412, featured: true, bestSeller: true, brand: 'ZABBRO ART', tags: 'stickers,dev'
    },
    {
        id: 'prod_stick_2', name: 'Cyberpunk Aesthetic Set', price: 350.00, originalPrice: 500.00,
        category: 'Stickers', subcategory: 'Art', description: 'Neon-infused vinyl stickers for urban look.',
        image: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6', images: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6',
        stock: 300, rating: 4.7, reviewCount: 124, featured: false, bestSeller: false, brand: 'ZABBRO ART', tags: 'stickers,neon'
    },
    // TECH ACCESSORIES (2)
    {
        id: 'prod_tech_1', name: 'Bolt Power Bank 20k', price: 3499.00, originalPrice: 4200.00,
        category: 'Tech Accessories', subcategory: 'Charging', description: '20,000mAh fast-charging power bank.',
        image: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586', images: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586',
        stock: 65, rating: 4.8, reviewCount: 215, featured: true, bestSeller: false, brand: 'ZABBRO', tags: 'tech,charging'
    },
    {
        id: 'prod_tech_2', name: 'MagSafe Wireless Charger', price: 1999.00, originalPrice: 2500.00,
        category: 'Tech Accessories', subcategory: 'Charging', description: 'Slim aluminum MagSafe compatible charger.',
        image: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179', images: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179',
        stock: 40, rating: 4.9, reviewCount: 56, featured: false, bestSeller: true, brand: 'ZABBRO', tags: 'tech,magsafe'
    },
    // CUSTOMIZED PRODUCTS (2)
    {
        id: 'prod_cust_1', name: 'Custom 3D Keycap', price: 899.00, originalPrice: 1200.00,
        category: 'Customized Products', subcategory: 'Gaming', description: 'Unique 3D printed Artisan keycap.',
        image: 'https://images.unsplash.com/photo-1595246140625-573b715d11dc', images: 'https://images.unsplash.com/photo-1595246140625-573b715d11dc',
        stock: 100, rating: 4.9, reviewCount: 34, featured: false, bestSeller: false, brand: 'ZABBRO LABS', tags: 'custom,gaming'
    },
    {
        id: 'prod_cust_2', name: 'Engraved Wooden Wallet', price: 1500.00, originalPrice: 2000.00,
        category: 'Customized Products', subcategory: 'Lifestyle', description: 'RFID blocking wooden wallet with personalized engraving.',
        image: 'https://images.unsplash.com/photo-1627123424574-724758594e93', images: 'https://images.unsplash.com/photo-1627123424574-724758594e93',
        stock: 30, rating: 4.8, reviewCount: 15, featured: true, bestSeller: true, brand: 'ZABBRO LABS', tags: 'custom,wallet'
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
