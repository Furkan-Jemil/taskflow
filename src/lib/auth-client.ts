import { createAuthClient } from "better-auth/client"

// Simple initialization. 
// BetterAuth handle baseURL and /api/auth pathing internally if it's relative.
export const auth = createAuthClient({
    baseURL: import.meta.env.VITE_API_BASE_URL?.startsWith('http') 
        ? import.meta.env.VITE_API_BASE_URL 
        : window.location.origin,
});

// We keep it as a single export to avoid "Vj is not a function" (un-bundling issues)
// and to ensure consistency in method access.
