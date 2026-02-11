import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Workspace } from '@/types/entities'
import { useUpdateWorkspace, useDeleteWorkspace } from '../hooks/useWorkspaces'
import { useNavigate } from 'react-router-dom'

const settingsSchema = z.object({
    name: z.string().min(2, 'Workspace name must be at least 2 characters'),
})

type SettingsFormValues = z.infer<typeof settingsSchema>

interface WorkspaceSettingsModalProps {
    workspace: Workspace
    isOpen: boolean
    onClose: () => void
}

export function WorkspaceSettingsModal({ workspace, isOpen, onClose }: WorkspaceSettingsModalProps) {
    const { mutate: updateWorkspace, isPending: isUpdating } = useUpdateWorkspace()
    const { mutate: deleteWorkspace, isPending: isDeleting } = useDeleteWorkspace()
    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SettingsFormValues>({
        resolver: zodResolver(settingsSchema),
        defaultValues: {
            name: workspace.name,
        },
    })

    const onSubmit = (data: SettingsFormValues) => {
        updateWorkspace({ id: workspace.id, data }, {
            onSuccess: () => {
                onClose()
            },
        })
    }

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this workspace? This action cannot be undone.')) {
            deleteWorkspace(workspace.id, {
                onSuccess: () => {
                    onClose()
                    navigate('/workspaces')
                }
            })
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Workspace Settings">
            <div className="space-y-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Workspace Name</label>
                        <Input
                            {...register('name')}
                            error={errors.name?.message}
                        />
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button variant="outline" type="button" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" isLoading={isUpdating}>
                            Save Changes
                        </Button>
                    </div>
                </form>

                <div className="pt-6 border-t">
                    <h3 className="text-sm font-bold text-destructive mb-2">Danger Zone</h3>
                    <p className="text-xs text-muted-foreground mb-4">
                        Deleting a workspace will remove all its boards and tasks permanently.
                    </p>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleDelete}
                        isLoading={isDeleting}
                    >
                        Delete Workspace
                    </Button>
                </div>
            </div>
        </Modal>
    )
}
