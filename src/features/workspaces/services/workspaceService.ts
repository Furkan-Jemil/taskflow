import apiClient from '@/api/client'
import { Workspace } from '@/types/entities'
import { ApiResponse } from '@/types'

const MOCK_WORKSPACES: Workspace[] = [
    {
        id: 'ws-1',
        name: 'Personal Projects',
        owner_id: '1',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
    {
        id: 'ws-2',
        name: 'Work Team',
        owner_id: '1',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
]

export const workspaceService = {
    /**
     * Get all workspaces for the current user
     */
    async getAll(): Promise<Workspace[]> {
        try {
            const response = await apiClient.get<ApiResponse<Workspace[]>>('/workspaces')
            return response.data.data
        } catch (error: any) {
            if (!error.response || error.code === 'ECONNABORTED') {
                console.warn('Backend unreachable, using mock workspaces.')
                return MOCK_WORKSPACES
            }
            throw error
        }
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
