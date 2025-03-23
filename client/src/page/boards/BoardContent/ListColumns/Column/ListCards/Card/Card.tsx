import ListActionCard from '@/page/boards/BoardContent/components/ListActionCard'
import { Cards } from '@/types/Board'

interface PropsCradItem {
  cardItem: Cards
}

export const Card = ({ cardItem }: PropsCradItem) => {
  const { title, cover } = cardItem
  return (
    <div className='p-3 bg-white'>
      {cover ? (
        <div className='w-full h-auto'>
          <img src={cover} alt={title} className='object-cover h-full w-full' />
        </div>
      ) : (
        ''
      )}

      <h3 className='text-md py-3'>{title}</h3>
      {cardItem.memberIds.length > 0 && cardItem.comments.length > 0 && cardItem.attachments.length > 0 && (
        <ListActionCard
          memberIds={cardItem.memberIds}
          comments={cardItem.comments}
          attachments={cardItem.attachments}
        />
      )}
    </div>
  )
}
