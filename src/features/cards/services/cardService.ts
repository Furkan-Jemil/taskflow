import { Card } from '@/types/entities'
import { mockStorage } from '@/lib/mockStorage'

export const cardService = {
    /**
     * Get all cards for a list
     */
    async getByList(listId: string): Promise<Card[]> {
        await new Promise((resolve) => setTimeout(resolve, 300))
        return mockStorage.getCards(listId)
    },

    /**
     * Create a new card
     */
    async create(listId: string, title: string): Promise<Card> {
        await new Promise((resolve) => setTimeout(resolve, 400))

        const cards = mockStorage.get<Card>('taskflow_cards')
        const position = cards.filter(c => c.list_id === listId).length

        const newCard: Card = {
            id: crypto.randomUUID(),
            title,
            list_id: listId,
            position,
            priority: 'medium',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        }

        mockStorage.addCard(newCard)
        return newCard
    },

    /**
     * Update card
     */
    async update(id: string, data: Partial<Card>): Promise<Card> {
        await new Promise((resolve) => setTimeout(resolve, 200))
        const cards = mockStorage.get<Card>('taskflow_cards')
        const index = cards.findIndex((c) => c.id === id)
        if (index === -1) throw new Error('Card not found')
        cards[index] = { ...cards[index], ...data, updated_at: new Date().toISOString() }
        mockStorage.set('taskflow_cards', cards)
        return cards[index]
    },

    /**
     * Delete card
     */
    async delete(id: string): Promise<void> {
        await new Promise((resolve) => setTimeout(resolve, 200))
        const cards = mockStorage.get<Card>('taskflow_cards')
        mockStorage.set('taskflow_cards', cards.filter((c) => c.id !== id))
    },
}
