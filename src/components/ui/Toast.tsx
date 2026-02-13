import { useUIStore } from '@/stores/uiStore'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ToastContainer() {
    const { toasts, removeToast } = useUIStore()

    if (toasts.length === 0) return null

    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-md w-full pointer-events-none">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={cn(
                        "pointer-events-auto flex items-center justify-between p-4 rounded-xl border shadow-lg animate-in slide-in-from-right-10 fade-in duration-300",
                        toast.type === 'success' && "bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800",
                        toast.type === 'error' && "bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800",
                        toast.type === 'info' && "bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800"
                    )}
                >
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "p-2 rounded-full",
                            toast.type === 'success' && "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400",
                            toast.type === 'error' && "bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400",
                            toast.type === 'info' && "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400"
                        )}>
                            {toast.type === 'success' && <CheckCircle2 size={18} />}
                            {toast.type === 'error' && <AlertCircle size={18} />}
                            {toast.type === 'info' && <Info size={18} />}
                        </div>
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                            {toast.message}
                        </p>
                    </div>
                    <button
                        onClick={() => removeToast(toast.id)}
                        className="p-1 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded-lg transition-colors text-slate-400"
                    >
                        <X size={16} />
                    </button>
                </div>
            ))}
        </div>
    )
}
