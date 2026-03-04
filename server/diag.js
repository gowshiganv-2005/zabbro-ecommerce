/**
 * Clear Diagnostic
 */
require('dotenv').config();
const { readExcel } = require('./utils/excel');

async function run() {
    const sheets = ['products.xlsx', 'users.xlsx', 'orders.xlsx', 'inventory.xlsx', 'reviews.xlsx'];
    for (const s of sheets) {
        const data = await readExcel(s);
        process.stdout.write(`SHEET [${s}] COUNT: ${data.length}\n`);
    }
}
run();
