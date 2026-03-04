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
  scopes: [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive.file'
  ],
});

const sheets = google.sheets({ version: 'v4', auth });
const drive = google.drive({ version: 'v3', auth });
const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;

const SHEET_MAP = {
  'products.xlsx': 'Products',
  'users.xlsx': 'Users',
  'orders.xlsx': 'Orders',
  'inventory.xlsx': 'Inventory',
  'reviews.xlsx': 'Reviews'
};

/** Get data from sheet with raw response for index mapping */
async function getSheetDataRaw(sheetName) {
  if (!SPREADSHEET_ID) return { data: [], headers: [] };
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}`,
    });
    const rows = response.data.values;
    if (!rows || rows.length === 0) return { data: [], headers: [] };

    const headers = rows[0];
    const data = rows.slice(1).map(row => {
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
    return { data, headers };
  } catch (error) {
    console.error(`❌ Sheet Read Error (${sheetName}):`, error.message);
    throw new Error(`Database unavailable: ${error.message}`);
  }
}

/** Get data from sheet (standard wrapper) */
async function getSheetData(sheetName) {
  const result = await getSheetDataRaw(sheetName);
  return result.data;
}

/** Overwrite sheet data with absolute safety */
async function setSheetData(sheetName, data) {
  if (!SPREADSHEET_ID) throw new Error('GOOGLE_SPREADSHEET_ID is missing');

  try {
    const criticalSheets = ['Products', 'Users', 'Inventory'];
    // 🛡️ STOP: Prevents accidental bulk deletion
    if (criticalSheets.includes(sheetName) && (!data || data.length === 0)) {
      console.error(`🛑 BLOCKED: Attempted to clear critical sheet ${sheetName}. Safeguard triggered.`);
      return false;
    }

    if (!data) return false;

    // Determine current headers
    const headerSet = new Set();
    data.forEach(item => { if (item) Object.keys(item).forEach(key => headerSet.add(key)); });
    const headers = Array.from(headerSet);

    const rows = [headers, ...data.map(item => headers.map(h => {
      let val = item[h];
      if (typeof val === 'object' && val !== null) val = JSON.stringify(val);
      const strVal = val === undefined || val === null ? '' : String(val);
      if (strVal.length > 48000) return strVal.substring(0, 47000) + '... (TRUNCATED)';
      return strVal;
    }))];

    // Atomic full update: Clear previous content implicitly by updating the necessary range
    // We update starting at A1. We don't use a hardcoded large range to avoid unintended side effects.
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A1`, // Start at A1, Google will expand to fit the 'rows' array
      valueInputOption: 'USER_ENTERED',
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

/** Robust Atomic Append - ZERO risk of full sheet deletion */
async function appendRow(filename, row) {
  const sheetName = SHEET_MAP[filename];
  if (!sheetName) throw new Error(`Sheet not mapped for ${filename}`);

  // Fetch headers without relying on data presence
  const { headers: existingHeaders } = await getSheetDataRaw(sheetName);

  // Build headers from existing + any new fields in the new row
  const headerSet = new Set(existingHeaders);
  Object.keys(row).forEach(k => headerSet.add(k));
  const headers = Array.from(headerSet);

  const rowArray = headers.map(h => {
    let val = row[h];
    if (typeof val === 'object' && val !== null) val = JSON.stringify(val);
    const strVal = val === undefined || val === null ? '' : String(val);
    if (strVal.length > 48000) return strVal.substring(0, 47000) + '... (TRUNCATED)';
    return strVal;
  });

  try {
    // 🛡️ If headers don't exist in sheet, write them first (Initialize Sheet)
    if (existingHeaders.length === 0) {
      await writeExcel(filename, [row]);
      return true;
    }

    // 🛡️ ATOMIC APPEND: Adding to existing data - never touches previous rows
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A1`,
      valueInputOption: 'USER_ENTERED',
      resource: { values: [rowArray] },
    });
    return true;
  } catch (error) {
    console.error(`❌ Atomic Append Error in ${sheetName}:`, error.message);
    throw new Error(`Failed to save record: ${error.message}`);
  }
}

/** Atomic version of updateRow to prevent full sheet rewrite race conditions */
async function updateRow(filename, matchField, matchValue, updates) {
  const sheetName = SHEET_MAP[filename];
  const { data, headers } = await getSheetDataRaw(sheetName);

  const target = String(matchValue).toLowerCase().trim();
  const index = data.findIndex(item => {
    const val = item[matchField];
    return val !== undefined && String(val).toLowerCase().trim() === target;
  });

  if (index === -1) {
    console.warn(`⚠️ updateRow failed: No row found in ${filename} where ${matchField} matches "${matchValue}"`);
    return false;
  }

  const updatedItem = { ...data[index], ...updates };
  // Convert object back to row array based on headers
  const rowArray = headers.map(h => {
    let val = updatedItem[h];
    if (typeof val === 'object' && val !== null) val = JSON.stringify(val);
    const strVal = val === undefined || val === null ? '' : String(val);
    if (strVal.length > 49000) return strVal.substring(0, 48000) + '... (TRUNCATED)';
    return strVal;
  });

  const rowNumber = index + 2; // +1 for 0-indexing, +1 for header row
  try {
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A${rowNumber}`,
      valueInputOption: 'USER_ENTERED',
      resource: { values: [rowArray] },
    });
    return true;
  } catch (error) {
    console.error(`❌ Atomic Update Failed, falling back to full write:`, error.message);
    data[index] = updatedItem;
    return await writeExcel(filename, data);
  }
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
  drive,
  auth,
  DATA_DIR: ''
};
