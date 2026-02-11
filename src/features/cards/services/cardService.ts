import apiClient from '@/api/client'
import { Card } from '@/types/entities'
import { ApiResponse } from '@/types'

const MOCK_CARDS: Card[] = [
    {
        id: 'card-1',
        list_id: 'list-1',
        title: 'Draft landing page design',
        description: 'Create a Figma prototype for the new landing page.',
        priority: 'high',
        position: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
    {
        id: 'card-2',
        list_id: 'list-1',
        title: 'Write technical documentation',
        description: 'Document the API endpoints for the authentication module.',
        priority: 'medium',
        position: 2,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
    {
        id: 'card-3',
        list_id: 'list-2',
        title: 'Fix mobile responsiveness',
        description: 'The sidebar is breaking on small screens.',
        priority: 'high',
        position: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
]

export const cardService = {
    /**
     * Get all cards for a list
     */
    async getByList(listId: string): Promise<Card[]> {
        try {
            const response = await apiClient.get<ApiResponse<Card[]>>(`/lists/${listId}/cards`)
            return response.data.data
        } catch (error: any) {
            if (!error.response || error.code === 'ECONNABORTED') {
                console.warn('Backend unreachable, using mock cards.')
                return MOCK_CARDS.filter(c => c.list_id === listId).sort((a, b) => a.position - b.position)
            }
            throw error
        }
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
