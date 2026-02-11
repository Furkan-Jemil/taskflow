import { Link } from 'react-router-dom'
import { LogOut, Search, Bell, User } from 'lucide-react'
import { useAuth } from '@/features/auth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export function Header() {
    const { user, logout } = useAuth()

    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center justify-between gap-4 px-6 max-w-none">
                <div className="flex items-center gap-4 flex-1">
                    <Link to="/workspaces" className="flex items-center space-x-2">
                        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                            <span className="text-primary-foreground font-bold text-xl">T</span>
                        </div>
                        <span className="hidden font-bold sm:inline-block text-xl tracking-tight">TaskFlow</span>
                    </Link>

                    <div className="hidden md:flex flex-1 max-w-md ml-8">
                        <div className="relative w-full">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search across boards..."
                                className="pl-9 bg-muted/50 border-none h-9 focus-visible:ring-1"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hidden sm:flex"
                        onClick={() => alert('Notifications coming soon!')}
                    >
                        <Bell size={18} />
                    </Button>

                    <div className="flex items-center gap-3 ml-2 pl-4 border-l">
                        <div className="hidden lg:flex flex-col items-end text-sm">
                            <span className="font-medium">{user?.name}</span>
                            <span className="text-xs text-muted-foreground">{user?.email}</span>
                        </div>

                        <div className="h-9 w-9 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400">
                            <User size={20} />
                        </div>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={logout}
                            className="text-muted-foreground hover:text-destructive transition-colors"
                            title="Logout"
                        >
                            <LogOut size={18} />
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    )
}
