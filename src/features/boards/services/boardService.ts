import apiClient from '@/api/client'
import { Board } from '@/types/entities'
import { ApiResponse } from '@/types'

const MOCK_BOARDS: Board[] = [
    {
        id: 'board-1',
        name: 'Sprint Backlog',
        workspace_id: 'ws-1',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
    {
        id: 'board-2',
        name: 'Project Roadmap',
        workspace_id: 'ws-1',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
]

export const boardService = {
    /**
     * Get all boards for a workspace
     */
    async getByWorkspace(workspaceId: string): Promise<Board[]> {
        try {
            const response = await apiClient.get<ApiResponse<Board[]>>(`/workspaces/${workspaceId}/boards`)
            return response.data.data
        } catch (error: any) {
            if (!error.response || error.code === 'ECONNABORTED') {
                console.warn('Backend unreachable, using mock boards.')
                return MOCK_BOARDS.filter(b => b.workspace_id === workspaceId)
            }
            throw error
        }
    },

    /**
     * Get single board by ID
     */
    async getById(id: string): Promise<Board> {
        const response = await apiClient.get<ApiResponse<Board>>(`/boards/${id}`)
        return response.data.data
    },

    /**
     * Create a new board
     */
    async create(workspaceId: string, name: string): Promise<Board> {
        const response = await apiClient.post<ApiResponse<Board>>(`/workspaces/${workspaceId}/boards`, { name })
        return response.data.data
    },

    /**
     * Update board
     */
    async update(id: string, data: Partial<Board>): Promise<Board> {
        const response = await apiClient.patch<ApiResponse<Board>>(`/boards/${id}`, data)
        return response.data.data
    },

    /**
     * Delete board
     */
    async delete(id: string): Promise<void> {
        await apiClient.delete(`/boards/${id}`)
    },
}
