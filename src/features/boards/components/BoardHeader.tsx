import { Link } from 'react-router-dom'
import { ChevronLeft, Star, Search, X, Users, Settings } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Board } from '@/types/entities'
import { memo } from 'react'

interface BoardHeaderProps {
    board: Board
    starred: boolean
    searchQuery: string
    setSearchQuery: (query: string) => void
    onToggleStar: () => void
    onOpenSharing: () => void
    onOpenSettings: () => void
}

export const BoardHeader = memo(function BoardHeader({
    board,
    starred,
    searchQuery,
    setSearchQuery,
    onToggleStar,
    onOpenSharing,
    onOpenSettings
}: BoardHeaderProps) {
    return (
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
                    onClick={onToggleStar}
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
                <Button variant="ghost" size="sm" onClick={onOpenSharing}>
                    <Users size={16} className="mr-2" />
                    Share
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-full"
                    onClick={onOpenSettings}
                >
                    <Settings size={18} />
                </Button>
            </div>
        </div>
    )
})
