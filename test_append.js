const { appendRow } = require('./server/utils/excel');
const { v4: uuidv4 } = require('uuid');

async function test() {
    try {
        console.log('Testing appendRow for Products...');
        const newProduct = {
            id: `test_${uuidv4().slice(0, 8)}`,
            name: 'Test Product',
            price: 99.99,
            category: 'Test',
            stock: 10
        };
        await appendRow('products.xlsx', newProduct);
        console.log('✅ Products append success');

        console.log('Testing appendRow for Inventory...');
        const inventoryItem = {
            productId: newProduct.id,
            productName: newProduct.name,
            currentStock: 10
        };
        await appendRow('inventory.xlsx', inventoryItem);
        console.log('✅ Inventory append success');
    } catch (e) {
        console.error('❌ FAILED:', e.message);
        if (e.response) console.error('Details:', JSON.stringify(e.response.data));
    }
}

test();
