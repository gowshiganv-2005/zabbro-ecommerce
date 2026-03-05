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

// Mutex lock to prevent concurrent writes causing sheet corruption
const writeLocks = new Map();

async function acquireLock(filename) {
  while (writeLocks.get(filename)) {
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  writeLocks.set(filename, true);
}

function releaseLock(filename) {
  writeLocks.set(filename, false);
}

const SHEET_MAP = {
  'products.xlsx': 'Products',
  'users.xlsx': 'Users',
  'orders.xlsx': 'Orders',
  'inventory.xlsx': 'Inventory',
  'reviews.xlsx': 'Reviews'
};

// 🏛️ Performance Cache Layer
const dataCache = new Map();
const CACHE_TTL = 5000; // 5 seconds

/** Get data from sheet with raw response for index mapping */
async function getSheetDataRaw(sheetName) {
  if (!SPREADSHEET_ID) return { data: [], headers: [] };

  // Return from cache if fresh (prevents rate limits)
  const cached = dataCache.get(sheetName);
  if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
    return cached.result;
  }

  try {
    const range = `${sheetName}!A1:Z2000`;
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: range,
    }).catch(async (err) => {
      if (err.message && err.message.toLowerCase().includes('not found')) {
        console.warn(`⚠️ Sheet "${sheetName}" missing. Recreating...`);
        // Sheet missing, try to create it
        await sheets.spreadsheets.batchUpdate({
          spreadsheetId: SPREADSHEET_ID,
          resource: { requests: [{ addSheet: { properties: { title: sheetName } } }] }
        }).catch(() => { }); // Ignore if add fails (might have just been created)

        // Define default headers for the new sheet
        const headersMap = {
          'Products': ['id', 'name', 'price', 'originalPrice', 'category', 'subcategory', 'description', 'image', 'images', 'stock', 'rating', 'reviewCount', 'featured', 'bestSeller', 'brand', 'tags'],
          'Users': ['id', 'name', 'email', 'password', 'role', 'phone', 'address', 'createdAt', 'lastLogin'],
          'Orders': ['id', 'userId', 'userName', 'userEmail', 'userPhone', 'products', 'total', 'status', 'createdAt'],
          'Inventory': ['productId', 'productName', 'currentStock', 'reservedStock', 'availableStock', 'reorderLevel', 'reorderQuantity', 'lastRestocked', 'supplier', 'status'],
          'Reviews': ['id', 'productId', 'userId', 'rating', 'comment', 'createdAt']
        };

        const headers = headersMap[sheetName] || ['id'];
        await sheets.spreadsheets.values.update({
          spreadsheetId: SPREADSHEET_ID,
          range: `${sheetName}!A1`,
          valueInputOption: 'RAW',
          resource: { values: [headers] }
        });
        return { data: { values: [headers] } };
      }
      throw err;
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
          const trimmed = typeof value === 'string' ? value.trim() : value;
          // Robust JSON/Boolean/Number parser
          if (typeof trimmed === 'string' && (trimmed.startsWith('[') || trimmed.startsWith('{'))) {
            obj[header] = JSON.parse(trimmed);
          } else if (trimmed === 'TRUE' || trimmed === 'true' || trimmed === true) {
            obj[header] = true;
          } else if (trimmed === 'FALSE' || trimmed === 'false' || trimmed === false) {
            obj[header] = false;
          } else if (trimmed !== '' && !isNaN(trimmed) && typeof trimmed !== 'boolean') {
            obj[header] = Number(trimmed);
          } else {
            obj[header] = value;
          }
        } catch (e) {
          obj[header] = value;
        }
      });
      return obj;
    });

    const result = { data, headers };
    dataCache.set(sheetName, { result, timestamp: Date.now() });
    return result;
  } catch (error) {
    console.error(`❌ Sheet Read Error (${sheetName}):`, error.message);
    return { data: [], headers: [] };
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
  const filename = Object.keys(SHEET_MAP).find(key => SHEET_MAP[key] === sheetName);
  await acquireLock(filename);

  try {
    const criticalSheets = ['Products', 'Users', 'Inventory'];
    // 🛡️ STOP: Prevents accidental bulk deletion
    if (criticalSheets.includes(sheetName) && (!data || data.length === 0)) {
      console.error(`🛑 BLOCKED: Attempted to clear critical sheet ${sheetName}. Safeguard triggered.`);
      releaseLock(filename);
      return false;
    }

    if (!data) { releaseLock(filename); return false; }

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

    // Atomic full update
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A1`,
      valueInputOption: 'USER_ENTERED',
      resource: { values: rows },
    });

    // ✨ Cache Invalidation
    dataCache.delete(sheetName);

    releaseLock(filename);
    return true;
  } catch (error) {
    console.error(`❌ Sheet Write Error (${sheetName}):`, error.message);
    releaseLock(filename);
    throw error;
  }
}

async function readExcel(filename) { return await getSheetData(SHEET_MAP[filename]); }
async function writeExcel(filename, data) { return await setSheetData(SHEET_MAP[filename], data); }

/** Global Header Sync - Ensures columns match across all rows */
async function syncHeaders(sheetName, newHeaders) {
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `${sheetName}!1:1`,
    valueInputOption: 'USER_ENTERED',
    resource: { values: [newHeaders] },
  });
}

/** Robust Atomic Append - ZERO risk of full sheet deletion */
async function appendRow(filename, row) {
  const sheetName = SHEET_MAP[filename];
  if (!sheetName) throw new Error(`Sheet not mapped for ${filename}`);
  await acquireLock(filename);

  try {
    const { headers: existingHeaders } = await getSheetDataRaw(sheetName);

    const headerSet = new Set(existingHeaders);
    let hasNewHeaders = false;
    Object.keys(row).forEach(k => {
      if (!headerSet.has(k)) {
        headerSet.add(k);
        hasNewHeaders = true;
      }
    });
    const headers = Array.from(headerSet);

    if (hasNewHeaders && existingHeaders.length > 0) {
      console.log(`✨ Expanding columns for ${sheetName}...`);
      await syncHeaders(sheetName, headers);
    }

    const rowArray = headers.map(h => {
      let val = row[h];
      if (typeof val === 'object' && val !== null) val = JSON.stringify(val);
      const strVal = val === undefined || val === null ? '' : String(val);
      if (strVal.length > 48000) return strVal.substring(0, 47000) + '... (TRUNCATED)';
      return strVal;
    });

    if (existingHeaders.length === 0) {
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `${sheetName}!A1`,
        valueInputOption: 'USER_ENTERED',
        resource: { values: [headers, rowArray] },
      });
    } else {
      await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: `${sheetName}!A1`,
        valueInputOption: 'USER_ENTERED',
        resource: { values: [rowArray] },
      });
    }

    // ✨ Cache Invalidation after append
    dataCache.delete(sheetName);

    releaseLock(filename);
    return true;
  } catch (error) {
    console.error(`❌ Atomic Append Error in ${sheetName}:`, error.message);
    releaseLock(filename);
    throw new Error(`Failed to save record: ${error.message}`);
  }
}

/** Atomic version of updateRow with Mutex locking */
async function updateRow(filename, matchField, matchValue, updates) {
  const sheetName = SHEET_MAP[filename];
  await acquireLock(filename);

  try {
    const { data, headers } = await getSheetDataRaw(sheetName);
    const target = String(matchValue).toLowerCase().trim();
    const index = data.findIndex(item => {
      const val = item[matchField];
      return val !== undefined && String(val).toLowerCase().trim() === target;
    });

    if (index === -1) {
      console.warn(`⚠️ updateRow failed: No row found in ${filename} where ${matchField} matches "${matchValue}"`);
      releaseLock(filename);
      return false;
    }

    const updatedItem = { ...data[index], ...updates };
    const rowArray = headers.map(h => {
      let val = updatedItem[h];
      if (typeof val === 'object' && val !== null) val = JSON.stringify(val);
      const strVal = val === undefined || val === null ? '' : String(val);
      if (strVal.length > 49000) return strVal.substring(0, 48000) + '... (TRUNCATED)';
      return strVal;
    });

    const rowNumber = index + 2;
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A${rowNumber}`,
      valueInputOption: 'USER_ENTERED',
      resource: { values: [rowArray] },
    });

    // ✨ Cache Invalidation
    dataCache.delete(sheetName);

    releaseLock(filename);
    return true;
  } catch (error) {
    console.error(`❌ updateRow failed for ${sheetName}:`, error.message);
    releaseLock(filename);
    return false;
  }
}

async function deleteRow(filename, matchField, matchValue) {
  const sheetName = SHEET_MAP[filename];
  await acquireLock(filename);
  try {
    const data = await readExcel(filename);
    const target = String(matchValue).toLowerCase().trim();
    const filtered = data.filter(item => {
      const val = item[matchField];
      return val === undefined || String(val).toLowerCase().trim() !== target;
    });

    if (filtered.length === data.length) {
      releaseLock(filename);
      return false;
    }

    const headerSet = new Set();
    filtered.forEach(item => { if (item) Object.keys(item).forEach(key => headerSet.add(key)); });
    const headers = Array.from(headerSet);
    const rows = [headers, ...filtered.map(item => headers.map(h => {
      let val = item[h];
      if (typeof val === 'object' && val !== null) val = JSON.stringify(val);
      return val === undefined || val === null ? '' : String(val);
    }))];

    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A1`,
      valueInputOption: 'USER_ENTERED',
      resource: { values: rows },
    });

    await sheets.spreadsheets.values.clear({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A${rows.length + 1}:Z${rows.length + 500}`, // Increased range for safety
    });

    // ✨ Cache Invalidation
    dataCache.delete(sheetName);

    releaseLock(filename);
    return true;
  } catch (error) {
    console.error(`❌ deleteRow failed for ${sheetName}:`, error.message);
    releaseLock(filename);
    return false;
  }
}

async function findRow(filename, matchField, matchValue) {
  const data = await readExcel(filename);
  if (!data) return null;
  const target = String(matchValue).toLowerCase().trim();
  return data.find(item => {
    const val = item[matchField];
    return val !== undefined && String(val).toLowerCase().trim() === target;
  }) || null;
}

async function findRows(filename, matchField, matchValue) {
  const data = await readExcel(filename);
  if (!data) return [];
  const target = String(matchValue).toLowerCase().trim();
  return data.filter(item => {
    const val = item[matchField];
    return val !== undefined && String(val).toLowerCase().trim() === target;
  });
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
