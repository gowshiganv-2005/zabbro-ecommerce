/**
 * Cloudinary Storage Utility
 * Handles image uploads to Cloudinary and generates optimized links.
 */

const cloudinary = require('cloudinary').v2;
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

// Configuration check
const isCloudinaryConfigured = () => {
    return process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_SECRET;
};

if (isCloudinaryConfigured()) {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: String(process.env.CLOUDINARY_API_KEY).trim(),
        api_secret: String(process.env.CLOUDINARY_API_SECRET).trim(),
    });
} else {
    console.warn('⚠️ Cloudinary is not fully configured in utils/cloudinary.js');
}

/** Upload image buffer to Cloudinary */
async function uploadToCloudinary(buffer, fileName) {
    if (!isCloudinaryConfigured()) {
        const missing = [];
        if (!process.env.CLOUDINARY_CLOUD_NAME) missing.push('CLOUDINARY_CLOUD_NAME');
        if (!process.env.CLOUDINARY_API_KEY) missing.push('CLOUDINARY_API_KEY');
        if (!process.env.CLOUDINARY_API_SECRET) missing.push('CLOUDINARY_API_SECRET');
        throw new Error(`Cloudinary Configuration Missing: ${missing.join(', ')}. Please verify .env file and restart server.`);
    }

    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: 'zabbro_store',
                use_filename: true,
                unique_filename: true,
                resource_type: 'auto',
            },
            (error, result) => {
                if (error) {
                    console.error('❌ Cloudinary Upload Error:', error.message);
                    return reject(error);
                }
                console.log(`✅ Image uploaded to Cloudinary: ${result.secure_url}`);
                resolve(result.secure_url);
            }
        );

        // Write the buffer to the upload stream
        const Readable = require('stream').Readable;
        const readable = new Readable();
        readable.push(buffer);
        readable.push(null);
        readable.pipe(uploadStream);
    });
}

/** Delete image from Cloudinary by URL */
async function deleteFromCloudinary(url) {
    try {
        const publicId = url.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`zabbro_store/${publicId}`);
        return true;
    } catch (error) {
        console.error('❌ Cloudinary Delete Error:', error.message);
        return false;
    }
}

module.exports = {
    uploadToCloudinary,
    deleteFromCloudinary,
};
