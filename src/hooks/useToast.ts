import { useUIStore } from '@/stores/uiStore'
import { useCallback } from 'react'

export function useToast() {
    const addToast = useUIStore((state) => state.addToast)
    const removeToast = useUIStore((state) => state.removeToast)

    const toast = useCallback(({ message, type = 'info' }: { message: string, type?: 'success' | 'error' | 'info' }) => {
        addToast({ message, type })
    }, [addToast])

    return {
        toast,
        dismiss: removeToast
    }
}
