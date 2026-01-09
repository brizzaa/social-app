import cloudinary from '../config/cloudinary';

/**
 * Delete a media file from Cloudinary
 * @param url - The Cloudinary URL of the media to delete
 * @returns Promise<void>
 */
export const deleteCloudinaryMedia = async (url: string): Promise<void> => {
    try {
        // Extract public_id from Cloudinary URL
        // URL format: https://res.cloudinary.com/{cloud_name}/{resource_type}/upload/v{version}/{public_id}.{format}
        const urlParts = url.split('/');
        const fileWithExtension = urlParts[urlParts.length - 1];
        const publicId = fileWithExtension.split('.')[0];
        const folder = 'social-app';
        const fullPublicId = `${folder}/${publicId}`;

        // Determine resource type from URL
        const resourceType = url.includes('/video/') ? 'video' : 'image';

        await cloudinary.uploader.destroy(fullPublicId, {
            resource_type: resourceType,
        });

        console.log(`Deleted ${resourceType} from Cloudinary: ${fullPublicId}`);
    } catch (error) {
        console.error('Error deleting media from Cloudinary:', error);
        // Don't throw error to prevent deletion failure from blocking post deletion
    }
};

/**
 * Generate a thumbnail URL for a video
 * @param videoUrl - The Cloudinary video URL
 * @returns string - The thumbnail URL
 */
export const getVideoThumbnail = (videoUrl: string): string => {
    // Replace /video/upload/ with /video/upload/so_0/ to get first frame
    return videoUrl.replace('/video/upload/', '/video/upload/so_0,f_jpg/');
};

/**
 * Get optimized image URL with transformations
 * @param imageUrl - The original Cloudinary image URL
 * @param width - Desired width
 * @param height - Desired height (optional)
 * @returns string - The transformed URL
 */
export const getOptimizedImageUrl = (
    imageUrl: string,
    width: number,
    height?: number
): string => {
    const transformation = height
        ? `w_${width},h_${height},c_fill,f_auto,q_auto`
        : `w_${width},c_limit,f_auto,q_auto`;

    return imageUrl.replace('/upload/', `/upload/${transformation}/`);
};
