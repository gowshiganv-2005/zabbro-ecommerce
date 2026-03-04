/**
 * Data Integrity Check
 * Reads all sheets and prints the number of records found.
 */
require('dotenv').config();
const { readExcel } = require('./utils/excel');

async function checkData() {
    console.log('--- DATA INTEGRITY CHECK ---');
    console.log('Using Spreadsheet ID:', process.env.GOOGLE_SPREADSHEET_ID);

    const sheets = ['products.xlsx', 'users.xlsx', 'orders.xlsx', 'inventory.xlsx', 'reviews.xlsx'];

    for (const sheet of sheets) {
        try {
            const data = await readExcel(sheet);
            console.log(`${sheet}: Found ${data.length} records`);
            if (data.length > 0) {
                console.log(`  First record keys: ${Object.keys(data[0]).join(', ')}`);
            }
        } catch (error) {
            console.error(`❌ Error reading ${sheet}:`, error.message);
        }
    }
    console.log('--- CHECK COMPLETE ---');
}

checkData();
