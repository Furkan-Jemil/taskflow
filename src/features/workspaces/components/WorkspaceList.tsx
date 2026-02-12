import { useState } from 'react'
import { useWorkspaces } from '../hooks/useWorkspaces'
import { Button } from '@/components/ui/Button'
import { CreateWorkspaceModal } from './CreateWorkspaceModal'
import { Plus, LayoutGrid, Users, Settings, Activity, Briefcase, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Workspace } from '@/types/entities'

export function WorkspaceList() {
    const { data: workspaces, isLoading } = useWorkspaces()
    const [isModalOpen, setIsModalOpen] = useState(false)

    if (isLoading) {
        return (
            <div className="space-y-12 animate-pulse">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => <div key={i} className="h-32 bg-muted rounded-2xl" />)}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-40 bg-muted rounded-xl border" />
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-12 animate-fade-in">
            {/* Dashboard Summary Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="relative overflow-hidden p-6 bg-gradient-to-br from-primary/10 to-transparent border rounded-2xl group transition-all">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
                        <Briefcase size={80} />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-primary/20 text-primary">
                                <Briefcase size={20} />
                            </div>
                            <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Workspaces</h4>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-black">{workspaces?.length || 0}</span>
                            <span className="text-sm text-emerald-500 font-bold">+12% this week</span>
                        </div>
                    </div>
                </div>

                <div className="relative overflow-hidden p-6 bg-gradient-to-br from-indigo-500/10 to-transparent border rounded-2xl group transition-all">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
                        <Zap size={80} />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-500">
                                <Zap size={20} />
                            </div>
                            <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Active Boards</h4>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-black">24</span>
                            <span className="text-sm text-indigo-500 font-bold">4 ongoing</span>
                        </div>
                    </div>
                </div>

                <div className="relative overflow-hidden p-6 bg-gradient-to-br from-amber-500/10 to-transparent border rounded-2xl group transition-all">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
                        <Activity size={80} />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-500">
                                <Activity size={20} />
                            </div>
                            <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Team Reach</h4>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-black">8.4k</span>
                            <span className="text-sm text-amber-500 font-bold">collaborators</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Project Hub</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your teams and streamline your productivity.
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
                                    <div className="w-8 h-8 rounded-full border-2 border-background bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-700">JD</div>
                                    <div className="w-8 h-8 rounded-full border-2 border-background bg-slate-100 flex items-center justify-center text-[10px] text-slate-600 border-dashed font-medium">+3</div>
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors">{ws.name}</h3>
                            <div className="flex items-center gap-4 mt-6 pt-4 border-t text-sm text-slate-600">
                                <button
                                    className="flex items-center gap-1 hover:text-primary transition-colors font-medium"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        alert('Team management coming soon!')
                                    }}
                                >
                                    <Users size={14} />
                                    <span>4 Members</span>
                                </button>
                                <button
                                    className="flex items-center gap-1 hover:text-primary transition-colors font-medium"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        alert('Workspace settings coming soon!')
                                    }}
                                >
                                    <Settings size={14} />
                                    <span>Settings</span>
                                </button>
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
