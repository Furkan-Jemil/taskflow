import apiClient from '@/api/client'
import { Card } from '@/types/entities'
import { ApiResponse } from '@/types'

export const cardService = {
    /**
     * Get cards for a specific list
     */
    async getByList(listId: string): Promise<Card[]> {
        const response = await apiClient.get<ApiResponse<Card[]>>(`/lists/${listId}/cards`)
        return response.data.data
    },

    /**
     * Create a new card
     */
    async create(listId: string, title: string): Promise<Card> {
        const response = await apiClient.post<ApiResponse<Card>>(`/lists/${listId}/cards`, { title })
        return response.data.data
    },

    /**
     * Update card
     */
    async update(id: string, data: Partial<Card>): Promise<Card> {
        const response = await apiClient.patch<ApiResponse<Card>>(`/cards/${id}`, data)
        return response.data.data
    },

    /**
     * Delete card
     */
    async delete(id: string): Promise<void> {
        await apiClient.delete(`/cards/${id}`)
    },
}
