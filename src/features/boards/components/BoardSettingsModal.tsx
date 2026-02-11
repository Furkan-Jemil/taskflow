import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Board } from '@/types/entities'
import { useUpdateBoard, useDeleteBoard } from '../hooks/useBoards'
import { useNavigate } from 'react-router-dom'

const boardSettingsSchema = z.object({
    name: z.string().min(2, 'Board name must be at least 2 characters'),
})

type BoardSettingsValues = z.infer<typeof boardSettingsSchema>

interface BoardSettingsModalProps {
    board: Board
    isOpen: boolean
    onClose: () => void
}

export function BoardSettingsModal({ board, isOpen, onClose }: BoardSettingsModalProps) {
    const { mutate: updateBoard, isPending: isUpdating } = useUpdateBoard(board.workspace_id)
    const { mutate: deleteBoard, isPending: isDeleting } = useDeleteBoard(board.workspace_id)
    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<BoardSettingsValues>({
        resolver: zodResolver(boardSettingsSchema),
        defaultValues: {
            name: board.name,
        },
    })

    const onSubmit = (data: BoardSettingsValues) => {
        updateBoard({ id: board.id, data }, {
            onSuccess: () => {
                onClose()
            },
        })
    }

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this board? All lists and cards will be lost.')) {
            deleteBoard(board.id, {
                onSuccess: () => {
                    onClose()
                    navigate(`/workspaces/${board.workspace_id}`)
                }
            })
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Board Settings">
            <div className="space-y-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Board Name</label>
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
                        Deleting this board is permanent and cannot be reversed.
                    </p>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleDelete}
                        isLoading={isDeleting}
                    >
                        Delete Board
                    </Button>
                </div>
            </div>
        </Modal>
    )
}
