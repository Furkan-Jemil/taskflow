import { useState, useCallback, useEffect, useMemo, useRef } from 'react'
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
    
    // Track the last container we moved a card into during a drag operation
    // to avoid redundant updates and infinite loops
    const lastOverContainer = useRef<string | null>(null)
    
    // Sync with server data
    useEffect(() => {
        if (serverLists) {
            setLists(serverLists)
        }
    }, [serverLists])


    // Sensors - properly configured for stability
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // Require dragging a few pixels before activating
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    // Helpers
    const findContainer = useCallback((id: string) => {
        // 1. Check if ID is a list ID
        if (lists.some((l) => l.id === id)) return id

        // 2. Search card in query cache - optimized
        const allCardQueries = queryClient.getQueriesData<Card[]>({ queryKey: ['cards'] })
        for (const [queryKey, cards] of allCardQueries) {
            if (cards && Array.isArray(cards) && cards.some((c) => c.id === id)) {
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
        // If we are over a list directly, use its ID. Otherwise find where the card belongs.
        const overContainer = overData?.type === 'List' ? overId : findContainer(overId)

        if (!activeContainer || !overContainer || activeContainer === overContainer) return

        // SAFETY: Prevent rapid-fire cache updates for the same container move
        if (lastOverContainer.current === overContainer) return
        lastOverContainer.current = overContainer

        // Optimistic update for React Query cache
        queryClient.setQueryData(['cards', activeContainer], (prev: Card[] | undefined) => {
            if (!prev) return []
            const cardToMove = prev.find(c => c.id === activeId)
            if (!cardToMove) return prev
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
            // Ensure we don't accidentally add duplicates
            if (!newCards.some(c => c.id === activeId)) {
                newCards.splice(newIndex, 0, updatedCard)
            }

            return newCards
        })
    }, [findContainer, queryClient])


    const onDragEnd = useCallback((event: DragEndEvent) => {
        const { active, over } = event
        setActiveList(null)
        setActiveCard(null)
        lastOverContainer.current = null // Reset safety guard

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
            const overContainer = (over.data.current?.type === 'List') ? overId : findContainer(overId)

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

    // Memoize the return value to prevent BoardCanvas from re-rendering everything on every cycle
    return useMemo(() => ({
        lists,
        activeList,
        activeCard,
        sensors,
        onDragStart,
        onDragOver,
        onDragEnd,
        closestCorners,
    }), [lists, activeList, activeCard, sensors, onDragStart, onDragOver, onDragEnd])
}
