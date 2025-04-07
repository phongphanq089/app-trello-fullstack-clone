import { CSS } from '@dnd-kit/utilities'
import { ColumnType } from '../../types.board'
import ColumnBody from './ColumnBody'
import ColumnHeader from './ColumnHeader'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { ACTIVE_DRAG_ITEM_TYPE } from '@/config/setting'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query'
import { useCreateCard } from '@/config/query/board'

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
  const [isAddCardOpen, setIsAddCardOpen] = useState(false)

  const [value, setValue] = useState('')
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }
  console.log(isAddCardOpen)
  const handleAddCard = () => {
    setIsAddCardOpen(true)
  }

  const handleSubmit = () => {
    console.log(value)
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

  return (
    <SortableContext items={column.cardOrderIds} strategy={verticalListSortingStrategy}>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className='p-4 bg-gray-100 w-[400px] rounded-md  relative overflow-hidden cursor-grab'
      >
        <ColumnHeader title={column.title} />
        <ColumnBody cards={column.cards} cardOrderIds={column.cardOrderIds} />
        {isAddCardOpen ? (
          <div className='flex items-center gap-3'>
            <Input type='text' value={value} onChange={handleChange} className='w-full' />

            <Button onClick={handleSubmit}>ADD CARD</Button>
          </div>
        ) : (
          <div
            className='bg-color-1 py-3 px-2 rounded-md absolute w-[90%] left-1/2 -translate-x-1/2 bottom-3 cursor-pointer hover:bg-color-2 transition-colors'
            onClick={handleAddCard}
          >
            add card
          </div>
        )}
      </div>
    </SortableContext>
  )
}

export default Column
