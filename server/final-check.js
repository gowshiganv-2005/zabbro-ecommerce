const { google } = require('googleapis');
require('dotenv').config();

async function check() {
    console.log('--- FINAL DIAGNOSTIC ---');
    console.log('Email:', process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL);
    console.log('Sheet ID:', process.env.GOOGLE_SPREADSHEET_ID);

    let key = process.env.GOOGLE_PRIVATE_KEY || '';
    console.log('Key length:', key.length);
    console.log('Key starts with:', key.substring(0, 30));
    console.log('Key contains \\n (count):', (key.match(/\\n/g) || []).length);

    // Test auth
    try {
        const auth = new google.auth.JWT(
            process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            null,
            key.replace(/\\n/g, '\n'),
            ['https://www.googleapis.com/auth/spreadsheets']
        );
        console.log('JWT object created');

        const sheets = google.sheets({ version: 'v4', auth });
        console.log('Fetching spreadsheet...');
        const res = await sheets.spreadsheets.get({
            spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID
        });
        console.log('SUCCESS! Title:', res.data.properties.title);
    } catch (err) {
        console.error('FAILURE:', err.message);
        if (err.message.includes('permission')) {
            console.log('\n🚨 TIP: You still need to SHARE the sheet with:');
            console.log(process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL);
            console.log('as an EDITOR.');
        }
    }
}
check();
