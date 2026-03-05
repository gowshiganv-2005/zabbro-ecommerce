/**
 * Test Cloudinary Upload
 */
require('dotenv').config();
const { uploadToCloudinary } = require('./utils/cloudinary');
const fs = require('fs');
const path = require('path');

async function testCloudinary() {
    console.log('--- CLOUDINARY UPLOAD TEST ---');
    try {
        // Create a tiny dummy image buffer (1x1 red dot)
        const dummyBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');

        console.log('☁️ Attempting upload...');
        const url = await uploadToCloudinary(dummyBuffer, 'test-pixel.png');
        console.log('✅ Success! URL:', url);
    } catch (e) {
        console.error('❌ Cloudinary Test Failed:', e.message);
        console.error('Error Details:', e);
    }
}

testCloudinary();
