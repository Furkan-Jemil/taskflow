import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useCreateWorkspace } from '../hooks/useWorkspaces'

const workspaceSchema = z.object({
    name: z.string().min(2, 'Workspace name must be at least 2 characters'),
})

type WorkspaceFormValues = z.infer<typeof workspaceSchema>

interface CreateWorkspaceModalProps {
    isOpen: boolean
    onClose: () => void
}

export function CreateWorkspaceModal({ isOpen, onClose }: CreateWorkspaceModalProps) {
    const { mutate: createWorkspace, isPending } = useCreateWorkspace()

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<WorkspaceFormValues>({
        resolver: zodResolver(workspaceSchema),
        defaultValues: {
            name: '',
        },
    })

    const onSubmit = (data: WorkspaceFormValues) => {
        createWorkspace(data.name, {
            onSuccess: () => {
                reset()
                onClose()
            },
        })
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create New Workspace">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">
                        Workspace Name
                    </label>
                    <Input
                        placeholder="e.g. Acme Marketing, Project X"
                        {...register('name')}
                        error={errors.name?.message}
                    />
                    <p className="text-xs text-muted-foreground">
                        Think of a workspace as a container for your boards and team members.
                    </p>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                    <Button variant="outline" type="button" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" isLoading={isPending}>
                        Create Workspace
                    </Button>
                </div>
            </form>
        </Modal>
    )
}
