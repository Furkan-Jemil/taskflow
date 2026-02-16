import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from './Button'

interface Props {
    children: ReactNode
    fallback?: ReactNode
}

interface State {
    hasError: boolean
    error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    }

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error }
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo)
    }

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback
            }

            return (
                <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <div className="p-4 rounded-full bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400 mb-4 animate-in zoom-in duration-300">
                        <AlertTriangle size={32} />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                        Something went wrong
                    </h2>
                    <p className="text-muted-foreground max-w-sm mb-6">
                        We encountered an unexpected error. Try refreshing the page or contact support if the problem persists.
                    </p>
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            onClick={() => window.location.reload()}
                        >
                            <RefreshCw size={16} className="mr-2" />
                            Reload Page
                        </Button>
                    </div>
                    {process.env.NODE_ENV === 'development' && this.state.error && (
                        <div className="mt-8 p-4 bg-slate-950 text-slate-300 rounded-lg text-left text-xs font-mono w-full max-w-lg overflow-auto max-h-48 border border-slate-800">
                            {this.state.error.toString()}
                        </div>
                    )}
                </div>
            )
        }

        return this.props.children
    }
}
