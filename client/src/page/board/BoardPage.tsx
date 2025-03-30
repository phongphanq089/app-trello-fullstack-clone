import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import BoardContent from './components/BoardContent'

const BoardPage = () => {
  return (
    <ScrollArea className='w-full pb-8'>
      <div className='w-full pl-4'>
        <BoardContent />
      </div>
      <ScrollBar orientation='horizontal' />
    </ScrollArea>
  )
}

export default BoardPage
