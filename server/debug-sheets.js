/**
 * Debugging script to see EXACTLY why it fails
 */
const { google } = require('googleapis');
require('dotenv').config();

async function debug() {
    console.log('--- DEBUG START ---');
    console.log('Email:', process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL);
    console.log('Sheet ID:', process.env.GOOGLE_SPREADSHEET_ID);

    const privateKey = process.env.GOOGLE_PRIVATE_KEY ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n') : '';
    if (!privateKey) {
        console.log('❌ Private key is EMPTY in .env');
        return;
    }

    try {
        const auth = new google.auth.JWT(
            process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            null,
            privateKey,
            ['https://www.googleapis.com/auth/spreadsheets']
        );

        const sheets = google.sheets({ version: 'v4', auth });

        console.log('Attempting to fetch spreadsheet details...');
        const response = await sheets.spreadsheets.get({
            spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
        });
        console.log('✅ SPREADSHEET DETECTED:', response.data.properties.title);

        console.log('Attempting to check sheets (tabs)...');
        const sheetNames = response.data.sheets.map(s => s.properties.title);
        console.log('Available tabs:', sheetNames.join(', '));

        const required = ['Products', 'Users', 'Orders', 'Inventory', 'Reviews'];
        required.forEach(req => {
            if (!sheetNames.includes(req)) {
                console.log(`⚠️ Tab missing: ${req}`);
            }
        });

        console.log('Attempting a test write to Products!A1...');
        await sheets.spreadsheets.values.update({
            spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
            range: 'Products!A1',
            valueInputOption: 'RAW',
            resource: { values: [['TEST_WRITE', new Date().toISOString()]] },
        });
        console.log('✅ TEST WRITE SUCCESSFUL!');

    } catch (error) {
        console.error('❌ FATAL ERROR:');
        console.error('Code:', error.code);
        console.error('Message:', error.message);

        if (error.message.includes('permission')) {
            console.log('\n🚨 SOLUTION: You MUST go to the spreadsheet, click "Share", and add the email above as an "Editor".');
        } else if (error.message.includes('not found')) {
            console.log('\n🚨 SOLUTION: The Google Spreadsheet ID in .env might be wrong.');
        } else if (error.message.includes('invalid_grant') || error.message.includes('key')) {
            console.log('\n🚨 SOLUTION: The Private Key you pasted might be incomplete or wrong.');
        }
    }
    console.log('--- DEBUG END ---');
}

debug();
