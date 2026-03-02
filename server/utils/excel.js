/**
 * Excel Utility Module
 * Handles all read/write operations with Excel files (.xlsx)
 * Acts as the database layer for the e-commerce application
 */

const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const DATA_DIR = path.join(__dirname, '..', 'data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

/**
 * Read data from an Excel file
 * @param {string} filename - Name of the Excel file (e.g., 'products.xlsx')
 * @param {string} sheetName - Optional sheet name, defaults to first sheet
 * @returns {Array} Array of objects representing rows
 */
function readExcel(filename, sheetName = null) {
  const filePath = path.join(DATA_DIR, filename);
  
  if (!fs.existsSync(filePath)) {
    console.warn(`File ${filename} not found. Returning empty array.`);
    return [];
  }

  try {
    const workbook = XLSX.readFile(filePath);
    const sheet = sheetName 
      ? workbook.Sheets[sheetName] 
      : workbook.Sheets[workbook.SheetNames[0]];
    
    if (!sheet) return [];
    
    const data = XLSX.utils.sheet_to_json(sheet, { defval: '' });
    return data;
  } catch (error) {
    console.error(`Error reading ${filename}:`, error.message);
    return [];
  }
}

/**
 * Write data to an Excel file
 * @param {string} filename - Name of the Excel file
 * @param {Array} data - Array of objects to write
 * @param {string} sheetName - Optional sheet name, defaults to 'Sheet1'
 */
function writeExcel(filename, data, sheetName = 'Sheet1') {
  const filePath = path.join(DATA_DIR, filename);

  try {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    XLSX.writeFile(workbook, filePath);
    return true;
  } catch (error) {
    console.error(`Error writing ${filename}:`, error.message);
    return false;
  }
}

/**
 * Append a single row to an existing Excel file
 * @param {string} filename - Name of the Excel file
 * @param {Object} row - Object representing the new row
 */
function appendRow(filename, row) {
  const existingData = readExcel(filename);
  existingData.push(row);
  return writeExcel(filename, existingData);
}

/**
 * Update a row in an Excel file by matching a field value
 * @param {string} filename - Name of the Excel file
 * @param {string} matchField - Field to match on (e.g., 'id')
 * @param {*} matchValue - Value to match
 * @param {Object} updates - Object with fields to update
 */
function updateRow(filename, matchField, matchValue, updates) {
  const data = readExcel(filename);
  const index = data.findIndex(row => String(row[matchField]) === String(matchValue));
  
  if (index === -1) return false;
  
  data[index] = { ...data[index], ...updates };
  return writeExcel(filename, data);
}

/**
 * Delete a row from an Excel file by matching a field value
 * @param {string} filename - Name of the Excel file
 * @param {string} matchField - Field to match on
 * @param {*} matchValue - Value to match
 */
function deleteRow(filename, matchField, matchValue) {
  const data = readExcel(filename);
  const filtered = data.filter(row => String(row[matchField]) !== String(matchValue));
  
  if (filtered.length === data.length) return false;
  
  return writeExcel(filename, filtered);
}

/**
 * Find a single row by matching a field value
 * @param {string} filename - Name of the Excel file
 * @param {string} matchField - Field to match on
 * @param {*} matchValue - Value to match
 */
function findRow(filename, matchField, matchValue) {
  const data = readExcel(filename);
  return data.find(row => String(row[matchField]) === String(matchValue)) || null;
}

/**
 * Find multiple rows by matching a field value
 * @param {string} filename - Name of the Excel file
 * @param {string} matchField - Field to match on
 * @param {*} matchValue - Value to match
 */
function findRows(filename, matchField, matchValue) {
  const data = readExcel(filename);
  return data.filter(row => String(row[matchField]) === String(matchValue));
}

module.exports = {
  readExcel,
  writeExcel,
  appendRow,
  updateRow,
  deleteRow,
  findRow,
  findRows,
  DATA_DIR
};
