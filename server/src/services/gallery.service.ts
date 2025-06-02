import { result } from 'lodash'
import { Collection, ObjectId } from 'mongodb'
import ENV_SETTING from '~/config/envSetting'
import databaseService from '~/config/mongoDb'
import HTTTP_STATUS_CODE from '~/constants/HttpStatusCodes'
import { AppError } from '~/middlewares/errorHandler'
import { CreateFolderDto } from '~/model/gallery.schema'
import { uploadImageKitProvider } from '~/provider/uploadImageKitProvider'

class GalleryService {
  /**
   * @COLECTION_NAME
   */
  getColection(name: string): Collection {
    return databaseService.getDb().collection(name)
  }
  /**
   * @FIND_ONE_BY_ID
   */
  private async finOneById(collectionName: string, id: string) {
    try {
      const collection = this.getColection(collectionName)
      const result = await collection.findOne({ _id: new ObjectId(id) })

      return result
    } catch (error) {
      throw new AppError(error, HTTTP_STATUS_CODE.SERVER_ERROR.INTERNAL_SERVER_ERROR)
    }
  }
  /**
   * @CREATE_FOLDER
   */
  async createFolder(userId: string, resBody: CreateFolderDto) {
    try {
      const collection = this.getColection(ENV_SETTING.FOLDER_NAME_COLLECTION_NAME)

      const payload = {
        ...resBody,
        userId: new ObjectId(userId)
      }
      const result = await collection.insertOne(payload)

      const folder = await this.finOneById(ENV_SETTING.FOLDER_NAME_COLLECTION_NAME, result.insertedId.toString())
      return folder
    } catch (error) {
      throw new AppError(error, HTTTP_STATUS_CODE.SERVER_ERROR.INTERNAL_SERVER_ERROR)
    }
  }
  /**
   * @GET_FOLDER
   */
  async getFolder(userId: string) {
    try {
      const collection = this.getColection(ENV_SETTING.FOLDER_NAME_COLLECTION_NAME)

      const result = await collection
        .aggregate([
          {
            $match: {
              $and: [
                {
                  $or: [{ userId: { $all: [new ObjectId(userId)] } }]
                }
              ]
            }
          }
        ])
        .toArray()

      return result
    } catch (error) {
      throw new AppError(error, HTTTP_STATUS_CODE.SERVER_ERROR.INTERNAL_SERVER_ERROR)
    }
  }
  /**
   * @GET_FOLDER
   */
  async uploadGallery(userId: string, fileBuffer: Buffer[], folder: string, folderId: string, type: string) {
    try {
      const collection = this.getColection(ENV_SETTING.GALLERY_NAME_COLLECTION_NAME)

      const sanitizedFolder = folder.trim().replace(/\s+/g, '')

      const uploadPromises = fileBuffer.map(async (fileBuffer) => {
        const nameGallery = `file-${Date.now()}-${Math.random().toString(36)}`

        const uploadfile = await uploadImageKitProvider.streamUpload(
          fileBuffer,
          nameGallery,
          `gallery/${sanitizedFolder}`
        )

        const payload = {
          userId: new ObjectId(userId),
          folderId: new ObjectId(folderId),
          folder,
          src: uploadfile.url,
          fileId: uploadfile.fileId,
          createdAt: new Date(),
          type: type
        }

        return payload
      })

      const galleryItems = await Promise.all(uploadPromises)
      const result = await collection.insertMany(galleryItems)
      return result
    } catch (error) {
      throw new AppError(error, HTTTP_STATUS_CODE.SERVER_ERROR.INTERNAL_SERVER_ERROR)
    }
  }
  /**
   * @LIST_GALLERY
   */
  async listGallery(userId: string, folderId: string, options?: { limit?: number; skip?: number }) {
    try {
      const collection = this.getColection(ENV_SETTING.GALLERY_NAME_COLLECTION_NAME)

      const indexes = await collection.indexExists(['folderId_1_userId_1'])
      if (!indexes) {
        await collection.createIndex({ folderId: 1, userId: 1 })
      }

      const limit = Number(options?.limit) || 12
      const page = Number(options?.skip) || 1
      const skip = (page - 1) * limit

      const pipeline = [
        {
          $match: {
            folderId: new ObjectId(folderId),
            userId: new ObjectId(userId)
          }
        },
        {
          $sort: { createdAt: -1 }
        },
        {
          $facet: {
            data: [{ $skip: skip }, { $limit: limit }],
            totalCount: [{ $count: 'count' }]
          }
        }
      ]

      const result = await collection.aggregate(pipeline).toArray()
      const items = result[0]?.data || []
      const total = result[0]?.totalCount?.[0]?.count || 0
      const totalPages = Math.ceil(total / limit)

      return {
        items,
        total,
        page,
        limit,
        totalPages
      }
    } catch (error) {
      throw new AppError(error, HTTTP_STATUS_CODE.SERVER_ERROR.INTERNAL_SERVER_ERROR)
    }
  }
  /**
   * @REMOVE_IMAGE_ITEM
   */
  async deleteGalleryItem(userId: string, galleryId: string) {
    try {
      const collection = this.getColection(ENV_SETTING.GALLERY_NAME_COLLECTION_NAME)

      const _id = new ObjectId(galleryId)

      const image = await collection.findOne({ _id, userId: new ObjectId(userId) })

      if (!image) {
        throw new AppError('Image not found', HTTTP_STATUS_CODE.CLIENT_ERROR.NOT_FOUND)
      }

      await uploadImageKitProvider.deleteFileGalleryItem(image.fileId)

      await collection.deleteOne({ _id, userId: new ObjectId(userId) })

      return { success: true }
    } catch (error) {
      throw new AppError(error, HTTTP_STATUS_CODE.SERVER_ERROR.INTERNAL_SERVER_ERROR)
    }
  }
  /**
   * @REMOVE_IMAGE_MUTIPLE
   */
  async deleteMultipleGalleryItems(userId: string, galleryIds: string[]) {
    try {
      const collection = this.getColection(ENV_SETTING.GALLERY_NAME_COLLECTION_NAME)

      const indexes = await collection.indexExists(['_id_1_userId_1'])
      if (!indexes) {
        await collection.createIndex({ _id: 1, userId: 1 })
      }

      const objectIds = galleryIds.map((id) => new ObjectId(id))
      const images = await collection.find({ _id: { $in: objectIds }, userId: new ObjectId(userId) }).toArray()

      if (images.length === 0) {
        throw new AppError('No images found to delete', HTTTP_STATUS_CODE.CLIENT_ERROR.NOT_FOUND)
      }

      // xoá file từ image kit (nên xoá song song)
      const deleteFilePromises = images.map((img) => uploadImageKitProvider.deleteFileGalleryItem(img.fileId))
      await Promise.all(deleteFilePromises)

      // Xoá record trong MongoDB
      await collection.deleteMany({
        _id: { $in: images.map((img) => img._id) },
        userId: new ObjectId(userId)
      })

      return { success: true, deletedCount: images.length }
    } catch (error) {
      throw new AppError(error, HTTTP_STATUS_CODE.SERVER_ERROR.INTERNAL_SERVER_ERROR)
    }
  }
  /**
   * @REMOVE_FOLDER
   */
  async deleteFolder(userId: string, folderId: string) {
    try {
      const folderCollection = this.getColection(ENV_SETTING.FOLDER_NAME_COLLECTION_NAME)
      const galleryCollection = this.getColection(ENV_SETTING.GALLERY_NAME_COLLECTION_NAME)
      const folderObjectId = new ObjectId(folderId)

      // Kiểm tra folder trong DB
      const folder = await folderCollection.findOne({ _id: folderObjectId, userId: new ObjectId(userId) })
      if (!folder) {
        throw new AppError('Folder not found', HTTTP_STATUS_CODE.CLIENT_ERROR.NOT_FOUND)
      }

      // Lấy toàn bộ ảnh trong folder
      const images = await galleryCollection
        .find({
          folderId: folderObjectId,
          userId: new ObjectId(userId)
        })
        .toArray()

      // Xóa từng ảnh trên ImageKit
      for (const image of images) {
        if (image.fileId) {
          try {
            await uploadImageKitProvider.deleteFileGalleryItem(image.fileId)
          } catch (error: any) {
            console.warn(`Failed to delete file ${image.fileId} on ImageKit:`, error.message)
            // Tiếp tục xóa các file khác ngay cả khi có lỗi
          }
        }
      }

      const folderPath = `gallery/${folder.nameFolder}`
      const normalizedPath = folderPath.startsWith('/') ? folderPath : `${folderPath}`

      let folderExists = false
      try {
        const list = await uploadImageKitProvider.getListFolder(folder.nameFolder)
        console.log('Folder contents:', list)
        folderExists = list && list.length > 0 // Giả sử list trả về mảng các file/folder, nếu có nội dung thì folder tồn tại
      } catch (error: any) {
        console.warn(`Folder ${normalizedPath} not found or error checking on ImageKit:`, error.message)
        folderExists = false // Nếu getListFolder thất bại, giả định folder không tồn tại
      }

      // Chỉ xóa folder trên ImageKit nếu folder tồn tại
      if (folderExists) {
        try {
          await uploadImageKitProvider.deleteFolderItem(normalizedPath)
          console.log(`Folder ${normalizedPath} deleted successfully on ImageKit`)
        } catch (error: any) {
          console.warn(`Failed to delete folder ${normalizedPath} on ImageKit:`, error.message)
        }
      } else {
        console.log(`Folder ${normalizedPath} does not exist on ImageKit, skipping deletion`)
      }

      // Xóa ảnh trong DB
      await galleryCollection.deleteMany({
        folderId: folderObjectId,
        userId: new ObjectId(userId)
      })

      // Xóa folder trong DB
      await folderCollection.deleteOne({
        _id: folderObjectId,
        userId: new ObjectId(userId)
      })

      return { success: true }
    } catch (error: any) {
      throw new AppError(error.message, HTTTP_STATUS_CODE.SERVER_ERROR.INTERNAL_SERVER_ERROR)
    }
  }
}

export const galleryService = new GalleryService()
