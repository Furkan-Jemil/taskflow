import apiClient from '@/api/client'
import { Workspace } from '@/types/entities'
import { ApiResponse } from '@/types'

export const workspaceService = {
    /**
     * Get all workspaces for the current user
     */
    async getAll(): Promise<Workspace[]> {
        const response = await apiClient.get<ApiResponse<Workspace[]>>('/workspaces')
        return response.data.data
    },

    /**
     * Get single workspace by ID
     */
    async getById(id: string): Promise<Workspace> {
        const response = await apiClient.get<ApiResponse<Workspace>>(`/workspaces/${id}`)
        return response.data.data
    },

    /**
     * Create a new workspace
     */
    async create(name: string): Promise<Workspace> {
        const response = await apiClient.post<ApiResponse<Workspace>>('/workspaces', { name })
        return response.data.data
    },

    /**
     * Update workspace
     */
    async update(id: string, data: Partial<Workspace>): Promise<Workspace> {
        const response = await apiClient.patch<ApiResponse<Workspace>>(`/workspaces/${id}`, data)
        return response.data.data
    },

    /**
     * Delete workspace
     */
    async delete(id: string): Promise<void> {
        await apiClient.delete(`/workspaces/${id}`)
    },
}
