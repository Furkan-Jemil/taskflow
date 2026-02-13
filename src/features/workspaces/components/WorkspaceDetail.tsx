import { useParams, Link } from 'react-router-dom'
import { useWorkspace } from '../hooks/useWorkspaces'
import { BoardList } from '@/features/boards'
import { ChevronLeft, LayoutGrid, Users, Settings, Star } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { WorkspaceSettingsModal } from './WorkspaceSettingsModal'
import { WorkspaceMembersModal } from './WorkspaceMembersModal'
import { useFavoritesStore } from '@/stores/favoritesStore'
import { useModal } from '@/hooks/useModal'

export function WorkspaceDetail() {
    const { id } = useParams<{ id: string }>()
    const { data: workspace, isLoading } = useWorkspace(id || '')
    const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite)
    const isFavorite = useFavoritesStore((state) => state.isFavorite)

    const settingsModal = useModal()
    const membersModal = useModal()

    const starred = isFavorite(workspace?.id || '')

    const handleToggleStar = () => {
        if (!workspace) return
        toggleFavorite({
            id: workspace.id,
            type: 'workspace',
            name: workspace.name
        })
    }

    if (isLoading) {
        return (
            <div className="container mx-auto py-10 px-4 md:px-6 animate-pulse">
                <div className="h-8 w-48 bg-muted rounded mb-8" />
                <div className="h-32 w-full bg-muted rounded-xl mb-10" />
                <div className="space-y-4">
                    <div className="h-6 w-32 bg-muted rounded" />
                    <div className="grid grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-muted rounded-lg" />)}
                    </div>
                </div>
            </div>
        )
    }

    if (!workspace) {
        return (
            <div className="container mx-auto py-20 text-center">
                <h1 className="text-2xl font-bold">Workspace not found</h1>
                <Link to="/workspaces" className="text-primary hover:underline mt-4 inline-block">
                    Return to dashboard
                </Link>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-10 px-4 md:px-6 animate-fade-in">
            {/* Breadcrumbs / Back */}
            <Link
                to="/workspaces"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
            >
                <ChevronLeft size={16} className="mr-1" />
                Back to Workspaces
            </Link>

            {/* Header / Hero */}
            <div className="relative p-8 rounded-2xl bg-gradient-to-br from-primary/10 via-background to-background border border-primary/10 mb-10 overflow-hidden">
                <div className="absolute top-0 right-0 p-8 text-primary/5 -mr-8 -mt-8 rotate-12">
                    <LayoutGrid size={160} />
                </div>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-primary text-primary-foreground">
                                <LayoutGrid size={20} />
                            </div>
                            <span className="text-sm font-bold text-primary tracking-widest uppercase">Workspace</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <h1 className="text-4xl font-extrabold tracking-tight">{workspace.name}</h1>
                            <button
                                onClick={handleToggleStar}
                                className={`p-2 rounded-full hover:bg-background/50 transition-all ${starred ? 'text-amber-500' : 'text-muted-foreground/30 hover:text-amber-500'}`}
                            >
                                <Star size={24} fill={starred ? 'currentColor' : 'none'} />
                            </button>
                        </div>
                        <p className="text-muted-foreground mt-2 max-w-xl">
                            Manage your boards, team members, and high-level project goals in this workspace.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            onClick={membersModal.open}
                            className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all text-foreground"
                        >
                            <Users size={18} className="mr-2" />
                            Members
                        </Button>
                        <Button
                            variant="outline"
                            onClick={settingsModal.open}
                            className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all text-foreground"
                        >
                            <Settings size={18} className="mr-2" />
                            Settings
                        </Button>
                    </div>
                </div>
            </div>

            {/* Board Section */}
            <BoardList workspaceId={workspace.id} />

            <WorkspaceSettingsModal
                workspace={workspace}
                isOpen={settingsModal.isOpen}
                onClose={settingsModal.close}
            />

            <WorkspaceMembersModal
                workspace={workspace}
                isOpen={membersModal.isOpen}
                onClose={membersModal.close}
            />
        </div>
    )
}
