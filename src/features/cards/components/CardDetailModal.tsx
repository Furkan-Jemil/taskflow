import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/types/entities'
import { useUpdateCard, useDeleteCard } from '../hooks/useCards'
import { Calendar, Tag, AlignLeft, Info } from 'lucide-react'

const cardDetailSchema = z.object({
    title: z.string().min(2, 'Title must be at least 2 characters'),
    description: z.string().optional(),
    priority: z.enum(['low', 'medium', 'high']),
})

type CardDetailValues = z.infer<typeof cardDetailSchema>

interface CardDetailModalProps {
    card: Card | null
    isOpen: boolean
    onClose: () => void
}

export function CardDetailModal({ card, isOpen, onClose }: CardDetailModalProps) {
    const listId = card?.list_id || ''
    const { mutate: updateCard, isPending } = useUpdateCard(listId)
    const { mutate: deleteCard } = useDeleteCard(listId)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CardDetailValues>({
        resolver: zodResolver(cardDetailSchema),
        values: card ? {
            title: card.title,
            description: card.description || '',
            priority: card.priority,
        } : undefined,
    })

    const onSubmit = (data: CardDetailValues) => {
        if (!card) return
        updateCard({ id: card.id, data }, {
            onSuccess: () => {
                onClose()
            },
        })
    }

    const handleDeleteCard = () => {
        if (!card) return
        if (window.confirm('Are you sure you want to delete this card?')) {
            deleteCard(card.id, {
                onSuccess: () => onClose()
            })
        }
    }

    if (!card) return null

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Card Details" className="max-w-2xl">
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="md:col-span-2 space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold flex items-center gap-2">
                            <Info size={16} className="text-muted-foreground" />
                            Title
                        </label>
                        <Input
                            {...register('title')}
                            error={errors.title?.message}
                            className="text-lg font-bold bg-transparent border-none focus-visible:ring-1 px-0"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold flex items-center gap-2">
                            <AlignLeft size={16} className="text-muted-foreground" />
                            Description
                        </label>
                        <textarea
                            {...register('description')}
                            placeholder="Add a more detailed description..."
                            className="w-full min-h-[150px] p-3 rounded-lg bg-muted/50 border-none focus:ring-1 focus:ring-primary outline-none text-sm resize-none"
                        />
                    </div>
                </div>

                {/* Sidebar / Actions */}
                <div className="space-y-6">
                    <div className="space-y-3">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Properties</label>

                        <div className="space-y-2">
                            <label className="text-sm flex items-center gap-2 text-muted-foreground">
                                <Tag size={14} />
                                Priority
                            </label>
                            <select
                                {...register('priority')}
                                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-ring"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm flex items-center gap-2 text-muted-foreground">
                                <Calendar size={14} />
                                Due Date
                            </label>
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full justify-start font-normal"
                                type="button"
                                onClick={() => alert('Calendar picker coming soon!')}
                            >
                                <span>{card.due_date ? new Date(card.due_date).toLocaleDateString() : 'No date set'}</span>
                            </Button>
                        </div>
                    </div>

                    <div className="pt-6 border-t space-y-3">
                        <Button type="submit" className="w-full" isLoading={isPending}>
                            Save Changes
                        </Button>
                        <Button
                            variant="ghost"
                            className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10"
                            type="button"
                            onClick={handleDeleteCard}
                        >
                            Delete Card
                        </Button>
                    </div>
                </div>
            </form>
        </Modal>
    )
}
