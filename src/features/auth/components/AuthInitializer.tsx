import { useEffect } from 'react'
import { useAuthStore } from '../store/authStore'
import { auth } from '@/lib/auth-client'
import { User } from '@/types/entities'

export function AuthInitializer({ children }: { children: React.ReactNode }) {
    const { setAuth, logout } = useAuthStore()
    
    // Call useSession at the top level, un-conditionally.
    // We cast to any to bypass the 'never' type error which happens 
    // when BetterAuth types don't align with the Vite bundling environment perfectly.
    const { data: session, isPending } = (auth as any).useSession();

    useEffect(() => {
        if (!isPending) {
            if (session?.user) {
                const user: User = {
                    id: session.user.id,
                    email: session.user.email,
                    name: session.user.name || 'User',
                    created_at: session.user.createdAt?.toISOString() || new Date().toISOString(),
                    updated_at: session.user.updatedAt?.toISOString() || new Date().toISOString(),
                }
                const token = 'better-auth-session'
                setAuth({ user, token })
            } else {
                const currentToken = localStorage.getItem('auth_token')
                if (currentToken === 'better-auth-session') {
                    logout()
                }
            }
        }
    }, [session, isPending, setAuth, logout])

    return <>{children}</>
}
