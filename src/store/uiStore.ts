import { create } from 'zustand'

interface UIState {
    // Sidebar
    isSidebarOpen: boolean
    toggleSidebar: () => void
    setSidebarOpen: (open: boolean) => void

    // Theme
    theme: 'light' | 'dark'
    toggleTheme: () => void

    // Global loading
    isGlobalLoading: boolean
    setGlobalLoading: (loading: boolean) => void
}

export const useUIStore = create<UIState>((set) => ({
    // Sidebar
    isSidebarOpen: true,
    toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
    setSidebarOpen: (open) => set({ isSidebarOpen: open }),

    // Theme
    theme: 'light',
    toggleTheme: () =>
        set((state) => {
            const newTheme = state.theme === 'light' ? 'dark' : 'light'
            document.documentElement.classList.toggle('dark', newTheme === 'dark')
            return { theme: newTheme }
        }),

    // Global loading
    isGlobalLoading: false,
    setGlobalLoading: (loading) => set({ isGlobalLoading: loading }),
}))
