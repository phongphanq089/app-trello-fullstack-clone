import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useCreateFolder } from '@/services/query/gallery'

import { zodResolver } from '@hookform/resolvers/zod'
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query'
import { Columns3, Plus } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { z } from 'zod'

interface AddNewFolderProps {
  refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<any, Error>>
}
const AddNewFolder = ({ refetch }: AddNewFolderProps) => {
  const [open, setOpen] = useState(false)

  const { mutate: createFolder } = useCreateFolder()

  const verifyFolderNameValidation = z.object({
    nameFolder: z.string().min(3, { message: 'Title must be at least 3 characters long' })
  })
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors }
  } = useForm<z.infer<typeof verifyFolderNameValidation>>({
    resolver: zodResolver(verifyFolderNameValidation)
  })

  const onSubmit = (payload: z.infer<typeof verifyFolderNameValidation>) => {
    createFolder(payload, {
      onSuccess: () => {
        reset()
        setOpen(false)
        refetch()
        toast.success('Folder created successfully')
      },
      onError: (error) => {
        console.error('Error creating folder:', error)
      }
    })
  }

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button>
          CREATE FOLDER
          <Plus className='w-5 h-5 mr-2' />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <div className='mb-2 flex flex-col items-center gap-2'>
          <div className='flex size-11 shrink-0 items-center justify-center rounded-full border' aria-hidden='true'>
            <svg
              className='stroke-zinc-800 dark:stroke-zinc-100'
              xmlns='http://www.w3.org/2000/svg'
              width='20'
              height='20'
              viewBox='0 0 32 32'
              aria-hidden='true'
            >
              <circle cx='16' cy='16' r='12' fill='none' strokeWidth='8' />
            </svg>
          </div>
          <DialogHeader>
            <DialogTitle className='sm:text-center'>ADD NEW FOLDER</DialogTitle>
          </DialogHeader>
        </div>

        <form className='space-y-5' onSubmit={handleSubmit(onSubmit)}>
          <div className='*:not-first:mt-2'>
            <div className='relative'>
              <Input
                id='dialog-subscribe'
                className='peer ps-9'
                placeholder='title'
                type='text'
                {...register('nameFolder')}
              />

              <div className='text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50'>
                <Columns3 size={16} aria-hidden='true' />
              </div>
              {errors.nameFolder && <p className='text-red-500 text-sm mt-1'>{errors.nameFolder.message}</p>}
            </div>
          </div>
          <Button type='submit' className='w-full py-6'>
            ADD
            <Plus />
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddNewFolder
