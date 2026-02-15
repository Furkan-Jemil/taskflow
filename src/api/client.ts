import axios from 'axios'

// Create axios instance with base configuration
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
})

// Request interceptor to add auth token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.message || error.message || 'An unexpected error occurred'

        if (error.response?.status === 401) {
            // Token expired or invalid - clear auth and notification
            localStorage.removeItem('auth_token')
            window.dispatchEvent(new Event('auth:unauthorized'))
        }

        // Attach the processed message to the error object
        error.apiMessage = message
        return Promise.reject(error)
    }
)

export default apiClient
