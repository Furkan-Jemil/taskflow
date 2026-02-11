import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Board } from '@/types/entities'
import { UserPlus, Link as LinkIcon, Globe, Lock } from 'lucide-react'
import { useState } from 'react'

interface BoardSharingModalProps {
    board: Board
    isOpen: boolean
    onClose: () => void
}

export function BoardSharingModal({ board, isOpen, onClose }: BoardSharingModalProps) {
    const [email, setEmail] = useState('')
    const [visibility, setVisibility] = useState('private')

    const handleInvite = (e: React.FormEvent) => {
        e.preventDefault()
        if (!email) return
        alert(`Invitation to join "${board.name}" sent to ${email}`)
        setEmail('')
    }

    const copyLink = () => {
        navigator.clipboard.writeText(window.location.href)
        alert('Board link copied to clipboard!')
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Share Board" className="max-w-md">
            <div className="space-y-6">
                {/* Visibility Toggle */}
                <div className="p-3 rounded-lg border bg-muted/30 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {visibility === 'private' ? (
                            <div className="p-2 rounded bg-orange-100 text-orange-600">
                                <Lock size={18} />
                            </div>
                        ) : (
                            <div className="p-2 rounded bg-green-100 text-green-600">
                                <Globe size={18} />
                            </div>
                        )}
                        <div>
                            <div className="text-sm font-bold capitalize">{visibility} Board</div>
                            <div className="text-[10px] text-muted-foreground">
                                {visibility === 'private' ? 'Only invited members can access' : 'Anyone with the link can view'}
                            </div>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-[10px] uppercase font-bold tracking-tight"
                        onClick={() => setVisibility(v => v === 'private' ? 'public' : 'private')}
                    >
                        Change
                    </Button>
                </div>

                {/* Invite Form */}
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Invite by Email</label>
                    <form onSubmit={handleInvite} className="flex gap-2">
                        <Input
                            placeholder="colleague@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="h-9"
                        />
                        <Button type="submit" size="sm">
                            <UserPlus size={16} className="mr-2" />
                            Invite
                        </Button>
                    </form>
                </div>

                {/* Link Section */}
                <div className="pt-4 border-t space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <LinkIcon size={12} />
                        Shareable Link
                    </label>
                    <div className="flex items-center gap-2">
                        <div className="flex-1 h-9 rounded-md border bg-muted/50 px-3 flex items-center text-xs text-muted-foreground truncate">
                            {window.location.href}
                        </div>
                        <Button variant="outline" size="sm" onClick={copyLink}>
                            Copy
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    )
}
