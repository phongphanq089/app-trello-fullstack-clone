import { useGetListFolder } from '@/services/query/gallery'
import AddNewFolder from './components/AddNewFolder'
import FormUploadFile from './components/FormUploadFile'
import ListFolder from './components/ListFolder'

export default function PageGallery() {
  const { data: listFolder, isLoading, refetch } = useGetListFolder()
  return (
    <div>
      <div className='py-5 flex  justify-between flex-wrap gap-5'>
        <ListFolder listFolder={listFolder} isLoading={isLoading} refetch={refetch} />
        <AddNewFolder refetch={refetch} />
      </div>

      <FormUploadFile />
    </div>
  )
}
