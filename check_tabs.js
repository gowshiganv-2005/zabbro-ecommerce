const { google } = require('googleapis');
require('dotenv').config();

async function checkSpreadsheet() {
    const rawKey = process.env.GOOGLE_PRIVATE_KEY || '';
    const PRIVATE_KEY = rawKey.replace(/\\n/g, '\n').trim();
    const auth = new google.auth.GoogleAuth({
        credentials: { client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL, private_key: PRIVATE_KEY },
        scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });
    const sheets = google.sheets({ version: 'v4', auth });

    try {
        const res = await sheets.spreadsheets.get({
            spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID
        });
        console.log('--- SPREADSHEET TABS ---');
        res.data.sheets.forEach(s => console.log(`- ${s.properties.title}`));
        console.log('------------------------');
    } catch (e) {
        console.error('❌ ERROR:', e.message);
    }
}

checkSpreadsheet();
