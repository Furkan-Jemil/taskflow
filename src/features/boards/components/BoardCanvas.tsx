import { useState, useMemo, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useBoard } from '@/features/boards/hooks/useBoards'
import { useLists, useCreateList, useUpdateList } from '@/features/lists/hooks/useLists'
import { ListContainer } from '@/features/lists/components/ListContainer'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { CardDetailModal, useUpdateCard } from '@/features/cards'
import { Card, List } from '@/types/entities'
import { ChevronLeft, Plus, Users, Settings, Search, X, Star } from 'lucide-react'
import { useFavoritesStore } from '@/stores/favoritesStore'

// DND Kit Imports
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent,
} from '@dnd-kit/core'
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    horizontalListSortingStrategy,
} from '@dnd-kit/sortable'
import { createPortal } from 'react-dom'
import { CardItem } from '@/features/cards'

import { BoardSettingsModal } from './BoardSettingsModal'
import { BoardSharingModal } from './BoardSharingModal'

export function BoardCanvas() {
    const { boardId } = useParams<{ boardId: string }>()
    const queryClient = useQueryClient()
    const { data: board, isLoading: isBoardLoading } = useBoard(boardId || '')
    const { data: serverLists, isLoading: isListsLoading } = useLists(boardId || '')
    const { mutate: createList, isPending: isCreatingList } = useCreateList(boardId || '')
    const { mutate: updateList } = useUpdateList(boardId || '')
    const { mutate: updateCard } = useUpdateCard('') // listId not strictly needed for mutation itself if we invalidate correctly

    // Local state for optimistic updates and DND
    const [lists, setLists] = useState<List[]>([])
    const [searchQuery, setSearchQuery] = useState('')

    const [isAddingList, setIsAddingList] = useState(false)
    const [newListTitle, setNewListTitle] = useState('')

    const [selectedCard, setSelectedCard] = useState<Card | null>(null)
    const [isCardModalOpen, setIsCardModalOpen] = useState(false)

    const [isSettingsOpen, setIsSettingsOpen] = useState(false)
    const [isSharingOpen, setIsSharingOpen] = useState(false)

    // Active dragging state
    const [activeList, setActiveList] = useState<List | null>(null)
    const [activeCard, setActiveCard] = useState<Card | null>(null)

    const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite)
    const isFavorite = useFavoritesStore((state) => state.isFavorite)
    const starred = isFavorite(boardId || '')

    const handleToggleStar = () => {
        if (!board) return
        toggleFavorite({
            id: board.id,
            type: 'board',
            name: board.name
        })
    }

    // DND Sensors
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // Avoid accidental drags when clicking
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    // Update local state when server data changes
    useEffect(() => {
        if (serverLists) {
            setLists(serverLists)
        }
    }, [serverLists])

    const handleCardClick = useCallback((card: Card) => {
        setSelectedCard(card)
        setIsCardModalOpen(true)
    }, [])

    const handleAddList = useCallback(() => {
        if (!newListTitle.trim()) return
        createList(newListTitle, {
            onSuccess: () => {
                setNewListTitle('')
                setIsAddingList(false)
            }
        })
    }, [createList, newListTitle])

    // --- DND LOGIC ---

    const findContainer = useCallback((id: string) => {
        // If id is a list id
        if (lists.some((l: List) => l.id === id)) return id

        // If id is a card id, find which list it belongs to in the React Query cache
        const allCardQueries = queryClient.getQueriesData<Card[]>({ queryKey: ['cards'] })
        for (const [queryKey, cards] of allCardQueries) {
            if (cards && cards.some((c: Card) => c.id === id)) {
                return (queryKey[1] as string) // listId is at index 1
            }
        }

        return null
    }, [lists, queryClient])

    const onDragStart = useCallback((event: DragStartEvent) => {
        const { active } = event
        const data = active.data.current

        if (data?.type === 'List') {
            setActiveList(data.list)
        } else if (data?.type === 'Card') {
            setActiveCard(data.card)
        }
    }, [])

    const onDragOver = useCallback((event: DragOverEvent) => {
        const { active, over } = event
        if (!over) return

        const activeId = active.id as string
        const overId = over.id as string

        if (activeId === overId) return

        const activeData = active.data.current
        if (activeData?.type !== 'Card') return

        const overData = over.data.current

        const activeContainer = findContainer(activeId)
        const overContainer = findContainer(overId)

        if (!activeContainer || !overContainer || activeContainer === overContainer) return

        // Moving card between lists
        queryClient.setQueryData(['cards', activeContainer], (prev: Card[] | undefined) => {
            if (!prev) return []
            const activeCard = prev.find(c => c.id === activeId)
            if (!activeCard) return prev
            return prev.filter(c => c.id !== activeId)
        })

        queryClient.setQueryData(['cards', overContainer], (prev: Card[] | undefined) => {
            const activeCard = activeData.card
            const currentCards = prev || []

            // Find position to insert
            let newIndex
            const isOverACard = overData?.type === 'Card'
            if (isOverACard) {
                newIndex = currentCards.findIndex(c => c.id === overId)
            } else {
                newIndex = currentCards.length
            }

            const updatedCard = { ...activeCard, list_id: overContainer }
            const newCards = [...currentCards]
            newCards.splice(newIndex, 0, updatedCard)

            return newCards
        })
    }, [findContainer, queryClient])

    const onDragEnd = useCallback((event: DragEndEvent) => {
        const { active, over } = event
        setActiveList(null)
        setActiveCard(null)

        if (!over) return

        const activeId = active.id as string
        const overId = over.id as string

        const activeData = active.data.current

        // 1. Handle List Reordering
        if (activeData?.type === 'List') {
            if (activeId !== overId) {
                const oldIndex = lists.findIndex((l: List) => l.id === activeId)
                const newIndex = lists.findIndex((l: List) => l.id === overId)
                const newLists = arrayMove(lists, oldIndex, newIndex)
                setLists(newLists)

                // Persistence
                newLists.forEach((list: List, index: number) => {
                    if (list.position !== index + 1) {
                        updateList({ id: list.id, data: { position: index + 1 } })
                    }
                })
            }
            return
        }

        // 2. Handle Card Drop
        if (activeData?.type === 'Card') {
            const activeContainer = findContainer(activeId)
            const overContainer = findContainer(overId)

            if (!activeContainer || !overContainer) return

            const cardsInOver = queryClient.getQueryData<Card[]>(['cards', overContainer]) || []
            const newIndex = cardsInOver.findIndex(c => c.id === activeId)

            // Trigger persistence API call
            updateCard({
                id: activeId,
                data: {
                    list_id: overContainer,
                    position: newIndex + 1
                }
            })
        }
    }, [lists, findContainer, queryClient, updateList, updateCard])

    const filteredLists = useMemo(() => {
        if (!searchQuery) return lists
        // In a real app, filtering might happen at the card level inside the list
        // but for the UI to "search across boards", we'll filter lists that contain cards matching the query
        // and tell the lists to only show matching cards.
        return lists.map((list: List) => ({
            ...list,
            // We can't actually filter the cards here because cards are fetched in ListContainer
            // but we can pass the search query down
        }))
    }, [lists, searchQuery])

    const listIds = useMemo(() => lists.map((l: List) => l.id), [lists])

    if (isBoardLoading) {
        return (
            <div className="flex flex-col h-screen bg-[#0f172a]">
                <div className="h-16 border-b border-white/5 bg-slate-900/40 flex items-center px-6 gap-4">
                    <div className="h-6 w-32 bg-white/5 rounded animate-pulse" />
                </div>
                <div className="flex-1 p-6 flex gap-6 overflow-hidden">
                    {[1, 2, 3].map(i => <div key={i} className="w-[300px] h-full bg-white/5 rounded-2xl animate-pulse" />)}
                </div>
            </div>
        )
    }

    if (!board) return null

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDragEnd={onDragEnd}
        >
            <div className="flex flex-col h-screen bg-[#0f172a] text-slate-50 overflow-hidden relative">
                {/* Background Blobs */}
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

                {/* Board Header */}
                <div className="h-16 border-b border-slate-800 bg-slate-900/40 backdrop-blur-xl flex items-center justify-between px-6 shrink-0 z-10">
                    <div className="flex items-center gap-4">
                        <Link
                            to={`/workspaces/${board.workspace_id}`}
                            className="p-2 hover:bg-muted rounded-full transition-colors"
                            title="Back to Workspace"
                        >
                            <ChevronLeft size={20} />
                        </Link>
                        <div className="h-4 w-[1px] bg-border mx-1" />
                        <h1 className="text-lg font-bold tracking-tight">{board.name}</h1>
                        <button
                            onClick={handleToggleStar}
                            className={`p-1.5 rounded-full hover:bg-muted transition-all ${starred ? 'text-amber-500' : 'text-muted-foreground/30 hover:text-amber-500'}`}
                        >
                            <Star size={18} fill={starred ? 'currentColor' : 'none'} />
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="relative mr-4 hidden md:block">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search tasks..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-64 h-9 pl-9 bg-muted/50 border-none focus-visible:ring-1"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    <X size={12} />
                                </button>
                            )}
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => setIsSharingOpen(true)}>
                            <Users size={16} className="mr-2" />
                            Share
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 rounded-full"
                            onClick={() => setIsSettingsOpen(true)}
                        >
                            <Settings size={18} />
                        </Button>
                    </div>
                </div>

                {/* Board Content (Horizontal Split) */}
                <div className="flex-1 overflow-x-auto p-6 flex items-start gap-6 custom-scrollbar-h">
                    {isListsLoading ? (
                        <div className="flex gap-6 h-full">
                            {[1, 2, 3].map(i => <div key={i} className="w-[300px] h-full bg-muted/20 rounded-xl border border-dashed" />)}
                        </div>
                    ) : (
                        <>
                            <SortableContext items={listIds} strategy={horizontalListSortingStrategy}>
                                {filteredLists.map((list: List) => (
                                    <ListContainer
                                        key={list.id}
                                        list={list}
                                        searchQuery={searchQuery}
                                        onCardClick={handleCardClick}
                                    />
                                ))}
                            </SortableContext>

                            {/* Add List Button */}
                            <div className="w-[300px] min-w-[300px] shrink-0 pb-10">
                                {isAddingList ? (
                                    <div className="bg-slate-200/50 dark:bg-slate-900/50 p-4 rounded-xl border animate-in fade-in zoom-in-95 duration-200">
                                        <Input
                                            autoFocus
                                            placeholder="Enter list title..."
                                            value={newListTitle}
                                            onChange={(e) => setNewListTitle(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') handleAddList()
                                                if (e.key === 'Escape') setIsAddingList(false)
                                            }}
                                            className="mb-3 bg-card border-none"
                                        />
                                        <div className="flex items-center gap-2">
                                            <Button size="sm" onClick={handleAddList} isLoading={isCreatingList}>
                                                Add List
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsAddingList(false)}>
                                                <X size={16} />
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setIsAddingList(true)}
                                        className="flex items-center justify-center w-full p-4 bg-slate-200/30 dark:bg-slate-900/30 border border-dashed rounded-xl text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-slate-200/50 transition-all font-medium group h-14"
                                    >
                                        <Plus size={20} className="mr-2 group-hover:scale-110 transition-transform" />
                                        Add another list
                                    </button>
                                )}
                            </div>
                        </>
                    )}
                </div>

                <CardDetailModal
                    card={selectedCard}
                    isOpen={isCardModalOpen}
                    onClose={() => setIsCardModalOpen(false)}
                />

                <BoardSettingsModal
                    board={board}
                    isOpen={isSettingsOpen}
                    onClose={() => setIsSettingsOpen(false)}
                />

                <BoardSharingModal
                    board={board}
                    isOpen={isSharingOpen}
                    onClose={() => setIsSharingOpen(false)}
                />
            </div>

            {/* Drag Previews */}
            {createPortal(
                <DragOverlay adjustScale={false}>
                    {activeList && (
                        <ListContainer
                            list={activeList}
                            onCardClick={() => { }}
                        />
                    )}
                    {activeCard && (
                        <CardItem
                            card={activeCard}
                            onClick={() => { }}
                        />
                    )}
                </DragOverlay>,
                document.body
            )}
        </DndContext>
    )
}
