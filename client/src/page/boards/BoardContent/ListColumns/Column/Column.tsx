import { Cards } from '@/types/Board'
import HeadingColumn from '../../components/HeadingColumn'
import ListCards from './ListCards/ListCards'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface PropsColumnItem {
  title?: string
  cardList: Cards[]
  col: any
}

const Column = ({ title, cardList, col }: PropsColumnItem) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: col._id,
    data: { ...cardList }
  })

  const style = {
    transform: CSS.Translate.toString(transform),
    transition
  }
  return (
    <div
      className='bg-gray-200 w-[370px]  p-3 rounded-md h-fit'
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <ScrollArea className='h-[70vh] w-full rounded-md border'>
        <HeadingColumn title={title} />
        <ListCards cardList={cardList} />
      </ScrollArea>
    </div>
  )
}

export default Column
