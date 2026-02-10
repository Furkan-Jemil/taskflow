import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useBoard } from '@/features/boards/hooks/useBoards'
import { useLists, useCreateList } from '@/features/lists/hooks/useLists'
import { ListContainer } from '@/features/lists/components/ListContainer'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { CardDetailModal } from '@/features/cards'
import { Card } from '@/types/entities'
import { ChevronLeft, Plus, Users, Settings, Filter, Search, X } from 'lucide-react'

export function BoardCanvas() {
    const { boardId } = useParams<{ boardId: string }>()
    const { data: board, isLoading: isBoardLoading } = useBoard(boardId || '')
    const { data: lists, isLoading: isListsLoading } = useLists(boardId || '')
    const { mutate: createList, isPending: isCreatingList } = useCreateList(boardId || '')

    const [isAddingList, setIsAddingList] = useState(false)
    const [newListTitle, setNewListTitle] = useState('')

    const [selectedCard, setSelectedCard] = useState<Card | null>(null)
    const [isCardModalOpen, setIsCardModalOpen] = useState(false)

    const handleCardClick = (card: Card) => {
        setSelectedCard(card)
        setIsCardModalOpen(true)
    }

    const handleAddList = () => {
        if (!newListTitle.trim()) return
        createList(newListTitle, {
            onSuccess: () => {
                setNewListTitle('')
                setIsAddingList(false)
            }
        })
    }

    if (isBoardLoading) {
        return (
            <div className="flex flex-col h-screen bg-background">
                <div className="h-16 border-b bg-card flex items-center px-6 gap-4">
                    <div className="h-6 w-32 bg-muted rounded animate-pulse" />
                </div>
                <div className="flex-1 p-6 flex gap-6 overflow-hidden">
                    {[1, 2, 3].map(i => <div key={i} className="w-[300px] h-full bg-muted/50 rounded-xl animate-pulse" />)}
                </div>
            </div>
        )
    }

    if (!board) return null

    return (
        <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
            {/* Board Header */}
            <div className="h-16 border-b bg-card flex items-center justify-between px-6 shrink-0 z-10">
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
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative mr-4 hidden md:block">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search tasks..."
                            className="w-64 h-9 pl-9 bg-muted/50 border-none focus-visible:ring-1"
                        />
                    </div>
                    <Button variant="ghost" size="sm">
                        <Filter size={16} className="mr-2" />
                        Filters
                    </Button>
                    <Button variant="ghost" size="sm">
                        <Users size={16} className="mr-2" />
                        Share
                    </Button>
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
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
                        {lists?.map(list => (
                            <ListContainer
                                key={list.id}
                                list={list}
                                onCardClick={handleCardClick}
                            />
                        ))}

                        {/* Add List Button */}
                        <div className="w-[300px] min-w-[300px] shrink-0">
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
                                    className="flex items-center justify-center w-full p-4 bg-slate-200/30 dark:bg-slate-900/30 border border-dashed rounded-xl text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-slate-200/50 transition-all font-medium group"
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
        </div>
    )
}
