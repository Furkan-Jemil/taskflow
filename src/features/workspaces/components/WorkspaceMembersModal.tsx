import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Workspace } from '@/types/entities'
import { Mail, Shield, UserPlus } from 'lucide-react'
import { useState } from 'react'

interface WorkspaceMembersModalProps {
    workspace: Workspace
    isOpen: boolean
    onClose: () => void
}

export function WorkspaceMembersModal({ isOpen, onClose }: WorkspaceMembersModalProps) {
    const [email, setEmail] = useState('')

    // Mock members
    const members = [
        { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Owner' },
        { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'Member' },
    ]

    const handleInvite = (e: React.FormEvent) => {
        e.preventDefault()
        if (!email) return
        alert(`Invite sent to ${email} (Mock functionality)`)
        setEmail('')
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Workspace Members" className="max-w-md">
            <div className="space-y-6">
                <form onSubmit={handleInvite} className="flex gap-2">
                    <Input
                        placeholder="Enter email address..."
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-9"
                    />
                    <Button type="submit" size="sm">
                        <UserPlus size={16} className="mr-2" />
                        Invite
                    </Button>
                </form>

                <div className="space-y-4">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Current Members ({members.length})
                    </label>

                    <div className="space-y-3">
                        {members.map((member) => (
                            <div key={member.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                                        {member.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium flex items-center gap-2">
                                            {member.name}
                                            {member.role === 'Owner' && (
                                                <Shield size={12} className="text-primary" />
                                            )}
                                        </div>
                                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Mail size={10} />
                                            {member.email}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-[10px] font-bold uppercase text-muted-foreground bg-muted px-2 py-0.5 rounded">
                                    {member.role}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Modal>
    )
}
