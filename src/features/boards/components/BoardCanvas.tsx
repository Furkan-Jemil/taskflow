import { useState, useMemo, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useBoard } from '@/features/boards/hooks/useBoards'
import { useLists, useCreateList, useUpdateList } from '@/features/lists/hooks/useLists'
import { ListContainer } from '@/features/lists/components/ListContainer'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Skeleton } from '@/components/ui/Skeleton'
import { CardDetailModal, useUpdateCard } from '@/features/cards'
import { Card } from '@/types/entities'
import { Plus, X } from 'lucide-react'
import { useFavoritesStore } from '@/stores/favoritesStore'
import { useModal } from '@/hooks/useModal'
import { useBoardDnd } from '@/features/boards/hooks/useBoardDnd'
import { DndContext, DragOverlay } from '@dnd-kit/core'
import { createPortal } from 'react-dom'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import { CardItem } from '@/features/cards'
import { BoardSettingsModal } from './BoardSettingsModal'
import { BoardSharingModal } from './BoardSharingModal'
import { BoardHeader } from './BoardHeader'

export function BoardCanvas() {
    const { boardId } = useParams<{ boardId: string }>()
    const queryClient = useQueryClient()
    const { data: board, isLoading: isBoardLoading } = useBoard(boardId || '')
    const { data: serverLists, isLoading: isListsLoading } = useLists(boardId || '')
    const { mutate: createList, isPending: isCreatingList } = useCreateList(boardId || '')
    const { mutate: updateList } = useUpdateList(boardId || '')
    const { mutate: updateCard } = useUpdateCard('')

    // Modals
    const settingsModal = useModal()
    const sharingModal = useModal()
    const cardModal = useModal()

    const [searchQuery, setSearchQuery] = useState('')
    const [isAddingList, setIsAddingList] = useState(false)
    const [newListTitle, setNewListTitle] = useState('')
    const [selectedCard, setSelectedCard] = useState<Card | null>(null)

    const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite)
    const isFavorite = useFavoritesStore((state) => state.isFavorite)
    const starred = isFavorite(boardId || '')

    // DND Hook
    const {
        lists,
        activeList,
        activeCard,
        sensors,
        onDragStart,
        onDragOver,
        onDragEnd,
        closestCorners
    } = useBoardDnd({
        serverLists,
        queryClient,
        updateList,
        updateCard
    })

    const handleToggleStar = useCallback(() => {
        if (!board) return
        toggleFavorite({
            id: board.id,
            type: 'board',
            name: board.name
        })
    }, [board, toggleFavorite])

    const handleCardClick = useCallback((card: Card) => {
        setSelectedCard(card)
        cardModal.open()
    }, [cardModal])

    const handleAddList = useCallback(() => {
        if (!newListTitle.trim()) return
        createList(newListTitle, {
            onSuccess: () => {
                setNewListTitle('')
                setIsAddingList(false)
            }
        })
    }, [createList, newListTitle])

    const filteredLists = useMemo(() => {
        if (!searchQuery) return lists
        return lists.map((list) => ({
            ...list,
        }))
    }, [lists, searchQuery])

    const listIds = useMemo(() => lists.map((l) => l.id), [lists])

    if (isBoardLoading) {
        return (
            <div className="flex flex-col h-screen bg-[#0f172a]">
                <div className="h-16 border-b border-white/5 bg-slate-900/40 flex items-center px-6 gap-4">
                    <Skeleton className="h-6 w-32 bg-white/5" />
                </div>
                <div className="flex-1 p-6 flex gap-6 overflow-hidden">
                    {[1, 2, 3].map(i => <Skeleton key={i} className="w-[300px] h-full bg-white/5 rounded-2xl" />)}
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
                <BoardHeader
                    board={board}
                    starred={starred}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    onToggleStar={handleToggleStar}
                    onOpenSharing={sharingModal.open}
                    onOpenSettings={settingsModal.open}
                />

                {/* Board Content (Horizontal Split) */}
                <div className="flex-1 overflow-x-auto p-6 flex items-start gap-6 custom-scrollbar-h">
                    {isListsLoading ? (
                        <div className="flex gap-6 h-full">
                            {[1, 2, 3].map(i => <Skeleton key={i} className="w-[300px] h-full bg-muted/20 border-dashed" />)}
                        </div>
                    ) : (
                        <>
                            <SortableContext items={listIds} strategy={horizontalListSortingStrategy}>
                                {filteredLists.map((list) => (
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
                    isOpen={cardModal.isOpen}
                    onClose={cardModal.close}
                />

                <BoardSettingsModal
                    board={board}
                    isOpen={settingsModal.isOpen}
                    onClose={settingsModal.close}
                />

                <BoardSharingModal
                    board={board}
                    isOpen={sharingModal.isOpen}
                    onClose={sharingModal.close}
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
