import express from 'express'
import {
  createFolderController,
  deleteFolderController,
  deleteImageController,
  deleteMultipleGalleryItemsController,
  getFolderController,
  listGalleryController,
  uploadGalleryController
} from '~/controllers/gallery.controller'
import { authMiddlewares } from '~/middlewares/authMiddlewares'
import { multerUploadMiddleware } from '~/middlewares/multerUploadMiddleware'
import { validateRequest } from '~/middlewares/wrapRequestHandler'
import { GallerySchema } from '~/model/gallery.schema'

const Router = express.Router()

Router.post('/gallery', authMiddlewares, multerUploadMiddleware.upload.single('gallery'), uploadGalleryController)

Router.post(
  '/create-folder',
  authMiddlewares,
  validateRequest(GallerySchema.createFolderSchema),
  createFolderController
)

Router.get('/get-folder', authMiddlewares, getFolderController)

Router.get('/list-gallery/:id', authMiddlewares, listGalleryController)

Router.post('/delete-gallery/:id', authMiddlewares, deleteImageController)

Router.post(
  '/delete-gallery-mutiple',
  authMiddlewares,
  validateRequest(GallerySchema.deleteMutipleImageSchema),
  deleteMultipleGalleryItemsController
)

Router.post('/delete-folder/:id', authMiddlewares, deleteFolderController)

export const gallery = Router
