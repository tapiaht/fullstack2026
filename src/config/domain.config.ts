/**
 * Domain Configuration
 * Defines the entity structure and business logic for the application
 */

export interface FieldDefinition {
    name: string;
    type: 'string' | 'text' | 'number' | 'boolean' | 'date' | 'image' | 'array' | 'json';
    required?: boolean;
    defaultValue?: any;
    validation?: {
        min?: number;
        max?: number;
        pattern?: string;
        custom?: string; // Custom validation function name
    };
    prismaType?: string; // Override Prisma type if needed
}

export interface EntityConfig {
    name: string; // Singular name (e.g., 'Pokemon', 'Product')
    namePlural: string; // Plural name (e.g., 'Pokemon', 'Products')
    tableName?: string; // Database table name (defaults to lowercase plural)
    fields: FieldDefinition[];
    displayField?: string; // Field to use for display (defaults to 'name')
    imageField?: string; // Field that contains the image URL (defaults to 'imageUrl')
}

export interface DomainConfig {
    entity: EntityConfig;
    app: {
        name: string;
        description: string;
        baseUrl?: string;
    };
}

/**
 * Current Domain Configuration
 * This is the Pokemon Card App configuration
 * Modify this to transform the app into a different domain
 */
export const domainConfig: DomainConfig = {
    entity: {
        name: 'Post',
        namePlural: 'Posts',
        tableName: 'post',
        fields: [
            {
                name: 'id',
                type: 'string',
                required: true,
                prismaType: 'String @id @default(cuid())',
            },
            {
                name: 'title',
                type: 'string',
                required: true,
                validation: {
                    min: 5,
                },
            },
            {
                name: 'slug',
                type: 'string',
                required: true,
                prismaType: 'String @unique',
            },
            {
                name: 'content',
                type: 'text',
                required: true,
                prismaType: 'String', // Text type in Prisma is String too, but could be @db.Text for postgres
            },
            {
                name: 'published',
                type: 'boolean',
                required: false,
                defaultValue: false,
                prismaType: 'Boolean @default(false)',
            },
            {
                name: 'coverImage',
                type: 'image',
                required: false,
            },
            {
                name: 'tags',
                type: 'string',
                required: false,
                prismaType: 'String?',
            },
            {
                name: 'createdAt',
                type: 'date',
                required: true,
                defaultValue: 'now()',
                prismaType: 'DateTime @default(now())',
            },
            {
                name: 'updatedAt',
                type: 'date',
                required: true,
                prismaType: 'DateTime @updatedAt',
            },
        ],
        displayField: 'title',
        imageField: 'coverImage',
    },
    app: {
        name: 'DevBlog Engine',
        description: 'A developer blog powered by generic-app',
    },
};
