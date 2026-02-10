import { Routes, Route, Navigate } from 'react-router-dom'

/**
 * Application route definitions
 * Routes will be expanded in subsequent phases:
 *   Phase 2: /login, /register, protected routes
 *   Phase 3: /workspaces
 *   Phase 4: /workspaces/:id/boards
 *   Phase 5: /boards/:id (board canvas with lists & cards)
 */

function AppRoutes() {
    return (
        <Routes>
            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Auth routes — Phase 2 */}
            <Route
                path="/login"
                element={
                    <div className="flex items-center justify-center min-h-screen bg-background">
                        <div className="text-center space-y-4 animate-fade-in">
                            <h1 className="text-4xl font-bold text-foreground">
                                TaskFlow
                            </h1>
                            <p className="text-muted-foreground">
                                Login page — coming in Phase 2
                            </p>
                        </div>
                    </div>
                }
            />

            {/* Catch‑all 404 */}
            <Route
                path="*"
                element={
                    <div className="flex items-center justify-center min-h-screen bg-background">
                        <div className="text-center space-y-4 animate-fade-in">
                            <h1 className="text-6xl font-bold text-primary">
                                404
                            </h1>
                            <p className="text-xl text-muted-foreground">
                                Page not found
                            </p>
                        </div>
                    </div>
                }
            />
        </Routes>
    )
}

export default AppRoutes
