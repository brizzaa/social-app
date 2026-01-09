# Cloudinary Integration Guide

## 📝 Overview
This application uses Cloudinary for storing and managing media files (images and videos).

## 🔧 Configuration

### 1. Get Cloudinary Credentials
1. Go to [Cloudinary](https://cloudinary.com/) and create an account (or login)
2. From your dashboard, you'll find:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

### 2. Configure Environment Variables

Add the following to your `.env` file in the `server` directory:

```env
CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME
```

**Example:**
```env
CLOUDINARY_URL=cloudinary://421533818525555:74LQ8GAhOC7je_uouJYks_1XsSQ@myapp-cloud
```

Replace:
- `API_KEY` with your Cloudinary API Key
- `API_SECRET` with your Cloudinary API Secret
- `CLOUD_NAME` with your Cloudinary Cloud Name

## ✨ Features

### Automatic Upload
- Images and videos are automatically uploaded to Cloudinary when creating a post
- Files are stored in the `social-app` folder in your Cloudinary account

### Automatic Optimization
- **Images**: Automatically resized to max 1200px width, optimized quality and format
- **Videos**: Automatically optimized for web delivery

### Automatic Deletion
- When you delete a post, the associated media is automatically deleted from Cloudinary

### File Size Limits
- Maximum upload size: **100MB** (suitable for videos)

### Supported Formats

**Images:**
- JPG/JPEG
- PNG
- GIF
- WebP

**Videos:**
- MP4
- MOV
- AVI
- MKV
- WebM

## 🛠️ Helper Functions

The application includes helper functions in `src/services/cloudinaryService.ts`:

### `deleteCloudinaryMedia(url: string)`
Deletes a media file from Cloudinary

### `getVideoThumbnail(videoUrl: string)`
Generates a thumbnail URL for a video (first frame)

### `getOptimizedImageUrl(imageUrl: string, width: number, height?: number)`
Gets an optimized version of an image with custom dimensions

## 🔍 Troubleshooting

### "CLOUDINARY_URL not found"
Make sure you have added the `CLOUDINARY_URL` to your `.env` file

### "Error parsing CLOUDINARY_URL"
Check that your URL follows the correct format:
```
cloudinary://API_KEY:API_SECRET@CLOUD_NAME
```

### Upload fails
1. Check your Cloudinary credentials are correct
2. Verify your Cloudinary account is active
3. Check file size is under 100MB
4. Ensure file format is supported

## 📚 Additional Resources

- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Node.js SDK](https://cloudinary.com/documentation/node_integration)
- [Image Transformations](https://cloudinary.com/documentation/image_transformations)
- [Video Transformations](https://cloudinary.com/documentation/video_manipulation_and_delivery)
