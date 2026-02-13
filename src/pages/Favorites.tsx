import { Star, LayoutGrid, ArrowRight } from 'lucide-react'
import { useFavoritesStore } from '@/stores/favoritesStore'
import { Link } from 'react-router-dom'

export default function Favorites() {
    const favorites = useFavoritesStore((state) => state.favorites)

    if (favorites.length === 0) {
        return (
            <div className="container mx-auto py-10 px-4 md:px-6 animate-fade-in text-center">
                <div className="max-w-md mx-auto py-20">
                    <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-6">
                        <Star size={32} />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Favorites</h1>
                    <p className="text-muted-foreground mt-4">
                        Items you star will appear here for quick access.
                        Manage your most important boards and workspaces in one place.
                    </p>
                    <div className="mt-10 p-12 border-2 border-dashed rounded-2xl bg-muted/30">
                        <LayoutGrid className="mx-auto text-muted-foreground/30 mb-4" size={48} />
                        <p className="text-sm text-[#D1D5DB] italic">You haven't added any favorites yet.</p>
                        <Link
                            to="/workspaces"
                            className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 mt-6 text-sm text-[#1F2937]"
                        >
                            Go to Workspaces
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-10 px-4 md:px-6 animate-fade-in">
            <div className="mb-10 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Favorites</h1>
                    <p className="text-muted-foreground mt-1">Your starred boards and workspaces.</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center">
                    <Star size={20} fill="currentColor" />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map((item) => (
                    <Link
                        key={`${item.type}-${item.id}`}
                        to={item.type === 'workspace' ? `/workspaces/${item.id}` : `/boards/${item.id}`}
                        className="group p-6 bg-card border rounded-2xl hover:shadow-lg hover:border-primary/50 transition-all duration-300 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-150 transition-transform duration-500">
                            {item.type === 'workspace' ? <LayoutGrid size={80} /> : <Star size={80} />}
                        </div>

                        <div className="flex items-start justify-between relative z-10">
                            <div className="space-y-3">
                                <div className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full w-fit ${item.type === 'workspace' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
                                    }`}>
                                    {item.type}
                                </div>
                                <h3 className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-1">
                                    {item.name}
                                </h3>
                                <div className="flex items-center text-sm text-primary font-medium opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all">
                                    Open {item.type} <ArrowRight size={14} className="ml-1" />
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
