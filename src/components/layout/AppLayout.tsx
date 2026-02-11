import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { useUIStore } from '@/store/uiStore'
import { CreateWorkspaceModal } from '@/features/workspaces'

export function AppLayout() {
    const { isCreateWorkspaceModalOpen, setCreateWorkspaceModalOpen } = useUIStore()

    return (
        <div className="relative flex min-h-screen flex-col bg-[#0f172a] text-slate-50 overflow-hidden">
            {/* Background Blobs for consistency */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

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
