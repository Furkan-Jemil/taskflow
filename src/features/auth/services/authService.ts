import apiClient from '@/api/client'
import { AuthResponse, LoginCredentials, RegisterCredentials } from '@/types/auth'
import { ApiResponse } from '@/types'
import { sleep } from '@/lib/utils'

/**
 * Mock data for development
 */
const MOCK_USER = {
    id: '1',
    name: 'Demo User',
    email: 'demo@example.com',
    created_at: new Date().toISOString(),
}

const MOCK_AUTH_RESPONSE: AuthResponse = {
    user: MOCK_USER,
    token: 'mock-jwt-token-xyz-123',
}

export const authService = {
    /**
     * Login user
     */
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        // Simulating API delay
        await sleep(1000)

        // For demo/mock purposes, any login works
        // In a real app, this would be:
        // const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', credentials)
        // return response.data.data

        if (credentials.email === 'error@example.com') {
            throw new Error('Invalid email or password')
        }

        return MOCK_AUTH_RESPONSE
    },

    /**
     * Register new user
     */
    async register(credentials: RegisterCredentials): Promise<AuthResponse> {
        await sleep(1000)

        // Mock registration
        return {
            user: {
                ...MOCK_USER,
                name: credentials.name,
                email: credentials.email,
            },
            token: 'mock-jwt-token-new-user',
        }
    },

    /**
     * Get current user profile
     */
    async getProfile(): Promise<AuthResponse['user']> {
        const response = await apiClient.get<ApiResponse<AuthResponse['user']>>('/auth/me')
        return response.data.data
    },

    /**
     * Logout
     */
    async logout(): Promise<void> {
        // In real app: await apiClient.post('/auth/logout')
        await sleep(500)
    },
}
