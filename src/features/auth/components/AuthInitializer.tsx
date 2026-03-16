import { useEffect } from 'react'
import { useAuthStore } from '../store/authStore'
import { auth } from '@/lib/auth-client'
import { User } from '@/types/entities'

export function AuthInitializer({ children }: { children: React.ReactNode }) {
    const { setAuth, logout } = useAuthStore()
    
    // Safely check for useSession and call it
    let sessionData: any = { data: null, isPending: true };
    
    try {
        if (auth && typeof auth.useSession === 'function') {
            sessionData = auth.useSession();
        } else {
            console.error('[AuthInitializer] auth.useSession is not a function or auth is missing', { 
                authExists: !!auth, 
                useSessionType: auth ? typeof auth.useSession : 'undefined' 
            });
        }
    } catch (err) {
        console.error('[AuthInitializer] Error calling useSession:', err);
    }

    const { data: session, isPending } = sessionData;

    useEffect(() => {
        if (!isPending) {
            console.log('[AuthInitializer] Session check complete. Session:', !!session?.user);
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
