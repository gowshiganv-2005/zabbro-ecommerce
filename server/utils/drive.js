/**
 * Google Drive Storage Utility
 * Handles image uploads to Google Drive and link generation
 */

const { drive } = require('./excel');
const { Readable } = require('stream');

// Use the specific folder ID shared by the user to bypass quota issues
let FOLDER_ID = '1Zlmr5DgL0d3ORa-C1qjQdZNzR2FiZ1Cy';
const FOLDER_NAME = 'ZABBRO_STORE_IMAGES';

/** Get or Create the Images Folder in Drive */
async function getOrCreateFolder() {
    return FOLDER_ID; // Return the hardcoded ID directly
}

/** Upload buffer to Drive and return shared link */
async function uploadToDrive(buffer, fileName, mimeType) {
    try {
        const parentFolder = await getOrCreateFolder();

        // Create File in Drive
        const fileMetadata = {
            name: fileName,
            parents: [parentFolder],
        };

        const media = {
            mimeType: mimeType,
            body: Readable.from(buffer),
        };

        const file = await drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id, webViewLink, webContentLink',
        });

        const fileId = file.data.id;

        // IMPORTANT: Make the file public so anyone can see it on the website
        await drive.permissions.create({
            fileId: fileId,
            resource: {
                role: 'reader',
                type: 'anyone',
            },
        });

        // Generate a direct image link that works in <img> tags
        // The format is: https://lh3.googleusercontent.com/u/0/d/{ID}
        // and https://drive.google.com/thumbnail?id={ID}&sz=w1000
        // But the most reliable for raw usage is the direct export link or thumb link
        const directLink = `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;

        console.log(`✅ File uploaded to Drive: ${fileId}`);
        return directLink;
    } catch (error) {
        console.error('❌ Drive Upload Error:', error.message);
        throw error;
    }
}

module.exports = {
    uploadToDrive,
    getOrCreateFolder
};
