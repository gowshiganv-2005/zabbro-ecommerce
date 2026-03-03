/**
 * Data Setup Script
 * Creates initial Excel files with sample data for the e-commerce store
 * Run with: npm run setup
 */

const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const DATA_DIR = path.join(__dirname, 'data');

if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Ensure uploads directory exists
const UPLOADS_DIR = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

function writeExcel(filename, data, sheetName = 'Sheet1') {
    const filePath = path.join(DATA_DIR, filename);
    // NEVER overwrite existing data files
    if (fs.existsSync(filePath)) {
        console.log(`⏭️  SKIPPED ${filename} — file already exists (data preserved)`);
        return;
    }
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    XLSX.writeFile(workbook, filePath);
    console.log(`✓ Created ${filename} with ${data.length} records`);
}

// ═══════════════════════════════════════
// PRODUCTS DATA
// ═══════════════════════════════════════
const products = [
    {
        id: 'prod_001',
        name: 'Minimalist Ceramic Vase',
        price: 89.00,
        originalPrice: 120.00,
        category: 'Home Decor',
        subcategory: 'Vases',
        description: 'Handcrafted ceramic vase with a clean, modern silhouette. Perfect for minimalist interiors. Each piece is unique with subtle variations in glaze.',
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
        description: 'Full-grain Italian leather tote with a spacious interior. Features brass hardware and a removable shoulder strap. Ages beautifully over time.',
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
        tags: 'leather,bag,tote,premium,accessories'
    },
    {
        id: 'prod_003',
        name: 'Wireless Noise-Cancelling Headphones',
        price: 349.00,
        originalPrice: 399.00,
        category: 'Electronics',
        subcategory: 'Audio',
        description: 'Premium over-ear headphones with active noise cancellation, 30-hour battery life, and crystal-clear sound. Ultra-comfortable memory foam ear cushions.',
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
        tags: 'headphones,wireless,noise-cancelling,electronics'
    },
    {
        id: 'prod_004',
        name: 'Organic Cotton Throw Blanket',
        price: 129.00,
        originalPrice: 159.00,
        category: 'Home Decor',
        subcategory: 'Textiles',
        description: 'Sustainably made from 100% organic cotton. Soft, breathable, and perfect for layering on sofas or beds. Machine washable and hypoallergenic.',
        image: '/uploads/products/blanket.jpg',
        images: '/uploads/products/blanket.jpg,/uploads/products/blanket-2.jpg',
        stock: 60,
        rating: 4.6,
        reviewCount: 156,
        featured: false,
        bestSeller: true,
        newArrival: false,
        brand: 'EcoLiving',
        material: 'Organic Cotton',
        color: 'Ivory',
        tags: 'blanket,organic,cotton,textile,cozy'
    },
    {
        id: 'prod_005',
        name: 'Modern Desk Lamp',
        price: 179.00,
        originalPrice: 219.00,
        category: 'Lighting',
        subcategory: 'Desk Lamps',
        description: 'Sleek LED desk lamp with adjustable color temperature and brightness. Touch-sensitive controls, USB charging port, and a minimal design that complements any workspace.',
        image: '/uploads/products/lamp.jpg',
        images: '/uploads/products/lamp.jpg,/uploads/products/lamp-2.jpg',
        stock: 40,
        rating: 4.5,
        reviewCount: 78,
        featured: true,
        bestSeller: false,
        newArrival: true,
        brand: 'LumiDesign',
        material: 'Aluminum',
        color: 'Silver',
        tags: 'lamp,desk,LED,lighting,modern'
    },
    {
        id: 'prod_006',
        name: 'Heritage Watch Collection',
        price: 599.00,
        originalPrice: 750.00,
        category: 'Accessories',
        subcategory: 'Watches',
        description: 'Classic automatic timepiece with sapphire crystal, exhibition case back, and genuine leather strap. Swiss-made movement with 42-hour power reserve.',
        image: '/uploads/products/watch.jpg',
        images: '/uploads/products/watch.jpg,/uploads/products/watch-2.jpg',
        stock: 15,
        rating: 4.9,
        reviewCount: 45,
        featured: true,
        bestSeller: false,
        newArrival: false,
        brand: 'Meridian',
        material: 'Stainless Steel',
        color: 'Rose Gold',
        tags: 'watch,automatic,heritage,luxury,accessories'
    },
    {
        id: 'prod_007',
        name: 'Artisan Coffee Dripper Set',
        price: 69.00,
        originalPrice: 89.00,
        category: 'Kitchen',
        subcategory: 'Coffee',
        description: 'Pour-over coffee dripper with double-wall borosilicate glass carafe. Includes stainless steel reusable filter and bamboo stand. Makes 4 cups of perfect coffee.',
        image: '/uploads/products/coffee.jpg',
        images: '/uploads/products/coffee.jpg,/uploads/products/coffee-2.jpg',
        stock: 100,
        rating: 4.4,
        reviewCount: 203,
        featured: false,
        bestSeller: true,
        newArrival: false,
        brand: 'BrewCraft',
        material: 'Glass & Bamboo',
        color: 'Natural',
        tags: 'coffee,dripper,pour-over,kitchen,artisan'
    },
    {
        id: 'prod_008',
        name: 'Linen Blend Cushion Set',
        price: 99.00,
        originalPrice: 129.00,
        category: 'Home Decor',
        subcategory: 'Cushions',
        description: 'Set of 2 premium linen blend cushion covers with hidden zipper closure. Subtle textured weave adds depth to any space. Inserts included.',
        image: '/uploads/products/cushion.jpg',
        images: '/uploads/products/cushion.jpg,/uploads/products/cushion-2.jpg',
        stock: 75,
        rating: 4.3,
        reviewCount: 91,
        featured: false,
        bestSeller: false,
        newArrival: true,
        brand: 'NestHome',
        material: 'Linen Blend',
        color: 'Sage Green',
        tags: 'cushion,linen,home decor,set'
    },
    {
        id: 'prod_009',
        name: 'Smart Fitness Tracker Pro',
        price: 199.00,
        originalPrice: 249.00,
        category: 'Electronics',
        subcategory: 'Wearables',
        description: 'Advanced fitness tracker with AMOLED display, heart rate monitoring, GPS, and 7-day battery life. Water resistant to 50m. Tracks 30+ exercise modes.',
        image: '/uploads/products/tracker.jpg',
        images: '/uploads/products/tracker.jpg,/uploads/products/tracker-2.jpg',
        stock: 120,
        rating: 4.6,
        reviewCount: 567,
        featured: true,
        bestSeller: true,
        newArrival: false,
        brand: 'FitPulse',
        material: 'Silicone & Aluminum',
        color: 'Black',
        tags: 'fitness,tracker,smart,wearable,electronics'
    },
    {
        id: 'prod_010',
        name: 'Marble & Gold Bookends',
        price: 149.00,
        originalPrice: 189.00,
        category: 'Home Decor',
        subcategory: 'Accessories',
        description: 'Elegant bookend set crafted from genuine marble with gold-plated metal accents. Each piece weighs 2kg for stability. A statement piece for any shelf.',
        image: '/uploads/products/bookends.jpg',
        images: '/uploads/products/bookends.jpg,/uploads/products/bookends-2.jpg',
        stock: 25,
        rating: 4.7,
        reviewCount: 34,
        featured: false,
        bestSeller: false,
        newArrival: true,
        brand: 'StoneArt',
        material: 'Marble & Metal',
        color: 'White/Gold',
        tags: 'bookends,marble,gold,decor,luxury'
    },
    {
        id: 'prod_011',
        name: 'Cashmere Blend Scarf',
        price: 159.00,
        originalPrice: 199.00,
        category: 'Accessories',
        subcategory: 'Scarves',
        description: 'Luxuriously soft cashmere blend scarf with hand-rolled edges. Lightweight yet warm. Available in classic neutral tones that pair with everything.',
        image: '/uploads/products/scarf.jpg',
        images: '/uploads/products/scarf.jpg,/uploads/products/scarf-2.jpg',
        stock: 50,
        rating: 4.8,
        reviewCount: 128,
        featured: false,
        bestSeller: true,
        newArrival: false,
        brand: 'Finesse',
        material: 'Cashmere Blend',
        color: 'Camel',
        tags: 'scarf,cashmere,luxury,accessories,warm'
    },
    {
        id: 'prod_012',
        name: 'Portable Bluetooth Speaker',
        price: 129.00,
        originalPrice: 159.00,
        category: 'Electronics',
        subcategory: 'Speakers',
        description: 'Compact waterproof speaker with 360° sound, 20-hour battery, and built-in microphone. Pairs two speakers for true stereo sound. Rugged yet elegant design.',
        image: '/uploads/products/speaker.jpg',
        images: '/uploads/products/speaker.jpg,/uploads/products/speaker-2.jpg',
        stock: 90,
        rating: 4.5,
        reviewCount: 234,
        featured: false,
        bestSeller: false,
        newArrival: false,
        brand: 'SoundElite',
        material: 'Fabric & Aluminum',
        color: 'Charcoal',
        tags: 'speaker,bluetooth,portable,waterproof,electronics'
    }
];

// ═══════════════════════════════════════
// USERS DATA
// ═══════════════════════════════════════
const users = [
    {
        id: 'user_001',
        name: 'Admin User',
        email: 'admin@store.com',
        password: bcrypt.hashSync('admin123', 10),
        role: 'admin',
        phone: '+1-555-0100',
        address: '123 Admin Street, New York, NY 10001',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
    },
    {
        id: 'user_002',
        name: 'Jane Cooper',
        email: 'jane@example.com',
        password: bcrypt.hashSync('password123', 10),
        role: 'customer',
        phone: '+1-555-0101',
        address: '456 Oak Avenue, Los Angeles, CA 90001',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
    },
    {
        id: 'user_003',
        name: 'Demo User',
        email: 'demo@store.com',
        password: bcrypt.hashSync('demo123', 10),
        role: 'customer',
        phone: '+1-555-0102',
        address: '789 Pine Road, Chicago, IL 60601',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
    }
];

// ═══════════════════════════════════════
// ORDERS DATA
// ═══════════════════════════════════════
const orders = [
    {
        id: 'ord_001',
        userId: 'user_002',
        userName: 'Jane Cooper',
        userEmail: 'jane@example.com',
        products: JSON.stringify([
            { productId: 'prod_001', name: 'Minimalist Ceramic Vase', quantity: 1, price: 89.00 },
            { productId: 'prod_004', name: 'Organic Cotton Throw Blanket', quantity: 2, price: 129.00 }
        ]),
        subtotal: 347.00,
        shipping: 0,
        tax: 27.76,
        total: 374.76,
        status: 'delivered',
        shippingAddress: '456 Oak Avenue, Los Angeles, CA 90001',
        paymentMethod: 'Credit Card',
        createdAt: '2026-02-15T10:30:00Z',
        updatedAt: '2026-02-20T14:00:00Z'
    },
    {
        id: 'ord_002',
        userId: 'user_002',
        userName: 'Jane Cooper',
        userEmail: 'jane@example.com',
        products: JSON.stringify([
            { productId: 'prod_003', name: 'Wireless Noise-Cancelling Headphones', quantity: 1, price: 349.00 }
        ]),
        subtotal: 349.00,
        shipping: 0,
        tax: 27.92,
        total: 376.92,
        status: 'shipped',
        shippingAddress: '456 Oak Avenue, Los Angeles, CA 90001',
        paymentMethod: 'PayPal',
        createdAt: '2026-02-25T09:15:00Z',
        updatedAt: '2026-02-27T11:00:00Z'
    },
    {
        id: 'ord_003',
        userId: 'user_003',
        userName: 'Demo User',
        userEmail: 'demo@store.com',
        products: JSON.stringify([
            { productId: 'prod_006', name: 'Heritage Watch Collection', quantity: 1, price: 599.00 },
            { productId: 'prod_011', name: 'Cashmere Blend Scarf', quantity: 1, price: 159.00 }
        ]),
        subtotal: 758.00,
        shipping: 0,
        tax: 60.64,
        total: 818.64,
        status: 'processing',
        shippingAddress: '789 Pine Road, Chicago, IL 60601',
        paymentMethod: 'Credit Card',
        createdAt: '2026-03-01T16:45:00Z',
        updatedAt: '2026-03-01T16:45:00Z'
    }
];

// ═══════════════════════════════════════
// INVENTORY DATA
// ═══════════════════════════════════════
const inventory = products.map(p => ({
    productId: p.id,
    productName: p.name,
    currentStock: p.stock,
    reservedStock: Math.floor(p.stock * 0.1),
    availableStock: p.stock - Math.floor(p.stock * 0.1),
    reorderLevel: 10,
    reorderQuantity: 50,
    lastRestocked: '2026-02-20T00:00:00Z',
    supplier: p.brand,
    status: p.stock > 20 ? 'in_stock' : p.stock > 0 ? 'low_stock' : 'out_of_stock'
}));

// ═══════════════════════════════════════
// REVIEWS DATA
// ═══════════════════════════════════════
const reviews = [
    {
        id: 'rev_001',
        productId: 'prod_001',
        userId: 'user_002',
        userName: 'Jane Cooper',
        rating: 5,
        title: 'Absolutely stunning piece',
        comment: 'The vase is even more beautiful in person. The glaze has this wonderful subtle texture. It looks perfect on my mantel with some dried eucalyptus.',
        createdAt: '2026-02-18T14:30:00Z',
        helpful: 12
    },
    {
        id: 'rev_002',
        productId: 'prod_001',
        userId: 'user_003',
        userName: 'Demo User',
        rating: 4,
        title: 'Beautiful but slightly smaller than expected',
        comment: 'Really lovely craftsmanship. My only note is that it was a touch smaller than I expected from the photos, but the quality is undeniable.',
        createdAt: '2026-02-22T09:15:00Z',
        helpful: 5
    },
    {
        id: 'rev_003',
        productId: 'prod_003',
        userId: 'user_002',
        userName: 'Jane Cooper',
        rating: 5,
        title: 'Best headphones I have ever owned',
        comment: 'The noise cancellation is incredible. I use them for work calls and music, and the sound quality is pristine. Battery lasts well beyond the stated 30 hours.',
        createdAt: '2026-02-28T11:00:00Z',
        helpful: 28
    },
    {
        id: 'rev_004',
        productId: 'prod_002',
        userId: 'user_003',
        userName: 'Demo User',
        rating: 5,
        title: 'Worth every penny',
        comment: 'The quality of the leather is outstanding. It has a wonderful smell and the craftsmanship is top-notch. Already getting compliments!',
        createdAt: '2026-02-20T16:45:00Z',
        helpful: 15
    },
    {
        id: 'rev_005',
        productId: 'prod_006',
        userId: 'user_002',
        userName: 'Jane Cooper',
        rating: 5,
        title: 'A timeless classic',
        comment: 'This watch is a work of art. The movement is smooth, the dial is gorgeous, and the leather strap is incredibly comfortable. A true heirloom piece.',
        createdAt: '2026-02-25T20:00:00Z',
        helpful: 22
    },
    {
        id: 'rev_006',
        productId: 'prod_009',
        userId: 'user_003',
        userName: 'Demo User',
        rating: 4,
        title: 'Great tracker, minor app issues',
        comment: 'The hardware is fantastic and the battery life is amazing. The companion app could use some polish, but overall a great fitness companion.',
        createdAt: '2026-03-01T08:30:00Z',
        helpful: 8
    }
];

// ═══════════════════════════════════════
// WRITE ALL FILES
// ═══════════════════════════════════════
console.log('\n🛒 Setting up e-commerce database...\n');

writeExcel('products.xlsx', products);
writeExcel('users.xlsx', users);
writeExcel('orders.xlsx', orders);
writeExcel('inventory.xlsx', inventory);
writeExcel('reviews.xlsx', reviews);

console.log('\n✅ Database setup complete!\n');
console.log('📧 Admin login: admin@store.com / admin123');
console.log('📧 Demo login: demo@store.com / demo123');
console.log('📧 User login: jane@example.com / password123\n');
