import apiClient from '@/api/client'
import { List } from '@/types/entities'
import { ApiResponse } from '@/types'

export const listService = {
    /**
     * Get all lists for a board
     */
    async getByBoard(boardId: string): Promise<List[]> {
        const response = await apiClient.get<ApiResponse<List[]>>(`/boards/${boardId}/lists`)
        return response.data.data
    },

    /**
     * Create a new list
     */
    async create(boardId: string, title: string): Promise<List> {
        const response = await apiClient.post<ApiResponse<List>>(`/boards/${boardId}/lists`, { title })
        return response.data.data
    },

    /**
     * Update list
     */
    async update(id: string, data: Partial<List>): Promise<List> {
        const response = await apiClient.patch<ApiResponse<List>>(`/lists/${id}`, data)
        return response.data.data
    },

    /**
     * Delete list
     */
    async delete(id: string): Promise<void> {
        await apiClient.delete(`/lists/${id}`)
    },
}
