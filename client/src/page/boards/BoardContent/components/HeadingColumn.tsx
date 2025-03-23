import { cn } from '@/lib/utils'
import { ArrowDown } from 'lucide-react'

interface PropsHeadingColumn {
  title?: string
  className?: string
}
const HeadingColumn = ({ title = 'To Do Column 01', className }: PropsHeadingColumn) => {
  return (
    <div className={cn('flex  items-center justify-between gap-3 mb-5', className)}>
      <h3 className={cn('text-lg font-bold')}>{title}</h3>
      <ArrowDown />
    </div>
  )
}

export default HeadingColumn
