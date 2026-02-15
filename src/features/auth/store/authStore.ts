import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { AuthState, AuthResponse } from '@/types/auth'
import { User } from '@/types/entities'

interface AuthStore extends AuthState {
    setAuth: (data: AuthResponse) => void
    setUser: (user: User | null) => void
    logout: () => void
    setError: (error: string | null) => void
    setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            // Initial State
            user: null,
            session: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            // Actions
            setAuth: (data) => {
                set({
                    user: data.user,
                    session: data.session,
                    isAuthenticated: true,
                    error: null,
                })
            },

            setUser: (user) => set({ user }),

            logout: () => {
                set({
                    user: null,
                    session: null,
                    isAuthenticated: false,
                    error: null,
                })
            },

            setError: (error) => set({ error }),
            setLoading: (loading) => set({ isLoading: loading }),
        }),
        {
            name: 'taskflow-auth-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                user: state.user,
                session: state.session,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
)
