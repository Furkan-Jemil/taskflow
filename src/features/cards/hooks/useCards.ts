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

export function useUpdateCard() {
    const queryClient = useQueryClient()
    const { toast } = useToast()

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => cardService.update(id, data),
        onSuccess: (_, variables) => {
            // If the card was moved to a new list, invalidate both the original and destination list
            // However, a simple strategy for board-level consistency is to invalidate the board cards
            // or just the specific list if known. Since we often move between lists, 
            // invalidating all lists in the current board is safest if we don't have the original ID.
            
            if (variables.data.list_id) {
                queryClient.invalidateQueries({ queryKey: ['cards', variables.data.list_id] })
            }
            
            // This ensures the board view remains consistent after any update
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
