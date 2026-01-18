/**
 * Cloudinary Storage Service Implementation
 * Implements the StorageService interface for Cloudinary
 */

import { v2 as cloudinary } from 'cloudinary';
import { StorageService, UploadResult } from './storage.interface';

export class CloudinaryStorageService implements StorageService {
    constructor() {
        // Configure Cloudinary from environment variables
        if (process.env.CLOUDINARY_URL) {
            // CLOUDINARY_URL format: cloudinary://api_key:api_secret@cloud_name
            cloudinary.config({
                cloudinary_url: process.env.CLOUDINARY_URL,
            });
        } else if (
            process.env.CLOUDINARY_CLOUD_NAME &&
            process.env.CLOUDINARY_API_KEY &&
            process.env.CLOUDINARY_API_SECRET
        ) {
            cloudinary.config({
                cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                api_key: process.env.CLOUDINARY_API_KEY,
                api_secret: process.env.CLOUDINARY_API_SECRET,
            });
        }
    }

    isConfigured(): boolean {
        return !!(
            process.env.CLOUDINARY_URL ||
            (process.env.CLOUDINARY_CLOUD_NAME &&
                process.env.CLOUDINARY_API_KEY &&
                process.env.CLOUDINARY_API_SECRET)
        );
    }

    async upload(
        file: Buffer | string,
        options?: {
            folder?: string;
            filename?: string;
            format?: string;
        }
    ): Promise<UploadResult> {
        if (!this.isConfigured()) {
            throw new Error('Cloudinary is not configured');
        }

        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: options?.folder || 'uploads',
                    public_id: options?.filename,
                    format: options?.format,
                },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else if (result) {
                        resolve({
                            url: result.secure_url,
                            publicId: result.public_id,
                            metadata: {
                                width: result.width,
                                height: result.height,
                                format: result.format,
                                resourceType: result.resource_type,
                            },
                        });
                    }
                }
            );

            // Handle Buffer or base64 string
            if (Buffer.isBuffer(file)) {
                uploadStream.end(file);
            } else {
                // Assume base64 string
                const buffer = Buffer.from(file.split(',')[1] || file, 'base64');
                uploadStream.end(buffer);
            }
        });
    }

    async delete(identifier: string): Promise<void> {
        if (!this.isConfigured()) {
            throw new Error('Cloudinary is not configured');
        }

        // Extract public_id from URL or use identifier directly
        let publicId = identifier;

        if (identifier.includes('cloudinary.com')) {
            const urlParts = identifier.split('/');
            const uploadIndex = urlParts.indexOf('upload');
            if (uploadIndex !== -1) {
                const pathAfterUpload = urlParts.slice(uploadIndex + 2).join('/');
                publicId = pathAfterUpload.replace(/\.[^/.]+$/, '');
            }
        }

        await cloudinary.uploader.destroy(publicId);
    }

    async update(
        oldIdentifier: string,
        newFile: Buffer | string,
        options?: {
            folder?: string;
            filename?: string;
            format?: string;
        }
    ): Promise<UploadResult> {
        if (!this.isConfigured()) {
            throw new Error('Cloudinary is not configured');
        }

        // Upload new file first
        const uploadResult = await this.upload(newFile, options);

        // Delete old file (don't fail if deletion fails)
        try {
            await this.delete(oldIdentifier);
        } catch (error) {
            console.warn('Failed to delete old file:', error);
        }

        return uploadResult;
    }
}
