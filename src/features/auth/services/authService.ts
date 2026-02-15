import { AuthResponse, LoginCredentials, RegisterCredentials } from '@/types/auth'
import { mockStorage } from '@/lib/mockStorage'
import { User } from '@/types/entities'

export const authService = {
    /**
     * Login user
     */
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        const users = mockStorage.getUsers()
        const user = users.find((u) => u.email === credentials.email)

        if (!user) {
            throw new Error('Invalid email or password')
        }

        // In mock mode, we don't check password, but we simulate a token
        const token = 'mock_token_' + btoa(user.email)

        return {
            user,
            token,
        }
    },

    /**
     * Register new user
     */
    async register(credentials: RegisterCredentials): Promise<AuthResponse> {
        await new Promise((resolve) => setTimeout(resolve, 500))

        const users = mockStorage.getUsers()
        if (users.some((u) => u.email === credentials.email)) {
            throw new Error('User already exists')
        }

        const newUser: User = {
            id: crypto.randomUUID(),
            email: credentials.email,
            name: credentials.name,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        }

        mockStorage.addUser(newUser)

        return {
            user: newUser,
            token: 'mock_token_' + btoa(newUser.email),
        }
    },

    /**
     * Get current user profile
     */
    async getProfile(): Promise<User> {
        const token = localStorage.getItem('auth_token')
        if (!token) throw new Error('Not authenticated')

        const email = atob(token.replace('mock_token_', ''))
        const users = mockStorage.getUsers()
        const user = users.find((u) => u.email === email)

        if (!user) throw new Error('User not found')
        return user
    },

    /**
     * Update user profile
     */
    async updateProfile(data: { name?: string; email?: string }): Promise<User> {
        const user = await this.getProfile()
        const updatedUser = { ...user, ...data, updated_at: new Date().toISOString() }

        const users = mockStorage.getUsers()
        const index = users.findIndex(u => u.id === user.id)
        if (index !== -1) {
            users[index] = updatedUser
            localStorage.setItem('taskflow_users', JSON.stringify(users))
        }

        return updatedUser
    },

    /**
     * Logout
     */
    async logout(): Promise<void> {
        // Nothing to do on backend in mock mode
        return Promise.resolve()
    },
}
