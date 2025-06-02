import {
  AlertCircleIcon,
  Check,
  Edit,
  FileArchiveIcon,
  FileIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  HeadphonesIcon,
  ImageIcon,
  ImageUp,
  Trash2,
  Trash2Icon,
  UploadIcon,
  VideoIcon,
  XIcon
} from 'lucide-react'

import { formatBytes, useFileUpload } from '@/hooks/use-file-upload'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import http from '@/services/http'
import { useSearchParams } from 'react-router-dom'
import { useDeleteGalleryMutiple, useDeleteImageItem, useGetListGallery } from '@/services/query/gallery'
import { toast } from 'react-toastify'
import { phoneIcon } from '@/assets'
import { cn } from '@/lib/utils'
import Masonry from 'react-masonry-css'

// Create some dummy initial files

const getFileIcon = (file: { file: File | { type: string; name: string } }) => {
  const fileType = file.file instanceof File ? file.file.type : file.file.type
  const fileName = file.file instanceof File ? file.file.name : file.file.name

  const iconMap = {
    pdf: {
      icon: FileTextIcon,
      conditions: (type: string, name: string) =>
        type.includes('pdf') ||
        name.endsWith('.pdf') ||
        type.includes('word') ||
        name.endsWith('.doc') ||
        name.endsWith('.docx')
    },
    archive: {
      icon: FileArchiveIcon,
      conditions: (type: string, name: string) =>
        type.includes('zip') || type.includes('archive') || name.endsWith('.zip') || name.endsWith('.rar')
    },
    excel: {
      icon: FileSpreadsheetIcon,
      conditions: (type: string, name: string) =>
        type.includes('excel') || name.endsWith('.xls') || name.endsWith('.xlsx')
    },
    video: {
      icon: VideoIcon,
      conditions: (type: string) => type.includes('video/')
    },
    audio: {
      icon: HeadphonesIcon,
      conditions: (type: string) => type.includes('audio/')
    },
    image: {
      icon: ImageIcon,
      conditions: (type: string) => type.startsWith('image/')
    }
  }

  for (const { icon: Icon, conditions } of Object.values(iconMap)) {
    if (conditions(fileType, fileName)) {
      return <Icon className='size-5 opacity-60' />
    }
  }

  return <FileIcon className='size-5 opacity-60' />
}

const getFilePreview = (file: { file: File | { type: string; name: string; url?: string } }) => {
  const fileType = file.file instanceof File ? file.file.type : file.file.type
  const fileName = file.file instanceof File ? file.file.name : file.file.name

  const renderImage = (src: string) => (
    <img src={src} alt={fileName} className='size-full rounded-t-[inherit] object-cover' />
  )

  return (
    <div className='bg-accent flex aspect-square items-center justify-center overflow-hidden rounded-t-[inherit]'>
      {fileType.startsWith('image/') ? (
        file.file instanceof File ? (
          (() => {
            const previewUrl = URL.createObjectURL(file.file)
            return renderImage(previewUrl)
          })()
        ) : file.file.url ? (
          renderImage(file.file.url)
        ) : (
          <ImageIcon className='size-5 opacity-60' />
        )
      ) : (
        getFileIcon(file)
      )}
    </div>
  )
}

const FormUploadFile = () => {
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})

  const TYPE_GALLERY = {
    IMAGE: 'images',
    AUDIOS: 'audios',
    VIDEOS: 'videos'
  }

  const [selectedImages, setSelectedImages] = useState<string[]>([])

  const [isSelectMode, setIsSelectMode] = useState(false)

  useEffect(() => {
    if (!isSelectMode) {
      setSelectedImages([])
    }
  }, [isSelectMode])

  const [searchParams, setSearchParams] = useSearchParams()

  const folderId = searchParams.get('folderId') || ''

  const [paramFolderId, setParamFolderId] = useState('')

  const getFolder = searchParams.get('name') || ''

  const pageParam = Number(searchParams.get('page')) || 1
  const limitParam = Number(searchParams.get('itemsPerPage')) || 12

  const updateParams = (params: Record<string, any>) => {
    const newParams = new URLSearchParams(searchParams.toString())
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') {
        newParams.delete(key)
      } else {
        newParams.set(key, String(value))
      }
    })

    setSearchParams(newParams)
  }

  const { data, refetch } = useGetListGallery(paramFolderId || '', pageParam, limitParam)

  useEffect(() => {
    refetch()
  }, [pageParam])

  const totalGallery = data?.result.total || 0
  const totalPages = Math.ceil(totalGallery / limitParam)

  const { mutate: deleteImage } = useDeleteImageItem()

  const { mutate: deleteMutipleGallery } = useDeleteGalleryMutiple()

  useEffect(() => {
    setParamFolderId(folderId)
  }, [folderId])

  useEffect(() => {
    if (paramFolderId) {
      refetch()
    }
  }, [paramFolderId])

  const maxSizeMB = 20
  const maxSize = maxSizeMB * 1024 * 1024
  const maxFiles = 20

  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      clearFiles,
      getInputProps
    }
  ] = useFileUpload({
    multiple: true,
    maxFiles,
    maxSize
  })

  const handleUpload = async () => {
    if (!files.length) return

    const folder = {
      getFolder: getFolder,
      folderId: folderId
    }
    const uploadPromises = files.map((file) => {
      const formData = new FormData()
      formData.append('gallery', file.file as any)

      formData.append('folder', JSON.stringify(folder))
      return http
        .post('/media/gallery', formData, {
          onUploadProgress: (progressEvent) => {
            const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1))
            setUploadProgress((prev) => ({ ...prev, [file.file.name]: percent }))
          }
        })
        .then(() => {
          removeFile(file.id)
        })
        .catch(() => {
          console.error(`Upload failed for ${file.file.name}`)
        })
    })

    await Promise.all(uploadPromises)
    refetch()
  }

  const handleDeleteImage = (id: string) => {
    deleteImage(id, {
      onSuccess: () => {
        refetch()
      },
      onError: () => {
        toast.error('Remove Image error')
      }
    })
  }

  const handleDeleteMutipleGallery = () => {
    const payload = {
      galleryIds: selectedImages
    }
    deleteMutipleGallery(payload, {
      onSuccess: () => {
        refetch()
      }
    })
  }

  const handleRemoveAll = async () => {
    if (files.length > 0) {
      clearFiles()
    }

    if (data && data?.result.items.length > 0) {
      const ids = data?.result.items.map((item: any) => item._id)

      const payload = {
        galleryIds: ids
      }

      deleteMutipleGallery(payload, {
        onSuccess: () => {
          refetch()
        }
      })
    }
  }
  const breakpointColumnsObj = {
    default: 3,
    1024: 2,
    640: 1
  }
  return (
    <div className='flex flex-col gap-2'>
      {/* Drop area */}

      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        data-dragging={isDragging || undefined}
        data-files={files.length > 0 || undefined}
        className='border-input data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 relative flex min-h-52 flex-col items-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors not-data-[files]:justify-center has-[input:focus]:ring-[3px] '
      >
        <input {...getInputProps()} className='sr-only' aria-label='Upload image file' />
        {files.length > 0 || (data && data?.result.items.length > 0) ? (
          <div className='flex w-full flex-col gap-3 '>
            <div className='flex items-center justify-between gap-2 mb-5'>
              <h3 className='truncate text-sm font-medium'>Files upload ({files.length})</h3>
              <div className='flex gap-2'>
                {files.length > 0 && (
                  <Button onClick={handleUpload}>
                    <ImageUp /> Upload
                  </Button>
                )}
                {isSelectMode && (
                  <Button onClick={handleDeleteMutipleGallery} disabled={!selectedImages.length}>
                    Xoá {selectedImages.length} file
                  </Button>
                )}
                <Button variant='outline' onClick={() => setIsSelectMode(!isSelectMode)}>
                  {isSelectMode ? 'Huỷ chọn' : 'Chọn'}
                </Button>
                <Button variant='outline' onClick={openFileDialog}>
                  <UploadIcon className='-ms-0.5 size-3.5 opacity-60' aria-hidden='true' />
                  Add files
                </Button>
                <Button variant='destructive' onClick={handleRemoveAll} className='text-white'>
                  <Trash2Icon className='-ms-0.5 size-3.5 opacity-60' aria-hidden='true' />
                  Remove all
                </Button>
              </div>
            </div>
            {/* grid grid-cols-2 gap-4 md:grid-cols-3 */}
            <div className=''>
              {files.map((file) => {
                return (
                  <div key={file.id} className='bg-background relative flex flex-col rounded-md border'>
                    {getFilePreview(file)}
                    <Button
                      onClick={() => removeFile(file.id)}
                      size='icon'
                      className='border-background focus-visible:border-background absolute -top-2 -right-2 size-6 rounded-full border-2 shadow-none'
                      aria-label='Remove image'
                    >
                      <XIcon className='size-3.5' />
                    </Button>
                    <div className='flex min-w-0 flex-col gap-0.5 border-t p-3'>
                      <p className='truncate text-[13px] font-medium'>{file.file.name}</p>
                      <p className='text-muted-foreground truncate text-xs'>{formatBytes(file.file.size)}</p>
                    </div>
                    <div
                      className='h-[3px] bg-green-500 transition-all duration-300'
                      style={{ width: `${uploadProgress[file.file.name] || 0}%` }}
                    />
                  </div>
                )
              })}
              <Masonry
                breakpointCols={breakpointColumnsObj}
                className='my-masonry-grid'
                columnClassName='my-masonry-grid_column'
              >
                {data?.result.items.map((item) => (
                  <div key={item._id} className='rounded-md border bg-background'>
                    <div className='columns-2 md:columns-3 gap-4 space-y-4'>
                      {data?.result.items.map((item: any) => {
                        const isSelected = selectedImages.includes(item._id)
                        const images = item.type === TYPE_GALLERY.IMAGE
                        const audios = item.type === TYPE_GALLERY.AUDIOS
                        const videos = item.type === TYPE_GALLERY.VIDEOS

                        return (
                          <div key={item._id} className='break-inside-avoid relative rounded-md border bg-background'>
                            {/* Checkbox select mode */}
                            {isSelectMode && (
                              <div className='absolute bottom-3 left-2 border border-white w-fit z-10'>
                                <div
                                  className={cn('relative p-1 px-2 h-6 w-6', isSelected ? 'bg-red-600' : 'bg-white')}
                                >
                                  <input
                                    type='checkbox'
                                    checked={isSelected}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setSelectedImages((prev) => [...prev, item._id])
                                      } else {
                                        setSelectedImages((prev) => prev.filter((id) => id !== item._id))
                                      }
                                    }}
                                    className='w-full h-full absolute top-0 left-0 opacity-0'
                                  />
                                  {isSelected && (
                                    <Check className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-semibold' />
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Content */}
                            {images && (
                              <img src={item.src} alt='Uploaded file' className='w-full rounded-t-md object-cover' />
                            )}
                            {videos && (
                              <video className='w-full rounded-t-md' controls>
                                <source src={item.src} type='video/mp4' />
                                Your browser does not support the video tag.
                              </video>
                            )}
                            {audios && (
                              <div className='aspect-square flex items-center justify-center bg-accent overflow-hidden rounded-t-md'>
                                <img src={phoneIcon} className='max-w-[400px] h-auto object-cover' />
                              </div>
                            )}

                            {/* Delete icon */}
                            <span
                              className='absolute top-2 right-2 p-2 bg-white rounded-full text-primary shadow-2xl cursor-pointer z-10'
                              onClick={() => handleDeleteImage(item._id)}
                            >
                              <Trash2 />
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </Masonry>
            </div>
            {data && data?.result.totalPages === 1 ? (
              ''
            ) : (
              <div className='flex justify-center gap-2 mt-10 fixed bottom-0 left-1/2 -translate-x-1/2 bg-white dark:bg-muted p-2 px-10 rounded-xl border shadow'>
                <Button disabled={pageParam <= 1} onClick={() => updateParams({ page: pageParam - 1 })}>
                  Prev
                </Button>
                {[...Array(data?.result.totalPages)].map((_, index) => {
                  const pageNumber = index + 1
                  const isActive = pageNumber === pageParam
                  return (
                    <Button
                      key={pageNumber}
                      variant={isActive ? 'default' : 'outline'}
                      size='sm'
                      className={isActive ? 'font-bold' : ''}
                      onClick={() => updateParams({ page: pageNumber })}
                    >
                      {pageNumber}
                    </Button>
                  )
                })}
                <Button disabled={pageParam >= totalPages} onClick={() => updateParams({ page: pageParam + 1 })}>
                  Next
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center px-4 py-3 text-center'>
            <div
              className='bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border'
              aria-hidden='true'
            >
              <ImageIcon className='size-4 opacity-60' />
            </div>
            <p className='mb-1.5 text-sm font-medium'>Drop your files here</p>
            <p className='text-muted-foreground text-xs'>
              Max {maxFiles} files ∙ Up to {maxSizeMB}MB
            </p>
            <Button variant='outline' className='mt-4' onClick={openFileDialog}>
              <UploadIcon className='-ms-1 opacity-60' aria-hidden='true' />
              Select images
            </Button>
          </div>
        )}
      </div>

      {errors.length > 0 && (
        <div className='text-destructive flex items-center gap-1 text-xs' role='alert'>
          <AlertCircleIcon className='size-3 shrink-0' />
          <span>{errors[0]}</span>
        </div>
      )}
    </div>
  )
}

export default FormUploadFile
