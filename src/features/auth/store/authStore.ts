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
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            // Actions
            setAuth: (data) => {
                localStorage.setItem('auth_token', data.token)
                set({
                    user: data.user,
                    token: data.token,
                    isAuthenticated: true,
                    error: null,
                })
            },

            setUser: (user) => set({ user }),

            logout: () => {
                localStorage.removeItem('auth_token')
                set({
                    user: null,
                    token: null,
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
                token: state.token,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
)
