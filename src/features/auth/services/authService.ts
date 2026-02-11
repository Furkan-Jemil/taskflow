import apiClient from '@/api/client'
import { AuthResponse, LoginCredentials, RegisterCredentials } from '@/types/auth'
import { ApiResponse } from '@/types'
import { sleep } from '@/lib/utils'

const MOCK_USER = {
    id: '1',
    name: 'Demo User',
    email: 'demo@example.com',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
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
        try {
            const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', credentials)
            return response.data.data
        } catch (error: any) {
            // Fallback for connection errors or if the server is down
            if (!error.response || error.code === 'ECONNABORTED') {
                console.warn('Backend is unreachable, falling back to mock login.')
                await sleep(800)
                return MOCK_AUTH_RESPONSE
            }
            throw error
        }
    },

    /**
     * Register new user
     */
    async register(credentials: RegisterCredentials): Promise<AuthResponse> {
        try {
            const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', credentials)
            return response.data.data
        } catch (error: any) {
            if (!error.response || error.code === 'ECONNABORTED') {
                console.warn('Backend is unreachable, falling back to mock registration.')
                await sleep(800)
                return {
                    user: { ...MOCK_USER, name: credentials.name, email: credentials.email },
                    token: 'mock-jwt-token-new',
                }
            }
            throw error
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
     * Update user profile
     */
    async updateProfile(data: { name?: string; email?: string }): Promise<AuthResponse['user']> {
        try {
            const response = await apiClient.patch<ApiResponse<AuthResponse['user']>>('/auth/profile', data)
            return response.data.data
        } catch (error: any) {
            if (!error.response || error.code === 'ECONNABORTED') {
                console.warn('Backend is unreachable, updating mock profile.')
                return { ...MOCK_USER, ...data }
            }
            throw error
        }
    },

    /**
     * Logout
     */
    async logout(): Promise<void> {
        try {
            await apiClient.post('/auth/logout')
        } catch (error) {
            console.warn('Logout API failed, continuing with local cleanup.')
        }
    },
}
