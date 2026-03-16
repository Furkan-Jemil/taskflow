import { useEffect } from 'react'
import { useAuthStore } from '../store/authStore'
import { useSession } from '@/lib/auth-client'
import { User } from '@/types/entities'

export function AuthInitializer({ children }: { children: React.ReactNode }) {
    const { setAuth, logout } = useAuthStore()
    const { data: session, isPending } = (useSession as any)()

    useEffect(() => {
        if (!isPending) {
            if (session?.user) {
                // Bridge BetterAuth user to our Entity User type
                const user: User = {
                    id: session.user.id,
                    email: session.user.email,
                    name: session.user.name || 'User',
                    created_at: session.user.createdAt?.toISOString() || new Date().toISOString(),
                    updated_at: session.user.updatedAt?.toISOString() || new Date().toISOString(),
                }
                
                // In BetterAuth, the token is handled via cookies or internal storage
                // For our mock compatibility, we'll use a virtual token
                const token = 'better-auth-session'
                
                setAuth({ user, token })
            } else {
                // Only logout if we were previously authenticated via BetterAuth
                // This avoids clearing mock sessions if there's no BetterAuth session
                const currentToken = localStorage.getItem('auth_token')
                if (currentToken === 'better-auth-session') {
                    logout()
                }
            }
        }
    }, [session, isPending, setAuth, logout])

    return <>{children}</>
}
