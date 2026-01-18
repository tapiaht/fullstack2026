/**
 * Generic Storage Service Interface
 * Abstraction for different storage providers (Cloudinary, S3, Local, etc.)
 */

export interface UploadResult {
    url: string;
    publicId?: string;
    metadata?: Record<string, any>;
}

export interface StorageService {
    /**
     * Upload a file to the storage provider
     * @param file - File to upload (as Buffer or base64 string)
     * @param options - Additional upload options
     * @returns Upload result with URL and metadata
     */
    upload(file: Buffer | string, options?: {
        folder?: string;
        filename?: string;
        format?: string;
    }): Promise<UploadResult>;

    /**
     * Delete a file from the storage provider
     * @param identifier - URL or public ID of the file
     */
    delete(identifier: string): Promise<void>;

    /**
     * Update an existing file (delete old, upload new)
     * @param oldIdentifier - URL or public ID of the old file
     * @param newFile - New file to upload
     * @param options - Upload options
     */
    update(
        oldIdentifier: string,
        newFile: Buffer | string,
        options?: {
            folder?: string;
            filename?: string;
            format?: string;
        }
    ): Promise<UploadResult>;

    /**
     * Check if the storage service is configured and ready
     */
    isConfigured(): boolean;
}
