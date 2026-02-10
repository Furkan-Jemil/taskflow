import { useState } from 'react'
import { List, Card } from '@/types/entities'
import { CardItem, useCards, useCreateCard } from '@/features/cards'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { MoreVertical, Plus, X } from 'lucide-react'

interface ListContainerProps {
    list: List
    onCardClick: (card: Card) => void
}

export function ListContainer({ list, onCardClick }: ListContainerProps) {
    const { data: cards, isLoading } = useCards(list.id)
    const { mutate: createCard, isPending: isCreating } = useCreateCard(list.id)

    const [isAdding, setIsAdding] = useState(false)
    const [newCardTitle, setNewCardTitle] = useState('')

    const handleAddCard = () => {
        if (!newCardTitle.trim()) return
        createCard(newCardTitle, {
            onSuccess: () => {
                setNewCardTitle('')
                setIsAdding(false)
            }
        })
    }

    return (
        <div className="flex flex-col w-[300px] min-w-[300px] h-full bg-slate-100/50 dark:bg-slate-900/50 rounded-xl border border-border/50 overflow-hidden shadow-sm">
            {/* List Header */}
            <div className="p-4 flex items-center justify-between font-bold text-sm tracking-tight text-slate-900 dark:text-slate-100">
                <h3>{list.title}</h3>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground rounded-full">
                    <MoreVertical size={16} />
                </Button>
            </div>

            {/* Card Content Area */}
            <div className="flex-1 overflow-y-auto px-2 space-y-2 custom-scrollbar">
                {isLoading ? (
                    <div className="space-y-2 p-1">
                        {[1, 2].map(i => <div key={i} className="h-24 bg-muted rounded-lg animate-pulse" />)}
                    </div>
                ) : (
                    cards?.map(card => (
                        <CardItem key={card.id} card={card} onClick={onCardClick} />
                    ))
                )}
            </div>

            {/* List Footer / Add Card */}
            <div className="p-3 mt-auto">
                {isAdding ? (
                    <div className="bg-card p-3 rounded-lg border shadow-sm animate-in slide-in-from-bottom-2 fade-in">
                        <Input
                            autoFocus
                            placeholder="Enter a title for this card..."
                            value={newCardTitle}
                            onChange={(e) => setNewCardTitle(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleAddCard()
                                if (e.key === 'Escape') setIsAdding(false)
                            }}
                            className="text-sm min-h-[80px] bg-transparent border-none focus-visible:ring-0 px-0"
                            style={{ resize: 'none' }}
                        />
                        <div className="flex items-center gap-2 mt-2 pt-2 border-t">
                            <Button size="sm" onClick={handleAddCard} isLoading={isCreating}>Add Card</Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsAdding(false)}>
                                <X size={16} />
                            </Button>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="flex items-center w-full p-2 text-sm text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all font-medium group"
                    >
                        <Plus size={18} className="mr-2 group-hover:scale-110 transition-transform" />
                        Add a card
                    </button>
                )}
            </div>
        </div>
    )
}
