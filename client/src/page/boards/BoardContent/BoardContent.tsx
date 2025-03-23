import ListColumn from './ListColumns/ListColumn'
import { DndContext, DragEndEvent } from '@dnd-kit/core'

const handleContext = (e: DragEndEvent) => {
  console.log(e)
}
const BoardContent = () => {
  return (
    <DndContext onDragEnd={handleContext}>
      <div className='py-4 pl-4'>
        <ListColumn />
      </div>
    </DndContext>
  )
}

export default BoardContent
