import { Workspace } from '@/types/entities'
import { mockStorage } from '@/lib/mockStorage'

export const workspaceService = {
    /**
     * Get all workspaces for the current user
     */
    async getAll(): Promise<Workspace[]> {
        await new Promise((resolve) => setTimeout(resolve, 300))
        return mockStorage.getWorkspaces()
    },

    /**
     * Get single workspace by ID
     */
    async getById(id: string): Promise<Workspace> {
        await new Promise((resolve) => setTimeout(resolve, 200))
        const workspaces = mockStorage.getWorkspaces()
        const workspace = workspaces.find((ws) => ws.id === id)
        if (!workspace) throw new Error('Workspace not found')
        return workspace
    },

    /**
     * Create a new workspace
     */
    async create(name: string): Promise<Workspace> {
        await new Promise((resolve) => setTimeout(resolve, 400))

        const token = localStorage.getItem('auth_token')
        const email = atob(token?.replace('mock_token_', '') || '')
        const users = mockStorage.getUsers()
        const user = users.find(u => u.email === email)

        const newWorkspace: Workspace = {
            id: crypto.randomUUID(),
            name,
            owner_id: user?.id || 'guest',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        }

        mockStorage.addWorkspace(newWorkspace)
        return newWorkspace
    },

    /**
     * Update workspace
     */
    async update(id: string, data: Partial<Workspace>): Promise<Workspace> {
        await new Promise((resolve) => setTimeout(resolve, 300))
        return mockStorage.updateWorkspace(id, data)
    },

    /**
     * Delete workspace
     */
    async delete(id: string): Promise<void> {
        await new Promise((resolve) => setTimeout(resolve, 300))
        mockStorage.deleteWorkspace(id)
    },
}
