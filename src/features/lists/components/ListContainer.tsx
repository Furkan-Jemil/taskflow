import { useState, useMemo } from 'react'
import { List, Card } from '@/types/entities'
import { CardItem, useCards, useCreateCard } from '@/features/cards'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { MoreVertical, Plus, X, GripVertical } from 'lucide-react'
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface ListContainerProps {
    list: List
    onCardClick: (card: Card) => void
}

export function ListContainer({ list, onCardClick }: ListContainerProps) {
    const { data: cards, isLoading } = useCards(list.id)
    const { mutate: createCard, isPending: isCreating } = useCreateCard(list.id)

    const [isAdding, setIsAdding] = useState(false)
    const [newCardTitle, setNewCardTitle] = useState('')

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({
        id: list.id,
        data: {
            type: 'List',
            list,
        },
    })

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
    }

    const cardIds = useMemo(() => cards?.map((c: Card) => c.id) || [], [cards])

    const handleAddCard = () => {
        if (!newCardTitle.trim()) return
        createCard(newCardTitle, {
            onSuccess: () => {
                setNewCardTitle('')
                setIsAdding(false)
            }
        })
    }

    if (isDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="w-[300px] min-w-[300px] h-full bg-slate-200/50 dark:bg-slate-800/50 border-2 border-primary/20 rounded-xl opacity-40 shrink-0 shadow-lg"
            />
        )
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex flex-col w-[300px] min-w-[300px] h-full bg-slate-100/50 dark:bg-slate-900/50 rounded-xl border border-border/50 overflow-hidden shadow-sm shrink-0"
        >
            {/* List Header */}
            <div className="p-4 flex items-center justify-between font-bold text-sm tracking-tight text-slate-900 dark:text-slate-100">
                <div className="flex items-center gap-2">
                    <button
                        {...attributes}
                        {...listeners}
                        className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded text-muted-foreground/50 transition-colors"
                    >
                        <GripVertical size={16} />
                    </button>
                    <h3>{list.title}</h3>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground rounded-full">
                    <MoreVertical size={16} />
                </Button>
            </div>

            {/* Card Content Area */}
            <div className="flex-1 overflow-y-auto px-2 space-y-2 custom-scrollbar">
                <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
                    {isLoading ? (
                        <div className="space-y-2 p-1">
                            {[1, 2].map(i => <div key={i} className="h-24 bg-muted rounded-lg animate-pulse" />)}
                        </div>
                    ) : (
                        cards?.map((card: Card) => (
                            <CardItem key={card.id} card={card} onClick={onCardClick} />
                        ))
                    )}
                </SortableContext>
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
