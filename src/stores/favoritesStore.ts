import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface FavoriteItem {
    id: string
    type: 'workspace' | 'board'
    name: string
}

interface FavoritesState {
    favorites: FavoriteItem[]
    toggleFavorite: (item: FavoriteItem) => void
    isFavorite: (id: string) => boolean
}

export const useFavoritesStore = create<FavoritesState>()(
    persist(
        (set, get) => ({
            favorites: [],
            toggleFavorite: (item) => {
                const { favorites } = get()
                const exists = favorites.find((f) => f.id === item.id)

                if (exists) {
                    set({ favorites: favorites.filter((f) => f.id !== item.id) })
                } else {
                    set({ favorites: [...favorites, item] })
                }
            },
            isFavorite: (id) => {
                return get().favorites.some((f) => f.id === id)
            },
        }),
        {
            name: 'taskflow-favorites',
        }
    )
)
