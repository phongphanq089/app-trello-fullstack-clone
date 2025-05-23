import { CSS } from '@dnd-kit/utilities'
import { ColumnType } from '../../types.board'
import ColumnBody from './ColumnBody'
import ColumnHeader from './ColumnHeader'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query'
import { ACTIVE_DRAG_ITEM_TYPE } from '@/contants/setting'
import { useCreateCard, useRemoveColumn } from '@/services/query/board'
import { Card } from '@/components/ui/card'
import ConfirmDeleted from '../ConfirmDeleted'
import { Plus, SendIcon, Trash } from 'lucide-react'

interface PropsType {
  column: ColumnType

  boardId?: string
  refetch?: (options?: RefetchOptions) => Promise<QueryObserverResult<any, Error>>
}

const Column: React.FC<PropsType> = ({ column, boardId, refetch }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: column._id,
    data: { type: ACTIVE_DRAG_ITEM_TYPE.COLUMN }
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  const { mutate } = useCreateCard()

  const { mutate: removeColunm } = useRemoveColumn()
  const [isAddCardOpen, setIsAddCardOpen] = useState(false)

  const [open, setOpen] = useState(false)

  const [value, setValue] = useState('')
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }

  const handleAddCard = () => {
    setIsAddCardOpen(true)
  }

  const handleSubmit = () => {
    mutate(
      { title: value, columnId: column._id, boardId: boardId as string },
      {
        onSuccess: () => {
          refetch && refetch()
          setValue('')
          setIsAddCardOpen(false)
        },
        onError: (error) => {
          console.log(error)
        }
      }
    )
  }

  const handleRemoveColumn = () => {
    removeColunm(column._id, {
      onSuccess: () => {
        refetch && refetch()
        setOpen(false)
      },
      onError: (error) => {
        console.log(error)
      }
    })
  }

  return (
    <>
      <SortableContext items={column.cardOrderIds} strategy={verticalListSortingStrategy}>
        <Card
          ref={setNodeRef}
          style={style}
          {...attributes}
          {...listeners}
          className='p-4 w-[350px] rounded-md  relative overflow-hidden cursor-grab'
        >
          <div className='flex items-center relative justify-between mb-4 border-b pb-5'>
            <ColumnHeader title={column.title} />
            <Trash className='cursor-pointer' onClick={() => setOpen(true)} />
          </div>

          <ColumnBody cards={column.cards} cardOrderIds={column.cardOrderIds} />
          {isAddCardOpen ? (
            <div className='w-full absolute left-1/2 -translate-x-1/2 bottom-3 px-3 '>
              <div className='relative'>
                <Input className='pe-9' placeholder='Add card...' type='text' value={value} onChange={handleChange} />
                <button
                  className='text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50'
                  aria-label='Subscribe'
                  onClick={handleSubmit}
                >
                  <Plus size={24} aria-hidden='true' />
                </button>
              </div>
            </div>
          ) : (
            <div className='w-full absolute left-1/2 -translate-x-1/2 bottom-3 px-3'>
              <Button
                className=' py-6 px-2 w-full rounded-md  cursor-pointer  transition-colors uppercase'
                onClick={handleAddCard}
              >
                add card
              </Button>
            </div>
          )}
        </Card>
      </SortableContext>
      <ConfirmDeleted open={open} setOpen={setOpen} handleRemoveColumn={handleRemoveColumn} />
    </>
  )
}

export default Column
