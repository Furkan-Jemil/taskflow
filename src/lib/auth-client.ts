import { createAuthClient } from "@better-auth/client"

// The current types seem to think this takes 0 arguments, 
// so we cast to any to pass the config correctly.
const client = (createAuthClient as any)({
    // If VITE_API_BASE_URL is relative (like /api), we use the window origin.
    // BetterAuth client appends /api/auth to the baseURL by default.
    baseURL: import.meta.env.VITE_API_BASE_URL?.startsWith('http') 
        ? import.meta.env.VITE_API_BASE_URL 
        : window.location.origin,
});

export const auth = client;
export const useSession = client.useSession;
export const signIn = client.signIn;
export const signUp = client.signUp;
