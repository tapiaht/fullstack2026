/**
 * Storage Configuration
 * Configure storage provider settings
 */

export interface StorageConfig {
    provider: 'cloudinary' | 'uploadthing' | 's3' | 'local' | 'placeholder';

    // Cloudinary settings
    cloudinary?: {
        cloudName?: string;
        apiKey?: string;
        apiSecret?: string;
        cloudinaryUrl?: string;
        folder?: string;
    };

    // Uploadthing settings
    uploadthing?: {
        appId?: string;
        token?: string;
    };

    // AWS S3 settings
    s3?: {
        region?: string;
        bucket?: string;
        accessKeyId?: string;
        secretAccessKey?: string;
    };

    // Local storage settings
    local?: {
        uploadDir?: string;
        publicPath?: string;
    };

    // Placeholder settings
    placeholder?: {
        service?: 'placehold.co' | 'placeholder.com';
        defaultSize?: { width: number; height: number };
    };
}

/**
 * Get storage configuration from environment variables
 */
export function getStorageConfig(): StorageConfig {
    // Auto-detect provider based on environment variables
    let provider: StorageConfig['provider'] = 'placeholder';

    if (
        process.env.CLOUDINARY_URL ||
        (process.env.CLOUDINARY_CLOUD_NAME &&
            process.env.CLOUDINARY_API_KEY &&
            process.env.CLOUDINARY_API_SECRET)
    ) {
        provider = 'cloudinary';
    } else if (process.env.UPLOADTHING_TOKEN) {
        provider = 'uploadthing';
    } else if (
        process.env.AWS_REGION &&
        process.env.AWS_S3_BUCKET &&
        process.env.AWS_ACCESS_KEY_ID &&
        process.env.AWS_SECRET_ACCESS_KEY
    ) {
        provider = 's3';
    } else if (process.env.LOCAL_UPLOAD_DIR) {
        provider = 'local';
    }

    return {
        provider,
        cloudinary: {
            cloudName: process.env.CLOUDINARY_CLOUD_NAME,
            apiKey: process.env.CLOUDINARY_API_KEY,
            apiSecret: process.env.CLOUDINARY_API_SECRET,
            cloudinaryUrl: process.env.CLOUDINARY_URL,
            folder: process.env.CLOUDINARY_FOLDER || 'uploads',
        },
        uploadthing: {
            appId: process.env.UPLOADTHING_APP_ID,
            token: process.env.UPLOADTHING_TOKEN,
        },
        s3: {
            region: process.env.AWS_REGION,
            bucket: process.env.AWS_S3_BUCKET,
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
        local: {
            uploadDir: process.env.LOCAL_UPLOAD_DIR || './uploads',
            publicPath: process.env.LOCAL_PUBLIC_PATH || '/uploads',
        },
        placeholder: {
            service: 'placehold.co',
            defaultSize: { width: 600, height: 400 },
        },
    };
}

/**
 * Current storage configuration
 */
export const storageConfig = getStorageConfig();
