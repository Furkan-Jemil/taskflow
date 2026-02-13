import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Users, Settings, Plus, Star, LayoutGrid } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { useWorkspaces } from '@/features/workspaces/hooks/useWorkspaces'
import { useUIStore } from '@/stores/uiStore'
import { useFavoritesStore } from '@/stores/favoritesStore'

const navigation = [
    { name: 'Home', href: '/workspaces', icon: LayoutDashboard },
    { name: 'My Workspaces', href: '/workspaces/all', icon: Users },
    { name: 'Favorites', href: '/favorites', icon: Star },
    { name: 'Settings', href: '/settings', icon: Settings },
]

export function Sidebar() {
    const location = useLocation()
    const { data: workspaces } = useWorkspaces()
    const { setCreateWorkspaceModalOpen } = useUIStore()
    const { favorites } = useFavoritesStore()

    return (
        <aside className="hidden md:flex flex-col w-64 border-r border-slate-800 bg-slate-900/60 backdrop-blur-xl h-[calc(100vh-3.5rem)] sticky top-14 z-20">
            <div className="flex-1 py-6 px-4 space-y-8 overflow-y-auto custom-scrollbar">
                {/* Main Navigation */}
                <div className="space-y-1">
                    <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Navigation</h3>
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            to={item.href}
                            className={cn(
                                'flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all',
                                location.pathname === item.href
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
                            )}
                        >
                            <item.icon size={18} />
                            {item.name}
                        </Link>
                    ))}
                </div>

                {/* Favorites Section (Dynamic) */}
                {favorites.length > 0 && (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between px-3">
                            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Favorites</h3>
                        </div>
                        <div className="space-y-1">
                            {favorites.map((fav) => (
                                <Link
                                    key={`${fav.type}-${fav.id}`}
                                    to={fav.type === 'workspace' ? `/workspaces/${fav.id}` : `/boards/${fav.id}`}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-1.5 text-xs text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all",
                                        location.pathname === (fav.type === 'workspace' ? `/workspaces/${fav.id}` : `/boards/${fav.id}`) && "bg-primary/5 text-primary"
                                    )}
                                >
                                    {fav.type === 'workspace' ? <LayoutGrid size={14} /> : <Star size={14} className="text-amber-500" fill="currentColor" />}
                                    <span className="truncate">{fav.name}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Workspaces Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-3">
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Your Workspaces</h3>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 rounded-md hover:bg-primary/10 hover:text-primary"
                            onClick={() => setCreateWorkspaceModalOpen(true)}
                        >
                            <Plus size={14} />
                        </Button>
                    </div>

                    <div className="space-y-1">
                        {workspaces?.map((ws) => (
                            <Link
                                key={ws.id}
                                to={`/workspaces/${ws.id}`}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all",
                                    location.pathname === `/workspaces/${ws.id}` && "bg-primary/5 text-primary"
                                )}
                            >
                                <div className="h-6 w-6 rounded bg-primary/10 flex items-center justify-center text-primary font-bold text-[10px]">
                                    {ws.name.substring(0, 1).toUpperCase()}
                                </div>
                                <span className="truncate">{ws.name}</span>
                            </Link>
                        ))}

                        {workspaces?.length === 0 && (
                            <p className="px-3 text-xs text-muted-foreground italic">No workspaces yet</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="p-4 border-t bg-muted/20 text-center">
                <div className="rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 p-4 border border-primary/10">
                    <p className="text-xs font-medium text-primary">TaskFlow Pro</p>
                    <p className="text-[10px] text-muted-foreground mt-1">Upgrade for unlimited workspaces and advanced features.</p>
                    <Button
                        size="sm"
                        className="w-full mt-3 h-7 text-[10px]"
                        onClick={() => alert('Upgrade logic coming soon!')}
                    >
                        Upgrade Now
                    </Button>
                </div>
            </div>
        </aside>
    )
}
