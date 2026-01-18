/**
 * Prisma CRUD Service Implementation
 * Generic CRUD operations using Prisma client
 */

import { PrismaClient } from '@prisma/client';
import { CRUDService, PaginatedResult, PaginationOptions } from './crud.interface';

type PrismaModel = keyof Omit<
    PrismaClient,
    | '$connect'
    | '$disconnect'
    | '$on'
    | '$transaction'
    | '$use'
    | '$extends'
    | symbol
>;

export class PrismaCRUDService<T, CreateInput = Partial<T>, UpdateInput = Partial<T>>
    implements CRUDService<T, CreateInput, UpdateInput> {
    constructor(
        private prisma: PrismaClient,
        private modelName: PrismaModel
    ) { }

    private get model() {
        return this.prisma[this.modelName] as any;
    }

    async create(data: CreateInput): Promise<T> {
        return this.model.create({ data });
    }

    async findById(id: string): Promise<T | null> {
        return this.model.findUnique({ where: { id } });
    }

    async findAll(filters?: Record<string, any>): Promise<T[]> {
        return this.model.findMany({
            where: filters,
        });
    }

    async update(id: string, data: UpdateInput): Promise<T> {
        return this.model.update({
            where: { id },
            data,
        });
    }

    async delete(id: string): Promise<T> {
        return this.model.delete({
            where: { id },
        });
    }

    async count(filters?: Record<string, any>): Promise<number> {
        return this.model.count({
            where: filters,
        });
    }

    /**
     * Find entities with pagination
     * @param options - Pagination options
     * @param filters - Optional filter criteria
     * @returns Paginated result
     */
    async findPaginated(
        options: PaginationOptions = {},
        filters?: Record<string, any>
    ): Promise<PaginatedResult<T>> {
        const page = options.page || 1;
        const pageSize = options.pageSize || 10;
        const skip = (page - 1) * pageSize;

        const [data, total] = await Promise.all([
            this.model.findMany({
                where: filters,
                skip,
                take: pageSize,
                orderBy: options.orderBy,
            }),
            this.model.count({ where: filters }),
        ]);

        return {
            data,
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize),
        };
    }

    /**
     * Find one entity by filter
     * @param filters - Filter criteria
     * @returns Entity or null
     */
    async findOne(filters: Record<string, any>): Promise<T | null> {
        return this.model.findFirst({ where: filters });
    }

    /**
     * Check if an entity exists
     * @param id - Entity ID
     * @returns True if exists
     */
    async exists(id: string): Promise<boolean> {
        const count = await this.model.count({ where: { id } });
        return count > 0;
    }
}
