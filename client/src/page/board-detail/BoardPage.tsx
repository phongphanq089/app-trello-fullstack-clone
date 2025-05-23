import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import BoardContent from './components/BoardContent'

const BoardPage = () => {
  return (
    <ScrollArea className='w-full pb-8 '>
      <div className='w-full pr-[200px]'>
        <BoardContent />
      </div>
      <ScrollBar orientation='horizontal' />
    </ScrollArea>
  )
}

export default BoardPage
