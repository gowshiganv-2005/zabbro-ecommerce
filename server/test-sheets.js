const { google } = require('googleapis');
require('dotenv').config();

async function testConnection() {
    console.log('Testing Google Sheets connection...');
    console.log('Email:', process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL);
    console.log('Sheet ID:', process.env.GOOGLE_SPREADSHEET_ID);

    const auth = new google.auth.JWT(
        process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        null,
        process.env.GOOGLE_PRIVATE_KEY ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n') : '',
        ['https://www.googleapis.com/auth/spreadsheets']
    );

    const sheets = google.sheets({ version: 'v4', auth });

    try {
        const response = await sheets.spreadsheets.get({
            spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
        });
        console.log('✅ Connection Successful!');
        console.log('Spreadsheet Title:', response.data.properties.title);

        // Try to read the Products sheet
        const data = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
            range: 'Products!A1',
        });
        console.log('✅ Read Successful!');
    } catch (error) {
        console.error('❌ Connection Failed!');
        console.error('Error Message:', error.message);
        if (error.message.includes('permission')) {
            console.log('\n🚨 TIP: You MUST share the sheet with the email above as an "Editor".');
        }
    }
}

testConnection();
