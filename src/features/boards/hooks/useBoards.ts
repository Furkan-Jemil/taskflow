import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { boardService } from '../services/boardService'

export const BOARD_KEYS = {
    all: (workspaceId: string) => ['boards', workspaceId] as const,
    detail: (id: string) => ['board', id] as const,
}

/**
 * Hook to fetch all boards for a workspace
 */
export function useBoards(workspaceId: string) {
    return useQuery({
        queryKey: BOARD_KEYS.all(workspaceId),
        queryFn: () => boardService.getByWorkspace(workspaceId),
        enabled: !!workspaceId,
    })
}

/**
 * Hook to fetch a single board
 */
export function useBoard(id: string) {
    return useQuery({
        queryKey: BOARD_KEYS.detail(id),
        queryFn: () => boardService.getById(id),
        enabled: !!id,
    })
}

/**
 * Hook to create a board
 */
export function useCreateBoard(workspaceId: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (name: string) => boardService.create(workspaceId, name),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: BOARD_KEYS.all(workspaceId) })
        },
    })
}
