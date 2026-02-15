import { User } from './entities'

export interface AuthResponse {
    user: User
    token: string
}

export interface LoginCredentials {
    email: string
    password?: string
}

export interface RegisterCredentials extends LoginCredentials {
    name: string
}

export interface AuthState {
    user: User | null
    token: string | null
    isAuthenticated: boolean
    isLoading: boolean
    error: string | null
}
