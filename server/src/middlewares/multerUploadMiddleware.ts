import multer from 'multer'
import { ALLOW_COMMOM_FILE_TYPES, LIMIT_COMMON_FILE_SIZE } from '~/constants/setting'

import { Request } from 'express'
import { FileFilterCallback } from 'multer'

const customFileFilter = (req: Request, file: Express.Multer.File, callback: FileFilterCallback) => {
  if (!ALLOW_COMMOM_FILE_TYPES.includes(file.mimetype)) {
    const err = new Error('file type is invalid. Only accept jpg, jpeg ,png')
    return callback(err as any, false)
  }

  return callback(null, true)
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fieldSize: LIMIT_COMMON_FILE_SIZE },
  fileFilter: customFileFilter
})

export const multerUploadMiddleware = { upload }
