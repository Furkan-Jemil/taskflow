import { Board } from '@/types/entities'
import { sleep } from '@/lib/utils'

/**
 * Mock data for boards
 */
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
        await sleep(800)
        // Simulate workspace filtering
        return MOCK_BOARDS.filter(b => b.workspace_id === workspaceId)
    },

    /**
     * Get single board by ID
     */
    async getById(id: string): Promise<Board> {
        await sleep(500)
        const board = MOCK_BOARDS.find(b => b.id === id)
        if (!board) throw new Error('Board not found')
        return board
    },

    /**
     * Create a new board
     */
    async create(workspaceId: string, name: string): Promise<Board> {
        await sleep(1000)
        const newBoard: Board = {
            id: `board-${Math.random().toString(36).substr(2, 9)}`,
            name,
            workspace_id: workspaceId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        }
        return newBoard
    },

    /**
     * Update board
     */
    async update(id: string, data: Partial<Board>): Promise<Board> {
        await sleep(800)
        return { ...MOCK_BOARDS[0], ...data, id, updated_at: new Date().toISOString() }
    },

    /**
     * Delete board
     */
    async delete(id: string): Promise<void> {
        await sleep(800)
        console.log('Deleted board', id)
    },
}
