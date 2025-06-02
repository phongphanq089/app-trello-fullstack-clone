import { listGallery } from '@/page/gallery/type'
import http from '../http'

export const createFolder = async (payload: { nameFolder: string }) => {
  const respone = await http.post('/media/create-folder', payload)

  return respone.data
}

export const getFolder = async () => {
  const respone = await http.get('/media/get-folder')

  return respone.data
}

export const getGallery = async (id: string, page: number, limit: number): Promise<listGallery> => {
  const respone = await http.get(`/media/list-gallery/${id}?page=${page}&limit=${limit}`)

  return respone.data
}

export const deleteGalleryImageItem = async (id: string) => {
  const respone = await http.post(`/media/delete-gallery/${id}`)

  return respone.data
}

export const deleteFolderItem = async (id: string) => {
  const respone = await http.post(`/media/delete-folder/${id}`)

  return respone.data
}

export const deleteGalleryMutiple = async (payload: { galleryIds: string[] }) => {
  const respone = await http.post(`/media/delete-gallery-mutiple`, payload)

  return respone.data
}
