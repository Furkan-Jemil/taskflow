import { useState, useMemo } from 'react'
import { List, Card } from '@/types/entities'
import { CardItem, useCards, useCreateCard } from '@/features/cards'
import { useUpdateList, useDeleteList } from '../hooks/useLists'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Plus, X, GripVertical } from 'lucide-react'
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface ListContainerProps {
    list: List
    searchQuery?: string
    onCardClick: (card: Card) => void
}

export function ListContainer({ list, searchQuery, onCardClick }: ListContainerProps) {
    const { data: cards, isLoading } = useCards(list.id)
    const { mutate: createCard, isPending: isCreating } = useCreateCard(list.id)
    const { mutate: updateList } = useUpdateList(list.board_id)
    const { mutate: deleteList } = useDeleteList(list.board_id)

    const [isAdding, setIsAdding] = useState(false)
    const [newCardTitle, setNewCardTitle] = useState('')

    const [isEditingTitle, setIsEditingTitle] = useState(false)
    const [listTitle, setListTitle] = useState(list.title)

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

    const filteredCards = useMemo(() => {
        if (!cards) return []
        if (!searchQuery) return cards
        const q = searchQuery.toLowerCase()
        return cards.filter(c =>
            c.title.toLowerCase().includes(q) ||
            c.description?.toLowerCase().includes(q)
        )
    }, [cards, searchQuery])

    const cardIds = useMemo(() => filteredCards.map((c: Card) => c.id), [filteredCards])

    const handleAddCard = () => {
        if (!newCardTitle.trim()) return
        createCard(newCardTitle, {
            onSuccess: () => {
                setNewCardTitle('')
                setIsAdding(false)
            }
        })
    }

    const handleUpdateTitle = () => {
        if (!listTitle.trim() || listTitle === list.title) {
            setListTitle(list.title)
            setIsEditingTitle(false)
            return
        }
        updateList({ id: list.id, data: { title: listTitle } }, {
            onSuccess: () => setIsEditingTitle(false)
        })
    }

    const handleDeleteList = () => {
        if (window.confirm('Are you sure you want to delete this list and all its cards?')) {
            deleteList(list.id)
        }
    }

    if (isDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="w-[300px] min-w-[300px] h-full bg-white/5 border-2 border-primary/30 rounded-2xl opacity-40 shrink-0 shadow-2xl"
            />
        )
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex flex-col w-[302px] min-w-[302px] h-full bg-slate-900/40 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden shadow-xl shrink-0 group/list hover:border-white/20 transition-all duration-300"
        >
            {/* List Header */}
            <div className="p-4 flex items-center justify-between font-bold text-sm tracking-tight">
                <div className="flex items-center gap-2 flex-1">
                    <button
                        {...attributes}
                        {...listeners}
                        className="cursor-grab active:cursor-grabbing p-1.5 hover:bg-white/10 rounded-lg text-white/30 hover:text-white/60 transition-all"
                    >
                        <GripVertical size={16} />
                    </button>
                    {isEditingTitle ? (
                        <Input
                            autoFocus
                            value={listTitle}
                            onChange={(e) => setListTitle(e.target.value)}
                            onBlur={handleUpdateTitle}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleUpdateTitle()
                                if (e.key === 'Escape') {
                                    setListTitle(list.title)
                                    setIsEditingTitle(false)
                                }
                            }}
                            className="h-8 text-sm font-bold bg-white/5 border-primary/50 text-white px-2 focus-visible:ring-primary/30"
                        />
                    ) : (
                        <h3
                            className="cursor-pointer hover:text-primary transition-colors truncate text-slate-100 font-semibold"
                            onClick={() => setIsEditingTitle(true)}
                        >
                            {list.title}
                        </h3>
                    )}
                </div>
                <div className="flex items-center opacity-0 group-hover/list:opacity-100 transition-opacity">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-white/40 rounded-full hover:text-destructive hover:bg-destructive/10 transition-all"
                        onClick={handleDeleteList}
                    >
                        <X size={16} />
                    </Button>
                </div>
            </div>

            {/* Card Content Area */}
            <div className="flex-1 overflow-y-auto px-2 space-y-2 custom-scrollbar">
                <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
                    {isLoading ? (
                        <div className="space-y-2 p-1">
                            {[1, 2].map(i => <div key={i} className="h-24 bg-muted rounded-lg animate-pulse" />)}
                        </div>
                    ) : (
                        filteredCards.map((card: Card) => (
                            <CardItem key={card.id} card={card} onClick={onCardClick} />
                        ))
                    )}
                </SortableContext>
            </div>

            {/* List Footer / Add Card */}
            <div className="p-3 mt-auto">
                {isAdding ? (
                    <div className="bg-white/5 backdrop-blur-lg p-3 rounded-xl border border-white/10 shadow-2xl animate-in slide-in-from-bottom-2 fade-in duration-300">
                        <Input
                            autoFocus
                            placeholder="Enter a title for this card..."
                            value={newCardTitle}
                            onChange={(e) => setNewCardTitle(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleAddCard()
                                if (e.key === 'Escape') setIsAdding(false)
                            }}
                            className="text-sm min-h-[80px] bg-transparent border-none focus-visible:ring-0 px-0 placeholder:text-white/30 text-white"
                            style={{ resize: 'none' }}
                        />
                        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/5">
                            <Button size="sm" onClick={handleAddCard} isLoading={isCreating} className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">Add Card</Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-white/40" onClick={() => setIsAdding(false)}>
                                <X size={16} />
                            </Button>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="flex items-center w-full p-2.5 text-sm text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-all font-medium group"
                    >
                        <Plus size={18} className="mr-2 group-hover:scale-110 transition-transform text-primary" />
                        Add a card
                    </button>
                )}
            </div>
        </div>
    )
}
