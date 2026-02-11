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
        try {
            const response = await apiClient.get<ApiResponse<Board>>(`/boards/${id}`)
            return response.data.data
        } catch (error: any) {
            if (!error.response || error.code === 'ECONNABORTED') {
                console.warn('Backend unreachable, using mock board details.')
                return MOCK_BOARDS.find(b => b.id === id) || MOCK_BOARDS[0]
            }
            throw error
        }
    },

    /**
     * Create a new board
     */
    async create(workspaceId: string, name: string): Promise<Board> {
        try {
            const response = await apiClient.post<ApiResponse<Board>>(`/workspaces/${workspaceId}/boards`, { name })
            return response.data.data
        } catch (error: any) {
            if (!error.response || error.code === 'ECONNABORTED') {
                console.warn('Backend unreachable, creating mock board.')
                return {
                    id: `board-${Math.random().toString(36).substring(2, 9)}`,
                    name,
                    workspace_id: workspaceId,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                }
            }
            throw error
        }
    },

    /**
     * Update board
     */
    async update(id: string, data: Partial<Board>): Promise<Board> {
        try {
            const response = await apiClient.patch<ApiResponse<Board>>(`/boards/${id}`, data)
            return response.data.data
        } catch (error: any) {
            if (!error.response || error.code === 'ECONNABORTED') {
                console.warn('Backend unreachable, updating mock board.')
                return { id, ...data } as Board
            }
            throw error
        }
    },

    /**
     * Delete board
     */
    async delete(id: string): Promise<void> {
        try {
            await apiClient.delete(`/boards/${id}`)
        } catch (error: any) {
            if (!error.response || error.code === 'ECONNABORTED') {
                console.warn('Backend unreachable, deleting mock board locally.')
                return
            }
            throw error
        }
    },
}
