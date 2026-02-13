import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { cardService } from '../services/cardService'
import { useToast } from '@/hooks/useToast'

export const CARD_KEYS = {
    all: (listId: string) => ['cards', listId] as const,
}

export function useCards(listId: string) {
    return useQuery({
        queryKey: CARD_KEYS.all(listId),
        queryFn: () => cardService.getByList(listId),
        enabled: !!listId,
    })
}

export function useCreateCard(listId: string) {
    const queryClient = useQueryClient()
    const { toast } = useToast()

    return useMutation({
        mutationFn: (title: string) => cardService.create(listId, title),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CARD_KEYS.all(listId) })
            toast({ message: 'Card created', type: 'success' })
        },
        onError: (error: any) => {
            toast({ message: error.message || 'Failed to create card', type: 'error' })
        }
    })
}

export function useUpdateCard(listId: string) {
    const queryClient = useQueryClient()
    const { toast } = useToast()

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => cardService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CARD_KEYS.all(listId) })
        },
        onError: (error: any) => {
            toast({ message: error.message || 'Failed to update card', type: 'error' })
        }
    })
}
export function useDeleteCard(listId: string) {
    const queryClient = useQueryClient()
    const { toast } = useToast()

    return useMutation({
        mutationFn: (id: string) => cardService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CARD_KEYS.all(listId) })
            toast({ message: 'Card deleted', type: 'success' })
        },
        onError: (error: any) => {
            toast({ message: error.message || 'Failed to delete card', type: 'error' })
        }
    })
}
