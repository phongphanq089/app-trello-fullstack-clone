import { Link, MessageCircle, User } from 'lucide-react'

interface PropsListActionCard {
  memberIds: string[]
  comments: string[]
  attachments: string[]
}

const ListActionCard = ({ memberIds, comments, attachments }: PropsListActionCard) => {
  return (
    <div className='flex items-center gap-1 justify-between w-full text-orange-600'>
      <div className='flex items-center gap-2 cursor-pointer'>
        <User />
        {memberIds.length}
      </div>
      <div className='flex items-center gap-2 cursor-pointer'>
        <MessageCircle />
        {comments.length}
      </div>
      <div className='flex items-center gap-2 cursor-pointer'>
        <Link />
        {attachments.length}
      </div>
    </div>
  )
}

export default ListActionCard
