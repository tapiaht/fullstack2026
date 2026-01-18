/**
 * Placeholder Storage Service
 * Fallback service that generates placeholder images when no storage provider is configured
 */

import { StorageService, UploadResult } from './storage.interface';

export class PlaceholderStorageService implements StorageService {
    isConfigured(): boolean {
        return true; // Always available as fallback
    }

    async upload(
        file: Buffer | string,
        options?: {
            folder?: string;
            filename?: string;
            format?: string;
        }
    ): Promise<UploadResult> {
        // Generate a placeholder URL
        const width = 600;
        const height = 400;
        const text = options?.filename || 'Image';
        const url = `https://placehold.co/${width}x${height}/png?text=${encodeURIComponent(text)}`;

        return {
            url,
            metadata: {
                isPlaceholder: true,
                width,
                height,
            },
        };
    }

    async delete(identifier: string): Promise<void> {
        // No-op for placeholder service
        console.log('Placeholder service: delete called for', identifier);
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
        // Just generate a new placeholder
        return this.upload(newFile, options);
    }
}
