import { List } from '@/types/entities'
import { mockStorage } from '@/lib/mockStorage'

export const listService = {
    /**
     * Get all lists for a board
     */
    async getByBoard(boardId: string): Promise<List[]> {
        await new Promise((resolve) => setTimeout(resolve, 200))
        return mockStorage.getLists(boardId)
    },

    /**
     * Create a new list
     */
    async create(boardId: string, title: string): Promise<List> {
        await new Promise((resolve) => setTimeout(resolve, 300))

        const lists = mockStorage.get<List>('taskflow_lists')
        const position = lists.filter(l => l.board_id === boardId).length

        const newList: List = {
            id: crypto.randomUUID(),
            title,
            board_id: boardId,
            position,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        }

        mockStorage.addList(newList)
        return newList
    },

    /**
     * Update list
     */
    async update(id: string, data: Partial<List>): Promise<List> {
        await new Promise((resolve) => setTimeout(resolve, 200))
        const lists = mockStorage.get<List>('taskflow_lists')
        const index = lists.findIndex((l) => l.id === id)
        if (index === -1) throw new Error('List not found')
        lists[index] = { ...lists[index], ...data, updated_at: new Date().toISOString() }
        mockStorage.set('taskflow_lists', lists)
        return lists[index]
    },

    /**
     * Delete list
     */
    async delete(id: string): Promise<void> {
        await new Promise((resolve) => setTimeout(resolve, 200))
        const lists = mockStorage.get<List>('taskflow_lists')
        mockStorage.set('taskflow_lists', lists.filter((l) => l.id !== id))
    },
}
