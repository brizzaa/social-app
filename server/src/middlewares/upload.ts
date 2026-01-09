import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary';

// Configure Cloudinary storage for multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (_req, file) => {
        // Determine if it's a video or image
        const isVideo = file.mimetype.startsWith('video/');

        return {
            folder: 'social-app', // Folder name in Cloudinary
            resource_type: isVideo ? 'video' : 'image',
            allowed_formats: isVideo
                ? ['mp4', 'mov', 'avi', 'mkv', 'webm']
                : ['jpg', 'jpeg', 'png', 'gif', 'webp'],
            transformation: isVideo
                ? [{ quality: 'auto', fetch_format: 'auto' }]
                : [{ quality: 'auto', fetch_format: 'auto', width: 1200, crop: 'limit' }],
        };
    },
});

const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only images and videos are allowed.'));
    }
};

export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024, // 100MB limit for videos
    },
});
