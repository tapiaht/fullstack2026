'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { domainConfig } from '@/config/domain.config';
import { StorageServiceFactory } from '@/core/storage';
import { featuresConfig } from '@/config/features.config';

// Helper to get the model name in the format Prisma expects (usually camelCase or PascalCase depending on schema)
// In our generator we allow mapping, but usually it matches the model name directly or lowercase
function getPrismaModel() {
    // We assume the model name in Prisma matches the entity name (e.g. 'Pokemon')
    // or we need to access it dynamically.
    // Prisma Client instance keys are usually camelCase (e.g. 'pokemon', 'user')
    // But if we defined `model Pokemon`, usage is `prisma.pokemon`.
    // If we defined `model Product`, usage is `prisma.product`.
    const modelName = domainConfig.entity.name.toLowerCase();
    return (prisma as any)[modelName];
}

export async function createEntity(prevState: any, formData: FormData) {
    const config = domainConfig.entity;
    const data: Record<string, any> = {};
    const errors: Record<string, string[]> = {};

    // 1. Extract and Validate Data
    for (const field of config.fields) {
        // Skip system fields
        if (['id', 'createdAt', 'updatedAt'].includes(field.name)) continue;

        const value = formData.get(field.name);

        if (field.type === 'image') {
            // Handle image separately later
            continue;
        }

        if (field.required && !value) {
            // Allow 0 as a valid value if it's a number field
            if (field.type === 'number' && value === '0') {
                // valid
            } else {
                errors[field.name] = [`${field.name} is required`];
            }
        }

        if (value) {
            if (field.type === 'number') {
                data[field.name] = Number(value);
            } else if (field.type === 'boolean') {
                data[field.name] = value === 'true' || value === 'on';
            } else {
                data[field.name] = value;
            }

            // Simple validation from config
            if (field.validation?.min && String(value).length < field.validation.min) {
                errors[field.name] = [`${field.name} must be at least ${field.validation.min} characters`];
            }
        }
    }

    if (Object.keys(errors).length > 0) {
        return { errors };
    }

    // 2. Handle Image Upload
    if (config.imageField && featuresConfig.storage.enabled) {
        const imageFile = formData.get(config.imageField) as File | null;

        if (imageFile && imageFile.size > 0) {
            try {
                const storage = StorageServiceFactory.getStorageService();

                // Basic validation
                if (featuresConfig.storage.maxFileSize && imageFile.size > featuresConfig.storage.maxFileSize) {
                    return { errors: { [config.imageField]: [`Max file size is ${featuresConfig.storage.maxFileSize / 1000000}MB`] } };
                }

                const buffer = Buffer.from(await imageFile.arrayBuffer());
                const uploadResult = await storage.upload(buffer, {
                    folder: `${config.tableName || config.name.toLowerCase()}-images`,
                    filename: data[config.displayField || 'name'] || 'entity',
                });

                data[config.imageField] = uploadResult.url;

            } catch (error) {
                console.error('Upload failed:', error);
                // Fallback or error?
                // For now, let's use a placeholder if upload fails
                if (!data[config.imageField]) {
                    data[config.imageField] = `https://placehold.co/600x400?text=${encodeURIComponent(data[config.displayField || 'name'] || 'Image')}`;
                }
            }
        } else {
            // No image uploaded, use placeholder if required or allowed
            data[config.imageField] = `https://placehold.co/600x400?text=${encodeURIComponent(data[config.displayField || 'name'] || 'Image')}`;
        }
    }

    // 3. Save to Database
    try {
        const model = getPrismaModel();
        if (!model) throw new Error(`Model ${domainConfig.entity.name} not found in Prisma Client`);

        await model.create({ data });

        revalidatePath('/');
        revalidatePath('/dashboard');
        return { success: true };
    } catch (error) {
        console.error('Create Entity Error:', error);
        return { errors: { _form: ['Failed to create entity.'] } };
    }
}

export async function updateEntity(id: string, prevState: any, formData: FormData) {
    const config = domainConfig.entity;
    const data: Record<string, any> = {};
    const errors: Record<string, string[]> = {};

    // 1. Extract and Validate Data
    for (const field of config.fields) {
        if (['id', 'createdAt', 'updatedAt'].includes(field.name)) continue;

        const value = formData.get(field.name);

        if (field.type === 'image') continue;

        if (field.required && !value) {
            // Allow 0 as a valid value if it's a number field
            if (field.type === 'number' && value === '0') {
                // valid
            } else {
                errors[field.name] = [`${field.name} is required`];
            }
        }

        if (value) {
            if (field.type === 'number') {
                data[field.name] = Number(value);
            } else {
                data[field.name] = value;
            }
        }
    }

    if (Object.keys(errors).length > 0) {
        return { errors };
    }

    // 2. Handle Image Update
    if (config.imageField && featuresConfig.storage.enabled) {
        const imageFile = formData.get(config.imageField) as File | null;

        if (imageFile && imageFile.size > 0) {
            try {
                const model = getPrismaModel();
                const existing = await model.findUnique({ where: { id } });

                const storage = StorageServiceFactory.getStorageService();
                const buffer = Buffer.from(await imageFile.arrayBuffer());

                // Update (upload new, delete old)
                const uploadResult = await storage.update(
                    existing[config.imageField],
                    buffer,
                    {
                        folder: `${config.tableName || config.name.toLowerCase()}-images`,
                        filename: data[config.displayField || 'name'] || 'entity',
                    }
                );

                data[config.imageField] = uploadResult.url;

            } catch (error) {
                console.error('Image update failed:', error);
                // Continue without updating image
            }
        }
    }

    // 3. Update Database
    try {
        const model = getPrismaModel();
        await model.update({
            where: { id },
            data,
        });

        revalidatePath('/');
        revalidatePath('/dashboard');
        return { success: true };
    } catch (error) {
        console.error('Update Entity Error:', error);
        return { errors: { _form: ['Failed to update entity.'] } };
    }
}

export async function deleteEntity(id: string) {
    const config = domainConfig.entity;
    try {
        const model = getPrismaModel();
        const existing = await model.findUnique({ where: { id } });

        if (!existing) return { error: 'Entity not found' };

        // Delete image if exists
        if (config.imageField && existing[config.imageField]) {
            try {
                const storage = StorageServiceFactory.getStorageService();
                await storage.delete(existing[config.imageField]);
            } catch (e) {
                console.warn('Failed to delete image:', e);
            }
        }

        await model.delete({ where: { id } });

        revalidatePath('/');
        revalidatePath('/dashboard');
        return { success: true };
    } catch (error) {
        console.error('Delete Entity Error:', error);
        return { error: 'Failed to delete entity' };
    }
}
