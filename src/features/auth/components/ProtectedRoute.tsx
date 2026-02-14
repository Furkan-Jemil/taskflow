import { useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { authService } from '../services/authService'

export function ProtectedRoute() {
    const { isAuthenticated, isLoading: isAuthLoading, logout } = useAuth()
    // We can add a local loading state for invalidation check, but let's rely on the background check
    // or we can block rendering until checked. For better UX, let's block sparingly or just redirect on failure.

    useEffect(() => {
        if (isAuthenticated) {
            authService.getProfile().catch((error) => {
                console.error('Session validation failed:', error)
                logout()
            })
        }
    }, [isAuthenticated, logout])

    if (isAuthLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
            </div>
        )
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    return <Outlet />
}
