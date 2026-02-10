import { Workspace } from '@/types/entities'
import { sleep } from '@/lib/utils'

/**
 * Mock data for workspaces
 */
const MOCK_WORKSPACES: Workspace[] = [
    {
        id: 'ws-1',
        name: 'Personal Projects',
        owner_id: '1',
        created_at: new Date().toISOString(),
    },
    {
        id: 'ws-2',
        name: 'Work Team',
        owner_id: '1',
        created_at: new Date().toISOString(),
    },
]

export const workspaceService = {
    /**
     * Get all workspaces for current user
     */
    async getAll(): Promise<Workspace[]> {
        await sleep(800)
        // In real app:
        // const response = await apiClient.get<ApiResponse<Workspace[]>>('/workspaces')
        // return response.data.data
        return MOCK_WORKSPACES
    },

    /**
     * Get single workspace by ID
     */
    async getById(id: string): Promise<Workspace> {
        await sleep(500)
        const ws = MOCK_WORKSPACES.find(w => w.id === id)
        if (!ws) throw new Error('Workspace not found')
        return ws
    },

    /**
     * Create a new workspace
     */
    async create(name: string): Promise<Workspace> {
        await sleep(1000)
        const newWs: Workspace = {
            id: `ws-${Math.random().toString(36).substr(2, 9)}`,
            name,
            owner_id: '1',
            created_at: new Date().toISOString(),
        }
        return newWs
    },

    /**
     * Update workspace
     */
    async update(id: string, data: Partial<Workspace>): Promise<Workspace> {
        await sleep(800)
        return { ...MOCK_WORKSPACES[0], ...data, id }
    },

    /**
     * Delete workspace
     */
    async delete(id: string): Promise<void> {
        await sleep(800)
        console.log('Deleted workspace', id)
    },
}
