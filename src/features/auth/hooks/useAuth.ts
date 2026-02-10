import { useAuthStore } from '../store/authStore'
import { authService } from '../services/authService'
import { LoginCredentials, RegisterCredentials } from '@/types/auth'
import { useNavigate } from 'react-router-dom'
import { useCallback } from 'react'

export function useAuth() {
    const navigate = useNavigate()
    const {
        user,
        token,
        isAuthenticated,
        isLoading,
        error,
        setAuth,
        logout: clearStore,
        setLoading,
        setError,
    } = useAuthStore()

    const login = useCallback(
        async (credentials: LoginCredentials) => {
            setLoading(true)
            setError(null)
            try {
                const data = await authService.login(credentials)
                setAuth(data)
                navigate('/workspaces')
            } catch (err: any) {
                setError(err.message || 'Failed to login')
                throw err
            } finally {
                setLoading(false)
            }
        },
        [navigate, setAuth, setError, setLoading]
    )

    const register = useCallback(
        async (credentials: RegisterCredentials) => {
            setLoading(true)
            setError(null)
            try {
                const data = await authService.register(credentials)
                setAuth(data)
                navigate('/workspaces')
            } catch (err: any) {
                setError(err.message || 'Failed to register')
                throw err
            } finally {
                setLoading(false)
            }
        },
        [navigate, setAuth, setError, setLoading]
    )

    const logout = useCallback(async () => {
        try {
            await authService.logout()
        } finally {
            clearStore()
            navigate('/login')
        }
    }, [clearStore, navigate])

    return {
        user,
        token,
        isAuthenticated,
        isLoading,
        error,
        login,
        register,
        logout,
    }
}
