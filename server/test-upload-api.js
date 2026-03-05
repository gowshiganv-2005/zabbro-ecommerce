/**
 * Test Admin Image Upload API
 */
require('dotenv').config();
const fetch = require('node-fetch');
const FormData = require('form-data');

const API_URL = 'http://localhost:3000/api';

async function testUpload() {
    console.log('--- ADMIN UPLOAD API TEST ---');
    try {
        // 1. Login as Admin
        const loginRes = await fetch(`${API_URL}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@store.com', password: 'admin123' })
        });
        const loginData = await loginRes.json();
        if (!loginData.success) {
            console.error('❌ Login Failed:', loginData.message);
            return;
        }
        const token = loginData.data.token;
        console.log('✅ Logged in');

        // 2. Upload Image
        const form = new FormData();
        const dummyBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');
        form.append('image', dummyBuffer, { filename: 'test-pixel.png', contentType: 'image/png' });

        console.log('☁️ Uploading image to API...');
        const uploadRes = await fetch(`${API_URL}/admin/upload`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: form
        });
        const uploadData = await uploadRes.json();
        if (uploadData.success) {
            console.log('🎉 SUCCESS! URL:', uploadData.data.url);
        } else {
            console.error('❌ Upload Failed:', uploadData.message, uploadData.error || '');
        }
    } catch (e) {
        console.error('❌ Test Script Error:', e.message);
    }
}

testUpload();
