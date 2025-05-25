import { ScrollArea } from '@/components/ui/scroll-area'
import { CardType } from '../../types.board'
import Card from '../card/Card'

interface ColumnBodyProps {
  cards: CardType[]
  cardOrderIds: string[]
}
const ColumnBody: React.FC<ColumnBodyProps> = ({ cards, cardOrderIds }) => {
  return (
    <ScrollArea className='h-[60vh] w-full rounded-md'>
      <div className='flex'>
        <div className='space-y-2 h-full w-full'>
          {cardOrderIds.map((cardId) => {
            const card = cards.find((c) => c._id === cardId)
            return card && <Card key={card._id} card={card} />
          })}
        </div>
      </div>
    </ScrollArea>
  )
}

export default ColumnBody
