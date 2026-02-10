import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { cardService } from '../services/cardService'

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

    return useMutation({
        mutationFn: (title: string) => cardService.create(listId, title),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CARD_KEYS.all(listId) })
        },
    })
}

export function useUpdateCard(listId: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => cardService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CARD_KEYS.all(listId) })
        },
    })
}
