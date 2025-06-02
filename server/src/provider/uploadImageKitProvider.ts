import ImageKit from 'imagekit'
import ENV_SETTING from '~/config/envSetting'

const imagekit = new ImageKit({
  publicKey: ENV_SETTING.IMAGE_KIT_PUBLIC_KEY,
  privateKey: ENV_SETTING.IMAGE_KIT_PRIVATE_KEY,
  urlEndpoint: ENV_SETTING.IMAGE_KIT_URLENDOINT
})

interface StreamUploadParams {
  fileBuffer: Buffer
  fileName: string
  folderName: string
}

interface ImageKitUploadResponse {
  fileId: string
  name: string
  url: string
  thumbnailUrl: string
  fileType: string
  filePath: string
  [key: string]: any
}

const streamUpload = async (
  fileBuffer: StreamUploadParams['fileBuffer'],
  fileName: StreamUploadParams['fileName'],
  folderName: string
): Promise<ImageKitUploadResponse> => {
  const result = await imagekit.upload({
    file: fileBuffer,
    fileName: `profile-${fileName}`,
    folder: folderName,
    tags: ['profile', 'user'],
    useUniqueFileName: true
  })
  return result
}

const deleteFileGalleryItem = async (fileId: string) => {
  return await imagekit.deleteFile(fileId)
}
const deleteFolderItem = async (folder: string) => {
  return await imagekit.deleteFolder(folder)
}

const getListFolder = async (folder: string) => {
  return await imagekit.listFiles({
    path: `gallery/${folder}`
  })
}

export const uploadImageKitProvider = { streamUpload, deleteFileGalleryItem, deleteFolderItem, getListFolder }
