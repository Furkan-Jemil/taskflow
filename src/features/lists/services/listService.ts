import apiClient from '@/api/client'
import { List } from '@/types/entities'
import { ApiResponse } from '@/types'

let MOCK_LISTS: List[] = [
    {
        id: 'list-1',
        board_id: 'board-1',
        title: 'To Do',
        position: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
    {
        id: 'list-2',
        board_id: 'board-1',
        title: 'In Progress',
        position: 2,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
    {
        id: 'list-3',
        board_id: 'board-1',
        title: 'Done',
        position: 3,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
]

export const listService = {
    /**
     * Get all lists for a board
     */
    async getByBoard(boardId: string): Promise<List[]> {
        try {
            const response = await apiClient.get<ApiResponse<List[]>>(`/boards/${boardId}/lists`)
            return response.data.data
        } catch (error: any) {
            if (!error.response || error.code === 'ECONNABORTED') {
                console.warn('Backend unreachable, using mock lists.')
                return MOCK_LISTS.filter(l => l.board_id === boardId).sort((a, b) => a.position - b.position)
            }
            throw error
        }
    },

    /**
     * Create a new list
     */
    async create(boardId: string, title: string): Promise<List> {
        try {
            const response = await apiClient.post<ApiResponse<List>>(`/boards/${boardId}/lists`, { title })
            return response.data.data
        } catch (error: any) {
            if (!error.response || error.code === 'ECONNABORTED') {
                console.warn('Backend unreachable, creating mock list.')
                const newList: List = {
                    id: `list-${Math.random().toString(36).substring(2, 9)}`,
                    board_id: boardId,
                    title,
                    position: MOCK_LISTS.length + 1,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                }
                MOCK_LISTS.push(newList)
                return newList
            }
            throw error
        }
    },

    /**
     * Update list
     */
    async update(id: string, data: Partial<List>): Promise<List> {
        try {
            const response = await apiClient.patch<ApiResponse<List>>(`/lists/${id}`, data)
            return response.data.data
        } catch (error: any) {
            if (!error.response || error.code === 'ECONNABORTED') {
                console.warn('Backend unreachable, updating mock list.')
                const index = MOCK_LISTS.findIndex(l => l.id === id)
                if (index !== -1) {
                    MOCK_LISTS[index] = { ...MOCK_LISTS[index], ...data }
                    return MOCK_LISTS[index]
                }
                return { id, ...data } as List
            }
            throw error
        }
    },

    /**
     * Delete list
     */
    async delete(id: string): Promise<void> {
        try {
            await apiClient.delete(`/lists/${id}`)
        } catch (error: any) {
            if (!error.response || error.code === 'ECONNABORTED') {
                console.warn('Backend unreachable, deleting mock list locally.')
                MOCK_LISTS = MOCK_LISTS.filter(l => l.id !== id)
                return
            }
            throw error
        }
    },
}
