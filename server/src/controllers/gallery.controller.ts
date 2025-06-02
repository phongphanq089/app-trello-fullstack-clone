import { Request, Response } from 'express'
import HTTTP_STATUS_CODE from '~/constants/HttpStatusCodes'
import { galleryService } from '~/services/gallery.service'
import fs from 'fs/promises'
import { getTypeFolder } from '~/utils/lib'

export const uploadGalleryController = async (req: Request<any, any, any>, res: Response) => {
  const userId = req.jwtDecoded._id
  const folder = JSON.parse(req.body.folder)

  if (!req?.file) return res.status(400).json({ error: 'No file uploaded' })

  const filePath = req.file.path

  const type = getTypeFolder(req.file.mimetype)

  const fileBuffer = await fs.readFile(filePath) // đọc nội dung file từ disk

  const result = await galleryService.uploadGallery(
    userId,
    [fileBuffer], // vẫn giữ dạng mảng nếu bạn muốn xử lý đa file sau này
    folder.getFolder,
    folder.folderId,
    type
  )

  // Sau khi xong, xóa file tạm
  await fs.unlink(filePath)

  return res.status(HTTTP_STATUS_CODE.SUCCESS.OK).json({
    message: 'Update Profile success!',
    result
  })
}

export const createFolderController = async (req: Request<any, any, any>, res: Response) => {
  const userId = req.jwtDecoded._id

  const result = await galleryService.createFolder(userId, req.body)

  return res.status(HTTTP_STATUS_CODE.SUCCESS.OK).json({
    message: 'Create folder success !',
    result: result
  })
}

export const getFolderController = async (req: Request<any, any, any>, res: Response) => {
  const userId = req.jwtDecoded._id
  const result = await galleryService.getFolder(userId)

  return res.status(HTTTP_STATUS_CODE.SUCCESS.OK).json({
    message: 'Get folder success !',
    result: result
  })
}

export const listGalleryController = async (req: Request<any, any, any>, res: Response) => {
  const userId = req.jwtDecoded._id
  const folderId = req.params.id
  if (!folderId) return

  const limit = req.query?.limit

  const skip = req.query?.page

  const options = { limit: limit, skip: skip }

  const result = await galleryService.listGallery(userId, folderId, options as any)

  return res.status(HTTTP_STATUS_CODE.SUCCESS.OK).json({
    message: 'Get gallery success !',
    result: result
  })
}

export const deleteImageController = async (req: Request<any, any, any>, res: Response) => {
  const userId = req.jwtDecoded._id
  const imageId = req.params.id

  const result = await galleryService.deleteGalleryItem(userId, imageId)

  return res.status(HTTTP_STATUS_CODE.SUCCESS.OK).json({
    message: `deleted ${imageId} success !`,
    result: result
  })
}

export const deleteMultipleGalleryItemsController = async (req: Request<any, any, any>, res: Response) => {
  const userId = req.jwtDecoded._id
  const { galleryIds } = req.body

  console.log(galleryIds)

  const result = await galleryService.deleteMultipleGalleryItems(userId, galleryIds)

  return res.status(HTTTP_STATUS_CODE.SUCCESS.OK).json({
    message: `Deleted gallery ${result.deletedCount} items successfully`,
    result: result
  })
}

export const deleteFolderController = async (req: Request<any, any, any>, res: Response) => {
  const userId = req.jwtDecoded._id
  const folderId = req.params.id

  const result = await galleryService.deleteFolder(userId, folderId)

  return res.status(HTTTP_STATUS_CODE.SUCCESS.OK).json({
    message: `deleted ${folderId} success !`,
    result: result
  })
}
