import React, { useEffect, useState } from 'react'
import { mapOrder } from '@/lib/utils'
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
import { useGetBoard } from '@/config/query/board'
import LoaderUi from '@/components/shared/LoaderUi'
import { Board, ColumnType } from '../types.board'
import AddColumn from './form/AddColumn'

const BoardContent = () => {
  const id = '67ee406024d26505cc4386a1'
  const { data: getBoard, isLoading, refetch } = useGetBoard(id)

  const [boardData, setBoardData] = useState<Board | undefined>(undefined)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [activeDragItemType, setActiveDragItemType] = useState<string | null>(null)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8
      }
    })
  )

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

    const activeIdString = active.id as string
    const overIdString = over.id as string

    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      handleColumnDrag(activeIdString, overIdString)
    } else if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
    }
    resetDragState()
  }

  const handleColumnDrag = (activeId: string, overId: string) => {
    if (!boardData) return

    const oldIndex = boardData?.columnOrderIds.indexOf(activeId)

    const newIndex = boardData?.columnOrderIds.indexOf(overId)

    const isActiveCloumn = oldIndex !== newIndex && oldIndex !== -1 && newIndex !== -1
    if (isActiveCloumn) {
      const newColumnOrder = arrayMove(boardData.columnOrderIds, oldIndex, newIndex)

      const orderedColumns = mapOrder(boardData.columns, newColumnOrder, '_id')

      setBoardData({
        ...boardData,
        columnOrderIds: newColumnOrder,
        columns: orderedColumns as ColumnType[]
      })
    }
  }

  const resetDragState = () => {
    setActiveId(null)
    setActiveDragItemType(null)
  }

  useEffect(() => {
    setBoardData(getBoard)
  }, [getBoard])

  if (isLoading) return <LoaderUi />
  if (!boardData) return <div className='text-center'>No data</div>

  const orderedColumns = mapOrder(boardData?.columns, boardData?.columnOrderIds, '_id')
  const activeCard = orderedColumns.flatMap((col) => col.cards).find((card) => card._id === activeId)

  return (
    <div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={boardData ? boardData.columnOrderIds : []} strategy={horizontalListSortingStrategy}>
          <div className='flex gap-5 w-full'>
            {boardData?.columnOrderIds?.map((columnId: any, index) => {
              const column = orderedColumns?.find((col) => col._id === columnId)
              const isLast = index === boardData.columnOrderIds.length - 1
              return (
                column && (
                  <React.Fragment key={column._id}>
                    <Column key={column._id} column={column} boardId={id} refetch={refetch} />
                    {isLast && <AddColumn boardId={id} refetch={refetch} />}
                  </React.Fragment>
                )
              )
            })}
          </div>
        </SortableContext>
        <DragOverlay>
          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN ? (
            <div className='opacity-80 bg-slate-400'>
              {orderedColumns?.find((col) => col._id === activeId) && (
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
