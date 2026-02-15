import apiClient from '@/api/client'
import { AuthResponse, LoginCredentials, RegisterCredentials } from '@/types/auth'
import { ApiResponse } from '@/types'

export const authService = {
    /**
     * Login user
     */
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>('/auth/sign-in/email', credentials)
        return response.data
    },

    /**
     * Register new user
     */
    async register(credentials: RegisterCredentials): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>('/auth/sign-up/email', credentials)
        return response.data
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
        const response = await apiClient.patch<ApiResponse<AuthResponse['user']>>('/auth/profile', data)
        return response.data.data
    },

    /**
     * Logout
     */
    async logout(): Promise<void> {
        await apiClient.post('/auth/logout')
    },
}
