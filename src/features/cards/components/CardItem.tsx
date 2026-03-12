import { memo } from 'react'
import { Card } from '@/types/entities'
import { cn } from '@/lib/utils'
import { Calendar, AlignLeft, AlertCircle } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface CardItemProps {
    card: Card
    onClick: (card: Card) => void
}

export const CardItem = memo(function CardItem({ card, onClick }: CardItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({
        id: card.id,
        data: {
            type: 'Card',
            card,
        },
    })

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
    }

    const priorityColors = {
        low: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
        medium: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
        high: 'bg-red-500/10 text-red-400 border border-red-500/20',
    }

    if (isDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="p-4 bg-primary/5 border-2 border-primary/20 rounded-xl opacity-40 h-[100px] shadow-2xl"
            />
        )
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={() => onClick(card)}
            className="group p-4 bg-card/40 backdrop-blur-sm border border-border rounded-xl shadow-lg hover:shadow-2xl hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-300 cursor-grab active:cursor-grabbing select-none animate-in fade-in slide-in-from-bottom-2"
        >
            {/* Priority Badge */}
            <div className="flex items-center justify-between mb-3">
                <span className={cn(
                    "text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest shadow-sm",
                    priorityColors[card.priority]
                )}>
                    {card.priority}
                </span>
            </div>

            {/* Title */}
            <h4 className="text-[15px] font-semibold leading-tight text-foreground group-hover:text-primary transition-colors mb-3">
                {card.title}
            </h4>

            {/* Icons / Meta */}
            <div className="flex items-center gap-4 text-muted-foreground group-hover:text-foreground transition-colors">
                {card.description && (
                    <div title="Has description">
                        <AlignLeft size={14} className="text-primary/60" />
                    </div>
                )}

                {card.due_date && (
                    <div className="flex items-center gap-1.5 text-[11px] font-medium" title="Due date">
                        <Calendar size={13} className="text-primary/60" />
                        <span>{formatDate(card.due_date)}</span>
                    </div>
                )}

                {card.priority === 'high' && !card.due_date && (
                    <div className="flex items-center gap-1.5 text-red-400/80" title="Urgent">
                        <AlertCircle size={15} />
                    </div>
                )}
            </div>
        </div>
    )
})
