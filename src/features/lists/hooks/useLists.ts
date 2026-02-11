import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { listService } from '../services/listService'
import { List } from '@/types/entities'

export const LIST_KEYS = {
    all: (boardId: string) => ['lists', boardId] as const,
}

export function useLists(boardId: string) {
    return useQuery({
        queryKey: LIST_KEYS.all(boardId),
        queryFn: () => listService.getByBoard(boardId),
        enabled: !!boardId,
    })
}

export function useCreateList(boardId: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (title: string) => listService.create(boardId, title),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: LIST_KEYS.all(boardId) })
        },
    })
}
export function useUpdateList(boardId: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<List> }) => listService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: LIST_KEYS.all(boardId) })
        },
    })
}

export function useDeleteList(boardId: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => listService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: LIST_KEYS.all(boardId) })
        },
    })
}
