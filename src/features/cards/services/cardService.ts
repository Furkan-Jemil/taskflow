import { Card } from '@/types/entities'
import { sleep } from '@/lib/utils'

/**
 * Mock data for cards
 */
const MOCK_CARDS: Card[] = [
    {
        id: 'card-1',
        list_id: 'list-1',
        title: 'Draft landing page design',
        description: 'Create a Figma prototype for the new landing page.',
        priority: 'high',
        position: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
    {
        id: 'card-2',
        list_id: 'list-1',
        title: 'Write technical documentation',
        description: 'Document the API endpoints for the authentication module.',
        priority: 'medium',
        position: 2,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
    {
        id: 'card-3',
        list_id: 'list-2',
        title: 'Fix mobile responsiveness',
        description: 'The sidebar is breaking on small screens.',
        priority: 'high',
        position: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
]

export const cardService = {
    /**
     * Get cards for a specific list
     */
    async getByList(listId: string): Promise<Card[]> {
        await sleep(500)
        return MOCK_CARDS.filter(c => c.list_id === listId).sort((a, b) => a.position - b.position)
    },

    /**
     * Create a new card
     */
    async create(listId: string, title: string): Promise<Card> {
        await sleep(800)
        const newCard: Card = {
            id: `card-${Math.random().toString(36).substr(2, 9)}`,
            list_id: listId,
            title,
            priority: 'medium',
            position: 100, // Large position for end of list
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        }
        return newCard
    },

    /**
     * Update card
     */
    async update(id: string, data: Partial<Card>): Promise<Card> {
        await sleep(500)
        const card = MOCK_CARDS.find(c => c.id === id) || MOCK_CARDS[0]
        return { ...card, ...data, id, updated_at: new Date().toISOString() }
    },

    /**
     * Delete card
     */
    async delete(id: string): Promise<void> {
        await sleep(500)
        console.log('Deleted card', id)
    },
}
