import { createAuthClient } from "better-auth/react"

// Simple initialization. 
// BetterAuth handle baseURL and /api/auth pathing internally if it's relative.
export const auth = createAuthClient({
    baseURL: import.meta.env.VITE_API_BASE_URL?.startsWith('http') 
        ? import.meta.env.VITE_API_BASE_URL 
        : window.location.origin,
});

// We destructure exports to ensure robust access in production builds (Vite tree-shaking)
// This avoids "TypeError: z0.useSession is not a function" by making them explicit exports.
export const { useSession, signIn, signOut } = auth;
