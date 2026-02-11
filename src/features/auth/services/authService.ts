import apiClient from '@/api/client'
import { AuthResponse, LoginCredentials, RegisterCredentials } from '@/types/auth'
import { ApiResponse } from '@/types'

export const authService = {
    /**
     * Login user
     */
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', credentials)
        return response.data.data
    },

    /**
     * Register new user
     */
    async register(credentials: RegisterCredentials): Promise<AuthResponse> {
        const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', credentials)
        return response.data.data
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
        await apiClient.post('/auth/logout')
    },
}
