import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { boardService } from '../services/boardService'
import { Board } from '@/types/entities'

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
        throwOnError: true,
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
export function useUpdateBoard(workspaceId: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Board> }) => boardService.update(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: BOARD_KEYS.all(workspaceId) })
            queryClient.invalidateQueries({ queryKey: BOARD_KEYS.detail(id) })
        },
    })
}

export function useDeleteBoard(workspaceId: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: boardService.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: BOARD_KEYS.all(workspaceId) })
        },
    })
}
