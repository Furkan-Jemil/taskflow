import { Board } from '@/types/entities'
import { mockStorage } from '@/lib/mockStorage'

export const boardService = {
    /**
     * Get all boards for a workspace
     */
    async getByWorkspace(workspaceId: string): Promise<Board[]> {
        await new Promise((resolve) => setTimeout(resolve, 300))
        return mockStorage.getBoards(workspaceId)
    },

    /**
     * Get single board by ID
     */
    async getById(id: string): Promise<Board> {
        await new Promise((resolve) => setTimeout(resolve, 200))
        const boards = mockStorage.get<Board>('taskflow_boards')
        const board = boards.find((b) => b.id === id)
        if (!board) throw new Error('Board not found')
        return board
    },

    /**
     * Create a new board
     */
    async create(workspaceId: string, name: string): Promise<Board> {
        await new Promise((resolve) => setTimeout(resolve, 400))

        const newBoard: Board = {
            id: crypto.randomUUID(),
            name,
            workspace_id: workspaceId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        }

        mockStorage.addBoard(newBoard)
        return newBoard
    },

    /**
     * Update board
     */
    async update(id: string, data: Partial<Board>): Promise<Board> {
        await new Promise((resolve) => setTimeout(resolve, 300))
        const boards = mockStorage.get<Board>('taskflow_boards')
        const index = boards.findIndex((b) => b.id === id)
        if (index === -1) throw new Error('Board not found')
        boards[index] = { ...boards[index], ...data, updated_at: new Date().toISOString() }
        mockStorage.set('taskflow_boards', boards)
        return boards[index]
    },

    /**
     * Delete board
     */
    async delete(id: string): Promise<void> {
        await new Promise((resolve) => setTimeout(resolve, 300))
        const boards = mockStorage.get<Board>('taskflow_boards')
        mockStorage.set('taskflow_boards', boards.filter((b) => b.id !== id))
    },
}
