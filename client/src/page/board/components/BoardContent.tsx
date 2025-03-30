import { useState } from 'react'

import { mapOrder } from '@/lib/utils'
import { MOC_DATA } from '@/contants/mock-data'
import Column from './column/Column'
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import { arrayMove, horizontalListSortingStrategy, SortableContext } from '@dnd-kit/sortable'
import { ACTIVE_DRAG_ITEM_TYPE } from '@/config/setting'
import Card from './card/Card'

const BoardContent = () => {
  const [boardData, setBoardData] = useState(MOC_DATA.board)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [activeDragItemType, setActiveDragItemType] = useState<string | null>(null)
  const sensors = useSensors(useSensor(PointerSensor))

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    setActiveId(active.id as string)
    setActiveDragItemType(active.data.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) {
      setActiveId(null)
      setActiveDragItemType(null)
      return
    }

    const activeId = active.id as string
    const overId = over.id as string

    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      const oldIndex = boardData.columnOrderIds.indexOf(activeId)
      const newIndex = boardData.columnOrderIds.indexOf(overId)

      if (oldIndex !== newIndex) {
        const newColumnOrder = arrayMove(boardData.columnOrderIds, oldIndex, newIndex)
        const orderedColumns = mapOrder(boardData.columns, newColumnOrder, '_id')
        setBoardData({
          ...boardData,
          columnOrderIds: newColumnOrder,
          columns: orderedColumns as any
        })
      }
    } else if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      const activeColumn = boardData.columns.find((col) => col.cards.some((card) => card._id === activeId))
      const overColumn = boardData.columns.find(
        (col) => col.cards.some((card) => card._id === overId) || col._id === overId
      )

      if (!activeColumn || !overColumn) return

      const activeCard = activeColumn.cards.find((card) => card._id === activeId)
      if (!activeCard) return

      // Kéo thả trong cùng column
      if (activeColumn._id === overColumn._id) {
        const oldIndex = activeColumn.cardOrderIds.indexOf(activeId)
        const newIndex = activeColumn.cardOrderIds.indexOf(overId)

        if (oldIndex !== newIndex) {
          const newCardOrder = arrayMove(activeColumn.cardOrderIds, oldIndex, newIndex)
          const orderedCards = mapOrder(activeColumn.cards as any, newCardOrder, '_id')
          const newColumns = boardData.columns.map((col) =>
            col._id === activeColumn._id ? { ...col, cardOrderIds: newCardOrder, cards: orderedCards } : col
          )
          setBoardData({ ...boardData, columns: newColumns as any })
        }
      }
      // Kéo thả giữa các column
      else {
        const newColumns = boardData.columns.map((col) => {
          if (col._id === activeColumn._id) {
            return {
              ...col,
              cardOrderIds: col.cardOrderIds.filter((id) => id !== activeId),
              cards: col.cards.filter((card) => card._id !== activeId)
            }
          }
          if (col._id === overColumn._id) {
            const newCard = { ...activeCard, columnId: overColumn._id }
            const overIndex = overId === overColumn._id ? 0 : col.cardOrderIds.indexOf(overId)
            const newCardOrder = [
              ...col.cardOrderIds.slice(0, overIndex),
              activeId,
              ...col.cardOrderIds.slice(overIndex)
            ]
            const orderedCards = mapOrder([...col.cards, newCard] as any, newCardOrder, '_id')
            return {
              ...col,
              cardOrderIds: newCardOrder,
              cards: orderedCards
            }
          }
          return col
        })
        setBoardData({ ...boardData, columns: newColumns as any })
      }
    }

    setActiveId(null)
    setActiveDragItemType(null)
  }
  const orderedColumns = mapOrder(boardData.columns, boardData.columnOrderIds, '_id')
  const activeCard = orderedColumns.flatMap((col) => col.cards).find((card) => card._id === activeId)

  return (
    <div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={boardData.columnOrderIds} strategy={horizontalListSortingStrategy}>
          <div className='flex gap-5 w-full'>
            {boardData.columnOrderIds.map((columnId) => {
              const column = orderedColumns.find((col) => col._id === columnId)

              return column && <Column key={column._id} column={column} />
            })}
          </div>
        </SortableContext>
        <DragOverlay>
          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN ? (
            <div className='opacity-80 bg-slate-400'>
              {orderedColumns.find((col) => col._id === activeId) && (
                <Column column={orderedColumns.find((col) => col._id === activeId)!} />
              )}
            </div>
          ) : activeCard ? (
            <Card card={activeCard} className='opacity-80 rotate-2 bg-slate-400' />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}

export default BoardContent
