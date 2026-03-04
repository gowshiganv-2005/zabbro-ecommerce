/**
 * Google Sheets Database Utility
 */

const { google } = require('googleapis');
require('dotenv').config();

// Clean the Private Key
let rawKey = process.env.GOOGLE_PRIVATE_KEY || '';
// Handle Vercel adding quotes or double-escaping
if (rawKey.startsWith('"') && rawKey.endsWith('"')) {
  rawKey = rawKey.substring(1, rawKey.length - 1);
}
// Clean up escaped newlines (e.g. \\n becomes \n)
const PRIVATE_KEY = rawKey.replace(/\\n/g, '\n').trim();

// Authentication setup using GoogleAuth for modern compatibility
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: PRIVATE_KEY,
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });
const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;

const SHEET_MAP = {
  'products.xlsx': 'Products',
  'users.xlsx': 'Users',
  'orders.xlsx': 'Orders',
  'inventory.xlsx': 'Inventory',
  'reviews.xlsx': 'Reviews'
};

/** Get data from sheet */
async function getSheetData(sheetName) {
  if (!SPREADSHEET_ID) return [];
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}`, // Get whole sheet accurately
    });
    const rows = response.data.values;
    if (!rows || rows.length === 0) return [];

    const headers = rows[0];
    return rows.slice(1).map(row => {
      const obj = {};
      headers.forEach((header, index) => {
        let value = row[index];
        if (value === undefined || value === null) value = '';
        try {
          if (value && typeof value === 'string' && (value.startsWith('[') || value.startsWith('{'))) {
            obj[header] = JSON.parse(value);
          } else if (value === 'TRUE' || value === 'true' || value === true) {
            obj[header] = true;
          } else if (value === 'FALSE' || value === 'false' || value === false) {
            obj[header] = false;
          } else if (!isNaN(value) && value !== '' && value !== null && typeof value !== 'boolean') {
            obj[header] = Number(value);
          } else {
            obj[header] = value;
          }
        } catch (e) {
          obj[header] = value;
        }
      });
      return obj;
    });
  } catch (error) {
    console.error(`❌ Sheet Read Error (${sheetName}):`, error.message);
    throw new Error(`Database unavailable: ${error.message}`);
  }
}

/** Overwrite sheet data */
async function setSheetData(sheetName, data) {
  if (!SPREADSHEET_ID) throw new Error('GOOGLE_SPREADSHEET_ID is missing');

  try {
    if (!data || data.length === 0) {
      await sheets.spreadsheets.values.clear({ spreadsheetId: SPREADSHEET_ID, range: `${sheetName}` });
      return true;
    }

    const headerSet = new Set();
    data.forEach(item => {
      if (item) Object.keys(item).forEach(key => headerSet.add(key));
    });
    const headers = Array.from(headerSet);
    const rows = [headers, ...data.map(item => headers.map(h => {
      const val = item[h];
      if (typeof val === 'object' && val !== null) return JSON.stringify(val);
      return val === undefined || val === null ? '' : val;
    }))];

    // Clear whole sheet first to avoid ghost rows from previous longer data
    await sheets.spreadsheets.values.clear({ spreadsheetId: SPREADSHEET_ID, range: `${sheetName}` });

    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A1`,
      valueInputOption: 'USER_ENTERED', // USER_ENTERED handles numbers/booleans better in Sheets UI
      resource: { values: rows },
    });
    return true;
  } catch (error) {
    if (error.response) {
      console.error(`❌ Sheet Write Error (${sheetName}) Details:`, JSON.stringify(error.response.data));
      throw new Error(`Google Sheets API Error: ${error.response.data.error.message} (Status: ${error.response.status})`);
    }
    console.error(`❌ Sheet Write Error (${sheetName}):`, error.message);
    throw error;
  }
}

async function readExcel(filename) { return await getSheetData(SHEET_MAP[filename]); }
async function writeExcel(filename, data) { return await setSheetData(SHEET_MAP[filename], data); }

async function appendRow(filename, row) {
  const sheetName = SHEET_MAP[filename];
  if (!sheetName) throw new Error(`Sheet not mapped for ${filename}`);

  // 1. Get current headers to ensure we align the row data correctly
  const data = await readExcel(filename);
  const headerSet = new Set();
  if (data.length > 0) {
    Object.keys(data[0]).forEach(k => headerSet.add(k));
  }
  // Add any new keys from the new row
  Object.keys(row).forEach(k => headerSet.add(k));
  const headers = Array.from(headerSet);

  // 2. If the sheet was empty, we need to write headers first
  if (data.length === 0) {
    await writeExcel(filename, [row]);
    return true;
  }

  // 3. Otherwise, use the atomic append API
  const rowArray = headers.map(h => {
    const val = row[h];
    if (typeof val === 'object' && val !== null) return JSON.stringify(val);
    return val === undefined || val === null ? '' : val;
  });

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A1`,
      valueInputOption: 'USER_ENTERED',
      resource: { values: [rowArray] },
    });
    return true;
  } catch (error) {
    console.error(`❌ Atomic Append Error (${sheetName}):`, error.message);
    // Fallback to full rewrite if append fails (e.g. range issues)
    data.push(row);
    return await writeExcel(filename, data);
  }
}

async function updateRow(filename, matchField, matchValue, updates) {
  const data = await readExcel(filename);
  const target = String(matchValue).toLowerCase().trim();
  const index = data.findIndex(item => {
    const val = item[matchField];
    return val !== undefined && String(val).toLowerCase().trim() === target;
  });

  if (index === -1) {
    console.warn(`⚠️ updateRow failed: No row found in ${filename} where ${matchField} matches "${matchValue}"`);
    return false;
  }
  data[index] = { ...data[index], ...updates };
  return await writeExcel(filename, data);
}

async function deleteRow(filename, matchField, matchValue) {
  const data = await readExcel(filename);
  const target = String(matchValue).toLowerCase().trim();
  const filtered = data.filter(item => {
    const val = item[matchField];
    return val === undefined || String(val).toLowerCase().trim() !== target;
  });

  if (filtered.length === data.length) return false;
  return await writeExcel(filename, filtered);
}

async function findRow(filename, matchField, matchValue) {
  const data = await readExcel(filename);
  const target = String(matchValue).toLowerCase().trim();
  return data.find(item => {
    const val = item[matchField];
    return val !== undefined && String(val).toLowerCase().trim() === target;
  }) || null;
}

async function findRows(filename, matchField, matchValue) {
  const data = await readExcel(filename);
  return data.filter(item => String(item[matchField]) === String(matchValue));
}

module.exports = {
  readExcel,
  writeExcel,
  appendRow,
  updateRow,
  deleteRow,
  findRow,
  findRows,
  DATA_DIR: ''
};
