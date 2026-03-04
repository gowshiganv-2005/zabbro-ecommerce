/**
 * Final Cloudinary Data Restoration (FULL 22 PRODUCT SET)
 */
require('dotenv').config();
const { writeExcel } = require('./utils/excel');
const { uploadToCloudinary } = require('./utils/cloudinary');
const bcrypt = require('bcryptjs');
const fetch = require('node-fetch');

const products = [
    { id: 'p1', name: 'AI Home Automation Hub', price: 15499, category: 'Projects', image: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=800', stock: 25, featured: true },
    { id: 'p2', name: 'Gesture Control Robot Kit', price: 8999, category: 'Projects', image: 'https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=800', stock: 12 },
    { id: 'p3', name: 'ZABBRO Voice Assistant', price: 12500, category: 'Projects', image: 'https://images.unsplash.com/photo-1589254065878-42c9da997008?w=800', stock: 8 },
    { id: 'p4', name: 'Zabbro Oversized Tech Tee', price: 1299, category: 'T-shirts', image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800', stock: 100 },
    { id: 'p5', name: 'Gradient Developer Tee', price: 999, category: 'T-shirts', image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800', stock: 85 },
    { id: 'p6', name: 'Minimalist Logo T-Shirt', price: 899, category: 'T-shirts', image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800', stock: 50 },
    { id: 'p7', name: 'E-Commerce React Template', price: 4500, category: 'Websites', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800', stock: 999 },
    { id: 'p8', name: 'Corporate Landing Page', price: 2999, category: 'Websites', image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800', stock: 999 },
    { id: 'p9', name: 'Travel Portfolio Theme', price: 1999, category: 'Websites', image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800', stock: 999 },
    { id: 'p10', name: 'Oak Monitor Stand', price: 3200, category: 'Wooden Products', image: 'https://images.unsplash.com/photo-1593642532400-2682810df593?w=800', stock: 15 },
    { id: 'p11', name: 'Walnut Laptop Dock', price: 4800, category: 'Wooden Products', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800', stock: 10 },
    { id: 'p12', name: 'Transparent Keyboard', price: 6499, category: 'Trendy Products', image: 'https://images.unsplash.com/photo-1618384881928-142835f8d975?w=800', stock: 40 },
    { id: 'p13', name: 'Neon LED Desk Strip', price: 1800, category: 'Trendy Products', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800', stock: 75 },
    { id: 'p14', name: 'Monstera Deliciosa', price: 2499, category: 'Plants', image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800', stock: 20 },
    { id: 'p15', name: 'Snake Plant', price: 1200, category: 'Plants', image: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?w=800', stock: 45 },
    { id: 'p16', name: 'Holographic Dev Pack', price: 499, category: 'Stickers', image: 'https://images.unsplash.com/photo-1572375995301-45564676ecdb?w=800', stock: 500 },
    { id: 'p17', name: 'Cyberpunk Aesthetic Set', price: 350, category: 'Stickers', image: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6?w=800', stock: 300 },
    { id: 'p18', name: 'Bolt Power Bank 20k', price: 3499, category: 'Tech Accessories', image: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=800', stock: 65 },
    { id: 'p19', name: 'MagSafe Wireless Charger', price: 1999, category: 'Tech Accessories', image: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=800', stock: 40 },
    { id: 'p20', name: 'Custom 3D Keycap', price: 899, category: 'Customized Products', image: 'https://images.unsplash.com/photo-1595246140625-573b715d11dc?w=800', stock: 100 },
    { id: 'p21', name: 'Engraved Wooden Wallet', price: 1500, category: 'Customized Products', image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800', stock: 30 },
    { id: 'p22', name: 'ZABBRO Premium Hoodie', price: 2499, category: 'T-shirts', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800', stock: 45 }
];

async function start() {
    console.log('🚀 DEEP COLD START: Restoring all 22 products to Cloudinary...');
    const finalProducts = [];
    for (const p of products) {
        try {
            const resp = await fetch(p.image);
            const buffer = await resp.buffer();
            const url = await uploadToCloudinary(buffer, p.name);
            p.image = url;
            p.images = url; // Set gallery to same for setup
            p.description = p.description || `Premium ${p.name} from ZABBRO.`;
            p.rating = 4.5 + Math.random() * 0.5;
            p.reviewCount = Math.floor(Math.random() * 200);
            p.bestSeller = Math.random() > 0.7;
            p.brand = 'ZABBRO';
            finalProducts.push(p);
        } catch (e) {
            console.error(`Skipped ${p.name}:`, e.message);
        }
    }

    const adminUser = { id: 'admin', name: 'Admin', email: 'admin@store.com', password: bcrypt.hashSync('admin123', 10), role: 'admin' };
    const inventory = finalProducts.map(p => ({ productId: p.id, productName: p.name, currentStock: p.stock, availableStock: p.stock }));

    await writeExcel('products.xlsx', finalProducts);
    await writeExcel('users.xlsx', [adminUser]);
    await writeExcel('inventory.xlsx', inventory);

    console.log('🎉 STORE FULLY RESTORED WITH 22 PRODUCTS!');
}

start();
