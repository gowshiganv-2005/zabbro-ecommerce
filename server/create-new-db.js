/**
 * Automated Spreadsheet Creator
 * Creates a brand new database, sets up tabs, and shares it with the user.
 */
const { google } = require('googleapis');
require('dotenv').config();

async function createNewDB() {
    console.log('--- CREATING FRESH GOOGLE SHEETS DATABASE ---');

    // 1. Clean Key
    let rawKey = process.env.GOOGLE_PRIVATE_KEY || '';
    if (rawKey.startsWith('"') && rawKey.endsWith('"')) rawKey = rawKey.substring(1, rawKey.length - 1);
    const PRIVATE_KEY = rawKey.replace(/\\n/g, '\n');

    const auth = new google.auth.GoogleAuth({
        credentials: {
            client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            private_key: PRIVATE_KEY,
        },
        scopes: [
            'https://www.googleapis.com/auth/spreadsheets',
            'https://www.googleapis.com/auth/drive'
        ],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const drive = google.drive({ version: 'v3', auth });

    try {
        // 2. Create Spreadsheet
        console.log('Creating spreadsheet...');
        const spreadsheet = await sheets.spreadsheets.create({
            resource: {
                properties: { title: 'Zabbro Store DB (Automated)' },
                sheets: [
                    { properties: { title: 'Products' } },
                    { properties: { title: 'Users' } },
                    { properties: { title: 'Orders' } },
                    { properties: { title: 'Inventory' } },
                    { properties: { title: 'Reviews' } }
                ]
            }
        });

        const newID = spreadsheet.data.spreadsheetId;
        console.log('✅ Created! ID:', newID);

        // 3. Share with User
        console.log('Sharing with gowshigan20805@gmail.com...');
        await drive.permissions.create({
            fileId: newID,
            resource: {
                type: 'user',
                role: 'writer',
                emailAddress: 'gowshigan20805@gmail.com'
            }
        });
        console.log('✅ Shared!');

        console.log('\n--- NEXT STEPS ---');
        console.log('1. Update GOOGLE_SPREADSHEET_ID in .env to:', newID);
        console.log('2. Run npm run setup');

        return newID;
    } catch (error) {
        console.error('❌ Failed to create DB:', error.message);
        if (error.message.includes('Drive API has not been used')) {
            console.log('🚨 TIP: You need to enable the Google Drive API in your Google Cloud Console for this service account.');
        }
    }
}

createNewDB().then(id => {
    if (id) {
        // Proactively update .env if successful
        const fs = require('fs');
        const path = require('path');
        const envPath = path.join(__dirname, '..', '.env');
        let envContent = fs.readFileSync(envPath, 'utf8');
        envContent = envContent.replace(/GOOGLE_SPREADSHEET_ID=.*/, `GOOGLE_SPREADSHEET_ID=${id}`);
        fs.writeFileSync(envPath, envContent);
        console.log('✅ Local .env updated automatically.');
    }
});
