import { Card } from '@/types/entities'
import { cn } from '@/lib/utils'
import { Calendar, AlignLeft, AlertCircle } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface CardItemProps {
    card: Card
    onClick: (card: Card) => void
}

export function CardItem({ card, onClick }: CardItemProps) {
    const priorityColors = {
        low: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
        high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    }

    return (
        <div
            onClick={() => onClick(card)}
            className="group p-3 bg-card border rounded-lg shadow-sm hover:shadow-md hover:border-primary/50 transition-all cursor-pointer select-none active:scale-[0.98] animate-fade-in"
        >
            {/* Priority Badge */}
            <div className="flex items-center justify-between mb-2">
                <span className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider",
                    priorityColors[card.priority]
                )}>
                    {card.priority}
                </span>
            </div>

            {/* Title */}
            <h4 className="text-sm font-medium leading-snug group-hover:text-primary transition-colors mb-2">
                {card.title}
            </h4>

            {/* Icons / Meta */}
            <div className="flex items-center gap-3 text-muted-foreground">
                {card.description && (
                    <div title="Has description">
                        <AlignLeft size={14} />
                    </div>
                )}

                {card.due_date && (
                    <div className="flex items-center gap-1 text-[11px]" title="Due date">
                        <Calendar size={12} />
                        <span>{formatDate(card.due_date)}</span>
                    </div>
                )}

                {card.priority === 'high' && !card.due_date && (
                    <div className="flex items-center gap-1 text-red-500/80" title="Urgent">
                        <AlertCircle size={14} />
                    </div>
                )}
            </div>
        </div>
    )
}
