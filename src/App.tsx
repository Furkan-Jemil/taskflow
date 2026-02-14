import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import AppRoutes from '@/routes'
import { ToastContainer, ErrorBoundary } from '@/components/ui'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
})

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <ErrorBoundary>
                <BrowserRouter>
                    <AppRoutes />
                </BrowserRouter>
                <ToastContainer />
                <ReactQueryDevtools initialIsOpen={false} />
            </ErrorBoundary>
        </QueryClientProvider>
    )
}

export default App
