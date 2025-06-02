import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useDeleteFolderItem } from '@/services/query/gallery'
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import ConfirmDeletedFolder from './ConfirmDeletedFolder'

interface ListFolderProps {
  listFolder: {
    result: Array<{
      _id: string
      nameFolder: string
    }>
  }
  isLoading?: boolean
  refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<any, Error>>
}

const ListFolder = ({ listFolder, isLoading, refetch }: ListFolderProps) => {
  const [open, setOpen] = useState(false)

  const [idfolder, setIdFolder] = useState('')

  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const currentFolderId = searchParams.get('folderId') || ''

  const { mutate: deleteFolder } = useDeleteFolderItem()

  useEffect(() => {
    if (!currentFolderId && listFolder?.result.length > 0) {
      const firstFolder = listFolder.result[0]
      navigate(`?name=${encodeURIComponent(firstFolder.nameFolder)}&folderId=${firstFolder._id}`, { replace: true })
    }
  }, [currentFolderId, listFolder?.result, navigate])

  const handleFolderChange = (folderId: string) => {
    const selectedFolder = listFolder?.result.find((item) => item._id === folderId)
    if (selectedFolder) {
      navigate(`?name=${encodeURIComponent(selectedFolder.nameFolder)}&folderId=${folderId}`)
    }
  }

  const handleOpen = (id: string) => {
    setIdFolder(id)
    setOpen(true)
  }
  const handleRemoveFolder = () => {
    if (idfolder) {
      const isDeletingCurrent = idfolder === currentFolderId

      deleteFolder(idfolder, {
        onSuccess: () => {
          refetch().then((data) => {
            const remainingFolders = data.data?.result || []

            if (isDeletingCurrent && remainingFolders.length > 0) {
              const firstFolder = remainingFolders[0]
              navigate(`?name=${encodeURIComponent(firstFolder.nameFolder)}&folderId=${firstFolder._id}`, {
                replace: true
              })
            }
          })
        }
      })
    }
  }
  if (isLoading) return <div>Loading...</div>
  return (
    <>
      <fieldset className='space-y-4'>
        <legend className='text-foreground text-sm leading-none font-medium'>SELECT FOLDER</legend>
        <RadioGroup
          className='flex flex-wrap gap-2 pt-4'
          defaultValue='1'
          value={currentFolderId || (listFolder.result.length > 0 ? listFolder.result[0]._id : '')}
          onValueChange={handleFolderChange}
        >
          {listFolder.result.map((item: any) => (
            <div className='flex items-center gap-3' key={`${item._id}-${item.nameFolder}`}>
              <div className='border-input  has-data-[state=checked]:border-primary/50 relative flex  items-center gap-4 rounded-md border p-3 shadow-xs outline-none '>
                <div className='flex items-center gap-2'>
                  <RadioGroupItem
                    id={`${item._id}-${item.nameFolder}`}
                    value={item._id}
                    className='after:absolute after:inset-0'
                  />
                  <Label htmlFor={`${item._id}-${item.nameFolder}`}>{item.nameFolder}</Label>
                </div>
                <div
                  className=' bg-red-500 w-5 h-5 flex items-center justify-center rounded-full cursor-pointer'
                  onClick={() => handleOpen(item._id)}
                >
                  <span className='translate-y-[-2px]'>x</span>
                </div>
              </div>
            </div>
          ))}
        </RadioGroup>
      </fieldset>
      <ConfirmDeletedFolder open={open} setOpen={setOpen} handleRemoveFolder={handleRemoveFolder} />
    </>
  )
}

export default ListFolder
