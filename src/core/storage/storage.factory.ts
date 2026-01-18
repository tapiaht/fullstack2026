/**
 * Storage Service Factory
 * Creates the appropriate storage service based on configuration
 */

import { StorageService } from './storage.interface';
import { CloudinaryStorageService } from './cloudinary.service';
import { PlaceholderStorageService } from './placeholder.service';

export type StorageProvider = 'cloudinary' | 'placeholder';

export class StorageServiceFactory {
    private static instance: StorageService | null = null;

    /**
     * Get the configured storage service instance
     * @param provider - Optional provider override (defaults to auto-detect)
     */
    static getStorageService(provider?: StorageProvider): StorageService {
        // Return cached instance if available
        if (this.instance) {
            return this.instance;
        }

        // Determine provider
        const selectedProvider = provider || this.detectProvider();

        // Create appropriate service
        switch (selectedProvider) {
            case 'cloudinary':
                const cloudinaryService = new CloudinaryStorageService();
                if (cloudinaryService.isConfigured()) {
                    this.instance = cloudinaryService;
                    return this.instance;
                }
                // Fall through to placeholder if not configured
                console.warn('Cloudinary not configured, falling back to placeholder');
            // eslint-disable-next-line no-fallthrough
            case 'placeholder':
            default:
                this.instance = new PlaceholderStorageService();
                return this.instance;
        }
    }

    /**
     * Auto-detect the storage provider based on environment variables
     */
    private static detectProvider(): StorageProvider {
        if (
            process.env.CLOUDINARY_URL ||
            (process.env.CLOUDINARY_CLOUD_NAME &&
                process.env.CLOUDINARY_API_KEY &&
                process.env.CLOUDINARY_API_SECRET)
        ) {
            return 'cloudinary';
        }

        return 'placeholder';
    }

    /**
     * Reset the cached instance (useful for testing)
     */
    static reset(): void {
        this.instance = null;
    }
}
