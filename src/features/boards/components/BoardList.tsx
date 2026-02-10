import { useState } from 'react'
import { useBoards } from '../hooks/useBoards'
import { Button } from '@/components/ui/Button'
import { CreateBoardModal } from './CreateBoardModal'
import { Plus, Trello, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Board } from '@/types/entities'
import { formatDate } from '@/lib/utils'

interface BoardListProps {
    workspaceId: string
}

export function BoardList({ workspaceId }: BoardListProps) {
    const { data: boards, isLoading } = useBoards(workspaceId)
    const [isModalOpen, setIsModalOpen] = useState(false)

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-32 bg-muted rounded-lg border" />
                ))}
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold tracking-tight">Boards</h2>
                <Button size="sm" onClick={() => setIsModalOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    New Board
                </Button>
            </div>

            {boards?.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed rounded-xl bg-muted/20">
                    <div className="p-3 rounded-full bg-primary/10 text-primary mb-3">
                        <Trello size={24} />
                    </div>
                    <h3 className="text-lg font-medium">No boards yet</h3>
                    <p className="text-sm text-muted-foreground text-center max-w-xs mt-1">
                        Create your first board to start tracking tasks and progress.
                    </p>
                    <Button variant="outline" size="sm" className="mt-4" onClick={() => setIsModalOpen(true)}>
                        Create Board
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {boards?.map((board: Board) => (
                        <Link
                            key={board.id}
                            to={`/boards/${board.id}`}
                            className="group block p-4 bg-card border rounded-lg shadow-sm hover:shadow-md hover:border-primary/50 transition-all hover:translate-y-[-2px]"
                        >
                            <div className="flex items-start justify-between mb-8">
                                <div className="p-2 rounded bg-primary/10 text-primary">
                                    <Trello size={18} />
                                </div>
                                <div className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded uppercase font-bold tracking-wider">
                                    Open
                                </div>
                            </div>
                            <h3 className="font-semibold group-hover:text-primary transition-colors truncate">{board.name}</h3>
                            <div className="flex items-center gap-1.5 mt-2 text-[11px] text-muted-foreground">
                                <Clock size={12} />
                                <span>Updated {formatDate(board.updated_at)}</span>
                            </div>
                        </Link>
                    ))}

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-lg hover:border-primary/50 hover:bg-muted/30 transition-all group h-32"
                    >
                        <Plus size={24} className="text-muted-foreground group-hover:text-primary transition-colors" />
                        <span className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors mt-2">New Board</span>
                    </button>
                </div>
            )}

            <CreateBoardModal
                workspaceId={workspaceId}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    )
}
