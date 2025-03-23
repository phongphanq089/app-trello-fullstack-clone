import { Cards } from '@/types/Board'
import { Card } from './Card/Card'
import ActionAddNewCard from '../../../components/ActionAddNewCard'

interface PorpsListCard {
  cardList: Cards[]
}
const ListCards = ({ cardList }: PorpsListCard) => {
  return (
    <div className='flex flex-col gap-3'>
      {cardList?.map((card, index) => {
        return <Card key={`${card._id}-${index}`} cardItem={card} />
      })}
      <ActionAddNewCard />
    </div>
  )
}

export default ListCards
