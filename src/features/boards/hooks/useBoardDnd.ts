import { useState, useCallback, useEffect } from 'react'
import {
    useSensor,
    useSensors,
    PointerSensor,
    KeyboardSensor,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent,
    closestCorners,
} from '@dnd-kit/core'
import {
    arrayMove,
    sortableKeyboardCoordinates,
} from '@dnd-kit/sortable'
import { Card, List } from '@/types/entities'
import { QueryClient } from '@tanstack/react-query'

interface UseBoardDndProps {
    serverLists?: List[]
    queryClient: QueryClient
    updateList: (args: { id: string; data: Partial<List> }) => void
    updateCard: (args: { id: string; data: Partial<Card> }) => void
}

export function useBoardDnd({
    serverLists,
    queryClient,
    updateList,
    updateCard,
}: UseBoardDndProps) {
    const [lists, setLists] = useState<List[]>([])
    const [activeList, setActiveList] = useState<List | null>(null)
    const [activeCard, setActiveCard] = useState<Card | null>(null)

    // Sync with server data
    useEffect(() => {
        if (serverLists) {
            setLists(serverLists)
        }
    }, [serverLists])

    // Sensors
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    // Helpers
    const findContainer = useCallback((id: string) => {
        if (lists.some((l) => l.id === id)) return id

        const allCardQueries = queryClient.getQueriesData<Card[]>({ queryKey: ['cards'] })
        for (const [queryKey, cards] of allCardQueries) {
            if (cards && cards.some((c) => c.id === id)) {
                return (queryKey[1] as string)
            }
        }
        return null
    }, [lists, queryClient])

    // Handlers
    const onDragStart = useCallback((event: DragStartEvent) => {
        const { active } = event
        const data = active.data.current

        if (data?.type === 'List') {
            setActiveList(data.list)
        } else if (data?.type === 'Card') {
            setActiveCard(data.card)
        }
    }, [])

    const onDragOver = useCallback((event: DragOverEvent) => {
        const { active, over } = event
        if (!over) return

        const activeId = active.id as string
        const overId = over.id as string

        if (activeId === overId) return

        const activeData = active.data.current
        if (activeData?.type !== 'Card') return

        const overData = over.data.current

        const activeContainer = findContainer(activeId)
        const overContainer = findContainer(overId)

        if (!activeContainer || !overContainer || activeContainer === overContainer) return

        // Optimistic update for React Query cache
        queryClient.setQueryData(['cards', activeContainer], (prev: Card[] | undefined) => {
            if (!prev) return []
            const activeCard = prev.find(c => c.id === activeId)
            if (!activeCard) return prev
            return prev.filter(c => c.id !== activeId)
        })

        queryClient.setQueryData(['cards', overContainer], (prev: Card[] | undefined) => {
            const activeCard = activeData.card
            const currentCards = prev || []

            let newIndex
            const isOverACard = overData?.type === 'Card'
            if (isOverACard) {
                newIndex = currentCards.findIndex(c => c.id === overId)
            } else {
                newIndex = currentCards.length
            }

            const updatedCard = { ...activeCard, list_id: overContainer }
            const newCards = [...currentCards]
            newCards.splice(newIndex, 0, updatedCard)

            return newCards
        })
    }, [findContainer, queryClient])

    const onDragEnd = useCallback((event: DragEndEvent) => {
        const { active, over } = event
        setActiveList(null)
        setActiveCard(null)

        if (!over) return

        const activeId = active.id as string
        const overId = over.id as string
        const activeData = active.data.current

        // 1. List Reordering
        if (activeData?.type === 'List') {
            if (activeId !== overId) {
                const oldIndex = lists.findIndex((l) => l.id === activeId)
                const newIndex = lists.findIndex((l) => l.id === overId)
                const newLists = arrayMove(lists, oldIndex, newIndex)
                setLists(newLists)

                // Persistence
                newLists.forEach((list, index) => {
                    if (list.position !== index + 1) {
                        updateList({ id: list.id, data: { position: index + 1 } })
                    }
                })
            }
            return
        }

        // 2. Card Drop Persistence
        if (activeData?.type === 'Card') {
            const activeContainer = findContainer(activeId)
            const overContainer = findContainer(overId)

            if (!activeContainer || !overContainer) return

            const cardsInOver = queryClient.getQueryData<Card[]>(['cards', overContainer]) || []
            const newIndex = cardsInOver.findIndex(c => c.id === activeId)

            updateCard({
                id: activeId,
                data: {
                    list_id: overContainer,
                    position: newIndex + 1
                }
            })
        }
    }, [lists, findContainer, queryClient, updateList, updateCard])

    return {
        lists,
        activeList,
        activeCard,
        sensors,
        onDragStart,
        onDragOver,
        onDragEnd,
        closestCorners,
    }
}
