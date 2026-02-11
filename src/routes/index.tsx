import { Routes, Route, Navigate } from 'react-router-dom'
import { LoginForm, RegisterForm, ProtectedRoute } from '@/features/auth'
import { WorkspaceList, WorkspaceDetail } from '@/features/workspaces'
import { BoardCanvas } from '@/features/boards'
import { AppLayout } from '@/components/layout'


/**
 * Application route definitions
 */
function AppRoutes() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/login" element={
                <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 p-4">
                    <LoginForm />
                </div>
            } />
            <Route path="/register" element={
                <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 p-4">
                    <RegisterForm />
                </div>
            } />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
                <Route element={<AppLayout />}>
                    <Route path="/workspaces" element={<WorkspaceList />} />
                    <Route path="/workspaces/:id" element={<WorkspaceDetail />} />
                    <Route path="/boards/:boardId" element={<BoardCanvas />} />
                    {/* Redirect authenticated users from root to workspaces */}
                    <Route path="/" element={<Navigate to="/workspaces" replace />} />
                </Route>
            </Route>

            {/* Default redirect for non-authenticated users */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Catch‑all 404 */}
            <Route path="*" element={
                <div className="flex items-center justify-center min-h-screen bg-background">
                    <div className="text-center space-y-4 animate-fade-in">
                        <h1 className="text-6xl font-bold text-primary">404</h1>
                        <p className="text-xl text-muted-foreground">Page not found</p>
                    </div>
                </div>
            } />
        </Routes>
    )
}

export default AppRoutes
