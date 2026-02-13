import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { listService } from '../services/listService'
import { List } from '@/types/entities'
import { useToast } from '@/hooks/useToast'

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
    const { toast } = useToast()

    return useMutation({
        mutationFn: (title: string) => listService.create(boardId, title),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: LIST_KEYS.all(boardId) })
            toast({ message: 'List created successfully', type: 'success' })
        },
        onError: (error: any) => {
            toast({ message: error.message || 'Failed to create list', type: 'error' })
        }
    })
}
export function useUpdateList(boardId: string) {
    const queryClient = useQueryClient()
    const { toast } = useToast()

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<List> }) => listService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: LIST_KEYS.all(boardId) })
        },
        onError: (error: any) => {
            toast({ message: error.message || 'Failed to update list', type: 'error' })
        }
    })
}

export function useDeleteList(boardId: string) {
    const queryClient = useQueryClient()
    const { toast } = useToast()

    return useMutation({
        mutationFn: (id: string) => listService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: LIST_KEYS.all(boardId) })
            toast({ message: 'List deleted', type: 'success' })
        },
        onError: (error: any) => {
            toast({ message: error.message || 'Failed to delete list', type: 'error' })
        }
    })
}
