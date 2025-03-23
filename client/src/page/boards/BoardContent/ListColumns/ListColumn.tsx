import { MOC_DATA } from '@/contants/mock-data'
import Column from './Column/Column'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'

const ListColumn = () => {
  return (
    <SortableContext items={MOC_DATA.board.columns.map((c) => c._id)} strategy={horizontalListSortingStrategy}>
      <div className='flex gap-5 w-full'>
        {MOC_DATA.board.columns.map((col, index) => {
          return <Column key={`${col._id}-${index}`} title={col.title} cardList={col.cards} col={col as any} />
        })}
      </div>
    </SortableContext>
  )
}

export default ListColumn
