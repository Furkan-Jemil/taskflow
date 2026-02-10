/**
 * Global type definitions
 * Entity types will be added in Phase 2+
 */

// Generic API response wrapper
export interface ApiResponse<T> {
    data: T
    message?: string
    success: boolean
}

// Pagination
export interface PaginatedResponse<T> {
    data: T[]
    total: number
    page: number
    limit: number
    totalPages: number
}

// Common entity fields
export interface BaseEntity {
    id: string
    created_at: string
}
