import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { workspaceService } from '../services/workspaceService'
import { Workspace } from '@/types/entities'

export const WORKSPACE_KEYS = {
    all: ['workspaces'] as const,
    detail: (id: string) => ['workspaces', id] as const,
}

/**
 * Hook to fetch all workspaces
 */
export function useWorkspaces() {
    return useQuery({
        queryKey: WORKSPACE_KEYS.all,
        queryFn: workspaceService.getAll,
    })
}

/**
 * Hook to fetch a single workspace
 */
export function useWorkspace(id: string) {
    return useQuery({
        queryKey: WORKSPACE_KEYS.detail(id),
        queryFn: () => workspaceService.getById(id),
        enabled: !!id,
    })
}

/**
 * Hook to create a workspace
 */
export function useCreateWorkspace() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: workspaceService.create,
        onSuccess: () => {
            // Invalidate the workspaces list to trigger a refetch
            queryClient.invalidateQueries({ queryKey: WORKSPACE_KEYS.all })
        },
    })
}
export function useUpdateWorkspace() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Workspace> }) => workspaceService.update(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: WORKSPACE_KEYS.all })
            queryClient.invalidateQueries({ queryKey: WORKSPACE_KEYS.detail(id) })
        },
    })
}

export function useDeleteWorkspace() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: workspaceService.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: WORKSPACE_KEYS.all })
        },
    })
}
