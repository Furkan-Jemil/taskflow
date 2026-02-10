import { useState } from 'react'
import { useWorkspaces } from '../hooks/useWorkspaces'
import { Button } from '@/components/ui/Button'
import { CreateWorkspaceModal } from './CreateWorkspaceModal'
import { Plus, LayoutGrid, Users, Settings } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Workspace } from '@/types/entities'

export function WorkspaceList() {
    const { data: workspaces, isLoading } = useWorkspaces()
    const [isModalOpen, setIsModalOpen] = useState(false)

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-40 bg-muted rounded-xl border" />
                ))}
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Workspaces</h1>
                    <p className="text-muted-foreground mt-1">
                        Select a workspace to view your project boards.
                    </p>
                </div>
                <Button onClick={() => setIsModalOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    New Workspace
                </Button>
            </div>

            {workspaces?.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed rounded-2xl bg-muted/30">
                    <div className="p-4 rounded-full bg-primary/10 text-primary mb-4">
                        <LayoutGrid size={32} />
                    </div>
                    <h2 className="text-xl font-semibold">No workspaces found</h2>
                    <p className="text-muted-foreground text-center max-w-xs mt-2">
                        Get started by creating your first workspace to organize your boards and tasks.
                    </p>
                    <Button variant="outline" className="mt-6" onClick={() => setIsModalOpen(true)}>
                        Create Workspace
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {workspaces?.map((ws: Workspace) => (
                        <Link
                            key={ws.id}
                            to={`/workspaces/${ws.id}`}
                            className="group block p-6 bg-card border rounded-xl shadow-sm hover:shadow-md hover:border-primary/50 transition-all active:scale-[0.98]"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                    <LayoutGrid size={24} />
                                </div>
                                <div className="flex -space-x-2">
                                    <div className="w-8 h-8 rounded-full border-2 border-background bg-slate-200 flex items-center justify-center text-[10px] font-bold">JD</div>
                                    <div className="w-8 h-8 rounded-full border-2 border-background bg-slate-100 flex items-center justify-center text-[10px] text-muted-foreground border-dashed">+3</div>
                                </div>
                            </div>
                            <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{ws.name}</h3>
                            <div className="flex items-center gap-4 mt-6 pt-4 border-t text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <Users size={14} />
                                    <span>4 Members</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Settings size={14} />
                                    <span>Settings</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            <CreateWorkspaceModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    )
}
