import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { useUIStore } from '@/store/uiStore'
import { CreateWorkspaceModal } from '@/features/workspaces'

export function AppLayout() {
    const { isCreateWorkspaceModalOpen, setCreateWorkspaceModalOpen } = useUIStore()

    return (
        <div className="relative flex min-h-screen flex-col bg-background">
            <Header />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <main className="flex-1 overflow-y-auto">
                    <div className="h-full">
                        <Outlet />
                    </div>
                </main>
            </div>

            <CreateWorkspaceModal
                isOpen={isCreateWorkspaceModalOpen}
                onClose={() => setCreateWorkspaceModalOpen(false)}
            />
        </div>
    )
}
