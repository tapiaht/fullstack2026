/**
 * Features Configuration
 * Enable or disable application features
 */

export interface FeaturesConfig {
    // Core features
    auth: {
        enabled: boolean;
        providers: ('email' | 'google' | 'github')[];
        requireEmailVerification?: boolean;
    };

    // Storage features
    storage: {
        enabled: boolean;
        provider: 'cloudinary' | 'uploadthing' | 's3' | 'local' | 'placeholder';
        maxFileSize?: number; // in bytes
        allowedFormats?: string[];
    };

    // CRUD features
    crud: {
        create: boolean;
        read: boolean;
        update: boolean;
        delete: boolean;
        pagination?: boolean;
        search?: boolean;
        filters?: boolean;
    };

    // UI features
    ui: {
        darkMode?: boolean;
        responsive?: boolean;
        animations?: boolean;
    };

    // Optional features
    comments?: boolean;
    ratings?: boolean;
    favorites?: boolean;
    sharing?: boolean;
    analytics?: boolean;
    notifications?: boolean;
    multiLanguage?: boolean;
}

/**
 * Current Features Configuration
 * Modify this to enable/disable features for your application
 */
export const featuresConfig: FeaturesConfig = {
    auth: {
        enabled: true,
        providers: ['email'],
        requireEmailVerification: false,
    },

    storage: {
        enabled: true,
        provider: 'cloudinary',
        maxFileSize: 5000000, // 5MB
        allowedFormats: ['image/jpeg', 'image/png', 'image/webp'],
    },

    crud: {
        create: true,
        read: true,
        update: true,
        delete: true,
        pagination: false,
        search: false,
        filters: false,
    },

    ui: {
        darkMode: true,
        responsive: true,
        animations: true,
    },

    comments: false,
    ratings: false,
    favorites: false,
    sharing: false,
    analytics: false,
    notifications: false,
    multiLanguage: false,
};
