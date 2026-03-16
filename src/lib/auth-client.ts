import { createAuthClient } from "@better-auth/client"

const config = {
    baseURL: import.meta.env.VITE_API_BASE_URL?.startsWith('http') 
        ? import.meta.env.VITE_API_BASE_URL 
        : window.location.origin,
};

console.log('[AuthClient] Initializing with config:', config);

export const auth = (createAuthClient as any)(config);

if (!auth) {
    console.error('[AuthClient] Failed to initialize: client is null/undefined');
} else {
    console.log('[AuthClient] Initialized successfully. Available methods:', Object.keys(auth));
}
