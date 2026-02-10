import { List } from '@/types/entities'
import { sleep } from '@/lib/utils'

/**
 * Mock data for lists
 */
const MOCK_LISTS: List[] = [
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
        await sleep(800)
        return MOCK_LISTS.filter(l => l.board_id === boardId).sort((a, b) => a.position - b.position)
    },

    /**
     * Create a new list
     */
    async create(boardId: string, title: string): Promise<List> {
        await sleep(1000)
        const newList: List = {
            id: `list-${Math.random().toString(36).substr(2, 9)}`,
            board_id: boardId,
            title,
            position: MOCK_LISTS.length + 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        }
        return newList
    },

    /**
     * Update list
     */
    async update(id: string, data: Partial<List>): Promise<List> {
        await sleep(500)
        const list = MOCK_LISTS.find(l => l.id === id) || MOCK_LISTS[0]
        return { ...list, ...data, id, updated_at: new Date().toISOString() }
    },

    /**
     * Delete list
     */
    async delete(id: string): Promise<void> {
        await sleep(800)
        console.log('Deleted list', id)
    },
}
