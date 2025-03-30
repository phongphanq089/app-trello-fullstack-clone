import { CSS } from '@dnd-kit/utilities'
import { ColumnType } from '../../types.board'
import ColumnBody from './ColumnBody'
import ColumnHeader from './ColumnHeader'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { ACTIVE_DRAG_ITEM_TYPE } from '@/config/setting'

interface PropsType {
  column: ColumnType
}

const Column: React.FC<PropsType> = ({ column }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: column._id,
    data: { type: ACTIVE_DRAG_ITEM_TYPE.COLUMN }
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  return (
    <SortableContext items={column.cardOrderIds} strategy={verticalListSortingStrategy}>
      <div
        className='p-4 bg-gray-100 w-[400px] rounded-md cursor-grab active:cursor-grabbing '
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
      >
        <ColumnHeader title={column.title} />
        <ColumnBody cards={column.cards} cardOrderIds={column.cardOrderIds} />
      </div>
    </SortableContext>
  )
}

export default Column
