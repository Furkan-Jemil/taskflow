import apiClient from '@/api/client'
import { Board } from '@/types/entities'
import { ApiResponse } from '@/types'

export const boardService = {
    /**
     * Get all boards for a workspace
     */
    async getByWorkspace(workspaceId: string): Promise<Board[]> {
        const response = await apiClient.get<ApiResponse<Board[]>>(`/workspaces/${workspaceId}/boards`)
        return response.data.data
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
