import { useAuthStore } from '../store/authStore'
import { authService } from '../services/authService'
import { LoginCredentials, RegisterCredentials } from '@/types/auth'
import { useNavigate } from 'react-router-dom'
import { useCallback } from 'react'

export function useAuth() {
    const navigate = useNavigate()
    const {
        user,
        session,
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
                setError(err.apiMessage || err.message || 'Failed to login')
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
                setError(err.apiMessage || err.message || 'Failed to register')
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

    const updateProfile = useCallback(async (data: { name?: string; email?: string }) => {
        setLoading(true)
        setError(null)
        try {
            const updatedUser = await authService.updateProfile(data)
            if (session) {
                setAuth({ user: updatedUser, session })
            }
        } catch (err: any) {
            setError(err.apiMessage || err.message || 'Failed to update profile')
            throw err
        } finally {
            setLoading(false)
        }
    }, [session, setAuth, setError, setLoading])

    return {
        user,
        session,
        isAuthenticated,
        isLoading,
        error,
        login,
        register,
        logout,
        updateProfile,
    }
}
