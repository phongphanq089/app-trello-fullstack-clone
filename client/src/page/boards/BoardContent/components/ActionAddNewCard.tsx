import { FolderPlus, Menu } from 'lucide-react'

const ActionAddNewCard = () => {
  return (
    <div className='flex justify-between items-center w-full cursor-pointer text-orange-500 py-4'>
      <div className='flex items-center gap-2'>
        <FolderPlus />
        Add new card
      </div>
      <Menu />
    </div>
  )
}

export default ActionAddNewCard
