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

    // Toasts
    toasts: Toast[]
    addToast: (toast: Omit<Toast, 'id'>) => void
    removeToast: (id: string) => void
}

export interface Toast {
    id: string
    message: string
    type: 'success' | 'error' | 'info'
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

    // Toasts
    toasts: [],
    addToast: (toast) => {
        const id = Math.random().toString(36).substring(2, 9)
        set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }))
        setTimeout(() => {
            set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }))
        }, 3000)
    },
    removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}))
