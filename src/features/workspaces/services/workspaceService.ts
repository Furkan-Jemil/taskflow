import apiClient from '@/api/client'
import { Workspace } from '@/types/entities'
import { ApiResponse } from '@/types'

let MOCK_WORKSPACES: Workspace[] = [
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
        try {
            const response = await apiClient.get<ApiResponse<Workspace>>(`/workspaces/${id}`)
            return response.data.data
        } catch (error: any) {
            if (!error.response || error.code === 'ECONNABORTED') {
                console.warn('Backend unreachable, using mock workspace details.')
                return MOCK_WORKSPACES.find(w => w.id === id) || MOCK_WORKSPACES[0]
            }
            throw error
        }
    },

    /**
     * Create a new workspace
     */
    async create(name: string): Promise<Workspace> {
        try {
            const response = await apiClient.post<ApiResponse<Workspace>>('/workspaces', { name })
            return response.data.data
        } catch (error: any) {
            if (!error.response || error.code === 'ECONNABORTED') {
                console.warn('Backend unreachable, creating mock workspace.')
                const newWorkspace: Workspace = {
                    id: `ws-${Math.random().toString(36).substring(2, 9)}`,
                    name,
                    owner_id: '1',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                }
                MOCK_WORKSPACES.push(newWorkspace)
                return newWorkspace
            }
            throw error
        }
    },

    /**
     * Update workspace
     */
    async update(id: string, data: Partial<Workspace>): Promise<Workspace> {
        try {
            const response = await apiClient.patch<ApiResponse<Workspace>>(`/workspaces/${id}`, data)
            return response.data.data
        } catch (error: any) {
            if (!error.response || error.code === 'ECONNABORTED') {
                console.warn('Backend unreachable, updating mock workspace.')
                const index = MOCK_WORKSPACES.findIndex(w => w.id === id)
                if (index !== -1) {
                    MOCK_WORKSPACES[index] = { ...MOCK_WORKSPACES[index], ...data }
                    return MOCK_WORKSPACES[index]
                }
                return { id, ...data } as Workspace
            }
            throw error
        }
    },

    /**
     * Delete workspace
     */
    async delete(id: string): Promise<void> {
        try {
            await apiClient.delete(`/workspaces/${id}`)
        } catch (error: any) {
            if (!error.response || error.code === 'ECONNABORTED') {
                console.warn('Backend unreachable, deleting mock workspace locally.')
                MOCK_WORKSPACES = MOCK_WORKSPACES.filter(w => w.id !== id)
                return
            }
            throw error
        }
    },
}
