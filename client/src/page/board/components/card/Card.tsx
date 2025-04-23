import { useSortable } from '@dnd-kit/sortable'
import { CardType } from '../../types.board'
import { CSS } from '@dnd-kit/utilities'
import { ACTIVE_DRAG_ITEM_TYPE } from '@/contants/setting'

interface CardProps {
  card: CardType
  className?: string
}

const Card: React.FC<CardProps> = ({ card, className }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: card._id,
    data: { type: ACTIVE_DRAG_ITEM_TYPE.CARD, columnId: card.columnId }
  })
  const style = { transform: CSS.Transform.toString(transform), transition }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-gray-50 p-3 rounded shadow-sm cursor-grab active:cursor-grabbing ${className || ''}`}
    >
      {card.cover && <img src={card.cover} alt='cover' className='w-full h-auto object-cover rounded mb-2' />}
      <div className='text-sm'>{card.title}</div>
      {card.description && <div className='text-xs text-gray-600 mt-1'>{card.description}</div>}
    </div>
  )
}

export default Card
