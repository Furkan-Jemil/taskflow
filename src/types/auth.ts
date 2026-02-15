import { User } from './entities'

export interface AuthResponse {
    user: User
    session: {
        id: string
        userId: string
        expiresAt: string
        token?: string
    }
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
    session: AuthResponse['session'] | null
    isAuthenticated: boolean
    isLoading: boolean
    error: string | null
}
