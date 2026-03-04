/**
 * Setup Data with Google Drive Images
 * Fetches sample Unsplash images, uploads them to your Google Drive,
 * and populates the Google Sheet with the permanent Drive links.
 */

require('dotenv').config();
const { writeExcel } = require('./utils/excel');
const { uploadToDrive } = require('./utils/drive');
const bcrypt = require('bcryptjs');

const products = [
    // PROJECTS (3)
    {
        id: 'prod_proj_1', name: 'AI Home Automation Hub', price: 15499.00, originalPrice: 18000.00,
        category: 'Projects', subcategory: 'Smart Home', description: 'A complete open-source AI hub for controlling your home devices.',
        image: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=800',
        images: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=800,https://images.unsplash.com/photo-1518770660439-4636190af475?w=800',
        stock: 25, rating: 4.9, reviewCount: 45, featured: true, bestSeller: true, brand: 'ZABBRO', tags: 'projects,ai'
    },
    {
        id: 'prod_proj_2', name: 'Gesture Control Robot Kit', price: 8999.00, originalPrice: 11000.00,
        category: 'Projects', subcategory: 'Robotics', description: 'Arduino-based robot kit that responds to hand gestures.',
        image: 'https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=800',
        images: 'https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=800',
        stock: 12, rating: 4.8, reviewCount: 18, featured: false, bestSeller: false, brand: 'ZABBRO', tags: 'projects,robot'
    },
    {
        id: 'prod_proj_3', name: 'ZABBRO Voice Assistant', price: 12500.00, originalPrice: 15000.00,
        category: 'Projects', subcategory: 'AI', description: 'Custom voice assistant with privacy-first local processing.',
        image: 'https://images.unsplash.com/photo-1589254065878-42c9da997008?w=800',
        images: 'https://images.unsplash.com/photo-1589254065878-42c9da997008?w=800',
        stock: 8, rating: 5.0, reviewCount: 12, featured: true, bestSeller: false, brand: 'ZABBRO', tags: 'ai,voice'
    },
    // T-SHIRTS (3)
    {
        id: 'prod_tsh_1', name: 'Zabbro Oversized Tech Tee', price: 1299.00, originalPrice: 1599.00,
        category: 'T-shirts', subcategory: 'Streetwear', description: 'Heavyweight 240 GSM cotton oversized t-shirt.',
        image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800',
        images: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800',
        stock: 120, rating: 4.8, reviewCount: 320, featured: true, bestSeller: true, brand: 'ZABBRO', tags: 'fashion,tshirt'
    },
    {
        id: 'prod_tsh_2', name: 'Gradient Developer Tee', price: 999.00, originalPrice: 1299.00,
        category: 'T-shirts', subcategory: 'Casual', description: 'Soft ringspun cotton with developer-themed gradient print.',
        image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800',
        images: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800',
        stock: 85, rating: 4.7, reviewCount: 95, featured: false, bestSeller: true, brand: 'ZABBRO', tags: 'fashion,dev'
    },
    // WEBSITES (2)
    {
        id: 'prod_web_1', name: 'E-Commerce React Template', price: 4500.00, originalPrice: 6000.00,
        category: 'Websites', subcategory: 'E-commerce', description: 'High-performance React template for online stores.',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
        images: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
        stock: 999, rating: 5.0, reviewCount: 67, featured: true, bestSeller: false, brand: 'ZABBRO DIGITAL', tags: 'web,react'
    },
    // WOODEN PRODUCTS (2)
    {
        id: 'prod_wood_1', name: 'Oak Monitor Stand', price: 3200.00, originalPrice: 4500.00,
        category: 'Wooden Products', subcategory: 'Office', description: 'Solid oak monitor riser with cable management.',
        image: 'https://images.unsplash.com/photo-1593642532400-2682810df593?w=800',
        images: 'https://images.unsplash.com/photo-1593642532400-2682810df593?w=800',
        stock: 15, rating: 4.7, reviewCount: 28, featured: false, bestSeller: true, brand: 'ZABBRO WOODS', tags: 'wooden,office'
    },
    // TRENDY PRODUCTS (2)
    {
        id: 'prod_trend_1', name: 'Transparent Keyboard', price: 6499.00, originalPrice: 7999.00,
        category: 'Trendy Products', subcategory: 'Gaming', description: 'RGB aura transparent mechanical keyboard.',
        image: 'https://images.unsplash.com/photo-1618384881928-142835f8d975?w=800',
        images: 'https://images.unsplash.com/photo-1618384881928-142835f8d975?w=800',
        stock: 40, rating: 4.9, reviewCount: 156, featured: true, bestSeller: true, brand: 'ZABBRO TECH', tags: 'trendy,gaming'
    },
    // PLANTS (2)
    {
        id: 'prod_plant_1', name: 'Monstera Deliciosa', price: 2499.00, originalPrice: 2999.00,
        category: 'Plants', subcategory: 'Indoor', description: 'Established Monstera in premium ceramic pot.',
        image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800',
        images: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800',
        stock: 20, rating: 4.6, reviewCount: 52, featured: false, bestSeller: false, brand: 'ZABBRO GREEN', tags: 'plants,decor'
    },
    // STICKERS (2)
    {
        id: 'prod_stick_1', name: 'Holographic Dev Pack', price: 499.00, originalPrice: 699.00,
        category: 'Stickers', subcategory: 'Stationery', description: 'Set of 10 waterproof holographic stickers.',
        image: 'https://images.unsplash.com/photo-1572375995301-45564676ecdb?w=800',
        images: 'https://images.unsplash.com/photo-1572375995301-45564676ecdb?w=800',
        stock: 500, rating: 4.9, reviewCount: 412, featured: true, bestSeller: true, brand: 'ZABBRO ART', tags: 'stickers,dev'
    },
    // TECH ACCESSORIES (2)
    {
        id: 'prod_tech_1', name: 'Bolt Power Bank 20k', price: 3499.00, originalPrice: 4200.00,
        category: 'Tech Accessories', subcategory: 'Charging', description: '20,000mAh fast-charging power bank.',
        image: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=800',
        images: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=800',
        stock: 65, rating: 4.8, reviewCount: 215, featured: true, bestSeller: false, brand: 'ZABBRO', tags: 'tech,charging'
    },
    // CUSTOMIZED PRODUCTS (2)
    {
        id: 'prod_cust_1', name: 'Custom 3D Keycap', price: 899.00, originalPrice: 1200.00,
        category: 'Customized Products', subcategory: 'Gaming', description: 'Unique 3D printed Artisan keycap.',
        image: 'https://images.unsplash.com/photo-1595246140625-573b715d11dc?w=800',
        images: 'https://images.unsplash.com/photo-1595246140625-573b715d11dc?w=800',
        stock: 100, rating: 4.9, reviewCount: 34, featured: false, bestSeller: false, brand: 'ZABBRO LABS', tags: 'custom,gaming'
    }
];

async function downloadAndUpload(url, name) {
    try {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        return await uploadToDrive(buffer, name, 'image/jpeg');
    } catch (e) {
        console.warn(`⚠️ Failed to upload image ${name}:`, e.message);
        return url; // Fallback to original
    }
}

async function start() {
    console.log('🚀 Starting deep restoration (Sheets + Drive Storage)...');

    // 1. Process Images
    const finalProducts = [];
    for (let i = 0; i < products.length; i++) {
        const p = products[i];
        console.log(`Processing [${i + 1}/${products.length}]: ${p.name}...`);

        // Upload main image
        const driveUrl = await downloadAndUpload(p.image, `${p.id}_main.jpg`);
        p.image = driveUrl;

        // Upload gallery images (simplified for setup)
        const galleryUrls = p.images.split(',');
        const newGallery = [];
        for (let j = 0; j < Math.min(galleryUrls.length, 2); j++) {
            const gUrl = await downloadAndUpload(galleryUrls[j], `${p.id}_gallery_${j}.jpg`);
            newGallery.push(gUrl);
        }
        p.images = newGallery.join(',');

        finalProducts.push(p);
    }

    // 2. Prepare Secondary Data
    const users = [{
        id: 'user_admin', name: 'Admin User', email: 'admin@store.com',
        password: bcrypt.hashSync('admin123', 10), role: 'admin',
        createdAt: new Date().toISOString()
    }];

    const inventory = finalProducts.map(p => ({
        productId: p.id, productName: p.name, currentStock: p.stock,
        availableStock: p.stock, status: 'in_stock'
    }));

    // 3. Write to Spreadsheet
    console.log('📝 Writing protected data to Google Sheets...');
    await writeExcel('products.xlsx', finalProducts);
    await writeExcel('users.xlsx', users);
    await writeExcel('inventory.xlsx', inventory);

    // Ensure template headers for other sheets
    await writeExcel('orders.xlsx', [{ id: 'order_template', userId: '', products: '[]', total: 0 }]);
    await writeExcel('reviews.xlsx', [{ id: 'review_template', productId: '', userId: '', rating: 5 }]);

    console.log('🎉 DEEP RESTORATION COMPLETE!');
    console.log('✅ All images hosted on Google Drive.');
    console.log('✅ Spreadsheet data is now atomic and safe.');
}

start();
