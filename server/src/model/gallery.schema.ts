import z from 'zod'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/constants/setting'

export class GallerySchema {
  public static uploadGallerySchema = z.object({
    folder: z.string().min(1, { message: 'Folder name is required' }),
    file: z.instanceof(Buffer).optional(),
    folderId: z.string().regex(OBJECT_ID_RULE, { message: 'Invalid boardId format (must be a valid ObjectId)' })
  })
  public static createFolderSchema = z.object({
    nameFolder: z.string().min(1, { message: 'Folder name is required' })
  })
  public static deleteMutipleImageSchema = z.object({
    galleryIds: z.array(z.string().regex(OBJECT_ID_RULE, { message: OBJECT_ID_RULE_MESSAGE })).default([])
  })
}

export type UploadGalleryDto = z.infer<typeof GallerySchema.uploadGallerySchema>
export type CreateFolderDto = z.infer<typeof GallerySchema.createFolderSchema>
export type DeleteMutipleImageSchema = z.infer<typeof GallerySchema.deleteMutipleImageSchema>
