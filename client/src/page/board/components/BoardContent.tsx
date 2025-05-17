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

import Card from './card/Card'

import LoaderUi from '@/components/shared/LoaderUi'
import { Board, CardType, ColumnType } from '../types.board'
import AddColumn from './form/AddColumn'

import { useGetBoard, useMoveCardDifferentColumn, useUpdateBoard, useUpdateColumn } from '@/services/query/board'
import { ACTIVE_DRAG_ITEM_TYPE } from '@/contants/setting'
import { toast } from 'react-toastify'

const BoardContent = () => {
  const id = '681f387fdc886ca3acecb0f2'
  const { data: getBoard, isLoading, refetch } = useGetBoard(id)

  // const [] = useState()

  const { mutate } = useUpdateBoard()

  const { mutate: updateColumn } = useUpdateColumn()

  const { mutate: moveCardDifferentColumn } = useMoveCardDifferentColumn()

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
      handleCardDrag(activeIdString, overIdString)
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

      const payload = {
        title: 'This is a sample project 1',
        description: 'This is a sample project board 1',
        columnOrderIds: newColumnOrder
      }
      mutate(payload, {
        onSuccess: () => {
          refetch()
        },
        onError: (error) => {
          toast.error(`Error creating column, ${error}`)
        }
      })

      const orderedColumns = mapOrder(boardData.columns, newColumnOrder, '_id')

      setBoardData({
        ...boardData,
        columnOrderIds: newColumnOrder,
        columns: orderedColumns as ColumnType[]
      })
    }
  }

  const handleCardDrag = (activeId: string, overId: string) => {
    if (!boardData) return

    // ==== kiểm tra card mình đang kéo có phải thuộc col mình đang kéo hay ko
    const activeColumn = boardData.columns.find((col) => col.cards.some((card) => card._id === activeId))

    const overColumn = boardData.columns.find(
      (col) => col.cards.some((card) => card._id === overId) || col._id === overId
    )

    if (!activeColumn || !overColumn) return

    // tìm card hiện tại đang được kéo
    const activeCard = activeColumn.cards.find((card) => card._id === activeId)

    if (!activeCard) return

    if (activeColumn._id === overColumn._id) {
      handleSameColumnDrag(activeColumn, activeId, overId)
    } else {
      handleDifferentColumnDrag(activeColumn, overColumn, activeCard, activeId, overId)
    }
  }

  const handleSameColumnDrag = (column: ColumnType, activeId: string, overId: string) => {
    const oldIndex = column.cardOrderIds.indexOf(activeId)
    const newIndex = column.cardOrderIds.indexOf(overId)

    if (oldIndex !== newIndex && oldIndex !== -1 && newIndex !== -1) {
      const newCardOrder = arrayMove(column.cardOrderIds, oldIndex, newIndex)
      const orderedCards = mapOrder(column.cards as any, newCardOrder, '_id')

      // console.log(column, 'column')
      const payload = {
        id: column._id,
        cardOrderIds: newCardOrder
      }

      updateColumn(payload, {
        onSuccess: () => {
          refetch()
        },
        onError: (error) => {
          toast.error(`Error creating column, ${error}`)
        }
      })

      updateBoardData(column._id, newCardOrder, orderedCards as any)
    }
  }
  const handleDifferentColumnDrag = (
    activeColumn: ColumnType,
    overColumn: ColumnType,
    activeCard: CardType,
    activeId: string,
    overId: string
  ) => {
    if (!boardData) return

    // 👉 Lấy dữ liệu chuẩn trước khi mutate
    const currentCardId = activeId
    const prevColumnId = activeColumn._id
    const nextColumnId = overColumn._id
    const prevCardOrderIds = activeColumn.cardOrderIds.filter((id) => id !== activeId)

    const overIndex = overId === overColumn._id ? 0 : overColumn.cardOrderIds.indexOf(overId)

    const nextCardOrderIds = [
      ...overColumn.cardOrderIds.slice(0, overIndex),
      activeId,
      ...overColumn.cardOrderIds.slice(overIndex)
    ]

    const payload = {
      currentCardId,
      prevColumnId,
      prevCardOrderIds,
      nextColumnId,
      nextCardOrderIds
    }

    moveCardDifferentColumn(payload, {
      onSuccess: () => {
        refetch()
      },
      onError: (error) => {
        toast.error(`Error creating column, ${error}`)
      }
    })

    const newColumns = boardData.columns.map((col) => {
      if (col._id === prevColumnId) {
        return {
          ...col,
          cardOrderIds: prevCardOrderIds,
          cards: col.cards.filter((card) => card._id !== activeId)
        }
      }
      if (col._id === nextColumnId) {
        const newCard = { ...activeCard, columnId: nextColumnId }
        const orderedCards = mapOrder([...(col.cards as any), newCard], nextCardOrderIds, '_id')

        return {
          ...col,
          cardOrderIds: nextCardOrderIds,
          cards: orderedCards
        }
      }

      return col
    })

    setBoardData({ ...boardData, columns: newColumns as any })
  }

  const updateBoardData = (columnId: string, newCardOrder: string[], orderedCards: CardType[]) => {
    if (!boardData) return
    const newColumns = boardData.columns.map((col) =>
      col._id === columnId ? { ...col, cardOrderIds: newCardOrder, cards: orderedCards } : col
    )

    setBoardData({ ...boardData, columns: newColumns })
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
