import { v2 as cloudinary } from 'cloudinary';

// Cloudinary configuration
const cloudinaryUrl = process.env.CLOUDINARY_URL;

if (!cloudinaryUrl) {
    console.warn('⚠️  CLOUDINARY_URL not found in environment variables');
} else {
    // Parse the CLOUDINARY_URL format: cloudinary://api_key:api_secret@cloud_name
    try {
        const url = new URL(cloudinaryUrl);
        cloudinary.config({
            cloud_name: url.hostname,
            api_key: url.username,
            api_secret: url.password,
        });
        console.log('✅ Cloudinary configured successfully');
    } catch (error) {
        console.error('❌ Error parsing CLOUDINARY_URL:', error);
    }
}

export default cloudinary;
