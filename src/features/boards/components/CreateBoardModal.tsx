import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useCreateBoard } from '../hooks/useBoards'

const boardSchema = z.object({
    name: z.string().min(2, 'Board name must be at least 2 characters'),
})

type BoardFormValues = z.infer<typeof boardSchema>

interface CreateBoardModalProps {
    workspaceId: string
    isOpen: boolean
    onClose: () => void
}

export function CreateBoardModal({ workspaceId, isOpen, onClose }: CreateBoardModalProps) {
    const { mutate: createBoard, isPending } = useCreateBoard(workspaceId)

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<BoardFormValues>({
        resolver: zodResolver(boardSchema),
        defaultValues: {
            name: '',
        },
    })

    const onSubmit = (data: BoardFormValues) => {
        createBoard(data.name, {
            onSuccess: () => {
                reset()
                onClose()
            },
        })
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create New Board">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">
                        Board Name
                    </label>
                    <Input
                        placeholder="e.g. Q1 Marketing, Inventory App"
                        {...register('name')}
                        error={errors.name?.message}
                    />
                    <p className="text-xs text-muted-foreground">
                        Boards are where you organize your tasks into lists and cards.
                    </p>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                    <Button variant="outline" type="button" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" isLoading={isPending}>
                        Create Board
                    </Button>
                </div>
            </form>
        </Modal>
    )
}
