import { useMutation, useQuery } from '@tanstack/react-query'
import {
  createFolder,
  deleteFolderItem,
  deleteGalleryImageItem,
  deleteGalleryMutiple,
  getFolder,
  getGallery
} from '../fetch/gallery'

export const useCreateFolder = () => {
  return useMutation({
    mutationFn: (payload: { nameFolder: string }) => createFolder(payload)
  })
}

export const useGetListFolder = () => {
  return useQuery({
    queryKey: ['board'],
    queryFn: () => getFolder(),
    staleTime: 1000 * 60 * 5
  })
}

export const useGetListGallery = (id: string, page: number, limit: number) => {
  return useQuery({
    queryKey: ['gallery'],
    queryFn: () => getGallery(id, page, limit),
    staleTime: 1000 * 60 * 5
  })
}

export const useDeleteImageItem = () => {
  return useMutation({
    mutationFn: (id: string) => deleteGalleryImageItem(id)
  })
}

export const useDeleteGalleryMutiple = () => {
  return useMutation({
    mutationFn: (payload: { galleryIds: string[] }) => deleteGalleryMutiple(payload)
  })
}

export const useDeleteFolderItem = () => {
  return useMutation({
    mutationFn: (id: string) => deleteFolderItem(id)
  })
}
