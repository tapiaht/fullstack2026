/**
 * Generic CRUD Service Interface
 * Provides type-safe CRUD operations for any entity
 */

export interface CRUDService<T, CreateInput = Partial<T>, UpdateInput = Partial<T>> {
    /**
     * Create a new entity
     * @param data - Entity data
     * @returns Created entity
     */
    create(data: CreateInput): Promise<T>;

    /**
     * Find an entity by ID
     * @param id - Entity ID
     * @returns Entity or null if not found
     */
    findById(id: string): Promise<T | null>;

    /**
     * Find all entities with optional filtering
     * @param filters - Optional filter criteria
     * @returns Array of entities
     */
    findAll(filters?: Record<string, any>): Promise<T[]>;

    /**
     * Update an entity by ID
     * @param id - Entity ID
     * @param data - Updated data
     * @returns Updated entity
     */
    update(id: string, data: UpdateInput): Promise<T>;

    /**
     * Delete an entity by ID
     * @param id - Entity ID
     * @returns Deleted entity
     */
    delete(id: string): Promise<T>;

    /**
     * Count entities with optional filtering
     * @param filters - Optional filter criteria
     * @returns Count of entities
     */
    count(filters?: Record<string, any>): Promise<number>;
}

/**
 * Pagination options
 */
export interface PaginationOptions {
    page?: number;
    pageSize?: number;
    orderBy?: Record<string, 'asc' | 'desc'>;
}

/**
 * Paginated result
 */
export interface PaginatedResult<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}
