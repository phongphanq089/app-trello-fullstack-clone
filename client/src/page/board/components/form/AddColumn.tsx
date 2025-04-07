import {
  FloatingPanelBody,
  FloatingPanelCloseButton,
  FloatingPanelContent,
  FloatingPanelFooter,
  FloatingPanelForm,
  FloatingPanelRoot,
  FloatingPanelSubmitButton,
  FloatingPanelTextarea,
  FloatingPanelTrigger
} from '@/components/ui/FloatingPanel'
import { useCreateBoard } from '@/config/query/board'
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query'
import { PackagePlus } from 'lucide-react'
import toast from 'react-hot-toast'

const AddColumn = ({
  boardId,
  refetch
}: {
  boardId: string
  refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<any, Error>>
}) => {
  const { mutate } = useCreateBoard()
  const handleSubmit = (note: string) => {
    console.log('Submitted note:', note)

    mutate(
      { title: note, boardId: boardId },
      {
        onSuccess: () => {
          refetch()
          toast.success('Column created successfully')
        },
        onError: (error) => {
          toast.error(`Error creating column, ${error}`)
        }
      }
    )
  }

  return (
    <FloatingPanelRoot>
      <FloatingPanelTrigger
        title='Add Note'
        className='flex items-center space-x-2 px-4 py-2 bg-white text-primary-foreground rounded-md  transition-colors text-black w-[200px]'
      >
        <div className='flex items-center space-x-2 justify-between w-full'>
          <span>Add Column</span>
          <PackagePlus />
        </div>
      </FloatingPanelTrigger>
      <FloatingPanelContent className='w-80'>
        <FloatingPanelForm onSubmit={handleSubmit}>
          <FloatingPanelBody>
            <h3 className='text-black'>Title</h3>
            <FloatingPanelTextarea id='note-input' className='min-h-[50px]' />
          </FloatingPanelBody>
          <FloatingPanelFooter>
            <FloatingPanelCloseButton />
            <FloatingPanelSubmitButton />
          </FloatingPanelFooter>
        </FloatingPanelForm>
      </FloatingPanelContent>
    </FloatingPanelRoot>
  )
}

export default AddColumn
